<template>
  <div id="map" :style="canvasStyle">
    <canvas id="map-canvas" :width="sizeW" :height="sizeH" @mousedown.left.prevent="leftDown" @mouseup.left.prevent="leftUp" @mousedown.right.prevent="rightDown" @mouseup.right.prevent="rightUp" @contextmenu.prevent></canvas>
  </div>
</template>

<script>
// const imageDef = () => import('./background-default.jpg')
import imageDef from './background-default.jpg'

export default {
  name: 'map',
  data () {
    return {
      isGrid: true,
      isAddress: true,
      memberNum: 1,
      menuHoverNum: 0,
      gridX: 20,
      gridY: 16,
      gridSize: 50,
      gridColor: 'rgb(255, 255, 255)',
      isDraggingLeft: false,
      leftMove: {
        totalX: 0,
        totalY: 0,
        draggingX: 0,
        draggingY: 0
      },
      isDraggingRight: false,
      rightMove: {
        totalX: 0,
        totalY: 0,
        draggingX: 0,
        draggingY: 0
      },
      mouse: {
        x: 0,
        y: 0,
        saveX: 0,
        saveY: 0
      },
      translateZ: 0,
      rotateZ: 0,
      rotateY: 0,
      rotateX: 0
    }
  },
  mounted: function () {
    this.paint()
    const _this = this
    document.body.addEventListener('mousemove', function (e) {
      _this.mouse.x = e.pageX
      _this.mouse.y = e.pageY
      _this.reflesh(e.pageX, e.pageY)
    })
  },
  methods: {
    setGrid: function (flg) {
      this.isGrid = flg
    },
    wheel: function (delta) {
      this.translateZ = this.translateZ + delta
    },
    leftDown: function () {
      console.log('leftDown')
      this.mouse.saveX = this.mouse.x
      this.mouse.saveY = this.mouse.y
      this.isDraggingLeft = true
    },
    leftUp: function () {
      console.log('leftUp')
      this.isDraggingLeft = false
      this.leftMove.totalX += this.leftMove.draggingX
      this.leftMove.totalY += this.leftMove.draggingY
      this.leftMove.draggingX = 0
      this.leftMove.draggingY = 0
    },
    rightDown: function () {
      console.log('rightDown')
      this.mouse.saveX = this.mouse.x
      this.mouse.saveY = this.mouse.y
      this.isDraggingRight = true
    },
    rightUp: function () {
      console.log('rightUp')
      this.isDraggingRight = false
      this.rightMove.totalX += this.rightMove.draggingX
      this.rightMove.totalY += this.rightMove.draggingY
      this.rightMove.draggingX = 0
      this.rightMove.draggingY = 0
    },
    reflesh: function (x, y) {
      const moveX = x - this.mouse.saveX
      const moveY = y - this.mouse.saveY
      if (this.isDraggingLeft) {
        this.leftMove.draggingX = moveX
        this.leftMove.draggingY = moveY
      }
      if (this.isDraggingRight) {
        this.rightMove.draggingX = moveX
        this.rightMove.draggingY = moveY
      }
    },
    paint: function () {
      const ctx = document.getElementById('map-canvas').getContext('2d')

      ctx.fillStyle = 'rgb(0, 22, 40)'
      ctx.fillRect(0, 0, this.sizeW, this.sizeH)

      /* Imageオブジェクトを生成 */
      var img = new Image()
      img.src = imageDef

      /* 画像を描画 */
      ctx.drawImage(img, 0, 0, this.sizeW, this.sizeH)

      if (this.isGrid) {
        ctx.strokeStyle = this.gridColor
        ctx.globalAlpha = 0.3
        for (let c = 0; c <= this.gridX; c++) {
          for (let r = 0; r <= this.gridY; r++) {
            // 横線
            this.drawLine(ctx, c * this.gridSize + 1, r * this.gridSize + 1, this.gridSize - 1, 0)
            // 縦線
            this.drawLine(ctx, c * this.gridSize + 1, r * this.gridSize + 2, 0, this.gridSize - 1)
          }
        }
      }
      if (this.isAddress) {
        ctx.fillStyle = this.gridColor
        ctx.globalAlpha = 0.3
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        for (let c = 0; c <= this.gridX; c++) {
          for (let r = 0; r <= this.gridY; r++) {
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
  computed: {
    sizeW: function () { return this.gridX * this.gridSize + 2 },
    sizeH: function () { return this.gridY * this.gridSize + 2 },
    translateX: function () { return this.leftMove.totalX + this.leftMove.draggingX },
    translateY: function () { return this.leftMove.totalY + this.leftMove.draggingY },
    canvasStyle: function () {
      const _this = this
      const translateZ = this.translateZ
      return {
        width: _this.sizeW + 'px',
        height: _this.sizeH + 'px',
        transform:
          'perspective(' + _this.sizeW + 'px)' +
          'translateZ(' + translateZ + 'px) ' +
          'translateY(' + _this.translateY + 'px) ' +
          'translateX(' + _this.translateX + 'px) ' +
          'rotateY(' + _this.rotateY + 'deg) ' +
          'rotateX(' + _this.rotateX + 'deg) ' +
          'rotateZ(' + _this.rotateZ + 'deg)'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  display: block;
  margin: auto;
}
canvas {
  display: block;
}
</style>
