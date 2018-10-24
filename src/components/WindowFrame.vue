
<template>
  <div class="window" :style="windowStyle" v-if="isDisplay" @mousedown="windowActive(displayProperty)" @touchstart="windowActive(displayProperty)" @mouseup="mouseup" @touchend="mouseup" @touchcancel="mouseup">
    <div class="_contents" @wheel.stop @contextmenu.prevent>
      <slot></slot>
    </div>
    <div class="title" :class="{fix : isFix}"
      @mousedown.left.prevent="(e) => move(e, true)" @mouseup.left.prevent="(e) => move(e, false)"
      @touchstart.prevent="(e) => move(e, true, true)" @touchend.prevent="(e) => move(e, false, true)" @touchcancel.prevent="(e) => move(e, false, true)"><span>{{titleText}}</span></div>
    <div class="corner-left-top" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'corner-left-top', true)" @mouseup.left.prevent="(e) => resize(e, 'corner-left-top', false)"
      @touchstart.prevent="(e) => resize(e, 'corner-left-top', true, true)" @touchend.prevent="(e) => resize(e, 'corner-left-top', false, true)" @touchcancel.prevent="(e) => resize(e, 'corner-left-top', false, true)"></div>
    <div class="corner-left-bottom" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'corner-left-bottom', true)" @mouseup.left.prevent="(e) => resize(e, 'corner-left-bottom', false)"
      @touchstart.prevent="(e) => resize(e, 'corner-left-bottom', true, true)" @touchend.prevent="(e) => resize(e, 'corner-left-bottom', false, true)" @touchcancel.prevent="(e) => resize(e, 'corner-left-bottom', false, true)"></div>
    <div class="corner-right-top" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'corner-right-top', true)" @mouseup.left.prevent="(e) => resize(e, 'corner-right-top', false)"
      @touchstart.prevent="(e) => resize(e, 'corner-right-top', true, true)" @touchend.prevent="(e) => resize(e, 'corner-right-top', false, true)" @touchcancel.prevent="(e) => resize(e, 'corner-right-top', false, true)"></div>
    <div class="corner-right-bottom" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'corner-right-bottom', true)" @mouseup.left.prevent="(e) => resize(e, 'corner-right-bottom', false)"
      @touchstart.prevent="(e) => resize(e, 'corner-right-bottom', true, true)" @touchend.prevent="(e) => resize(e, 'corner-right-bottom', false, true)" @touchcancel.prevent="(e) => resize(e, 'corner-right-bottom', false, true)"></div>
    <div class="side-top" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'side-top', true)" @mouseup.left.prevent="(e) => resize(e, 'side-top', false)"
      @touchstart.prevent="(e) => resize(e, 'side-top', true, true)" @touchend.prevent="(e) => resize(e, 'side-top', false, true)" @touchcancel.prevent="(e) => resize(e, 'side-top', false, true)"></div>
    <div class="side-left" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'side-left', true)" @mouseup.left.prevent="(e) => resize(e, 'side-left', false)"
      @touchstart.prevent="(e) => resize(e, 'side-left', true, true)" @touchend.prevent="(e) => resize(e, 'side-left', false, true)" @touchcancel.prevent="(e) => resize(e, 'side-left', false, true)"></div>
    <div class="side-right" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'side-right', true)" @mouseup.left.prevent="(e) => resize(e, 'side-right', false)"
      @touchstart.prevent="(e) => resize(e, 'side-right', true, true)" @touchend.prevent="(e) => resize(e, 'side-right', false, true)" @touchcancel.prevent="(e) => resize(e, 'side-right', false, true)"></div>
    <div class="side-bottom" v-if="!isFix"
      @mousedown.left.prevent="(e) => resize(e, 'side-bottom', true)" @mouseup.left.prevent="(e) => resize(e, 'side-bottom', false)"
      @touchstart.prevent="(e) => resize(e, 'side-bottom', true, true)" @touchend.prevent="(e) => resize(e, 'side-bottom', false, true)" @touchcancel.prevent="(e) => resize(e, 'side-bottom', false, true)"></div>
    <img class="close" v-if="!isBanClose" v-img="require('../assets/window_close.png')" @click.left.prevent="closeWindow"/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    'titleText': { type: String, required: true },
    'displayProperty': { type: String, required: true },
    'align': { type: String, required: true },
    'baseSize': String,
    'fixSize': String,
    'isBanClose': Boolean
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
  mounted () {
    document.addEventListener('mousemove', function (event) {
      this.mouse.x = event.pageX
      this.mouse.y = event.pageY
      this.reflesh()
    }.bind(this))
    document.addEventListener('touchmove', function (event) {
      this.mouse.x = event.changedTouches[0].pageX
      this.mouse.y = event.changedTouches[0].pageY
      this.reflesh()
    }.bind(this))
    this.addEventForIFrame()
  },
  methods: {
    ...mapActions([
      'windowClose',
      'setProperty',
      'windowActive'
    ]),
    closeWindow () {
      console.log(`  [methods] closeWindow(click [x]button)`)
      this.windowClose(this.displayProperty)
    },
    mouseup (event) {
      const evtObj = { clientX: event.pageX, clientY: event.pageY, button: event.button }
      if (event.button === 2) {
        this.setProperty({property: `map.isOverEvent`, value: true})
      }
      document.getElementById('mapBoardFrame').dispatchEvent(new MouseEvent('mouseup', evtObj))
    },
    resize (event, direct, flg, isTouch) {
      if (flg) {
        this.mouse.saveX = isTouch ? event.changedTouches[0].pageX : event.pageX
        this.mouse.saveY = isTouch ? event.changedTouches[0].pageY : event.pageY
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
        this.mouseup(event)
      }
      // console.log(this.moveMode, this.windowFactor.x, this.windowFactor.y, this.windowFactor.w, this.windowFactor.h, this.windowFactor.draggingX, this.windowFactor.draggingY)
      this.moveMode = (flg ? direct : '')
    },
    reflesh () {
      const x = this.mouse.x
      const y = this.mouse.y
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
    move (event, flg, isTouch) {
      if (flg) {
        this.mouse.saveX = isTouch ? event.changedTouches[0].pageX : event.pageX
        this.mouse.saveY = isTouch ? event.changedTouches[0].pageY : event.pageY
      } else {
        this.windowFactor.r -= this.windowFactor.draggingX
        this.windowFactor.t += this.windowFactor.draggingY
        this.windowFactor.l += this.windowFactor.draggingX
        this.windowFactor.b -= this.windowFactor.draggingY
        this.windowFactor.draggingX = 0
        this.windowFactor.draggingY = 0
        this.mouseup(event)
      }
      this.moveMode = flg ? 'move' : ''
    },
    addEventForIFrame () {
      const elms = document.getElementsByTagName('iframe')
      for (const iframeElm of elms) {
        // マウス移動
        const mouseMoveListener = function (event) {
          const iframeRect = iframeElm.getBoundingClientRect()
          const evtObj = { clientX: event.pageX + iframeRect.left, clientY: event.pageY + iframeRect.top }
          document.dispatchEvent(new MouseEvent('mousemove', evtObj))
        }
        // タッチ移動
        const touchMoveListener = function (event) {
          const iframeRect = iframeElm.getBoundingClientRect()
          const evtObj = { changedTouches: [{ clientX: event.changedTouches[0].pageX + iframeRect.left, clientY: event.changedTouches[0].pageY + iframeRect.top }] }
          document.dispatchEvent(new MouseEvent('touchmove', evtObj))
        }
        // クリック
        const clickListener = function (event) {
          const iframeRect = iframeElm.getBoundingClientRect()
          const evtObj = { clientX: event.pageX + iframeRect.left, clientY: event.pageY + iframeRect.top, button: event.button }
          document.getElementById('mapBoardFrame').dispatchEvent(new MouseEvent('click', evtObj))
        }
        // マウス離す
        const mouseupListener = function (event) {
          const iframeRect = iframeElm.getBoundingClientRect()
          const evtObj = { clientX: event.pageX + iframeRect.left, clientY: event.pageY + iframeRect.top, button: event.button }
          if (event.button === 2) {
            this.setProperty({property: `map.isOverEvent`, value: true})
          }
          document.getElementById('mapBoardFrame').dispatchEvent(new MouseEvent('mouseup', evtObj))
        }.bind(this)
        // コンテキストメニュー防止
        const contextmenuListener = function (event) {
          return false
        }
        if (!iframeElm.onload) {
          iframeElm.onload = function () {
            const bodyElm = iframeElm.contentWindow.document
            if (!bodyElm.onmousemove) { bodyElm.onmousemove = mouseMoveListener }
            if (!bodyElm.ontouchmove) { bodyElm.ontouchmove = touchMoveListener }
            if (!bodyElm.onmouseup) { bodyElm.onmouseup = mouseupListener }
            if (!bodyElm.oncontextmenu) { bodyElm.oncontextmenu = contextmenuListener }
            if (!bodyElm.onclick) { bodyElm.onclick = clickListener }
            /*
            const aElms = bodyElm.getElementsByTagName('a')
            for (const aElm of aElms) {
              if (!aElm.onmousemove) { aElm.onmousemove = mouseMoveListener }
              if (!aElm.ontouchmove) { aElm.ontouchmove = touchMoveListener }
              if (!aElm.oncontextmenu) { aElm.oncontextmenu = contextmenuListener }
              if (!aElm.onclick) { aElm.onclick = clickListener }
            }
            */
          }
        }
        /*
        */
        if (!iframeElm.onmousemove) { iframeElm.onmousemove = mouseMoveListener }
        if (!iframeElm.ontouchmove) { iframeElm.ontouchmove = touchMoveListener }
        if (!iframeElm.onmouseup) { iframeElm.onmouseup = mouseupListener }
        if (!iframeElm.onclick) { iframeElm.onclick = clickListener }
      }
    }
  },
  watch: {
    isDisplay (newValue, oldValue) {
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
    isResetPosition (newValue, oldValue) {
      if (newValue) {
        console.log(`    [watch] window reset => ${this.displayProperty}`)
        this.windowFactor.l = 0
        this.windowFactor.r = 0
        this.windowFactor.t = 0
        this.windowFactor.b = 0
        this.windowFactor.w = 0
        this.windowFactor.h = 0
        this.setProperty({property: `${this.displayProperty}.doResetPosition`, value: false})
        this.$emit('reset')
      } else {
        console.log(`    [watch] window resetted => ${this.displayProperty}`)
      }
    }
  },
  computed: mapState({
    ...mapGetters([
      'isWindowOpen',
      'getState'
    ]),
    isDisplay () { return !this.displayProperty ? false : this.isWindowOpen(this.displayProperty) },
    isResetPosition () { return !this.displayProperty ? false : this.getState(this.displayProperty).doResetPosition },
    zIndex () { return this.getState(this.displayProperty).zIndex },
    isFix () { return this.fixSize !== undefined },
    fixW () { return !this.isFix ? -1 : parseInt(this.fixSize.split(',')[0].trim()) },
    fixH () { return !this.isFix ? -1 : parseInt(this.fixSize.split(',')[1].trim()) },
    base () {
      if (!this.baseSize) { return { w: 0, h: 0 } }
      return {
        w: parseInt(this.baseSize.split(',')[0].trim()),
        h: parseInt(this.baseSize.split(',')[1].trim())
      }
    },
    min () {
      if (!this.minSize) { return { w: 0, h: 0 } }
      return {
        w: parseInt(this.minSize.split(',')[0].trim()),
        h: parseInt(this.minSize.split(',')[1].trim())
      }
    },
    windowStyle () {
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
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.window {
  position: fixed;
  display: block;
  padding: 29px 8px 8px 8px;
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
  display: block;
}

.title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25px;
  border-radius: 8px 8px 0 0;
  border-bottom: solid rgba(0, 0, 0, 0.2) 1px;
  cursor: move;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  display: flex; align-items: center; justify-content: center;
}
.title.fix {
  background: linear-gradient(rgba(170, 233, 203, 1), rgba(142, 226, 186, 1));
}
.title span {
  position: absolute;
  left: 5px;
}

.close {
  position: absolute;
  width: 13px;
  height: 13px;
  top: 7px;
  right: 8px;
  cursor: pointer;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
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
/*
input, button, textarea, select {
  background-color: rgba(50, 50, 50, .2)
}
*/
</style>
