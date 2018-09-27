<script>
import { mapMutations, mapGetters } from 'vuex'
import AddressCalcMixin from './AddressCalcMixin'

export default {
  mixins: [AddressCalcMixin],
  props: {
    'type': { type: String, required: true },
    'objKey': { type: Number, required: true }
  },
  data () { return {} },
  mounted: function () {},
  methods: {
    ...mapMutations([
      'windowOpen',
      'setProperty'
    ]),
    leftDown: function () {
      if (this.storeObj.isLock) {
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
      if (this.storeObj.isLock) {
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
    rightDown: function () { if (this.storeObj.isLock) { this.$emit('rightDown') } },
    rightUp: function () { if (this.storeObj.isLock) { this.$emit('rightUp') } },
    openContext: function (event, contextProperty) {
      let pageX = event.pageX
      let pageY = event.pageY

      this.setProperty({property: `display.${contextProperty}.key`, value: this.objKey})
      this.setProperty({property: `display.${contextProperty}.x`, value: pageX})
      this.setProperty({property: `display.${contextProperty}.y`, value: pageY})
      this.windowOpen(contextProperty)
      console.log(`  [methods] open context => ${contextProperty}(${this.objKey})`)
    }
  },
  watch: {
    mouseOnTable: {
      handler: function (mouseOnTable) {
        if (this.storeObj.isDraggingLeft) {
          this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.dragging.x`, value: mouseOnTable.x - this.storeObj.move.from.x, logOff: true})
          this.setProperty({property: `map.${this.type}.${this.storeIndex}.move.dragging.y`, value: mouseOnTable.y - this.storeObj.move.from.y, logOff: true})
        }

        if (this.storeObj.isDraggingRight) {
          const angle = this.calcCoordinate(mouseOnTable.x, mouseOnTable.y).angle
          let angleDiff = this.arrangeAngle(angle - this.angle.dragStart)
          this.setProperty({property: `map.${this.type}.${this.storeIndex}.angle.dragging`, value: angleDiff})
        }
      },
      deep: true
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
    rect: function () {
      const rectObj = {
        top: this.storeObj.top + this.storeObj.move.dragging.y,
        left: this.storeObj.left + this.storeObj.move.dragging.x,
        width: this.storeObj.columns * this.gridSize,
        height: this.storeObj.rows * this.gridSize
      }
      return rectObj
    },
    isFix: function () {
      return this.storeObj.isFix
    },
    style: function () {
      const rectObj = this.rect
      let obj = {
        top: `${rectObj.top}px`,
        left: `${rectObj.left}px`,
        width: `${rectObj.width}px`,
        height: `${rectObj.height}px`
      }
      // console.log(` [computed] mapMask(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height})`)
      return obj
    }
  }
}
</script>
