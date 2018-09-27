<template>
  <canvas
    id="map-canvas"
    :width="canvasSize.w"
    :height="canvasSize.h"
    @contextmenu.prevent />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'mapBoard',
  mounted: function () {
    this.paint()
  },
  methods: {
    ...mapMutations([]),
    paint: function () {
      const ctx = document.getElementById('map-canvas').getContext('2d')
      // console.log('paint')

      var img = new Image()
      img.src = '.' + this.getBackgroundImage
      img.onload = function () {
        ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)

        ctx.globalAlpha = 1
        ctx.drawImage(img, 0, 0, this.canvasSize.w, this.canvasSize.h)

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

        ctx.strokeStyle = 'red'
        ctx.globalAlpha = 1
        // 中心点
        const center = {
          x: this.canvasSize.w / 2,
          y: this.canvasSize.h / 2
        }
        // 横線
        this.drawLine(ctx, center.x - 5, center.y, 10, 0)
        // 縦線
        this.drawLine(ctx, center.x, center.y - 5, 0, 10)

        /*
        // マウス座標
        const mouseMark = {
          x: this.mouseOnCanvas.x - 10,
          y: this.mouseOnCanvas.y - 10
        }
        this.drawLine(ctx, mouseMark.x, mouseMark.y, 20, 20)
        this.drawLine(ctx, mouseMark.x + 20, mouseMark.y, -20, 20)
        // console.log(this.mouseOnCanvas)
        */

        // console.log(`isDrawGridId:${this.isDrawGridId}`)
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
    },
    drawLine: function (ctx, x, y, width, height) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + width, y + height)
      ctx.stroke()
    }
  },
  watch: {
    isDrawGridLine: function () { this.paint() },
    isDrawGridId: function () { this.paint() },
    gridColor: function () { this.paint() },
    grid: {
      handler: function () { this.paint() },
      deep: true
    },
    mouseOnCanvas: {
      handler: function () { this.paint() },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'getBackgroundImage'
    ]),
    isDrawGridLine: function () {
      return this.$store.state.display.gridLine
    },
    isDrawGridId: function () {
      return this.$store.state.display.gridId
    },
    gridColor: function () {
      return this.$store.state.map.grid.color
    },
    columns: function () {
      return this.$store.state.map.grid.totalColumn
    },
    rows: function () {
      return this.$store.state.map.grid.totalRow
    },
    grid: function () {
      return {
        c: this.$store.state.map.grid.c,
        r: this.$store.state.map.grid.r
      }
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    },
    canvasSize: function () {
      return {
        w: this.columns * this.gridSize,
        h: this.rows * this.gridSize
      }
    },
    mouseOnCanvas: function () {
      return {
        x: this.$store.state.map.mouse.onCanvas.x,
        y: this.$store.state.map.mouse.onCanvas.y
      }
    }
  }
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
  border-width: 0;
  /*
  border: 1px solid gray;
  */
  box-sizing: border-box;
  background-size: 100% 100%;
}
</style>
