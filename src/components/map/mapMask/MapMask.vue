<template>
  <div class="mapMask"
    :class="[storeObj.isLock ? 'isLock' : 'isUnLock', isHover ? 'hover' : '']"
    :style="mapMaskStyle"
    @mouseover="mouseover" @mouseout="mouseout"
    @click.right.prevent="(e) => openContext(e, 'private.display.mapMaskContext')"
    @mousedown.left.stop="leftDown" @mouseup.left.stop="leftUp"
    @mousedown.right.stop="rightDown" @mouseup.right.stop="rightUp"
    @touchstart.stop="leftDown" @touchend.stop="leftUp" @touchcancel.stop="leftUp"
    @contextmenu.prevent>
    {{storeObj.name}}
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'

export default {
  name: 'mapMask',
  mixins: [PieceMixin],
  computed: mapState({
    ...mapGetters([
      'parseColor'
    ]),
    mapMaskStyle () {
      let obj = {}
      const baseStyle = this.style
      for (let key in baseStyle) {
        obj[key] = baseStyle[key]
      }
      const translate = this.isHover ? -2 : 0
      obj.transform = obj.transform.replace(/ translate[XY]\([^)]+\)/g, '') + ` translateX(${translate}px) translateY(${translate}px)`
      let colorObj = this.parseColor(this.storeObj.color)
      if (this.storeObj.isDraggingLeft) {
        const plus = 1.5
        obj.left = this.rect.left - plus + 'px'
        obj.top = this.rect.top - plus + 'px'
        obj.width = this.rect.width + plus * 2 + 'px'
        obj.height = this.rect.height + plus * 2 + 'px'
        colorObj.a = colorObj.a / 2
      }
      obj['background-color'] = colorObj.getRGBA()
      obj['color'] = this.storeObj.fontColor
      // console.log(` [computed] mapMask(${this.objKey}) style => isDraggingLeft:${storeObj.isDraggingLeft},transZ:${obj['transform']} lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
      return obj
    }
  })
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
.mapMask.hover {
  border-width: 2px;
  z-index: 1000;
}
.mapMask.isLock.hover { border-color: blue; }
.mapMask.isUnLock.hover { border-color: yellow; }
</style>
