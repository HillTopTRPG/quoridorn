<template>
  <div class="character"
    :class="[storeObj.isLock ? 'isLock' : 'isUnLock']"
    :style="characterStyle"
    @click.right.prevent="(e) => openContext(e, 'characterContext')"
    @mousedown.left="leftDown" @mouseup.left="leftUp"
    @mousedown.right="rightDown" @mouseup.right="rightUp"
    @contextmenu.prevent
  >{{storeObj.name}}<br>({{storeObj.key}})</div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'

export default {
  name: 'character',
  mixins: [PieceMixin],
  computed: {
    ...mapGetters([]),
    characterStyle: function () {
      const storeObj = this.storeObj
      let obj = this.style
      obj['background-color'] = storeObj.color
      obj['color'] = storeObj.fontColor
      console.log(` [computed] character(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
      return obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.character {
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
.character:hover {
  border-width: 2px;
  z-index: 1000;
  transform: translate(-2px, -2px);
}
.character.isLock:hover { border-color: blue; }
.character.isUnLock:hover { border-color: yellow; }
</style>
