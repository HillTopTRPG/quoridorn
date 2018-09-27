
<template>
  <div class="window" :style="windowStyle" v-if="isDisplay" @mousedown.stop @mouseup.stop @mousedown="windowActive(displayProperty)">
    <div class="_contents" @wheel.stop>
      <slot></slot>
    </div>
    <div class="title" :class="{fix : isFix}" @mousedown.left.prevent="move(true)" @mouseup.left.prevent="move(false)">{{titleText}}</div>
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
    'titleText': { type: String, required: true },
    'displayProperty': { type: String, required: true },
    'align': { type: String, required: true },
    'baseSize': String,
    'fixSize': String
  },
  data () {
    return {
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
  },
  mounted: function () {
    document.body.addEventListener('mousemove', function (e) {
      this.mouse.x = e.pageX
      this.mouse.y = e.pageY
      this.reflesh(e.pageX, e.pageY)
    }.bind(this))
    document.body.addEventListener('mouseup', function (e) {
      this.resize(null, false)
    }.bind(this))
    this.addEventForIFrame()
  },
  methods: {
    ...mapMutations([
      'windowClose',
      'setProperty',
      'windowActive'
    ]),
    closeWindow: function () {
      console.log(`  [methods] closeWindow(click [x]button)`)
      this.windowClose(this.displayProperty)
    },
    resize: function (direct, flg) {
      if (flg) {
        this.mouse.saveX = this.mouse.x
        this.mouse.saveY = this.mouse.y
      } else {
        const moveMode = this.moveMode
        const winFac = this.windowFactor
        // console.log(this.moveMode, winFac.x, winFac.y, winFac.w, winFac.h, winFac.draggingX, winFac.draggingY)
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
      // console.log(this.moveMode, this.windowFactor.x, this.windowFactor.y, this.windowFactor.w, this.windowFactor.h, this.windowFactor.draggingX, this.windowFactor.draggingY)
      this.moveMode = (flg ? direct : '')
    },
    reflesh: function (x, y) {
      const moveX = x - this.mouse.saveX
      const moveY = y - this.mouse.saveY
      switch (this.moveMode) {
        case 'side-top':
        case 'side-bottom':
        case 'corner-left-top':
        case 'corner-left-bottom':
        case 'corner-right-top':
        case 'corner-right-bottom':
        case 'move':
          this.windowFactor.draggingY = moveY
      }
      switch (this.moveMode) {
        case 'side-left':
        case 'side-right':
        case 'corner-left-top':
        case 'corner-left-bottom':
        case 'corner-right-top':
        case 'corner-right-bottom':
        case 'move':
          this.windowFactor.draggingX = moveX
      }
      // console.log(this.moveMode, this.windowFactor.x, this.windowFactor.y, this.windowFactor.w, this.windowFactor.h, this.windowFactor.draggingX, this.windowFactor.draggingY)
    },
    move: function (flg) {
      if (flg) {
        this.mouse.saveX = this.mouse.x
        this.mouse.saveY = this.mouse.y
      } else {
        this.windowFactor.r -= this.windowFactor.draggingX
        this.windowFactor.t += this.windowFactor.draggingY
        this.windowFactor.l += this.windowFactor.draggingX
        this.windowFactor.b -= this.windowFactor.draggingY
        this.windowFactor.draggingX = 0
        this.windowFactor.draggingY = 0
      }
      this.moveMode = flg ? 'move' : ''
    },
    addEventForIFrame: function () {
      const elms = document.getElementsByTagName('iframe')
      for (let i = 0; i < elms.length; i++) {
        const iframeElm = elms[i]
        if (!iframeElm.onload) {
          iframeElm.onload = function () {
            const bodyElm = elms[i].contentDocument.body
            if (!bodyElm.onmousemove) {
              bodyElm.onmousemove = function (event) {
                const iframeRect = iframeElm.getBoundingClientRect()
                const address = {
                  clientX: event.pageX + iframeRect.left,
                  clientY: event.pageY + iframeRect.top
                }
                let evt = new MouseEvent('mousemove', address)
                document.body.dispatchEvent(evt)
              }
            }
            if (!bodyElm.onclick) {
              bodyElm.onclick = function (event) {
                let evt = document.createEvent('HTMLEvents')
                evt.initEvent('mousedown', true, true) // event type, bubbling, cancelable
                iframeElm.dispatchEvent(evt)
              }
            }
          }
        }
        if (!iframeElm.onmousemove) {
          iframeElm.onmousemove = function (event) {
            const iframeRect = iframeElm.getBoundingClientRect()
            const address = {
              clientX: event.pageX + iframeRect.left,
              clientY: event.pageY + iframeRect.top
            }
            let evt = new MouseEvent('mousemove', address)
            document.body.dispatchEvent(evt)
          }
        }
      }
    }
  },
  watch: {
    isDisplay: function (newValue, oldValue) {
      if (newValue) {
        console.log(`    [watch] window open => ${this.displayProperty}`)
        this.windowFactor.l = 0
        this.windowFactor.r = 0
        this.windowFactor.t = 0
        this.windowFactor.b = 0
        this.windowFactor.w = 0
        this.windowFactor.h = 0
        this.$emit('open')

        setTimeout(this.addEventForIFrame, 0)
      } else {
        console.log(`    [watch] window close => ${this.displayProperty}`)
        this.$emit('close')
      }
    },
    isResetPosition: function (newValue, oldValue) {
      if (newValue) {
        console.log(`    [watch] window reset => ${this.displayProperty}`)
        this.windowFactor.l = 0
        this.windowFactor.r = 0
        this.windowFactor.t = 0
        this.windowFactor.b = 0
        this.windowFactor.w = 0
        this.windowFactor.h = 0
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
    zIndex: function () {
      return this.$store.state.display[this.displayProperty].zIndex
    },
    isFix: function () {
      if (this.fixSize) { return true }
      return false
    },
    fixW: function () {
      if (!this.isFix) { return -1 }
      let width = this.fixSize.split(',')[0].trim()
      return parseInt(width)
    },
    fixH: function () {
      if (!this.isFix) { return -1 }
      let height = this.fixSize.split(',')[1].trim()
      return parseInt(height)
    },
    base: function () {
      if (!this.baseSize) { return 0 }
      return {
        w: parseInt(this.baseSize.split(',')[0].trim()),
        h: parseInt(this.baseSize.split(',')[1].trim())
      }
    },
    min: function () {
      if (!this.minSize) { return 0 }
      return {
        w: parseInt(this.minSize.split(',')[0].trim()),
        h: parseInt(this.minSize.split(',')[1].trim())
      }
    },
    windowStyle: function () {
      const moveMode = this.moveMode
      const winFac = this.windowFactor

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
        left: this.align.indexOf('left') >= 0 ? left + 'px' : undefined,
        right: this.align.indexOf('right') >= 0 ? right + 'px' : undefined,
        top: this.align.indexOf('top') >= 0 ? top + 37 + 'px' : undefined,
        bottom: this.align.indexOf('bottom') >= 0 ? bottom + 'px' : undefined,
        'z-index': this.zIndex + 10000
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
          obj.left = this.base.w > 0 ? `calc(50% - ${this.base.w / 2 - left}px)` : `calc(${-this.base.w / 2 + left}px)`
          obj.top = this.base.h > 0 ? `calc(50% - ${this.base.h / 2 - top}px)` : `calc(${-this.base.h / 2 + top}px)`
        }
      }
      if (this.isFix) {
        obj.width = this.fixW + 'px'
        obj.height = this.fixH + 'px'
      } else {
        obj.width = this.base.w > 0 ? `${this.base.w + width}px` : `calc(100% - ${-this.base.w - width + 10}px)`
        obj.height = this.base.h > 0 ? `${this.base.h + height}px` : `calc(100% - ${-this.base.h - height - 10}px)`
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
  display: inline-block;
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

._contents {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: inline-block;
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
/*
input, button, textarea, select {
  background-color: rgba(50, 50, 50, .2)
}
*/
</style>
