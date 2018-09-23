<template>
  <div class="mapMask"
    :class="[mapMask.isLock ? 'isLock' : 'isUnLock']"
    :style="mapMask.style"
    :draggable="!mapMask.isLock"
    @dragstart="(e) => dragStartMapMask(e, index)"
    @drag="dragging"
    @click.right.prevent="(e) => openContext(e, 'mapMask', index)"
    @mousedown.left="leftDown" @mouseup.left="leftUp"
    @mousedown.right="rightDown" @mouseup.right="rightUp"
    @contextmenu.prevent
  >{{mapMask.name}}</div>
</template>

<script>
// !mapMask.isLock
import { mapMutations } from 'vuex'

export default {
  name: 'mapMask',
  props: {
    mapMask: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapMutations([
      'setDraggingMapMask',
      'changeDisplay',
      'changeDisplayValue'
    ]),
    dragging: function (event) {
      console.log('!!!!dragging!!!')
      this.$emit('dragging', event)
      // setTimeout(function () { this.$emit('dragging', event) }.bind(this), 0)
    },
    dragStartMapMask: function (event, index) {
      console.log(`マップマスク(${index}) - 移動開始`)
      event.dataTransfer.setData('kind', 'mapMask-move')
      let offsetX = event.offsetX
      let offsetY = event.offsetY
      event.dataTransfer.setData('offsetX', offsetX)
      event.dataTransfer.setData('offsetY', offsetY)
      this.setDraggingMapMask(index)
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
    leftDown: function () {
      if (this.mapMask.isLock) {
        this.$emit('leftDown')
      }
    },
    leftUp: function () {
      if (this.mapMask.isLock) {
        this.$emit('leftUp')
      }
    },
    rightDown: function () {
      if (this.mapMask.isLock) {
        this.$emit('rightDown')
      }
    },
    rightUp: function () {
      if (this.mapMask.isLock) {
        this.$emit('rightUp')
      }
    }
  },
  computed: {
    mapMasks: function () {
      return this.$store.getters.mapMaskList
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
