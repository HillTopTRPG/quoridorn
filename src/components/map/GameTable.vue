<template>
  <div
    id="gameTable"
    dropzone="move"
    @dragover.prevent
    @drop.prevent="drop"
    :style="gameTableStyle"
    @contextmenu.prevent>

    <div class="mapBoardFrame"
      @mousedown.left.prevent="leftDown" @mouseup.left.prevent="leftUp"
      @mousedown.right.prevent="rightDown" @mouseup.right.prevent="rightUp">
      <MapBoard/>
    </div>

    <MapMask v-for="mapMask in mapMaskList" type="mapMasks" :objKey="mapMask.key" :key="mapMask.key" @leftDown="leftDown" @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp" @drag="dragging"/>

  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
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
      isDraggingLeft: false,
      isDraggingRight: false,
      mouse: {
        x: 0,
        y: 0,
        left: {
          from: { x: 0, y: 0 },
          to: { x: 0, y: 0 },
          totalX: 0,
          totalY: 0,
          draggingX: 0,
          draggingY: 0
        },
        right: {
          from: { x: 0, y: 0 },
          to: { x: 0, y: 0 },
          totalX: 0,
          totalY: 0,
          draggingX: 0,
          draggingY: 0
        }
      },
      angle: {
        total: 0,
        dragging: 0,
        dragStart: 0
      },
      translateZ: 0,
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
      // console.log('$$$$$$$$$  mouseMove', event)
      // const f = this.f
      let pageX = event.pageX
      let pageY = event.pageY
      this.mouse.x = pageX
      this.mouse.y = pageY
      this.reflesh()
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
    leftDown: function () {
      console.log('  [methods] mousedown left on GameTable')
      this.mouse.left.from.x = this.mouse.x
      this.mouse.left.from.y = this.mouse.y
      this.isDraggingLeft = true
    },
    leftUp: function () {
      console.log('  [methods] mouseup left on GameTable')
      this.isDraggingLeft = false
      this.mouse.left.totalX += this.mouse.left.draggingX
      this.mouse.left.totalY += this.mouse.left.draggingY
      this.mouse.left.draggingX = 0
      this.mouse.left.draggingY = 0
    },
    rightDown: function () {
      console.log('  [methods] mousedown right on GameTable')
      this.mouse.right.from.x = this.mouse.x
      this.mouse.right.from.y = this.mouse.y
      this.angle.dragStart = this.calcCoordinate(this.mouse.x, this.mouse.y).angle
      this.isDraggingRight = true
    },
    rightUp: function () {
      console.log('  [methods] mouseup right on GameTable')
      this.isDraggingRight = false
      this.mouse.right.totalX += this.mouse.right.draggingX
      this.mouse.right.totalY += this.mouse.right.draggingY
      this.mouse.right.draggingX = 0
      this.mouse.right.draggingY = 0

      this.angle.total += Math.round(this.angle.dragging / 5) * 5
      this.angle.dragging = 0
    },
    arrangeAngle: function (angle) {
      if (angle > 180) { angle -= 360 }
      if (angle < -180) { angle += 360 }
      return angle
    },
    /**
     * 指定されたスクリーン座標を元に、座標計算を行う
     * @param  {Number} screenX スクリーン上のX座標
     * @param  {Number} screenY スクリーン上のY座標
     * @return {Object}         ソース参照
     */
    calcCoordinate: function (screenX, screenY) {
      // スクロール倍率を考慮
      const zoom = (1000 - this.translateZ) / 1000.0

      // canvas上のマス座標を計算する
      const cr = document.getElementById('map-canvas').getBoundingClientRect()
      // canvasの中心点
      const center = {
        x: cr.x + cr.width / 2,
        y: cr.y + cr.height / 2
      }
      // 中心座標を基準としたマウス座標
      const loc = {
        x: (screenX - center.x),
        y: (screenY - center.y)
      }

      // 中心点と指定された座標とを結ぶ線の角度を求める
      const angle = Math.atan2(loc.y, loc.x) * 180 / Math.PI

      // 中心点と指定された座標とを結ぶ線の長さを求める
      const distance = Math.sqrt(Math.pow(loc.x, 2) + Math.pow(loc.y, 2)) * zoom

      // マップ回転前の角度を求める
      const oldAngle = this.arrangeAngle(this.angle.total + this.angle.dragging)
      const angleBeforeAround = this.arrangeAngle(angle - oldAngle)
      const planeLocate = {
        x: center.x + distance * Math.cos(angleBeforeAround * Math.PI / 180),
        y: center.y + distance * Math.sin(angleBeforeAround * Math.PI / 180)
      }

      /*
      const f = Math.floor
      const planeLocateFromCenter = {
        x: planeLocate.x - center.x,
        y: planeLocate.y - center.y
      }
      console.log(
          `zm:${zoom} `
        + `center(${f(center.x)}, ${f(center.y)}) `
        + `loc(${f(loc.x)}, ${f(loc.y)}) `
        + `angle:${f(angle)} `
        + `oldAngle:${f(oldAngle)} `
        + `angleBeforeAround:${f(angleBeforeAround)} `
        + `dist:${f(distance)} `
        + `planeLocate(${f(planeLocate.x)}, ${f(planeLocate.y)}) `
        + `planeLocateC(${f(planeLocateFromCenter.x)}, ${f(planeLocateFromCenter.y)}) `
        )
      */

      const result = {
        angle: angle, // 角度
        planeLocate: planeLocate // マップ回転前のスクリーン座標
      }
      // console.log(`screen(${this.f(screenX)}, ${this.f(screenY)}), angle:${this.f(angle)}, distance:${this.f(distance)} plane(${this.f(planeLocate.x)}, ${this.f(planeLocate.y)})`)
      return result
    },
    f: function (v) {
      return Math.floor(v * 100) / 100
    },
    calcAddress: function (screenX, screenY, offsetX = 0, offsetY = 0) {
      // 回転やズームの前のスクリーン座標がどこになるかを計算し、そこをベースにマップ上の座標を算出する
      let planeLocate = this.calcCoordinate(screenX, screenY).planeLocate
      let canvasElm = document.getElementById('map-canvas')
      const canvasRect = canvasElm.getBoundingClientRect()
      const center = {
        x: canvasRect.x + canvasRect.width / 2,
        y: canvasRect.y + canvasRect.height / 2
      }
      const leftTop = {
        x: center.x - this.gridC * this.gridSize / 2,
        y: center.y - this.gridR * this.gridSize / 2
      }
      const clientX = planeLocate.x - leftTop.x
      const clientY = planeLocate.y - leftTop.y

      //
      let gridC = Math.ceil(clientX / this.gridSize)
      let gridR = Math.ceil(clientY / this.gridSize)

      /*
      const f = Math.floor
      console.log(`screen(${f(screenX)}, ${f(screenY)}), center(${f(center.x)}, ${f(center.y)}), leftTop(${f(leftTop.x)}, ${f(leftTop.y)}), size(${f(this.sizeW)}, ${f(this.sizeH)}), planeLocate(${f(planeLocate.x)}, ${f(planeLocate.y)}), client(${f(clientX)}, ${f(clientY)})`)
      */

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
        gridC -= offsetGridX
        gridR -= offsetGridY
      }

      // console.log(`マス座標 rel(${gridC - this.marginGridNum / 2}, ${gridR - this.marginGridNum / 2}) abs(${gridC}, ${gridR})`)

      return {
        gridC: gridC,
        gridR: gridR
      }
    },
    reflesh: function () {
      if (this.isDraggingLeft) {
        this.mouse.left.to.x = this.mouse.x
        this.mouse.left.to.y = this.mouse.y
        const moveLeftX = this.mouse.x - this.mouse.left.from.x
        const moveLeftY = this.mouse.y - this.mouse.left.from.y
        this.mouse.left.draggingX = moveLeftX
        this.mouse.left.draggingY = moveLeftY
      }

      if (this.isDraggingRight) {
        this.mouse.right.to.x = this.mouse.x
        this.mouse.right.to.y = this.mouse.y
        const moveRightX = this.mouse.x - this.mouse.right.from.x
        const moveRightY = this.mouse.y - this.mouse.right.from.y
        this.mouse.right.draggingX = moveRightX
        this.mouse.right.draggingY = moveRightY

        const angle = this.calcCoordinate(this.mouse.x, this.mouse.y).angle
        let angleDiff = this.arrangeAngle(angle - this.angle.dragStart)
        this.angle.dragging = angleDiff
      }

      // canvas上のマス座標を計算する
      const gridObj = this.calcAddress(this.mouse.x, this.mouse.y)
      const addressObj = {
        c: gridObj.gridC,
        r: gridObj.gridR
      }
      this.setMouseAddress(addressObj)
    },
    drop: function (event) {
      // ドロップされた物の種類
      const kind = event.dataTransfer.getData('kind')

      const offsetX = event.dataTransfer.getData('offsetX')
      const offsetY = event.dataTransfer.getData('offsetY')

      // マス座標
      const addressObj = this.calcAddress(event.pageX, event.pageY, offsetX, offsetY)
      const gridC = addressObj.gridC
      const gridR = addressObj.gridR

      console.log(`  [methods] drop on GameTable(${gridC}, ${gridR}) => ${kind}`)

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
    }
  },
  computed: {
    ...mapGetters([
      'mapMaskList'
    ]),
    gridC: function () {
      return this.$store.state.map.grid.totalColumn
    },
    gridR: function () {
      return this.$store.state.map.grid.totalRow
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    },
    marginGridNum: function () {
      return this.$store.state.map.marginGridNum
    },
    sizeW: function () { return (this.gridC + this.marginGridNum) * this.gridSize + 0 },
    sizeH: function () { return (this.gridR + this.marginGridNum) * this.gridSize + 0 },
    gameTableStyle: function () {
      const _this = this
      const translateZ = this.translateZ
      const zoom = (1000 - this.translateZ) / 1000
      const totalLeftX = (this.mouse.left.totalX + this.mouse.left.draggingX) * zoom
      const totalLeftY = (this.mouse.left.totalY + this.mouse.left.draggingY) * zoom
      const rotateZ = this.arrangeAngle(this.angle.total + this.angle.dragging)
      // console.log(`rect(${this.sizeW}, ${this.sizeH}), position(${left}, ${top}), screen(${window.innerWidth}, ${window.innerHeight})`)
      return {
        width: this.sizeW + 'px',
        height: this.sizeH + 'px',
        transform:
          'translateZ(' + translateZ + 'px) ' +
          'translateY(' + totalLeftY + 'px) ' +
          'translateX(' + totalLeftX + 'px) ' +
          'rotateY(' + _this.rotateY + 'deg) ' +
          'rotateX(' + _this.rotateX + 'deg) ' +
          'rotateZ(' + rotateZ + 'deg)'
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
