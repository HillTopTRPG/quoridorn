<template>
  <div class="character"
    :class="[isThisRolling ? 'rolling' : '', isHover ? 'hover' : '']"
    :style="characterStyle"
    :title="storeObj.text"
    @click.right.prevent="(e) => openContext(e, 'private.display.characterContext')"
    @mouseover="mouseover" @mouseout="mouseout"
    @dblclick="dblClick"
    @mousedown.left.stop="leftDown" @mouseup.left.stop="leftUp"
    @mousedown.right.stop="rightDown" @mouseup.right.stop="rightUp"
    @touchstart="leftDown" @touchend="leftUp" @touchcancel="leftUp"
    @contextmenu.prevent>
    <div class="border"/>
    <img class="image" v-img="imageObj.data" :class="{reverse : imageObj.isReverse}" draggable="false"/>
    <div class="name">{{name}}</div>
    <span class="rotate" v-show="isHover || isThisRolling" draggable="false"><i class="icon-redo2"
      @mousedown.stop="rollStart" @mouseup.stop="rollEnd"
      @touchstart.stop="rollStart" @touchend.stop="rollEnd" @touchcancel.stop="rollEnd"></i></span>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'

export default {
  name: 'character',
  mixins: [PieceMixin],
  data () {
    return {
    }
  },
  methods: {
    getKeyObj (list, key) {
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
    },
    dblClick () {
      const maxIndex = this.useImageList.split('|').length - 1
      let nextIndex = this.useImageIndex + 1
      if (nextIndex > maxIndex) {
        nextIndex = 0
      }
      this.setProperty({property: `public.${this.type}.list.${this.storeIndex}.useImageIndex`, value: nextIndex, isNotice: true})
    }
  },
  computed: mapState({
    ...mapGetters([]),
    characterStyle () {
      let obj = this.style
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
    name () { return this.storeObj.name },
    useImageList () { return this.storeObj.useImageList },
    useImageIndex () { return this.storeObj.useImageIndex },
    imageList: state => state.public.image.list,
    imageObj () {
      if (this.useImageList === '') { return '' }
      const imageStr = this.useImageList.split('|')[this.useImageIndex]
      // console.log(`list:${this.useImageList}(${this.useImageIndex}), image:${imageStr}`)
      const isReverse = imageStr.indexOf(':R') >= 0
      const imageKey = imageStr.replace(':R', '')
      return {
        isReverse: isReverse,
        data: this.getKeyObj(this.imageList, imageKey).data
      }
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.character {
  /*
  box-sizing: border-box;
  */
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
  border-radius: 3px;
  z-index: 600000000;
}
.character.hover,
.character.rolling {
  z-index: 999999999;
}
.character:before {
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: -2px;
  top: -2px;
  border: solid black 2px;
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
.rotate {
  position: absolute;
  left: -5px;
  top: -5px;
  object-fit: fill;
  background-color: red;
  width: 15px;
  height: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rotate:hover {
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
