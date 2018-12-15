<template>
  <div class="character"
    :class="[isThisRolling ? 'rolling' : '', isHover ? 'hover' : '']"
    :style="characterStyle"
    :title="storeObj.text"
    @mouseover="mouseover" @mouseout="mouseout"
    @contextmenu.prevent>
    <div class="border"></div>
    <img class="image" v-img="imageObj.data" :class="{reverse : imageObj.isReverse}" draggable="false"/>
    <div class="name">{{name}}</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'
import Range from '../../range/Range'

export default {
  name: 'characterChip',
  mixins: [PieceMixin],
  components: {
    Range
  },
  data () {
    return {
    }
  },
  methods: {
    getKeyObj (list, key) {
      const filteredList = list.filter(obj => obj.key === key)
      if (filteredList.length === 0) {
        console.qLog(`key:"${key}" is not find.`)
        return null
      }
      if (filteredList.length > 1) {
        console.qLog(`key:"(${key})" is duplicate.`)
        return null
      }
      return filteredList[0]
    }
  },
  computed: mapState({
    ...mapGetters([]),
    characterStyle () {
      let obj = this.style
      obj.left = 0
      obj.top = 0
      obj.width = this.gridSize + 'px'
      obj.height = this.gridSize + 'px'
      // delete obj.transform
      // console.qLog(` [computed] character(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
      return obj
    },
    name () { return this.storeObj.name },
    useImageList () { return this.storeObj.useImageList },
    useImageIndex () { return this.storeObj.useImageIndex },
    imageList: state => state.public.image.list,
    imageObj () {
      if (this.useImageList === '') { return '' }
      const imageStr = this.useImageList.split('|')[this.useImageIndex]
      // console.qLog(`list:${this.useImageList}(${this.useImageIndex}), image:${imageStr}`)
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
  /*position: fixed;*/
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
  overflow: visible;
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
  border: 3px solid rgb(187, 187, 0);
  border-radius: 1px;
}
</style>
