<template>
  <canvas
    id="map-canvas"
    :width="sizeW"
    :height="sizeH"
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
    ...mapMutations([
      'setDraggingMapMask',
      'changeDisplay',
      'changeDisplayValue'
    ]),
    paint: function () {
      const ctx = document.getElementById('map-canvas').getContext('2d')
      // console.log('paint')

      var img = new Image()
      img.src = '.' + this.getBackgroundImage
      const w = this.sizeW
      const h = this.sizeH
      img.onload = function () {
        ctx.clearRect(0, 0, this.sizeW, this.sizeH)

        ctx.globalAlpha = 1
        ctx.drawImage(img, 0, 0, w, h)

        if (this.isGridLine) {
          ctx.strokeStyle = this.gridColor
          ctx.globalAlpha = 1
          for (let c = 0; c <= this.gridTotalColumn; c++) {
            for (let r = 0; r <= this.gridTotalRow; r++) {
              // 横線
              this.drawLine(ctx, c * this.gridSize, r * this.gridSize, this.gridSize - 1, 0)
              // 縦線
              this.drawLine(ctx, c * this.gridSize, r * this.gridSize + 1, 0, this.gridSize - 1)
            }
          }
        }

        ctx.strokeStyle = this.gridColor
        ctx.globalAlpha = 1
        ctx.rect((this.gridColumn - 1) * this.gridSize, (this.gridRow - 1) * this.gridSize, this.gridSize, this.gridSize)
        ctx.stroke()

        // console.log(`isGridId:${this.isGridId}`)
        if (this.isGridId) {
          ctx.fillStyle = this.gridColor
          ctx.globalAlpha = 1
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          for (let c = 0; c <= this.gridTotalColumn; c++) {
            for (let r = 0; r <= this.gridTotalRow; r++) {
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
    isGridLine: function () {
      this.paint()
    },
    isGridId: function () {
      this.paint()
    },
    gridColumn: function () {
      this.paint()
    },
    gridRow: function () {
      this.paint()
    }
  },
  computed: {
    ...mapGetters([
      'getBackgroundImage'
    ]),
    isGridLine: function () {
      return this.$store.state.display.gridLine
    },
    isGridId: function () {
      return this.$store.state.display.gridId
    },
    gridColor: function () {
      return this.$store.state.map.grid.color
    },
    gridTotalColumn: function () {
      return this.$store.state.map.grid.totalColumn
    },
    gridTotalRow: function () {
      return this.$store.state.map.grid.totalRow
    },
    gridColumn: function () {
      return this.$store.state.map.grid.c
    },
    gridRow: function () {
      return this.$store.state.map.grid.r
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    },
    sizeW: function () { return this.gridTotalColumn * this.gridSize },
    sizeH: function () { return this.gridTotalRow * this.gridSize }
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
