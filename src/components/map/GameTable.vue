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

    <MapMask v-for="(mapMask, index) in mapMasks" :key="index" :mapMask="mapMask" :index="index" @leftDown="leftDown" @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp" @drag="dragging"/>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import MapMask from './mapMask/MapMask'
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
    document.body.addEventListener('mousemove', this.mouseMove)
    document.body.addEventListener('drag', this.mouseMove)
  },
  methods: {
    ...mapMutations([
      'addMapMaskInfo',
      'moveMapMask',
      'setDraggingMapMask',
      'changeDisplay',
      'changeDisplayValue',
      'setMouseAddress'
    ]),
    dragging: function () {
      console.log(`★★★★ dragging ★★★★`)
    },
    mouseMove: function (event) {
      console.log('$$$$$$$$$  mouseMove', event)
      // const f = this.f
      let pageX = event.pageX
      let pageY = event.pageY
      this.mouse.x = pageX
      this.mouse.y = pageY
      this.reflesh(pageX, pageY)

      let canvasElm = document.getElementById('map-canvas')
      const canvasX = canvasElm.getBoundingClientRect().left
      const canvasY = canvasElm.getBoundingClientRect().top
      const clientX = pageX - canvasX
      const clientY = pageY - canvasY

      // console.log(`マウス移動 page(${f(pageX)}, ${f(pageY)}), canvas(${f(canvasX)}, ${f(canvasY)}), client(${f(clientX)}, ${f(clientY)}) translateZ:${this.translateZ}`)
      const gridObj = this.calcAddress(clientX, clientY)
      const addressObj = {
        c: gridObj.gridC - this.marginGridNum / 2,
        r: gridObj.gridR - this.marginGridNum / 2
      }
      this.setMouseAddress(addressObj)
      // console.log(`address(${addressObj.c}, ${addressObj.r}) grid(${gridObj.gridC}, ${gridObj.gridR}) marginGridNum:${this.marginGridNum}`)
    },
    wheel: function (delta) {
      const changeValue = 100
      const add = delta > 0 ? changeValue : -changeValue
      const afterTranslateZ = this.translateZ + add
      if (afterTranslateZ < -2400 || afterTranslateZ > 800) {
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
    f: function (v) {
      return Math.floor(v * 100) / 100
    },
    calcAddress: function (clientX, clientY, offsetX = 0, offsetY = 0) {
      let gridC, gridR
      // const f = this.f

      const zoom = (1000 - this.translateZ) / 1000

      // ドロップ先のマス座標を算出
      let offsetGridX = offsetX / this.gridSize
      let offsetGridY = offsetY / this.gridSize
      if (offsetGridX > 0) {
        offsetGridX = Math.floor(offsetGridX)
      } else {
        offsetGridX = Math.ceil(offsetGridX)
      }
      if (offsetGridY > 0) {
        offsetGridY = Math.floor(offsetGridY)
      } else {
        offsetGridY = Math.ceil(offsetGridY)
      }

      // console.log(`client(${f(clientX)}, ${f(clientY)}) offset(${f(offsetX)}, ${f(offsetY)}), １マスのサイズ:${f(zoomedGridSize)} zoomed(${f(clientX / zoomedGridSize)}, ${f(clientY / zoomedGridSize)}) offsetGrid(${f(offsetGridX)}, ${f(offsetGridY)})`)
      if (offsetX !== undefined && offsetY !== undefined) {
        gridC = Math.ceil(clientX * zoom / this.gridSize) + this.marginGridNum / 2 - offsetGridX
        gridR = Math.ceil(clientY * zoom / this.gridSize) + this.marginGridNum / 2 - offsetGridY
      } else {
        gridC = Math.ceil(clientX * zoom / this.gridSize) + this.marginGridNum / 2
        gridR = Math.ceil(clientY * zoom / this.gridSize) + this.marginGridNum / 2
      }

      // console.log(`マス座標 rel(${gridC - this.marginGridNum / 2}, ${gridR - this.marginGridNum / 2}) abs(${gridC}, ${gridR})`)

      return {
        gridC: gridC,
        gridR: gridR
      }
    },
    drop: function (event) {
      // ドロップされた物の種類
      console.log(`何かがドロップされた`)
      const kind = event.dataTransfer.getData('kind')

      // マス座標
      let canvasElm = document.getElementById('map-canvas')
      const clientX = event.pageX - canvasElm.getBoundingClientRect().left
      const clientY = event.pageY - canvasElm.getBoundingClientRect().top

      const offsetX = event.dataTransfer.getData('offsetX')
      const offsetY = event.dataTransfer.getData('offsetY')

      const addressObj = this.calcAddress(clientX, clientY, offsetX, offsetY)
      const gridC = addressObj.gridC
      const gridR = addressObj.gridR

      // マップマスクの作成
      if (kind === 'mapMask') {
        const name = event.dataTransfer.getData('name')
        const color = event.dataTransfer.getData('color')
        const fontColor = event.dataTransfer.getData('fontColor')
        let gridW = event.dataTransfer.getData('width')
        let gridH = event.dataTransfer.getData('height')

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
      // マップマスクの移動
      if (kind === 'mapMask-move') {
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
      return this.$store.state.map.grid.totalColumn
    },
    gridR: function () {
      return this.$store.state.map.grid.totalRow
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    },
    sizeW: function () { return (this.gridC + this.marginGridNum) * this.gridSize + 0 },
    sizeH: function () { return (this.gridR + this.marginGridNum) * this.gridSize + 0 },
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
        /*
          ,
        background-image:
          'linear-gradient(0deg, transparent -2px,' +
            `rgba(255, 255, 255, .3) 2px, rgba(255, 255, 255, .2) 3%, transparent 4%, transparent 20%,`
            */
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#gameTable {
  position: fixed;
  display: block;
  margin: auto;
  text-align: center;
  vertical-align: middle;
  -khtml-user-drag: element;
  background-color: rgba(20, 80, 20, .1);
  cursor: crosshair;
  border: none;
  border-width: 0;
  /*
  box-sizing: border-box;
  */
  border: ridge 24px gray;
  background-position: 1px 1px;
    background-image:
    linear-gradient(0deg, transparent -2px,
            rgba(255, 255, 255, .3) 2px, rgba(255, 255, 255, .2) 3%, transparent 4%, transparent 20%,
            rgba(255, 255, 255, .1) 21%, rgba(255, 255, 255, .1) 22%, transparent 23%, transparent 40%,
            rgba(255, 255, 255, .1) 41%, rgba(255, 255, 255, .1) 42%, transparent 43%, transparent 60%,
            rgba(255, 255, 255, .1) 61%, rgba(255, 255, 255, .1) 62%, transparent 63%, transparent 80%,
            rgba(255, 255, 255, .1) 81%, rgba(255, 255, 255, .1) 82%, transparent 83%, transparent),
    linear-gradient(270deg, transparent -2px,
            rgba(255, 255, 255, .3) 2px, rgba(255, 255, 255, .2) 3%, transparent 4%, transparent 20%,
            rgba(255, 255, 255, .1) 21%, rgba(255, 255, 255, .1) 22%, transparent 23%, transparent 40%,
            rgba(255, 255, 255, .1) 41%, rgba(255, 255, 255, .1) 42%, transparent 43%, transparent 60%,
            rgba(255, 255, 255, .1) 61%, rgba(255, 255, 255, .1) 62%, transparent 63%, transparent 80%,
            rgba(255, 255, 255, .1) 81%, rgba(255, 255, 255, .1) 82%, transparent 83%, transparent);
  background-size:48px 48px;
}
.mapBoardFrame {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: none;
  border-width: 0;
  text-align: center;
  vertical-align: middle;
}
</style>
