<template>
  <div
    id="gameTable"
    dropzone="move"
    @dragover.prevent
    @drop.prevent="drop"
    @contextmenu.prevent
    :style="gameTableStyle">

    <div class="mapBoardFrame"
      @mousedown.left.prevent="leftDown" @mouseup.left.prevent="leftUp"
      @mousedown.right.prevent="rightDown" @mouseup.right.prevent="rightUp">
      <MapBoard/>
    </div>

    <MapMask v-for="mapMask in pieceList('mapMasks')" type="mapMasks" :objKey="mapMask.key" :key="mapMask.key"
      @leftDown="leftDown" @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp" @drag="dragging"/>
    <Character v-for="character in pieceList('characters')" type="characters" :objKey="character.key" :key="character.key"
      @leftDown="leftDown" @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp" @drag="dragging"/>

  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import AddressCalcMixin from '../AddressCalcMixin'
import MapBoard from './MapBoard'
import MapMask from './mapMask/MapMask'
import Character from './character/Character'

export default {
  name: 'gameTable',
  mixins: [AddressCalcMixin],
  components: {
    MapBoard: MapBoard,
    MapMask: MapMask,
    Character: Character
  },
  data () {
    return {
    }
  },
  mounted: function () {
    document.body.addEventListener('mousemove', this.mouseMove)
    document.body.addEventListener('drag', this.mouseMove)
  },
  methods: {
    ...mapMutations([
      'addMapMaskInfo',
      'windowOpen',
      'setProperty'
    ]),
    dragging: function () {
      console.log(`★★★★ dragging ★★★★`)
    },
    onWheel: function (delta) {
      const changeValue = 100
      const add = delta > 0 ? changeValue : -changeValue
      const wheel = this.wheel + add
      if (wheel < -2400 || wheel > 800) {
        return
      }
      this.setProperty({property: 'map.wheel', value: wheel})
    },
    leftDown: function () {
      console.log(`  [methods] mousedown left on GameTable`)
      this.setProperty({property: 'map.move.from.x', value: this.mouseLocate.x})
      this.setProperty({property: 'map.move.from.y', value: this.mouseLocate.y})
      this.setProperty({property: 'map.isDraggingLeft', value: true})
    },
    leftUp: function () {
      console.log(`  [methods] mouseup left on GameTable`)
      this.setProperty({property: 'map.move.total.x', value: this.move.total.x + this.move.dragging.x})
      this.setProperty({property: 'map.move.total.y', value: this.move.total.y + this.move.dragging.y})
      this.setProperty({property: 'map.move.dragging.x', value: 0})
      this.setProperty({property: 'map.move.dragging.y', value: 0})
      this.setProperty({property: 'map.isDraggingLeft', value: false})
    },
    rightDown: function () {
      console.log(`  [methods] mousedown right on GameTable`)
      this.setProperty({property: 'map.angle.dragStart', value: this.calcCoordinate(this.mouseLocate.x, this.mouseLocate.y, this.currentAngle).angle})
      this.setProperty({property: 'map.isMouseDownRight', value: true})
    },
    rightUp: function (event) {
      console.log(`  [methods] mouseup right on GameTable`)
      const isDraggingRight = this.isDraggingRight
      this.setProperty({property: 'map.isMouseDownRight', value: false})
      if (isDraggingRight) {
        this.setProperty({property: 'map.angle.total', value: this.angle.total + Math.round(this.angle.dragging / 15) * 15})
        this.setProperty({property: 'map.angle.dragging', value: 0})
        this.setProperty({property: 'map.isDraggingRight', value: false})
      }
      let pageX = event.pageX
      let pageY = event.pageY

      console.log(`  [methods] open context => gameTableContext`)
      this.setProperty({property: `display.gameTableContext.x`, value: pageX})
      this.setProperty({property: `display.gameTableContext.y`, value: pageY})
      this.windowOpen(`gameTableContext`)
    },
    mouseMove: function (event) {
      // console.log('$$$$$$$$$  mouseMove', event)
      // const f = this.f

      if (this.isMouseDownRight) {
        this.setProperty({property: 'map.isDraggingRight', value: true})
      }

      let pageX = event.pageX
      let pageY = event.pageY
      this.setProperty({property: 'mouse.x', value: pageX, logOff: true})
      this.setProperty({property: 'mouse.y', value: pageY, logOff: true})

      const canvasAddress = this.calcCanvasAddress(event.pageX, event.pageY, this.currentAngle)
      this.setProperty({property: 'map.mouse.onScreen.x', value: canvasAddress.locateOnScreen.x, logOff: true})
      this.setProperty({property: 'map.mouse.onScreen.y', value: canvasAddress.locateOnScreen.y, logOff: true})
      this.setProperty({property: 'map.mouse.onTable.x', value: canvasAddress.locateOnTable.x, logOff: true})
      this.setProperty({property: 'map.mouse.onTable.y', value: canvasAddress.locateOnTable.y, logOff: true})
      this.setProperty({property: 'map.mouse.onCanvas.x', value: canvasAddress.locateOnCanvas.x, logOff: true})
      this.setProperty({property: 'map.mouse.onCanvas.y', value: canvasAddress.locateOnCanvas.y, logOff: true})
      this.setProperty({property: 'map.grid.c', value: canvasAddress.grid.column, logOff: true})
      this.setProperty({property: 'map.grid.r', value: canvasAddress.grid.row, logOff: true})
    },
    drop: function (event) {
      // ドロップされた物の種類
      const kind = event.dataTransfer.getData('kind')

      const offsetX = event.dataTransfer.getData('offsetX')
      const offsetY = event.dataTransfer.getData('offsetY')

      const canvasAddress = this.calcCanvasAddress(event.pageX, event.pageY, this.currentAngle, offsetX, offsetY)
      const locateOnTable = canvasAddress.locateOnTable
      if (this.isFitGrid) {
        locateOnTable.x = (Math.ceil(locateOnTable.x / this.gridSize) - 1) * this.gridSize
        locateOnTable.y = (Math.ceil(locateOnTable.y / this.gridSize) - 1) * this.gridSize
      }

      console.log(`  [methods] drop on GameTable(${canvasAddress.grid.column}, ${canvasAddress.grid.row}) => ${kind}`)

      // マップマスクの作成
      if (kind === 'mapMask') {
        const name = event.dataTransfer.getData('name')
        const color = event.dataTransfer.getData('color')
        const fontColor = event.dataTransfer.getData('fontColor')
        const columns = parseInt(event.dataTransfer.getData('columns'))
        const rows = parseInt(event.dataTransfer.getData('rows'))

        const mapMaskObj = {
          name: name,
          left: locateOnTable.x,
          top: locateOnTable.y,
          columns: columns,
          rows: rows,
          color: color,
          fontColor: fontColor
        }

        this.addMapMaskInfo(mapMaskObj)
      }

      // キャラクターの作成
      if (kind === 'character') {
        const name = event.dataTransfer.getData('name')
        const imgDataListStr = event.dataTransfer.getData('imgDataList')
        const imgIndex = parseInt(event.dataTransfer.getData('imgIndex'))

        const imgTag = event.dataTransfer.getData('imgTag')
        const gridSize = parseInt(event.dataTransfer.getData('gridSize'))
        const url = event.dataTransfer.getData('url')
        const text = event.dataTransfer.getData('text')

        const imgDataList = imgDataListStr.split(',')

        const mapMaskObj = {
          name: name,
          left: locateOnTable.x,
          top: locateOnTable.y,
          columns: gridSize,
          rows: gridSize,
          imgDataList: imgDataList,
          imgIndex: imgIndex,
          imgTag: imgTag,
          url: url,
          text: text
        }

        this.addMapMaskInfo(mapMaskObj)
      }
    }
  },
  watch: {
    mouseLocate: {
      handler: function (mouseLocate) {
        if (this.isDraggingLeft) {
          this.setProperty({property: 'map.move.dragging.x', value: mouseLocate.x - this.move.from.x, logOff: true})
          this.setProperty({property: 'map.move.dragging.y', value: mouseLocate.y - this.move.from.y, logOff: true})
        }
        if (this.isDraggingRight) {
          const angle = this.calcCoordinate(mouseLocate.x, mouseLocate.y, this.currentAngle).angle
          let angleDiff = this.arrangeAngle(angle - this.angle.dragStart)
          this.setProperty({property: 'map.angle.dragging', value: angleDiff})
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'pieceList',
      'isFitGrid'
    ]),
    isDraggingLeft: function () {
      return this.$store.state.map.isDraggingLeft
    },
    isMouseDownRight: function () {
      return this.$store.state.map.isMouseDownRight
    },
    isDraggingRight: function () {
      return this.$store.state.map.isDraggingRight
    },
    move: function () {
      return this.$store.state.map.move
    },
    angle: function () {
      return this.$store.state.map.angle
    },
    currentAngle: function () {
      return this.arrangeAngle(this.angle.total + this.angle.dragging)
    },
    sizeW: function () { return (this.columns + this.marginGridNum) * this.gridSize + 0 },
    sizeH: function () { return (this.rows + this.marginGridNum) * this.gridSize + 0 },
    gameTableStyle: function () {
      const translateZ = this.wheel
      const zoom = (1000 - this.wheel) / 1000
      const totalLeftX = (this.move.total.x + this.move.dragging.x) * zoom
      const totalLeftY = (this.move.total.y + this.move.dragging.y) * zoom
      let rotateZ = this.currentAngle
      return {
        width: this.sizeW + 'px',
        height: this.sizeH + 'px',
        'border-width': this.borderWidth + 'px',
        transform:
          'translateZ(' + translateZ + 'px) ' +
          'translateY(' + totalLeftY + 'px) ' +
          'translateX(' + totalLeftX + 'px) ' +
          'rotateY(0deg) ' +
          'rotateX(0deg) ' +
          'rotateZ(' + rotateZ + 'deg)'
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
  /*
  box-sizing: border-box;
  */
  perspective: 1000px;
  border-style: ridge;
  border-color: gray;
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
