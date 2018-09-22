
<template>
  <div class="context" :style="contextStyle" @mouseleave.prevent="close">
    <div class="item" @click.left.prevent="viewEditMapMask">変更</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="!isLock">固定</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="isLock">固定を解除</div>
    <div class="item" @click.left.prevent="deleteMapMask">削除</div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: ['displayProperty'],
  data () {
    return {
      x: 0,
      y: 0
    }
  },
  methods: {
    ...mapMutations([
      'changeDisplay',
      'windowOpen',
      'changeDisplayValue',
      'changeMapMaskInfo'
    ]),
    close: function () {
      console.log('$$ close', this.displayProperty)
      this.changeDisplayValue({ main: this.displayProperty, sub: 'isDisplay', value: false })
    },
    viewEditMapMask: function () {
      console.log('$$ viewEditMapMask', this.value.index)
      this.changeDisplayValue({ main: 'editMapMaskWindow', sub: 'index', value: this.value.index })
      this.windowOpen('editMapMaskWindow')
      this.close()
    },
    changeMapMaskLock: function () {
      console.log('$$ changeMapMaskLock')
      this.changeMapMaskInfo({
        index: this.index,
        isLock: !this.isLock
      })
      this.close()
    },
    deleteMapMask: function () {
      console.log('$$ deleteMapMask')
      this.close()
    }
  },
  computed: {
    ...mapGetters([
      'isWindowOpen'
    ]),
    isDisplay: function () {
      if (!this.displayProperty) return false
      return this.isWindowOpen(this.displayProperty)
    },
    value: function () {
      const propValue = this.$store.state.display[this.displayProperty]
      return propValue
    },
    index: function () {
      return this.value.index
    },
    isLock: function () {
      if (!this.isDisplay) {
        return false
      }
      console.log(this.$store.state.map.mapMasks.length, this.index, this.$store.state.map.mapMasks[this.index])
      return this.$store.state.map.mapMasks[this.index].isLock
    },
    dispX: function () {
      if (!this.isDisplay) { return -1 }
      let mouseX = this.value.x
      return mouseX - 1
    },
    dispY: function () {
      if (!this.isDisplay) { return -1 }
      let mouseY = this.value.y
      return mouseY - 1
    },
    contextStyle: function () {
      const obj = {
        display: this.isDisplay ? 'block' : 'none',
        top: this.dispY + 'px',
        left: this.dispX + 'px'
      }
      return obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.context {
  position: fixed;
  z-index: 90;
  padding: 0;
  min-width: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border: solid black 1px;
  box-sizing: border-box;
}

.contents {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-box;
  display: -ms-flexbox;
  flex-direction: column;
}

.title {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(100% - 4px);
  border-bottom: solid rgba(0, 0, 0, 0.2) 1px;
  cursor: move;
  font-size: 10px;
  font-weight: bold;
}

.side-left,
.side-right,
.side-top,
.side-bottom,
.corner-left-top,
.corner-left-bottom,
.corner-right-top,
.corner-right-bottom {
  position: absolute;
  z-index: 90;
}

.side-left,
.side-right {
  top: 8px;
  width: 10px;
  height: calc(100% - 12px);
}

.side-top,
.side-bottom {
  left: 8px;
  height: 10px;
  width: calc(100% - 12px);
}

.corner-left-top,
.corner-left-bottom,
.corner-right-top,
.corner-right-bottom {
  width: 10px;
  height: 10px;
}

.side-left, .corner-left-top, .corner-left-bottom { left: -4px; }
.side-right, .corner-right-top, .corner-right-bottom { right: -4px; }
.side-top, .corner-left-top, .corner-right-top { top: -4px; }
.side-bottom, .corner-left-bottom, .corner-right-bottom { bottom: -4px; }

.side-left { cursor: w-resize; }
.side-right { cursor: e-resize; }
.side-top { cursor: n-resize; }
.side-bottom { cursor: s-resize; }
.corner-left-top { cursor: nw-resize; }
.corner-left-bottom { cursor: sw-resize; }
.corner-right-top { cursor: ne-resize; border-radius: 0 8px 0 0; }
.corner-right-bottom { cursor: se-resize; }

.close {
  position: absolute;
  width: 13px;
  height: 13px;
  top: 2px;
  right: 8px;
  cursor: pointer;
}
</style>
