<template>
  <WindowFrame titleText="キャラクター置き場" display-property="addCharacterWindow" align="center" fixSize="200, 200" @open="open">
    <div class="container">
      <div class="name">{{name}}</div>
      <div class="image"><img class="img" v-img="imageObj.data" @dragstart="dragStart" draggable="true" :class="{reverse : imageObj.isReverse}" @mousedown.stop/></div>
      <div class="controllArea">
        <label><input type="checkbox" v-model="is_Continuous"/>複数作成</label>
        <span>連番：</span><input type="number" min="0" v-model="continuous_Num" :disabled="!isContinuous"/>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../../WindowFrame'

export default {
  name: 'addMapMask',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      continuous_Num: 1,
      is_Continuous: false
    }
  },
  methods: {
    ...mapMutations([
      'setProperty',
      'windowOpen',
      'windowClose'
    ]),
    dragStart: function (event) {
      event.dataTransfer.setData('kind', 'character')
      event.dataTransfer.setData('name', this.name)
      event.dataTransfer.setData('size', this.size)
      event.dataTransfer.setData('useImageList', this.useImageList)
      event.dataTransfer.setData('isHide', this.isHide)
      event.dataTransfer.setData('url', this.url)
      event.dataTransfer.setData('text', this.text)
      event.dataTransfer.setData('useImageIndex', this.useImageIndex)
      event.dataTransfer.setData('currentImageTag', this.currentImageTag)
      console.log(`  [methods] drag start character => {` +
        `name:"${this.name}", ` +
        `size:${this.size}, ` +
        `useImageList:${this.useImageList}, ` +
        `isHide:${this.isHide}, ` +
        `url:${this.url}, ` +
        `text:${this.text}, ` +
        `useImageIndex:${this.useImageIndex}, ` +
        `currentImageTag:${this.currentImageTag}}`)
    },
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
    },
    open: function () {
      this.continuous_Num = 1
      this.is_Continuous = false
      this.windowClose('addCharacterSettingWindow')
    }
  },
  watch: {
    is_Continuous: function (newVal, oldVal) {
      this.setProperty({property: `display.addCharacterWindow.isContinuous`, value: newVal})
    },
    continuousNum: function (newVal, oldVal) {
      this.continuous_Num = newVal
    }
  },
  computed: {
    ...mapGetters([
      'parseColor'
    ]),
    name: function () { return this.$store.state.display.addCharacterWindow.name + (this.is_Continuous ? `_${this.continuous_Num}` : '') },
    size: function () { return this.$store.state.display.addCharacterWindow.size },
    useImageList: function () { return this.$store.state.display.addCharacterWindow.useImageList },
    isHide: function () { return this.$store.state.display.addCharacterWindow.isHide },
    url: function () { return this.$store.state.display.addCharacterWindow.url },
    text: function () { return this.$store.state.display.addCharacterWindow.text },
    useImageIndex: function () { return this.$store.state.display.addCharacterWindow.useImageIndex },
    currentImageTag: function () { return this.$store.state.display.addCharacterWindow.currentImageTag },
    isContinuous: function () { return this.$store.state.display.addCharacterWindow.isContinuous },
    continuousNum: function () { return this.$store.state.display.addCharacterWindow.continuousNum },
    imageObj: function () {
      if (this.useImageList === '') { return '' }
      const imageStr = this.useImageList.split('|')[this.useImageIndex]
      console.log(`list:${this.useImageList}(${this.useImageIndex}), image:${imageStr}`)
      const isReverse = imageStr.indexOf(':R') >= 0
      console.log(imageStr, isReverse)
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
.container {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 12px;
}
.container > * {
  display: flex;
  align-items: center;
  justify-content: center;
}
.name {

}
.image img {
  display: block;
  width: 96px;
  height: 96px;
  margin: 10px;
  box-sizing: border-box;
  border: solid yellow 3px;
  background-color: rgba(0, 0, 0, 0);
}
.image img.reverse {
  transform: scale(-1, 1);
}
.controllArea {

}
label {
  display: flex;
  align-items: center;
  justify-content: center;
}
input[type=number] {
  width: 40px;
}
</style>
