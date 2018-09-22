<template>
  <canvas
    id="map-canvas"
    :width="sizeW"
    :height="sizeH"
    @contextmenu.prevent />
</template>

<script>
import { mapMutations } from 'vuex'
import imageDef from './background-default.jpg'

export default {
  name: 'mapBoard',
  mounted: function () {
    this.paint()
  },
  methods: {
    ...mapMutations([
      'addMapMaskInfo',
      'setDraggingMapMask',
      'changeDisplay',
      'changeDisplayValue'
    ]),
    paint: function () {
      const ctx = document.getElementById('map-canvas').getContext('2d')
      console.log('paint')

      ctx.fillStyle = 'rgb(0, 22, 40)'
      ctx.globalAlpha = 1
      ctx.fillRect(0, 0, this.sizeW, this.sizeH)

      /* Imageオブジェクトを生成 */
      var img = new Image()
      img.src = imageDef

      /* 画像を描画 */
      ctx.drawImage(img, 0, 0, this.sizeW, this.sizeH)

      if (this.isGridLine) {
        ctx.strokeStyle = this.gridColor
        ctx.globalAlpha = 0.3
        for (let c = 0; c <= this.gridC; c++) {
          for (let r = 0; r <= this.gridR; r++) {
            // 横線
            this.drawLine(ctx, c * this.gridSize, r * this.gridSize, this.gridSize - 1, 0)
            // 縦線
            this.drawLine(ctx, c * this.gridSize, r * this.gridSize + 1, 0, this.gridSize - 1)
          }
        }
      }
      if (this.isGridId) {
        ctx.fillStyle = this.gridColor
        ctx.globalAlpha = 0.3
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        for (let c = 0; c <= this.gridC; c++) {
          for (let r = 0; r <= this.gridR; r++) {
            const text = (c + 1) + '-' + (r + 1)
            ctx.fillText(text, c * this.gridSize + 2 + (this.gridSize - 1) / 2, r * this.gridSize + 2 + (this.gridSize - 1) / 2)
          }
        }
      }
    },
    drawLine: function (ctx, x, y, width, height) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + width, y + height)
      ctx.stroke()
    }
  },
  watch: {
    isGridLine: function () {
      this.paint()
    },
    isGridId: function () {
      this.paint()
    }
  },
  computed: {
    isGridLine: function () {
      return this.$store.state.display.gridLine
    },
    isGridId: function () {
      return this.$store.state.display.gridId
    },
    gridColor: function () {
      return this.$store.state.map.grid.color
    },
    gridC: function () {
      return this.$store.state.map.grid.c
    },
    gridR: function () {
      return this.$store.state.map.grid.r
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    },
    sizeW: function () { return this.gridC * this.gridSize },
    sizeH: function () { return this.gridR * this.gridSize }
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
  border: 1px solid gray;
  box-sizing: border-box;
}
</style>
