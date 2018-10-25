<template>
  <div class="chit"
    :class="[isThisRolling ? 'rolling' : '', isHover ? 'hover' : '']"
    :style="chitStyle"
    :title="description"
    @click.right.prevent="(e) => openContext(e, 'private.display.chitContext')"
    @mouseover="mouseover" @mouseout="mouseout"
    @mousedown.left.stop="leftDown" @mouseup.left.stop="leftUp"
    @mousedown.right.stop="rightDown" @mouseup.right.stop="rightUp"
    @touchstart="leftDown" @touchend="leftUp" @touchcancel="leftUp"
    @contextmenu.prevent>
    <div class="border"/>
    <img class="image" v-img="getKeyObj(imageList, imageKey).data" :class="{reverse : isReverse}" draggable="false"/>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PieceMixin from '../../PieceMixin'

export default {
  name: 'chit',
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
    }
  },
  computed: mapState({
    ...mapGetters([]),
    chitStyle () {
      let obj = this.style
      if (this.storeObj.isDraggingLeft) {
        const plus = 1.5
        obj.left = this.rect.left - plus + 'px'
        obj.top = this.rect.top - plus + 'px'
        obj.width = this.rect.width + plus * 2 + 'px'
        obj.height = this.rect.height + plus * 2 + 'px'
        obj.opacity = 0.6
      }
      // console.log(` [computed] chit(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
      return obj
    },
    imageKey () { return this.storeObj.imageKey },
    isReverse () { return this.storeObj.isReverse },
    description () { return this.storeObj.description },
    imageList: state => state.public.image.list
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chit {
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
  z-index: 100000000;
}
.chit.hover,
.chit.rolling {
  z-index: 999999999;
}
.chit:before {
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: -2px;
  top: -2px;
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
