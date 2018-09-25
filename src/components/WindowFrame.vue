
<template>
  <div class="window" :style="windowStyle">
    <div class="contents">
      <slot></slot>
    </div>
    <div class="title" :class="{fix : isFix}" @mousedown.left.prevent="move(true)" @mouseup.left.prevent="move(false)">{{title}}</div>
    <div class="corner-left-top" v-if="!isFix" @mousedown.left.prevent="resize('corner-left-top', true)" @mouseup.left.prevent="resize('corner-left-top', false)"></div>
    <div class="corner-left-bottom" v-if="!isFix" @mousedown.left.prevent="resize('corner-left-bottom', true)" @mouseup.left.prevent="resize('corner-left-bottom', false)"></div>
    <div class="corner-right-top" v-if="!isFix" @mousedown.left.prevent="resize('corner-right-top', true)" @mouseup.left.prevent="resize('corner-right-top', false)"></div>
    <div class="corner-right-bottom" v-if="!isFix" @mousedown.left.prevent="resize('corner-right-bottom', true)" @mouseup.left.prevent="resize('corner-right-bottom', false)"></div>
    <div class="side-top" v-if="!isFix" @mouseup.left.prevent="resize('side-top', false)" @mousedown.left.prevent="resize('side-top', true)"></div>
    <div class="side-left" v-if="!isFix" @mousedown.left.prevent="resize('side-left', true)" @mouseup.left.prevent="resize('side-left', false)"></div>
    <div class="side-right" v-if="!isFix" @mousedown.left.prevent="resize('side-right', true)" @mouseup.left.prevent="resize('side-right', false)"></div>
    <div class="side-bottom" v-if="!isFix" @mousedown.left.prevent="resize('side-bottom', true)" @mouseup.left.prevent="resize('side-bottom', false)"></div>
    <img class="close" src="../assets/window_close.png" @click.left.prevent="closeWindow">
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: {
    'title': { type: String, required: true },
    'displayProperty': { type: String, required: true },
    'align': { type: String, required: true },
    'baseSize': String,
    'fixSize': String
  },
  data () {
    return {
      windowBase: {
        isOpen: true,
        moveMode: '',
        mouse: {
          x: 0,
          y: 0,
          saveX: 0,
          saveY: 0
        },
        windowFactor: {
          l: 0, // left
          r: 0, // right
          t: 0, // top
          b: 0, // bottom
          w: 0, // width
          h: 0, // height
          draggingX: 0,
          draggingY: 0
        }
      }
    }
  },
  mounted: function () {
    const _this = this
    document.body.addEventListener('mousemove', function (e) {
      _this.windowBase.mouse.x = e.pageX
      _this.windowBase.mouse.y = e.pageY
      _this.reflesh(e.pageX, e.pageY)
    })
    document.body.addEventListener('mouseup', function (e) {
      _this.resize(null, false)
    })
  },
  methods: {
    ...mapMutations([
      'changeDisplay',
      'setProperty'
    ]),
    closeWindow: function () {
      console.log(`  [methods] closeWindow(click [x]button)`)
      this.changeDisplay(this.displayProperty)
    },
    resize: function (direct, flg) {
      if (flg) {
        this.windowBase.mouse.saveX = this.windowBase.mouse.x
        this.windowBase.mouse.saveY = this.windowBase.mouse.y
      } else {
        const moveMode = this.windowBase.moveMode
        const winFac = this.windowBase.windowFactor
        // console.log(this.windowBase.moveMode, winFac.x, winFac.y, winFac.w, winFac.h, winFac.draggingX, winFac.draggingY)
        if (moveMode.indexOf('right') >= 0) {
          winFac.r -= winFac.draggingX
          winFac.w += winFac.draggingX
        }
        if (moveMode.indexOf('left') >= 0) {
          winFac.l += winFac.draggingX
          winFac.w -= winFac.draggingX
        }
        if (moveMode.indexOf('top') >= 0) {
          winFac.t += winFac.draggingY
          winFac.h -= winFac.draggingY
        }
        if (moveMode.indexOf('bottom') >= 0) {
          winFac.b -= winFac.draggingY
          winFac.h += winFac.draggingY
        }
        winFac.draggingX = 0
        winFac.draggingY = 0
      }
      // console.log(this.windowBase.moveMode, this.windowBase.windowFactor.x, this.windowBase.windowFactor.y, this.windowBase.windowFactor.w, this.windowBase.windowFactor.h, this.windowBase.windowFactor.draggingX, this.windowBase.windowFactor.draggingY)
      this.windowBase.moveMode = (flg ? direct : '')
    },
    reflesh: function (x, y) {
      const moveX = x - this.windowBase.mouse.saveX
      const moveY = y - this.windowBase.mouse.saveY
      switch (this.windowBase.moveMode) {
        case 'side-top':
        case 'side-bottom':
        case 'corner-left-top':
        case 'corner-left-bottom':
        case 'corner-right-top':
        case 'corner-right-bottom':
        case 'move':
          this.windowBase.windowFactor.draggingY = moveY
      }
      switch (this.windowBase.moveMode) {
        case 'side-left':
        case 'side-right':
        case 'corner-left-top':
        case 'corner-left-bottom':
        case 'corner-right-top':
        case 'corner-right-bottom':
        case 'move':
          this.windowBase.windowFactor.draggingX = moveX
      }
      // console.log(this.windowBase.moveMode, this.windowBase.windowFactor.x, this.windowBase.windowFactor.y, this.windowBase.windowFactor.w, this.windowBase.windowFactor.h, this.windowBase.windowFactor.draggingX, this.windowBase.windowFactor.draggingY)
    },
    move: function (flg) {
      if (flg) {
        this.windowBase.mouse.saveX = this.windowBase.mouse.x
        this.windowBase.mouse.saveY = this.windowBase.mouse.y
      } else {
        this.windowBase.windowFactor.r -= this.windowBase.windowFactor.draggingX
        this.windowBase.windowFactor.t += this.windowBase.windowFactor.draggingY
        this.windowBase.windowFactor.l += this.windowBase.windowFactor.draggingX
        this.windowBase.windowFactor.b -= this.windowBase.windowFactor.draggingY
        this.windowBase.windowFactor.draggingX = 0
        this.windowBase.windowFactor.draggingY = 0
      }
      this.windowBase.moveMode = flg ? 'move' : ''
    }
  },
  watch: {
    isDisplay: function (newValue, oldValue) {
      if (newValue) {
        console.log(`    [watch] window open => ${this.displayProperty}`)
        this.windowBase.windowFactor.l = 0
        this.windowBase.windowFactor.r = 0
        this.windowBase.windowFactor.t = 0
        this.windowBase.windowFactor.b = 0
        this.windowBase.windowFactor.w = 0
        this.windowBase.windowFactor.h = 0
        this.$emit('open')
      } else {
        console.log(`    [watch] window close => ${this.displayProperty}`)
        this.$emit('close')
      }
    },
    isResetPosition: function (newValue, oldValue) {
      if (newValue) {
        console.log(`    [watch] window reset => ${this.displayProperty}`)
        this.windowBase.windowFactor.l = 0
        this.windowBase.windowFactor.r = 0
        this.windowBase.windowFactor.t = 0
        this.windowBase.windowFactor.b = 0
        this.windowBase.windowFactor.w = 0
        this.windowBase.windowFactor.h = 0
        this.setProperty({property: `display.${this.displayProperty}.doResetPosition`, value: false})
        this.$emit('reset')
      } else {
        console.log(`    [watch] window resetted => ${this.displayProperty}`)
      }
    }
  },
  computed: {
    ...mapGetters([
      'isWindowOpen',
      'doResetPosition'
    ]),
    isDisplay: function () {
      if (!this.displayProperty) return false
      return this.isWindowOpen(this.displayProperty)
    },
    isResetPosition: function () {
      if (!this.displayProperty) return false
      let isResetPosition = this.doResetPosition(this.displayProperty)
      // console.log(`isResetPosition ${isResetPosition} ${this.displayProperty}`)
      return isResetPosition
    },
    isFix: function () {
      if (this.fixSize) {
        return true
      } else {
        return false
      }
    },
    fixW: function () {
      if (!this.isFix) {
        return -1
      }
      let width = this.fixSize.split(',')[0].trim()
      return parseInt(width)
    },
    fixH: function () {
      if (!this.isFix) {
        return -1
      }
      let height = this.fixSize.split(',')[1].trim()
      return parseInt(height)
    },
    baseW: function () {
      if (!this.baseSize) {
        return 0
      }
      let width = this.baseSize.split(',')[0].trim()
      return parseInt(width)
    },
    baseH: function () {
      if (!this.baseSize) {
        return 0
      }
      let height = this.baseSize.split(',')[1].trim()
      return parseInt(height)
    },
    windowStyle: function () {
      const moveMode = this.windowBase.moveMode
      const winFac = this.windowBase.windowFactor

      let left = winFac.l
      let bottom = winFac.b
      let right = winFac.r
      let top = winFac.t
      let height = winFac.h
      let width = winFac.w

      if (moveMode.indexOf('top') >= 0 || moveMode === 'move') {
        top += winFac.draggingY
        if (moveMode.indexOf('top') >= 0) {
          height -= winFac.draggingY
        }
      }

      if (moveMode.indexOf('bottom') >= 0 || moveMode === 'move') {
        bottom -= winFac.draggingY
        if (moveMode.indexOf('bottom') >= 0) {
          height += winFac.draggingY
        }
      }

      if (moveMode.indexOf('right') >= 0 || moveMode === 'move') {
        right -= winFac.draggingX
        if (moveMode.indexOf('right') >= 0) {
          width += winFac.draggingX
        }
      }

      if (moveMode.indexOf('left') >= 0 || moveMode === 'move') {
        left += winFac.draggingX
        if (moveMode.indexOf('left') >= 0) {
          width -= winFac.draggingX
        }
      }

      const obj = {
        display: this.isDisplay ? 'block' : 'none'
      }
      if (this.align.indexOf('left') >= 0) {
        obj.left = left + 'px'
      }
      if (this.align.indexOf('right') >= 0) {
        obj.right = right + 'px'
      }
      if (this.align.indexOf('top') >= 0) {
        obj.top = top + 'px'
      }
      if (this.align.indexOf('bottom') >= 0) {
        obj.bottom = bottom + 'px'
      }
      if (this.align.indexOf('left') < 0 &&
          this.align.indexOf('right') < 0 &&
          this.align.indexOf('top') < 0 &&
          this.align.indexOf('bottom') < 0) {
        if (this.isFix) {
          // obj.left = `calc((100% - ${this.fixW}px) / 2 + ${left}px)`
          obj.left = `calc(50% - ${this.fixW / 2 - left}px)`
          obj.top = `calc(50% - ${this.fixH / 2 - top}px)`
        } else {
          if (this.baseW > 0) {
            obj.left = `calc(50% - ${this.baseW / 2 - left}px)`
          } else {
            obj.left = `calc(${-this.baseW / 2 + left}px)`
          }
          if (this.baseH > 0) {
            obj.top = `calc(50% - ${this.baseH / 2 + top}px)`
          } else {
            obj.top = `calc(${-this.baseH / 2 + top}px)`
          }
        }
      }
      if (this.isFix) {
        obj.width = this.fixW + 'px'
        obj.height = this.fixH + 'px'
      } else {
        if (this.baseW > 0) {
          obj.width = `${this.baseW + width}px`
        } else {
          obj.width = `calc(100% - ${-this.baseW - width + 10}px)`
        }
        if (this.baseH > 0) {
          obj.height = `${this.baseH + height}px`
        } else {
          obj.height = `calc(100% - ${-this.baseH - height - 10}px)`
        }
      }
      return obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.window {
  position: fixed;
  z-index: 90;
  padding: 22px 8px 8px 8px;
  overflow: visible;
  min-height: 50px;
  border-radius: 8px 8px 0 0;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 5px 5px 5px rgba(0,0,0,0.6);
  border: solid gray 1px;
  box-sizing: border-box;
}
.window img,
.window button {
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.window:focus,
.window:active {
  z-index: 91;
}

.contents {
  overflow: hidden;
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
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.title.fix {
  background: linear-gradient(rgba(170, 233, 203, 1), rgba(142, 226, 186, 1));
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
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
