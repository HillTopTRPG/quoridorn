<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  methods: {
    ...mapActions([]),
    arrangeAngle (angle) {
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
    calcCoordinate (screenX, screenY, oldAngle) {
      // スクロール倍率を考慮
      const zoom = (1000 - this.wheel) / 1000.0
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
      const angleBeforeAround = this.arrangeAngle(angle - oldAngle)
      const planeLocateScreen = {
        x: center.x + distance * Math.cos(angleBeforeAround * Math.PI / 180),
        y: center.y + distance * Math.sin(angleBeforeAround * Math.PI / 180)
      }
      const planeLocateCenter = {
        x: planeLocateScreen.x - center.x,
        y: planeLocateScreen.y - center.y
      }
      const planeLocateCanvas = {
        x: planeLocateCenter.x + this.columns / 2 * this.gridSize,
        y: planeLocateCenter.y + this.rows / 2 * this.gridSize
      }
      const planeLocateTable = {
        x: planeLocateCanvas.x + this.marginGridSize / 2 * this.gridSize,
        y: planeLocateCanvas.y + this.marginGridSize / 2 * this.gridSize
      }
      /*
      const f = Math.floor
      const planeLocateFromCenter = { x: planeLocate.x - center.x, y: planeLocate.y - center.y }
      const planeCanvas = { x: center.x - this.columns / 2 * this.gridSize, y: center.y - this.rows / 2 * this.gridSize }
      const canvas = { x: center.x - this.columns / 2 * this.gridSize / zoom, y: center.y - this.rows / 2 * this.gridSize / zoom }
      console.log(
        `zm:${zoom} ` +
        `canvas(${f(canvas.x)}, ${f(canvas.y)}) ` +
        `pCanvas(${f(planeCanvas.x)}, ${f(planeCanvas.y)}) ` +
        `center(${f(center.x)}, ${f(center.y)}) ` +
        `loc(${f(loc.x)}, ${f(loc.y)}) ` +
        // `angle:${f(angle)} ` +
        // `oldAngle:${f(oldAngle)} ` +
        `useAngle:${f(angleBeforeAround)} ` +
        `dist:${f(distance)} ` +
        `planeLocate(${f(planeLocate.x)}, ${f(planeLocate.y)}) ` +
        `planeLocateC(${f(planeLocateFromCenter.x)}, ${f(planeLocateFromCenter.y)}) `)
      */
      const result = {
        angle: angle, // 角度
        planeLocateScreen: planeLocateScreen, // マップ回転前のスクリーンベースの座標
        planeLocateCanvas: planeLocateCanvas, // マップ回転前のキャンバスベースの座標
        planeLocateTable: planeLocateTable // マップ回転前のテーブルベースの座標
      }
      // console.log(`screen(${this.f(screenX)}, ${this.f(screenY)}), angle:${this.f(angle)}, distance:${this.f(distance)} plane(${this.f(planeLocate.x)}, ${this.f(planeLocate.y)})`)
      return result
    },
    f (v) {
      return Math.floor(v * 100) / 100
    },
    getLeftTop () {
      let canvasElm = document.getElementById('map-canvas')
      const canvasRect = canvasElm.getBoundingClientRect()
      const center = {
        x: canvasRect.x + canvasRect.width / 2,
        y: canvasRect.y + canvasRect.height / 2
      }
      const leftTop = {
        x: center.x - this.columns * this.gridSize / 2,
        y: center.y - this.rows * this.gridSize / 2
      }
      return leftTop
    },
    calcAddress (screenX, screenY, oldAngle, offsetX = 0, offsetY = 0) {
      // 回転やズームの前のスクリーン座標がどこになるかを計算し、そこをベースにマップ上の座標を算出する
      let planeLocateCanvas = this.calcCoordinate(screenX, screenY, oldAngle).planeLocateCanvas

      // ドロップ先のマス座標を算出
      let gridC = Math.ceil(planeLocateCanvas.x / this.gridSize)
      let gridR = Math.ceil(planeLocateCanvas.y / this.gridSize)

      // 掴んだときの対象の相対位置を考慮
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
      gridC -= offsetGridX
      gridR -= offsetGridY

      return {
        gridC: gridC,
        gridR: gridR
      }
    },
    calcCanvasAddress (screenX, screenY, oldAngle, offsetX = 0, offsetY = 0) {
      //
      let coordinateObj = this.calcCoordinate(screenX, screenY, oldAngle)

      // マス座標
      const addressObj = this.calcAddress(screenX, screenY, oldAngle, offsetX, offsetY)

      /*
      const f = Math.floor
      console.log(
        `oldAngle:${oldAngle} ` +
        `los(${f(locateOnScreen.x)}, ${f(locateOnScreen.y)}) ` +
        `lot(${f(locateOnTable.x)}, ${f(locateOnTable.y)}) ` +
        `loc(${f(locateOnCanvas.x)}, ${f(locateOnCanvas.y)}) `)
      */

      return {
        locateOnScreen: coordinateObj.planeLocateScreen,
        locateOnTable: coordinateObj.planeLocateTable,
        locateOnCanvas: coordinateObj.planeLocateCanvas,
        grid: {
          column: addressObj.gridC,
          row: addressObj.gridR
        }
      }
    }
  },
  computed: mapState({
    ...mapGetters([]),
    mouseLocate: 'mouse',
    columns: state => state.public.map.grid.totalColumn,
    rows: state => state.public.map.grid.totalRow,
    gridSize: state => state.public.map.grid.size,
    canvasSize () {
      return {
        w: this.columns * this.gridSize,
        h: this.rows * this.gridSize
      }
    },
    mouseOnScreen: state => state.map.mouse.onScreen,
    mouseOnTable: state => state.map.mouse.onTable,
    mouseOnCanvas: state => state.map.mouse.onCanvas,
    mouseOnGrid () {
      return {
        c: this.$store.state.map.grid.c,
        r: this.$store.state.map.grid.r
      }
    },
    mouseOnGridLocaleOnCanvas () {
      return {
        x: (this.mouseOnGrid.c - 1) * this.gridSize,
        y: (this.mouseOnGrid.r - 1) * this.gridSize
      }
    },
    mouseOnGridLocaleOnTable () {
      return {
        x: this.mouseOnGridLocaleOnCanvas.x + this.canvasSize.w / 2,
        y: this.mouseOnGridLocaleOnCanvas.y + this.canvasSize.h / 2
      }
    },
    wheel: state => state.private.map.wheel,
    borderWidth: state => state.public.map.margin.borderWidth,
    marginGridSize: state => state.public.map.margin.gridSize
  })
}
</script>
