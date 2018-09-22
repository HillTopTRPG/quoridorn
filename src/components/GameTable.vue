<template>
  <div
    id="gameTable"
    dropzone="move"
    @dragover.prevent
    @drop.prevent="drop"
    :style="gameTableStyle">

    <div class="mapBoardFrame"
      @mousedown.left.prevent="leftDown" @mouseup.left.prevent="leftUp"
      @mousedown.right.prevent="rightDown" @mouseup.right.prevent="rightUp">
      <MapBoard/>
    </div>

    <MapMask v-for="(mapMask, index) in mapMasks" :key="index" :mapMask="mapMask" :index="index" @leftDown="leftDown" @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp"/>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import MapMask from './MapMask'
import MapBoard from './MapBoard'

export default {
  name: 'mapComponent',
  components: {
    MapMask: MapMask,
    MapBoard: MapBoard
  },
  data () {
    return {
      marginGridNum: 60,
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
    const _this = this
    document.body.addEventListener('mousemove', function (e) {
      _this.mouse.x = e.pageX
      _this.mouse.y = e.pageY
      _this.reflesh(e.pageX, e.pageY)
      // console.log(`page(${e.pageX}, ${e.pageY})`)
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
    wheel: function (delta) {
      const afterTranslateZ = this.translateZ + delta
      if (afterTranslateZ < -2400 || afterTranslateZ > 840) {
        return
      }
      this.translateZ = afterTranslateZ
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
    drop: function (event) {
      // ドロップされた物の種類
      console.log(`何かがドロップされた`)
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

        let gridC = Math.ceil(offsetX / zoomedGridSize) + this.marginGridNum / 2
        let gridR = Math.ceil(offsetY / zoomedGridSize) + this.marginGridNum / 2

        console.log(`grid(${gridC}, ${gridR})`)

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

        let gridC = Math.ceil((offsetX - _offsetX) / zoomedGridSize) + this.marginGridNum / 2
        let gridR = Math.ceil((offsetY - _offsetY) / zoomedGridSize) + this.marginGridNum / 2

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
    }
  },
  computed: {
    mapMasks: function () {
      return this.$store.getters.mapMaskList
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
    sizeW: function () { return (this.gridC + this.marginGridNum) * this.gridSize + 2 },
    sizeH: function () { return (this.gridR + this.marginGridNum) * this.gridSize + 2 },
    gameTableStyle: function () {
      const _this = this
      const translateZ = this.translateZ
      const zoom = (1000 - this.translateZ) / 1000
      let translateX = this.leftMove.totalX + this.leftMove.draggingX
      let translateY = this.leftMove.totalY + this.leftMove.draggingY
      translateX *= zoom
      translateY *= zoom
      // console.log(`rect(${this.sizeW}, ${this.sizeH}), position(${left}, ${top}), screen(${window.innerWidth}, ${window.innerHeight})`)
      return {
        width: this.sizeW + 'px',
        height: this.sizeH + 'px',
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
#gameTable {
  position: fixed;
  box-sizing: border-box;
  display: block;
  margin: auto;
  text-align: center;
  vertical-align: middle;
  -khtml-user-drag: element;
  background-color: rgba(20, 20, 20, .1);
  // border: groove 18px gray;
    background-image:
    linear-gradient(0deg, transparent 0%,
            rgba(255, 255, 255, .2) 1%, rgba(255, 255, 255, .2) 3%, transparent 4%, transparent 20%,
            rgba(255, 255, 255, .1) 21%, rgba(255, 255, 255, .1) 22%, transparent 23%, transparent 40%,
            rgba(255, 255, 255, .1) 41%, rgba(255, 255, 255, .1) 42%, transparent 43%, transparent 60%,
            rgba(255, 255, 255, .1) 61%, rgba(255, 255, 255, .1) 62%, transparent 63%, transparent 80%,
            rgba(255, 255, 255, .1) 81%, rgba(255, 255, 255, .1) 82%, transparent 83%, transparent 99%, rgba(255, 255, 255, .2) 1%),
    linear-gradient(90deg, transparent 0%,
            rgba(255, 255, 255, .2) 1%, rgba(255, 255, 255, .2) 3%, transparent 4%, transparent 20%,
            rgba(255, 255, 255, .1) 21%, rgba(255, 255, 255, .1) 22%, transparent 23%, transparent 40%,
            rgba(255, 255, 255, .1) 41%, rgba(255, 255, 255, .1) 42%, transparent 43%, transparent 60%,
            rgba(255, 255, 255, .1) 61%, rgba(255, 255, 255, .1) 62%, transparent 63%, transparent 80%,
            rgba(255, 255, 255, .1) 81%, rgba(255, 255, 255, .1) 82%, transparent 83%, transparent 99%);
  background-size:51px 51px;
}
.mapBoardFrame {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  vertical-align: middle;
}
</style>
