<template>
  <div class="mapMask"
    :class="[storeObj.isLock ? 'isLock' : 'isUnLock']"
    :style="mapMaskStyle"
    :draggable="!storeObj.isLock"
    @dragstart="dragStartMapMask"
    @drag="dragging"
    @click.right.prevent="(e) => openContext(e, 'mapMask')"
    @mousedown.left="leftDown" @mouseup.left="leftUp"
    @mousedown.right="rightDown" @mouseup.right="rightUp"
    @contextmenu.prevent
  >{{storeObj.name}}<br>({{storeObj.key}})</div>
</template>

<script>
// !mapMask.isLock
import { mapMutations, mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'

export default {
  name: 'mapMask',
  mixins: [PieceMixin],
  data () {
    return {}
  },
  props: {},
  methods: {
    ...mapMutations([
      'setDraggingMapMask',
      'changeDisplay',
      'changeDisplayValue'
    ]),
    dragging: function (event) {
      console.log('  [methods] dragging mapMask')
      this.$emit('dragging', event)
    },
    dragStartMapMask: function (event) {
      console.log(`  [methods] move start => mapMask(${this.objKey})`)
      event.dataTransfer.setData('kind', 'mapMask-move')
      let offsetX = event.offsetX
      let offsetY = event.offsetY
      event.dataTransfer.setData('offsetX', offsetX)
      event.dataTransfer.setData('offsetY', offsetY)
      this.setDraggingMapMask(this.objKey) // TODO
    },
    openContext: function (event, kind) {
      let pageX = event.pageX
      let pageY = event.pageY

      if (kind === 'mapMask') {
        this.changeDisplayValue({ main: 'mapMaskContext', sub: 'key', value: this.objKey })
        this.changeDisplayValue({ main: 'mapMaskContext', sub: 'x', value: pageX })
        this.changeDisplayValue({ main: 'mapMaskContext', sub: 'y', value: pageY })
        this.changeDisplay('mapMaskContext')
        console.log(`  [methods] open context => mapMask(${this.objKey})`)
      }
    }
  },
  computed: {
    ...mapGetters([]),
    mapMaskStyle: function () {
      const storeObj = this.storeObj
      const rectObj = this.rect
      let obj = {
        top: `${rectObj.top}px`,
        left: `${rectObj.left}px`,
        width: `${rectObj.width}px`,
        height: `${rectObj.height}px`,
        'background-color': storeObj.color,
        color: storeObj.fontColor
      }
      console.log(` [computed] mapMask(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
      return obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mapMask {
  position: fixed;
  cursor: default;
  /*
 box-sizing: border-box;
   */
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 0px;
  border-color: rgba(0, 0, 0, 0);
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-size: 12px;
  cursor: crosshair;
}
.mapMask:hover {
  border-width: 2px;
  z-index: 1000;
  transform: translate(-2px, -2px);
}
.mapMask.isLock:hover { border-color: blue; }
.mapMask.isUnLock:hover { border-color: yellow; }
/*
*/
</style>
