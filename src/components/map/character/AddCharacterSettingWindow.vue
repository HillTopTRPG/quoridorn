<template>
  <WindowFrame titleText="キャラクター追加" display-property="addCharacterSettingWindow" align="center" fixSize="637, 402" baseSize="500, 400" @open="open">
    <div class="container">
      <div class="viewImage"><img v-img="currentImage"/></div>
      <div class="choseImage">
        <div class="tagImages"><img v-for="image in imageList" :class="{active : image.key === currentImageKey}" :key="image.key" v-img="image.data" @click="selectTagImage(image.key)"/></div>
      </div>
      <div class="imageInfo">
        <div class="selectedImage"><label>タグ名：</label><select class="tagSelect" v-model="currentImageTag"><option v-for="tagObj in tagList" :key="tagObj.key" :value="tagObj.name">{{tagObj.name}}</option></select><span>{{selectedTagIndexText}}</span></div>
        <button>隠し画像</button>
        <button>反</button>
      </div>
      <div class="switchImageArea">
        <button v-show="!isOpenSwitch" @click="isOpenSwitch = true" class="switchButton">画像切替設定</button>
        <span v-show="isOpenSwitch" class="switchImage"><img v-for="switchObj in switchImageList" :class="{active : switchObj.key === switchCurrentKey}" :key="switchObj.key" v-img="getImage(switchObj.imgKey)" @click="selectSwitchImage(switchObj.key)" tabindex="0"/></span>
        <button v-show="isOpenSwitch" @click.prevent="addSwitch">追加</button>
        <button v-show="isOpenSwitch" @click.prevent="deleteSwitch" :disabled="!isCanSwitchDelete">削除</button>
      </div>
      <div class="initiativeTable">
      </div>
      <div class="nameArea"><label>名前：</label><input type="text" class="name" placeholder="必ず入力してください" v-model="name"/></div>
      <div class="pieceOptions">
        <label>サイズ：</label><input type="number" class="size" min="1" v-model="size"/>
        <label><input type="checkbox" class="hide" v-model="isHide"/><span>マップマスクの下に隠す<br>(イニシアティブ表で非表示)</span></label>
      </div>
      <div class="urlArea"><label>参照URL：</label><input type="text" v-model="url" placeholder="キャラクターシートのURL"/></div>
      <div class="otherTextLabel"><span>その他</span></div>
      <textarea class="otherText" v-model="text"></textarea>
      <div class="buttonArea">
        <div>
          <button @click="commit">変更</button>
          <button @click="cancel">キャンセル</button>
        </div>
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
      useImageList: '',
      isOpenSwitch: false,
      currentImageTag: '(全て)',
      switchImageList: [
        { key: 0, imgKey: 1 }
      ],
      switchCurrentKey: 0,
      name: '',
      size: 1,
      isHide: false,
      url: '',
      text: ''
    }
  },
  methods: {
    ...mapMutations([
      'setProperty',
      'windowOpen',
      'windowClose'
    ]),
    addSwitch: function () {
      let nextKey = -1
      let isFind
      do {
        nextKey++
        isFind = false
        for (const switchImage of this.switchImageList) {
          if (switchImage.key === nextKey) {
            isFind = true
            break
          }
        }
      } while (isFind)

      this.switchImageList.push({
        key: nextKey,
        imgKey: 1
      })
      this.switchCurrentKey = nextKey
    },
    getImage: function (key) {
      return this.getKeyObj(this.storeImages, key).data
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
    selectSwitchImage: function (key) {
      this.switchCurrentKey = key
    },
    selectTagImage: function (key) {
      const switchImageObj = this.getKeyObj(this.switchImageList, this.switchCurrentKey)
      switchImageObj.imgKey = key
      const index = this.switchImageList.indexOf(switchImageObj)
      this.switchImageList.splice(index, 1, switchImageObj)
    },
    deleteSwitch: function () {
      const switchObj = this.getKeyObj(this.switchImageList, this.switchCurrentKey)
      const index = this.switchImageList.indexOf(switchObj)
      // 削除
      this.switchImageList.splice(index, 1)
      if (index < this.switchImageList.length) {
        this.switchCurrentKey = this.switchImageList[index].key
      } else {
        this.switchCurrentKey = this.switchImageList[this.switchImageList.length - 1].key
      }
    },
    commit: function () {
      if (this.name === '') {
        alert(`名前を入力してください。`)
        return
      }
      /*
      this.setProperty({property: `display.addCharacterWindow.name`, value: this.name})
      this.setProperty({property: `display.addCharacterWindow.size`, value: this.size})
      this.setProperty({property: `display.addCharacterWindow.useImageList`, value: this.useImageList})
      this.setProperty({property: `display.addCharacterWindow.isHide`, value: this.isHide})
      this.setProperty({property: `display.addCharacterWindow.url`, value: this.url})
      this.setProperty({property: `display.addCharacterWindow.text`, value: this.text})
      this.setProperty({property: `display.addCharacterWindow.currentImage`, value: 'TODO'})
      this.setProperty({property: `display.addCharacterWindow.currentImageTag`, value: this.currentImageTag})
      this.windowOpen('addCharacterWindow')
      */
      this.setProperty({property: 'display.unSupportWindow.title', value: 'キャラクター置き場'}); this.windowOpen('unSupportWindow')
      this.windowClose('addCharacterSettingWindow')
    },
    cancel: function () {
      this.windowClose('addCharacterSettingWindow')
    },
    open: function () {
      this.isOpenSwitch = false
      this.currentImageTag = '(全て)'
      this.switchImageList.splice(0, this.switchImageList.length)
      this.switchImageList.push({ key: 0, imgKey: 1 })
      this.switchCurrentKey = 0
      this.name = ''
      this.size = 1
      this.isHide = false
      this.url = ''
      this.text = ''
    }
  },
  computed: {
    ...mapGetters([
      'parseColor'
    ]),
    selectedTagIndexText: function () {
      const imageList = this.imageList
      const keyObj = this.getKeyObj(imageList, this.currentImageKey)
      const index = keyObj ? imageList.indexOf(keyObj) + 1 : 0
      return `${index}/${imageList.length}`
    },
    isCanSwitchDelete: function () {
      return this.switchImageList.length > 1
    },
    storeImages: function () {
      return this.$store.state.images.data
    },
    currentImage: function () {
      return this.getImage(this.currentImageKey)
    },
    currentImageKey: function () {
      const switchImageObj = this.getKeyObj(this.switchImageList, this.switchCurrentKey)
      return switchImageObj.imgKey
    },
    tagList: function () {
      return this.$store.state.images.tags
    },
    imageList: function () {
      return this.$store.state.images.data.filter((obj) => {
        if (this.currentImageTag === '(全て)') { return true }
        return obj.tag.indexOf(this.currentImageTag) >= 0
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: grid;
  width: 100%;
  height: 100%;
  font-size: 12px;
  position: absolute;
  grid-template-columns: 200px auto 1fr;
  grid-template-rows: 1fr auto auto auto auto auto auto auto;
  grid-template-areas:
      "viewImage       choseImage      choseImage"
      "viewImage       imageInfo       imageInfo"
      "viewImage       switchImageArea switchImageArea"
      "initiativeTable initiativeTable initiativeTable"
      "nameArea        nameArea        otherTextLabel"
      "pieceOptions    pieceOptions    otherText"
      "urlArea         urlArea         otherText"
      "buttonArea      buttonArea      buttonArea";
}
.tagImages {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
  height: 100%;
  max-height: 100%;
  min-width: 217px;
  border: solid gray 1px;
}
.tagImages img {
  width: 50px;
  height: 50px;
  border: solid rgba(0, 0, 0, 0) 1px;
}
.tagImages img.active {
  border:solid blue 1px;
}
.container > * { padding: 1px 0; }
.viewImage { grid-area: viewImage; }
.viewImage img { display: inline-block; width: 200px; height: 200px; object-fit: fill; }
.choseImage { grid-area: choseImage; }
.imageInfo { grid-area: imageInfo; display: flex; }
.imageInfo .selectedImage { flex: 1; display: flex; }
.imageInfo .selectedImage > * { display: flex; align-items: center; justify-content: center; }
.imageInfo .selectedImage select { flex: 1; }
.imageInfo > button { margin-left: 10px; }
.switchImageArea { grid-area: switchImageArea; display: flex; }
.switchImageArea .switchImage { display: inline-block; flex: 1; height: 50px; }
.switchImageArea .switchImage img { width: 50px; height: 50px; border: solid rgba(0, 0, 0, 0) 1px; }
.switchImageArea .switchImage img.active { border:solid blue 1px; }
.switchImageArea button:not(.switchButton) { height: 50px; display: inline-block; margin-left: 10px; }
.initiativeTable { grid-area: initiativeTable; }
.nameArea { grid-area: nameArea; }
.viewImage { grid-area: viewImage; }
.otherTextLabel { display: flex; grid-area: otherTextLabel; vertical-align: bottom; }
.otherTextLabel span { display: inline; vertical-align: bottom; flex: 1; }
.pieceOptions { grid-area: pieceOptions; }
.pieceOptions input[type=number] { width: 35px; }
.pieceOptions span { display: inline-block; vertical-align: middle; margin-right: 10px; }
.otherText { grid-area: otherText; resize: none; width: 100%; height: 100%; box-sizing: border-box; }
.urlArea { grid-area: urlArea; display: flex; vertical-align: middle; }
.urlArea label { display: flex; align-items: center; justify-content: center; }
.urlArea input { flex: 1; margin-right: 7px; }
.buttonArea { grid-area: buttonArea; text-align: center; padding-top: 15px; padding-bottom: 10px; }
.buttonArea > div { display: inline-block; }
input { padding: 2px; }
/*
button {
  border-radius: 5px;
}
*/
</style>
