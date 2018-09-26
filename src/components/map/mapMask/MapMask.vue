<template>
  <div class="mapMask"
    :class="[storeObj.isLock ? 'isLock' : 'isUnLock']"
    :style="mapMaskStyle"
    @click.right.prevent="(e) => openContext(e, 'mapMaskContext')"
    @mousedown.left="leftDown" @mouseup.left="leftUp"
    @mousedown.right="rightDown" @mouseup.right="rightUp"
    @contextmenu.prevent>
    {{storeObj.name}}<br>({{storeObj.key}})
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'

export default {
  name: 'mapMask',
  mixins: [PieceMixin],
  computed: {
    ...mapGetters([
      'parseColor'
    ]),
    mapMaskStyle: function () {
      let obj = this.style
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
</style>
