<template>
  <div
    id="gameTable"
    dropzone="move"
    @dragover.prevent
    @drop.prevent="drop"
    @contextmenu.prevent
    :style="gameTableStyle">

    <div id="mapBoardFrame"
      @mousedown.left.prevent="leftDown" @mouseup.left.prevent="leftUp"
      @mousedown.right.prevent="rightDown" @mouseup.right.prevent="rightUp"
      @touchstart.prevent="leftDown" @touchend.prevent="leftUp" @touchcancel.prevent="leftUp">
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
  mounted: function () {
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('touchmove', this.touchMove)
  },
  methods: {
    ...mapMutations([
      'addPieceInfo',
      'windowOpen',
      'setProperty',
      'windowClose'
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
    getAngle: function (mouseOnTable, storeObj) {
      const rectObj = {
        top: storeObj.top + storeObj.move.dragging.y,
        left: storeObj.left + storeObj.move.dragging.x,
        width: storeObj.columns * this.gridSize,
        height: storeObj.rows * this.gridSize
      }
      const center = {
        x: rectObj.left + rectObj.width / 2,
        y: rectObj.top + rectObj.height / 2
      }
      // 中心座標を基準としたマウス座標
      const loc = {
        x: (mouseOnTable.x - center.x),
        y: (mouseOnTable.y - center.y)
      }
      // 中心点と指定された座標とを結ぶ線の角度を求める
      const angle = Math.atan2(loc.y, loc.x) * 180 / Math.PI
      return angle
    },
    leftDown: function () {
      console.log(`  [methods] mousedown left on GameTable`)
      this.setProperty({property: 'map.move.from.x', value: this.mouseLocate.x})
      this.setProperty({property: 'map.move.from.y', value: this.mouseLocate.y})
      this.setProperty({property: 'map.isDraggingLeft', value: true})
    },
    leftUp: function () {
      console.log(`  [methods] mouseup left on GameTable`)
      if (this.rollObj.isRolling) { // TODO
        const pieceObj = this.$store.state.map[this.rollObj.propName].filter(obj => obj.key === this.rollObj.key)[0]
        const storeIndex = this.$store.state.map[this.rollObj.propName].indexOf(pieceObj)
        this.setProperty({property: `map.rollObj.isRolling`, value: false})
        const planeAngle = this.arrangeAngle(pieceObj.angle.dragging + pieceObj.angle.total)
        const total = this.arrangeAngle(Math.round(planeAngle / 30) * 30)
        // console.log(`angle:${angle}, planeAngle:${planeAngle}, totalB:${this.angle.total}, totalA:${total}`)
        this.setProperty({property: `map.${this.rollObj.propName}.${storeIndex}.angle.total`, value: total})
        this.setProperty({property: `map.${this.rollObj.propName}.${storeIndex}.angle.dragging`, value: 0})
      } else {
        this.setProperty({property: 'map.move.total.x', value: this.move.total.x + this.move.dragging.x})
        this.setProperty({property: 'map.move.total.y', value: this.move.total.y + this.move.dragging.y})
        this.setProperty({property: 'map.move.dragging.x', value: 0})
        this.setProperty({property: 'map.move.dragging.y', value: 0})
        this.setProperty({property: 'map.isDraggingLeft', value: false})
      }
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

      let isRoll = false
      if (isDraggingRight) {
        const nextAngle = this.arrangeAngle(this.angle.total + Math.round(this.angle.dragging / 15) * 15)
        if (this.angle.total !== nextAngle) {
          isRoll = true
        }
        this.setProperty({property: 'map.angle.total', value: nextAngle})
        this.setProperty({property: 'map.angle.dragging', value: 0})
        this.setProperty({property: 'map.isDraggingRight', value: false})
      }
      let pageX = event.pageX
      let pageY = event.pageY

      if (!this.isOverEvent) {
        if (!isRoll) {
          // 右ドラッグが解除されたのが子画面上でなく、調整後に回転していない場合のみ右コンテキストメニューを表示する
          this.setProperty({property: `display.gameTableContext.x`, value: pageX})
          this.setProperty({property: `display.gameTableContext.y`, value: pageY})
          this.windowOpen(`gameTableContext`)
          console.log(`  [methods] open context => gameTableContext`)
        }
      } else {
        this.setProperty({property: `map.isOverEvent`, value: false})
      }
    },
    mouseMove: function (event) {
      this.setMouseLocateOnPage(event.pageX, event.pageY)
    },
    touchMove: function (event) {
      this.setMouseLocateOnPage(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
    },
    setMouseLocateOnPage: function (pageX, pageY) {
      if (this.isMouseDownRight && !this.isDraggingRight) {
        this.setProperty({property: 'map.isDraggingRight', value: true})
      }

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

      const pieceObj = {
        kind: kind,
        left: locateOnTable.x,
        top: locateOnTable.y
      }

      // マップマスクの作成
      if (kind === 'mapMask') {
        const name = event.dataTransfer.getData('name')
        const color = event.dataTransfer.getData('color')
        const fontColor = event.dataTransfer.getData('fontColor')
        const columns = parseInt(event.dataTransfer.getData('columns'))
        const rows = parseInt(event.dataTransfer.getData('rows'))

        // 必須項目
        pieceObj.propName = 'mapMasks'
        pieceObj.columns = columns
        pieceObj.rows = rows
        // 個別部
        pieceObj.name = name
        pieceObj.color = color
        pieceObj.fontColor = fontColor

        this.addPieceInfo(pieceObj)
        return
      }

      // キャラクターの作成
      if (kind === 'character') {
        const name = event.dataTransfer.getData('name')
        const size = event.dataTransfer.getData('size')
        const useImageList = event.dataTransfer.getData('useImageList')
        const isHide = event.dataTransfer.getData('isHide')
        const url = event.dataTransfer.getData('url')
        const text = event.dataTransfer.getData('text')
        const useImageIndex = parseInt(event.dataTransfer.getData('useImageIndex'))
        const currentImageTag = event.dataTransfer.getData('currentImageTag')

        // 必須項目
        pieceObj.propName = 'characters'
        pieceObj.columns = size
        pieceObj.rows = size
        // 個別部
        pieceObj.name = name
        pieceObj.useImageList = useImageList
        pieceObj.isHide = isHide
        pieceObj.url = url
        pieceObj.text = text
        pieceObj.useImageIndex = useImageIndex
        pieceObj.currentImageTag = currentImageTag

        if (this.$store.state.display.addCharacterWindow.isContinuous) {
          const splits = name.split('_')
          const continuousNum = parseInt(splits[splits.length - 1])
          this.setProperty({property: 'display.addCharacterWindow.continuousNum', value: continuousNum + 1})
        } else {
          this.windowClose('addCharacterWindow')
          this.setProperty({property: 'display.addCharacterWindow.continuousNum', value: 1})
        }

        this.addPieceInfo(pieceObj)
        return
      }

      // ファイルがドロップされてる
      const files = event.dataTransfer.files

      // ファイルの種類に応じて振り分け
      const imageFiles = []
      for (const file of files) {
        if (file.type.indexOf('image/') === 0) {
          // 画像
          imageFiles.push(file)
        }
      }

      // 画像ファイルの処理
      if (imageFiles.length > 0) {
        // どこに使う画像ファイルなのかを選んでもらう
        const thumbnailSize = { w: 96, h: 96 }
        const promiseList = []
        for (const file of imageFiles) {
          promiseList.push(this.createBase64DataSet(file, thumbnailSize))
        }
        Promise.all([...promiseList]).then(function (values) {
          values.forEach(function (valueObj, index) {
            valueObj.key = index
          })
          this.setProperty({property: 'display.dropChooseWindow.imageDataList', value: values})
        }.bind(this))
        this.windowOpen('dropChooseWindow')
      }
    },
    createBase64DataSet: function (imageFile, thumbnailSize) {
      return new Promise(function (resolve, reject) {
        const createPromise = function (isThumbnail) {
          // eslint-disable-next-line
          return new Promise(function (resolve2, reject2) {
            // 画像の読み込み処理
            try {
              const reader = new FileReader()
              reader.onload = function (event) {
                if (isThumbnail) {
                  // サムネイル画像作成の場合は小さくて決まったサイズの画像データに加工する（アニメGIFも最初の１コマの静止画になる）

                  const image = new Image()
                  image.onload = function () {
                    const useSize = {
                      w: image.width,
                      h: image.height
                    }

                    // 大きい場合は、比率を保ったまま縮小する
                    if (useSize.w > thumbnailSize.w || useSize.h > thumbnailSize.h) {
                      const scale = Math.min(thumbnailSize.w / useSize.w, thumbnailSize.h / useSize.h)
                      useSize.w = useSize.w * scale
                      useSize.h = useSize.h * scale
                    }

                    // 画像を描画してデータを取り出す（Base64変換の実装）
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = thumbnailSize.w
                    canvas.height = thumbnailSize.h
                    const locate = {
                      x: (canvas.width - useSize.w) / 2,
                      y: (canvas.height - useSize.h) / 2
                    }
                    ctx.drawImage(image, locate.x, locate.y, useSize.w, useSize.h)

                    // 非同期で返却
                    resolve2(canvas.toDataURL())
                  }
                  image.src = event.target.result
                } else {
                  // サムネイル画像でない場合はプレーンな画像データからBase64データを取得する

                  // 非同期で返却
                  resolve2(reader.result)
                }
              }
              reader.readAsDataURL(imageFile)
            } catch (error) {
              reject(error)
            }
          })
        }
        Promise.all([createPromise(true), createPromise(false)]).then(function (values) {
          resolve({
            name: imageFile.name,
            thumbnail: values[0],
            image: values[1]
          })
        })
      })
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
          this.setProperty({property: 'map.angle.dragging', value: angleDiff, logOff: true})
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
    rollObj: function () { return this.$store.state.map.rollObj },
    isDraggingLeft: function () { return this.$store.state.map.isDraggingLeft },
    isMouseDownRight: function () { return this.$store.state.map.isMouseDownRight },
    isOverEvent: function () { return this.$store.state.map.isOverEvent },
    isDraggingRight: function () { return this.$store.state.map.isDraggingRight },
    move: function () { return this.$store.state.map.move },
    angle: function () { return this.$store.state.map.angle },
    currentAngle: function () { return this.arrangeAngle(this.angle.total + this.angle.dragging) },
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
#mapBoardFrame {
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
