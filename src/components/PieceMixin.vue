<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: {
    'type': { type: String, required: true },
    'objKey': { type: Number, required: true }
  },
  data () {
    return {}
  },
  mounted: function () {},
  methods: {
    ...mapMutations([]),
    moveStart: function () {
    },
    moveEnd: function () {
    },
    leftDown: function () { if (this.storeObj.isLock) { this.$emit('leftDown') } },
    leftUp: function () { if (this.storeObj.isLock) { this.$emit('leftUp') } },
    rightDown: function () { if (this.storeObj.isLock) { this.$emit('rightDown') } },
    rightUp: function () { if (this.storeObj.isLock) { this.$emit('rightUp') } }
  },
  watch: {},
  computed: {
    ...mapGetters([
      'doResetPosition',
      'isFitGrid',
      'getPieceObj'
    ]),
    storeObj: function () {
      const type = this.type
      const key = this.objKey
      return this.getPieceObj(type, key)
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    },
    marginGridNum: function () {
      return this.$store.state.map.marginGridNum
    },
    rect: function () {
      const rectObj = {}

      const storeObj = this.storeObj
      const gridSize = this.gridSize

      if (this.isFitGrid) {
        rectObj.top = (storeObj.gridR - 1 + this.marginGridNum / 2) * gridSize
        rectObj.left = (storeObj.gridC - 1 + this.marginGridNum / 2) * gridSize
      } else {
        rectObj.top = storeObj.top
        rectObj.left = storeObj.left
      }
      rectObj.width = storeObj.gridW * gridSize
      rectObj.height = storeObj.gridH * gridSize

      return rectObj
    },
    isFix: function () {
      return this.storeObj.isFix
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
