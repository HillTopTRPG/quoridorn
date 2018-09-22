<template>
  <div id="map" :style="canvasStyle" dropzone="move" @dragover.prevent @drop.prevent="drop">
    <canvas
      id="map-canvas"
      :width="sizeW"
      :height="sizeH"
      @mousedown.left.prevent="leftDown"
      @mouseup.left.prevent="leftUp"
      @mousedown.right.prevent="rightDown"
      @mouseup.right.prevent="rightUp"
      @contextmenu.prevent />
    <div
      class="mapMask"
      v-for="(mapMask, index) in mapMasks"
      :key="index"
      :class="[mapMask.isLock ? 'isLock' : 'isUnLock']"
      :style="mapMask.style"
      :draggable="!mapMask.isLock"
      @dragstart="(e) => dragStartMapMask(e, index)"
      @click.right.prevent="(e) => openContext(e, 'mapMask', index)"
      @contextmenu.prevent
    >{{mapMask.name}}</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
// const imageDef = () => import('./background-default.jpg')
import imageDef from './background-default.jpg'

export default {
  name: 'mapComponent',
  data () {
    return {
      memberNum: 1,
      menuHoverNum: 0,
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
      // console.log(_this.mouse.x, _this.mouse.y)
    })
  },
  methods: {
    ...mapMutations([
      'addMapMaskInfo',
      'moveMapMask',
      'setDraggingMapMask',
      'changeDisplay',
      'changeDisplayValue'
    ]),
    setGrid: function (flg) {
      this.isGrid = flg
    },
    wheel: function (delta) {
      this.translateZ = this.translateZ + delta
    },
    openContext: function (event, kind, index) {
      let pageX = event.pageX
      let pageY = event.pageY

      if (kind === 'mapMask') {
        this.changeDisplayValue({ main: 'mapMaskContext', sub: 'index', value: index })
        this.changeDisplayValue({ main: 'mapMaskContext', sub: 'x', value: pageX })
        this.changeDisplayValue({ main: 'mapMaskContext', sub: 'y', value: pageY })
        this.changeDisplay('mapMaskContext')
        console.log(`mapMask(${index})のコンテキストをオープン`)
      }
    },
    dragStartMapMask: function (event, index) {
      event.dataTransfer.setData('kind', 'mapMask-move')
      let offsetX = event.offsetX
      let offsetY = event.offsetY
      event.dataTransfer.setData('offsetX', offsetX)
      event.dataTransfer.setData('offsetY', offsetY)
      this.setDraggingMapMask(index)
    },
    drop: function (event) {
      // ドロップされた物の種類
      const kind = event.dataTransfer.getData('kind')

      let canvasElm = document.getElementById('map-canvas')

      let offsetX = event.pageX - canvasElm.getBoundingClientRect().left
      let offsetY = event.pageY - canvasElm.getBoundingClientRect().top

      const zoom = (1000 - this.translateZ) / 1000
      const zoomedGridSize = this.gridSize / zoom

      if (kind === 'mapMask') {
        const name = event.dataTransfer.getData('name')
        const color = event.dataTransfer.getData('color')
        const fontColor = event.dataTransfer.getData('fontColor')
        let gridW = event.dataTransfer.getData('width')
        let gridH = event.dataTransfer.getData('height')

        let gridC = Math.ceil(offsetX / zoomedGridSize)
        let gridR = Math.ceil(offsetY / zoomedGridSize)

        const mapMaskObj = {
          name: name,
          gridR: gridR,
          gridC: gridC,
          gridW: gridW,
          gridH: gridH,
          color: color,
          fontColor: fontColor
        }

        this.addMapMaskInfo(mapMaskObj)
      }
      if (kind === 'mapMask-move') {
        const _offsetX = Math.floor(event.dataTransfer.getData('offsetX') / this.gridSize) * zoomedGridSize
        const _offsetY = Math.floor(event.dataTransfer.getData('offsetY') / this.gridSize) * zoomedGridSize

        let gridC = Math.ceil((offsetX - _offsetX) / zoomedGridSize)
        let gridR = Math.ceil((offsetY - _offsetY) / zoomedGridSize)

        this.moveMapMask({
          gridR: gridR,
          gridC: gridC
        })
      }
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
            this.drawLine(ctx, c * this.gridSize + 1, r * this.gridSize + 1, this.gridSize - 1, 0)
            // 縦線
            this.drawLine(ctx, c * this.gridSize + 1, r * this.gridSize + 2, 0, this.gridSize - 1)
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
    mapMasks: function () {
      return this.$store.getters.mapMaskList
    },
    sizeW: function () { return this.gridC * this.gridSize + 2 },
    sizeH: function () { return this.gridR * this.gridSize + 2 },
    translateX: function () { return this.leftMove.totalX + this.leftMove.draggingX },
    translateY: function () { return this.leftMove.totalY + this.leftMove.draggingY },
    canvasStyle: function () {
      const _this = this
      const translateZ = this.translateZ
      const zoom = (1000 - this.translateZ) / 1000
      let translateX = this.translateX
      let translateY = this.translateY
      translateX *= zoom
      translateY *= zoom
      return {
        width: _this.sizeW + 'px',
        height: _this.sizeH + 'px',
        transform:
          'translateZ(' + translateZ + 'px) ' +
          'translateY(' + translateY + 'px) ' +
          'translateX(' + translateX + 'px) ' +
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
  -khtml-user-drag: element;
}
canvas {
  display: block;
}
.mapMask {
  position: fixed;
  cursor: default;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 2px;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.mapMask.isLock { border-color: blue; }
.mapMask.isUnLock { border-color: yellow; }
.mapMask.isUnLock:hover { border-width: 4px; transform: translate(-2px, -2px); z-index: 1000; }
</style>
