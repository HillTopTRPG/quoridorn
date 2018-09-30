<script>
import { mapMutations, mapGetters } from 'vuex'
import AddressCalcMixin from './AddressCalcMixin'

export default {
  mixins: [AddressCalcMixin],
  props: {
    'type': { type: String, required: true },
    'objKey': { type: String, required: true }
  },
  data () {
    return {
      isHover: false
    }
  },
  mounted: function () {},
  methods: {
    ...mapMutations([
      'windowOpen',
      'setProperty'
    ]),
    leftDown: function () {
      if (this.storeObj.isLock || this.isRolling) {
        this.$emit('leftDown')
        return
      }
      console.log(`  [methods] mousedown left on ${this.type}`)
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.from.x`, value: this.mouseOnTable.x})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.from.y`, value: this.mouseOnTable.y})
      const offset = {
        w: this.mouseOnTable.x - this.rect.left,
        h: this.mouseOnTable.y - this.rect.top
      }
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.gridOffset.x`, value: Math.floor(offset.w / this.gridSize)})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.gridOffset.y`, value: Math.floor(offset.h / this.gridSize)})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.isDraggingLeft`, value: true})
    },
    leftUp: function () {
      if (this.storeObj.isLock || this.isRolling) {
        this.$emit('leftUp')
        return
      }
      console.log(`  [methods] mouseup left on ${this.type}`)
      const locate = {
        x: this.mouseOnTable.x - this.storeObj.move.gridOffset.x * this.gridSize,
        y: this.mouseOnTable.y - this.storeObj.move.gridOffset.y * this.gridSize
      }
      if (this.isFitGrid) {
        locate.x = (Math.ceil(locate.x / this.gridSize) - 1) * this.gridSize
        locate.y = (Math.ceil(locate.y / this.gridSize) - 1) * this.gridSize
      }
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.left`, value: locate.x})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.top`, value: locate.y})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.dragging.x`, value: 0})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.dragging.y`, value: 0})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.gridOffset.x`, value: 0})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.gridOffset.y`, value: 0})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.isDraggingLeft`, value: false})
    },
    rightDown: function () { if (this.storeObj.isLock || this.isRolling) { this.$emit('rightDown') } },
    rightUp: function (event) {
      this.setProperty({property: `map.isOverEvent`, value: true})
      this.$emit('rightUp', event)
    },
    openContext: function (event, contextProperty) {
      let pageX = event.pageX
      let pageY = event.pageY

      this.setProperty({property: `display.${contextProperty}.key`, value: this.objKey})
      this.setProperty({property: `display.${contextProperty}.x`, value: pageX})
      this.setProperty({property: `display.${contextProperty}.y`, value: pageY})
      this.windowOpen(contextProperty)
      console.log(`  [methods] open context => ${contextProperty}(${this.objKey})`)
    },
    mouseover: function () {
      this.isHover = true
    },
    mouseout: function () {
      this.isHover = false
    },
    arrangeAngle: function (angle) {
      if (angle > 180) { angle -= 360 }
      if (angle < -180) { angle += 360 }
      return angle
    },
    getAngle: function (mouseOnTable) {
      const rect = this.rect
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
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
    rollStart: function (event) {
      this.setProperty({property: `map.rollObj.isRolling`, value: true})
      console.log(`  [methods] rolling start on ${this.type}(${this.objKey})`)
      const angle = this.getAngle(this.mouseOnTable)
      const planeAngle = this.arrangeAngle(angle - this.angle.total)
      // console.log(`angle:${angle}, total:${this.angle.total}, dragStartB:${this.angle.dragStart}, dragStartA:${planeAngle}`)
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.angle.dragStart`, value: planeAngle})
      this.setProperty({property: `map.rollObj.propName`, value: this.type})
      this.setProperty({property: `map.rollObj.key`, value: this.objKey})
    },
    rollEnd: function (event) {
      console.log(`rollEnd`, event.pageX, event.pageY)
      if (event.button === 2) {
        this.setProperty({property: `map.isOverEvent`, value: true})
      }
      this.setProperty({property: `map.rollObj.isRolling`, value: false})
      const planeAngle = this.arrangeAngle(this.angle.dragging + this.angle.total)
      const total = this.arrangeAngle(Math.round(planeAngle / 30) * 30)
      // console.log(`angle:${angle}, planeAngle:${planeAngle}, totalB:${this.angle.total}, totalA:${total}`)
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.angle.total`, value: total})
      this.setProperty({property: `map.${this.type}.${this.storeIndex}.angle.dragging`, value: 0})
    }
  },
  watch: {
    mouseOnTable: {
      handler: function (mouseOnTable) {
        // console.log(`piece:${this.storeObj.name}, isDraggingLeft:${this.storeObj.isDraggingLeft}, isRolling:${this.isRolling}`)
        if (this.isRolling) {
          if (!this.isThisRolling) {
            return
          }
          const angle = this.getAngle(mouseOnTable)
          const dragging = this.arrangeAngle(this.arrangeAngle(angle - this.angle.dragStart) - this.angle.total)
          this.setProperty({property: `map.${this.type}.${this.storeIndex}.angle.dragging`, value: dragging, logOff: true})
        } else {
          if (this.storeObj.isDraggingLeft) {
            this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.dragging.x`, value: mouseOnTable.x - this.storeObj.move.from.x, logOff: true})
            this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.dragging.y`, value: mouseOnTable.y - this.storeObj.move.from.y, logOff: true})
          }
        }
      },
      deep: true
    },
    marginGridNum: function () {
      return this.$store.state.map.marginGridNum
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    }
  },
  computed: {
    ...mapGetters([
      'doResetPosition',
      'isFitGrid',
      'getPieceObj'
    ]),
    storeObj: function () {
      return this.getPieceObj(this.type, this.objKey)
    },
    storeIndex: function () {
      return this.$store.state.map[this.type].indexOf(this.storeObj)
    },
    rollObj: function () {
      return this.$store.state.map.rollObj
    },
    angle: function () { return this.storeObj.angle },
    rect: function () {
      const rectObj = {
        top: this.storeObj.top + this.storeObj.move.dragging.y,
        left: this.storeObj.left + this.storeObj.move.dragging.x,
        width: this.storeObj.columns * this.gridSize,
        height: this.storeObj.rows * this.gridSize
      }
      return rectObj
    },
    isRolling: function () {
      return this.$store.state.map.rollObj.isRolling
    },
    isThisRolling: function () {
      return this.$store.state.map.rollObj.isRolling && this.rollObj.propName === this.type && this.rollObj.key === this.objKey
    },
    isFix: function () {
      return this.storeObj.isFix
    },
    currentAngle: function () { return this.arrangeAngle(this.angle.total + this.angle.dragging) },
    style: function () {
      const rectObj = this.rect
      let rotateZ = this.arrangeAngle(Math.round(this.currentAngle / 30) * 30)
      let obj = {
        top: `${rectObj.top}px`,
        left: `${rectObj.left}px`,
        width: `${rectObj.width}px`,
        height: `${rectObj.height}px`,
        transform: 'rotateZ(' + rotateZ + 'deg)'

      }
      // console.log(` [computed] mapMask(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height})`)
      return obj
    }
  }
}
</script>
