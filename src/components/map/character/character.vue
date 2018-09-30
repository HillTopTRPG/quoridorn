<template>
  <div class="character"
    :class="[isThisRolling ? 'rolling' : '', isHover ? 'hover' : '']"
    :style="characterStyle"
    @click.right.prevent="(e) => openContext(e, 'characterContext')"
    @mouseover="mouseover" @mouseout="mouseout"
    @mousedown.left.stop="leftDown" @mouseup.left.stop="leftUp"
    @mousedown.right.stop="rightDown" @mouseup.right.stop="rightUp"
    @touchstart="leftDown" @touchend="leftUp" @touchcancel="leftUp"
    @contextmenu.prevent>
    <div class="border"/>
    <img class="image" v-img="imageObj.data" :class="{reverse : imageObj.isReverse}" draggable="false"/>
    <div class="name">{{name}}</div>
    <img class="rotate" v-img="require('../../../assets/rotateArrow.png')" v-show="isHover" draggable="false"
      @mousedown.stop="rollStart" @mouseup.stop="rollEnd"
      @touchstart.stop="rollStart" @touchend.stop="rollEnd" @touchcancel.stop="rollEnd" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'

export default {
  name: 'character',
  mixins: [PieceMixin],
  data () {
    return {
    }
  },
  methods: {
    getKeyObj: function (list, key) {
      const filteredList = list.filter(obj => obj.key === key)
      if (filteredList.length === 0) {
        console.log(`key:"${key}" is not find.`)
        return null
      }
      if (filteredList.length > 1) {
        console.log(`key:"(${key})" is duplicate.`)
        return null
      }
      return filteredList[0]
    }
  },
  computed: {
    ...mapGetters([]),
    characterStyle: function () {
      let obj = this.style
      const translate = this.isHover ? -2 : -2
      obj.transform += ` translate(${translate}px, ${translate}px)`
      if (this.storeObj.isDraggingLeft) {
        const plus = 1.5
        obj.left = this.rect.left - plus + 'px'
        obj.top = this.rect.top - plus + 'px'
        obj.width = this.rect.width + plus * 2 + 'px'
        obj.height = this.rect.height + plus * 2 + 'px'
      }
      // console.log(` [computed] character(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
      return obj
    },
    name: function () { return this.storeObj.name },
    useImageList: function () { return this.storeObj.useImageList },
    useImageIndex: function () { return this.storeObj.useImageIndex },
    imageObj: function () {
      if (this.useImageList === '') { return '' }
      const imageStr = this.useImageList.split('|')[this.useImageIndex]
      // console.log(`list:${this.useImageList}(${this.useImageIndex}), image:${imageStr}`)
      const isReverse = imageStr.indexOf(':r') >= 0
      const imageKey = parseInt(imageStr.replace(':r', ''))
      return {
        isReverse: isReverse,
        data: this.getKeyObj(this.$store.state.images.data, imageKey).data
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.character {
  position: fixed;
  cursor: default;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-size: 12px;
  cursor: crosshair;
  border: solid black 2px;
  border-radius: 3px;
}
.character.hover,
.character.rolling {
  z-index: 1000;
}
img.image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
img.image.reverse {
  transform: scale(-1, 1);
}
img.rotate {
  position: absolute;
  left: -5px;
  top: -5px;
  object-fit: fill;
  background-color: red;
  width: 15px;
  height: 15px;
  border-radius: 5px;
}
img.rotate:hover {
  width: 19px;
  height: 19px;
  transform: translate(-2px, -2px);
}
.name {
  position: absolute;
  top: calc(-1em - 4px);
  background-color: rgba(255, 255, 255, 0.3);
  padding: 0 3px;
}
.border {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-width: 2px;
  border: solid rgb(187, 187, 0) 3px;
  border-radius: 1px;
}
</style>
