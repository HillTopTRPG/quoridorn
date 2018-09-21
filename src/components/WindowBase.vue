
<template>
  <div class="window" :style="windowStyle">
    <div class="contents">
      <slot></slot>
    </div>
    <div class="title" @mousedown.left.prevent="move(true)" @mouseup.left.prevent="move(false)">{{title}}</div>
    <div class="corner-left-top" @mousedown.left.prevent="resize('corner-left-top', true)" @mouseup.left.prevent="resize('corner-left-top', false)"></div>
    <div class="corner-left-bottom" @mousedown.left.prevent="resize('corner-left-bottom', true)" @mouseup.left.prevent="resize('corner-left-bottom', false)"></div>
    <div class="corner-right-top" @mousedown.left.prevent="resize('corner-right-top', true)" @mouseup.left.prevent="resize('corner-right-top', false)"></div>
    <div class="corner-right-bottom" @mousedown.left.prevent="resize('corner-right-bottom', true)" @mouseup.left.prevent="resize('corner-right-bottom', false)"></div>
    <div class="side-top" @mouseup.left.prevent="resize('side-top', false)" @mousedown.left.prevent="resize('side-top', true)"></div>
    <div class="side-left" @mousedown.left.prevent="resize('side-left', true)" @mouseup.left.prevent="resize('side-left', false)"></div>
    <div class="side-right" @mousedown.left.prevent="resize('side-right', true)" @mouseup.left.prevent="resize('side-right', false)"></div>
    <div class="side-bottom" @mousedown.left.prevent="resize('side-bottom', true)" @mouseup.left.prevent="resize('side-bottom', false)"></div>
    <img class="close" src="../assets/window_close.png" @click.left.prevent="closeWindow"></div>
  </div>
</template>

<script>
export default {
  props: ['title'],
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
          x: 0,
          y: 0,
          w: 0,
          h: 0,
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
    closeWindow: function () {
      this.windowBase.isOpen = false
    },
    resize: function (direct, flg) {
      if (flg) {
        this.windowBase.mouse.saveX = this.windowBase.mouse.x
        this.windowBase.mouse.saveY = this.windowBase.mouse.y
      } else {
        // console.log(this.windowBase.moveMode, this.windowBase.windowFactor.x, this.windowBase.windowFactor.y, this.windowBase.windowFactor.w, this.windowBase.windowFactor.h, this.windowBase.windowFactor.draggingX, this.windowBase.windowFactor.draggingY)
        switch (this.windowBase.moveMode) {
          case 'side-right':
          case 'corner-right-top':
          case 'corner-right-bottom':
            this.windowBase.windowFactor.w += this.windowBase.windowFactor.draggingX
            break
          case 'side-left':
          case 'corner-left-top':
          case 'corner-left-bottom':
            this.windowBase.windowFactor.x += this.windowBase.windowFactor.draggingX
            this.windowBase.windowFactor.w -= this.windowBase.windowFactor.draggingX
        }
        switch (this.windowBase.moveMode) {
          case 'side-top':
          case 'corner-left-top':
          case 'corner-right-top':
            this.windowBase.windowFactor.h -= this.windowBase.windowFactor.draggingY
            break
          case 'side-bottom':
          case 'corner-left-bottom':
          case 'corner-right-bottom':
            this.windowBase.windowFactor.y -= this.windowBase.windowFactor.draggingY
            this.windowBase.windowFactor.h += this.windowBase.windowFactor.draggingY
        }
        this.windowBase.windowFactor.draggingX = 0
        this.windowBase.windowFactor.draggingY = 0
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
        this.windowBase.windowFactor.x += this.windowBase.windowFactor.draggingX
        this.windowBase.windowFactor.y -= this.windowBase.windowFactor.draggingY
        this.windowBase.windowFactor.draggingX = 0
        this.windowBase.windowFactor.draggingY = 0
      }
      this.windowBase.moveMode = flg ? 'move' : ''
    }
  },
  computed: {
    windowStyle: function () {
      let left = this.windowBase.windowFactor.x
      let bottom = this.windowBase.windowFactor.y
      let height = this.windowBase.windowFactor.h
      let width = this.windowBase.windowFactor.w
      switch (this.windowBase.moveMode) {
        case 'side-top':
          height -= this.windowBase.windowFactor.draggingY
          break
        case 'side-bottom':
          height += this.windowBase.windowFactor.draggingY
          bottom -= this.windowBase.windowFactor.draggingY
          break
        case 'side-left':
          width -= this.windowBase.windowFactor.draggingX
          left += this.windowBase.windowFactor.draggingX
          break
        case 'side-right':
          width += this.windowBase.windowFactor.draggingX
          break
        case 'corner-right-top':
          width += this.windowBase.windowFactor.draggingX
          height -= this.windowBase.windowFactor.draggingY
          break
        case 'corner-right-bottom':
          width += this.windowBase.windowFactor.draggingX
          height += this.windowBase.windowFactor.draggingY
          bottom -= this.windowBase.windowFactor.draggingY
          break
        case 'corner-left-bottom':
          width -= this.windowBase.windowFactor.draggingX
          height += this.windowBase.windowFactor.draggingY
          bottom -= this.windowBase.windowFactor.draggingY
          left += this.windowBase.windowFactor.draggingX
          break
        case 'corner-left-top':
          width -= this.windowBase.windowFactor.draggingX
          height -= this.windowBase.windowFactor.draggingY
          left += this.windowBase.windowFactor.draggingX
          break
        case 'move':
          left += this.windowBase.windowFactor.draggingX
          bottom -= this.windowBase.windowFactor.draggingY
      }
      const obj = {
        display: this.windowBase.isOpen ? 'block' : 'none',
        left: left + 'px',
        bottom: bottom + 'px',
        width: 'calc(100% - 10px - 200px + ' + width + 'px)',
        height: 'calc(200px + ' + height + 'px)'
      }
      // console.log(obj.left, obj.bottom, obj.width, obj.height)
      return obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.window {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 90;
  padding: 22px 8px 8px 8px;
  overflow: visible;
  min-height: 50px;
  border-radius: 8px 8px 0 0;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 5px 5px 5px rgba(0,0,0,0.6);
}
.window:focus {
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
