<template>
  <canvas
    id="map-canvas"
    class="anime"
    :class="{isReverse : isReverse}"
    :width="canvasSize.w"
    :height="canvasSize.h"
    v-bg-img="getBackgroundImage"
    @contextmenu.prevent ></canvas>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CanvasMixin from '../CanvasMixin'

export default {
  name: 'mapBoard',
  mixins: [CanvasMixin],
  mounted () {
    this.paint()
  },
  methods: {
    paint () {
      const ctx = document.getElementById('map-canvas').getContext('2d')
      // console.log('paint')

      const img = new Image()
      img.src = this.getBackgroundImage
      img.onload = function () {
        ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)

        // ctx.globalAlpha = 1
        // ctx.drawImage(img, 0, 0, this.canvasSize.w, this.canvasSize.h)

        // マス目の描画
        if (this.isDrawGridLine) {
          ctx.strokeStyle = this.gridColor
          ctx.globalAlpha = 1
          for (let c = 0; c <= this.columns; c++) {
            for (let r = 0; r <= this.rows; r++) {
              // 横線
              this.drawLine(ctx, c * this.gridSize, r * this.gridSize, this.gridSize - 1, 0)
              // 縦線
              this.drawLine(ctx, c * this.gridSize, r * this.gridSize + 1, 0, this.gridSize - 1)
            }
          }

          // マウス下のマスを強調表示
          ctx.strokeStyle = this.gridColor
          ctx.strokeStyle = 'red'
          ctx.globalAlpha = 1
          ctx.rect((this.grid.c - 1) * this.gridSize, (this.grid.r - 1) * this.gridSize, this.gridSize, this.gridSize)
          ctx.stroke()
        }

        // 中心点の描画
        ctx.strokeStyle = 'red'
        ctx.globalAlpha = 1
        const center = {
          x: this.canvasSize.w / 2,
          y: this.canvasSize.h / 2
        }
        // 横線
        this.drawLine(ctx, center.x - 5, center.y, 10, 0)
        // 縦線
        this.drawLine(ctx, center.x, center.y - 5, 0, 10)

        /*
        // マウス座標の描画
        const mouseMark = {
          x: this.mouseOnCanvas.x - 10,
          y: this.mouseOnCanvas.y - 10
        }
        this.drawLine(ctx, mouseMark.x, mouseMark.y, 20, 20)
        this.drawLine(ctx, mouseMark.x + 20, mouseMark.y, -20, 20)
        // console.log(this.mouseOnCanvas)
        */

        // マス座標の描画
        if (this.isDrawGridId) {
          ctx.fillStyle = this.gridColor
          ctx.globalAlpha = 1
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          for (let c = 0; c <= this.columns; c++) {
            for (let r = 0; r <= this.rows; r++) {
              const text = (c + 1) + '-' + (r + 1)
              const x = c * this.gridSize + (this.gridSize - 1) / 2
              const y = r * this.gridSize + (this.gridSize - 1) / 2
              ctx.fillText(text, x, y)
              // console.log(`text:${text} (${x}, ${y})`)
            }
          }
        }
      }.bind(this)
    }
  },
  watch: {
    isDrawGridLine () { this.paint() },
    isDrawGridId () { this.paint() },
    gridColor () { this.paint() },
    grid: {
      handler () { this.paint() },
      deep: true
    },
    mouseOnCanvas: {
      handler () { this.paint() },
      deep: true
    },
    canvasSize: {
      handler () { this.paint() },
      deep: true
    }
  },
  computed: mapState({
    ...mapGetters([
      'getBackgroundImage'
    ]),
    isDrawGridLine: state => state.public.setting.gridLine,
    isDrawGridId: state => state.public.setting.gridId,
    gridColor: state => state.public.map.grid.color,
    columns: state => state.public.map.grid.totalColumn,
    rows: state => state.public.map.grid.totalRow,
    isReverse: state => state.public.map.isReverse,
    grid () {
      return {
        c: this.$store.state.map.grid.c,
        r: this.$store.state.map.grid.r
      }
    },
    gridSize: state => state.public.map.grid.size,
    canvasSize () {
      return {
        w: this.columns * this.gridSize,
        h: this.rows * this.gridSize
      }
    },
    mouseOnCanvas () {
      return {
        x: this.$store.state.map.mouse.onCanvas.x,
        y: this.$store.state.map.mouse.onCanvas.y
      }
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: none;
  /*
  border: 1px solid gray;
  */
  box-sizing: border-box;
  background-size: 100% 100%;
}
.isReverse {
  transform: scale(-1, 1);
}
</style>
