<template>
  <WindowFrame titleText="キャラクター追加" display-property="private.display.addCharacterSettingWindow" align="center" fixSize="653, 377" @open="open"><!--  baseSize="601, 377" -->
    <div class="container">
      <div class="viewImage"><img v-img="currentImage" draggable="false" :class="{isReverse : isReverse}"/></div>
      <div class="choseImage">
        <div class="tagImages"><img v-for="image in imageList" :class="{active : image.key === currentImageKey}" :key="image.key" v-img="image.data" @click="selectTagImage(image.key)" draggable="false"/></div>
      </div>
      <div class="imageInfo">
        <div class="selectedImage"><label>タグ名：</label><select class="tagSelect" v-model="currentImageTag"><option v-for="tagObj in tagList" :key="tagObj.key" :value="tagObj.name">{{tagObj.name}}</option></select><span>{{selectedTagIndexText}}</span></div>
        <button>隠し画像</button>
        <button @click="doReverse">反</button>
      </div>
      <div class="switchImageArea">
        <button v-show="!isOpenSwitch" @click="isOpenSwitch = true" class="switchButton">画像切替設定</button>
        <span v-show="isOpenSwitch" class="switchImage"><img v-for="switchObj in switchImageList" :class="{active : switchObj.key === switchCurrentKey, isReverse : switchObj.isReverse}" :key="switchObj.key" v-img="getImage(switchObj.imgKey)" @click="selectSwitchImage(switchObj.key)" tabindex="0" draggable="false"/></span>
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
          <button @click="commit">追加</button>
          <button @click="cancel">キャンセル</button>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import WindowFrame from '../../WindowFrame'
import WindowMixin from '../../WindowMixin'

export default {
  name: 'addCharacterSettingWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  data () {
    return {
      isOpenSwitch: false,
      currentImageTag: 'キャラクター',
      switchImageList: [
        { key: 0, imgKey: 'image-1', isReverse: false }
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
    ...mapActions([
      'setProperty',
      'windowOpen',
      'windowClose'
    ]),
    addSwitch () {
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
        imgKey: 'image-1',
        isReverse: false
      })
      this.switchCurrentKey = nextKey
    },
    doReverse () {
      const switchImageObj = this.getKeyObj(this.switchImageList, this.switchCurrentKey)
      console.qLog(`image(${this.switchCurrentKey}) isReverse: ${switchImageObj.isReverse} -> ${!switchImageObj.isReverse}`)
      switchImageObj.isReverse = !switchImageObj.isReverse
      const index = this.switchImageList.indexOf(switchImageObj)
      this.switchImageList.splice(index, 1, switchImageObj)
    },
    getImage (key) {
      return this.getKeyObj(this.storeImages, key).data
    },
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
    },
    selectSwitchImage (key) {
      this.switchCurrentKey = key
    },
    selectTagImage (key) {
      const switchImageObj = this.getKeyObj(this.switchImageList, this.switchCurrentKey)
      switchImageObj.imgKey = key
      switchImageObj.isReverse = false
      const index = this.switchImageList.indexOf(switchImageObj)
      this.switchImageList.splice(index, 1, switchImageObj)
    },
    deleteSwitch () {
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
    commit () {
      if (this.name === '') {
        alert(`名前を入力してください。`)
        return
      }
      let useImageList = ''
      this.switchImageList.forEach(imgObj => {
        const isReverseStr = imgObj.isReverse ? ':R' : ''
        const imgStr = imgObj.imgKey + isReverseStr
        useImageList += imgStr + '|'
      })
      useImageList = useImageList.substr(0, useImageList.length - 1)
      const obj = {
        name: this.name,
        size: this.size,
        useImageList: useImageList,
        isHide: this.isHide,
        url: this.url,
        text: this.text,
        useImageIndex: this.switchCurrentKey,
        currentImageTag: this.currentImageTag
      }
      this.setProperty({property: `private.display.addCharacterWindow`, value: obj})
      this.windowOpen('private.display.addCharacterWindow')
    },
    cancel () {
      this.windowClose('private.display.addCharacterSettingWindow')
    },
    open () {
      this.isOpenSwitch = false
      this.currentImageTag = 'キャラクター'
      this.switchImageList.splice(0, this.switchImageList.length)
      this.switchImageList.push({ key: 0, imgKey: 'image-1', isReverse: false })
      this.switchCurrentKey = 0
      this.name = ''
      this.size = 1
      this.isHide = false
      this.url = ''
      this.text = ''
      this.windowClose('private.display.addCharacterWindow')
    }
  },
  computed: mapState({
    ...mapGetters([
      'parseColor'
    ]),
    selectedTagIndexText () {
      const imageList = this.imageList
      const keyObj = this.getKeyObj(imageList, this.currentImageKey)
      const index = keyObj ? imageList.indexOf(keyObj) + 1 : 0
      return `${index}/${imageList.length}`
    },
    isReverse () { return this.getKeyObj(this.switchImageList, this.switchCurrentKey).isReverse },
    isCanSwitchDelete () { return this.switchImageList.length > 1 },
    storeImages: state => state.public.image.list,
    currentImage () { return this.getImage(this.currentImageKey) },
    currentImageKey () { return this.getKeyObj(this.switchImageList, this.switchCurrentKey).imgKey },
    tagList: state => state.public.image.tags.list,
    imageList () {
      return this.$store.state.public.image.list.filter((obj) => {
        if (this.currentImageTag === '(全て)') { return true }
        return obj.tag.indexOf(this.currentImageTag) >= 0
      })
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: grid;
  width: 100%;
  font-size: 12px;
  position: absolute;
  grid-template-columns: 200px auto 1fr;
  grid-template-rows: 125px auto 1fr auto auto auto auto auto;
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
  height: auto;
  min-height: calc(100% - 2px);
  box-sizing: border-box;
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
.isReverse {
  transform: scale(-1, 1);
}
.container > * { padding: 1px 0; }
.viewImage { grid-area: viewImage; }
.viewImage img { display: inline-block; width: 200px; height: 200px; }
.choseImage { grid-area: choseImage; overflow-y: scroll; max-height: 130px; }
.imageInfo { grid-area: imageInfo; display: flex; }
.imageInfo .selectedImage { flex: 1; display: flex; }
.imageInfo .selectedImage > * { display: flex; align-items: center; justify-content: center; }
.imageInfo .selectedImage select { flex: 1; }
.imageInfo > button { margin-left: 10px; }
.switchImageArea { grid-area: switchImageArea; display: flex; }
.switchImageArea .switchImage { display: inline-block; flex: 1; height: 50px; }
.switchImageArea .switchImage img { width: 50px; height: 50px; border: solid rgba(0, 0, 0, 0) 1px; }
.switchImageArea .switchImage img.active { border:solid blue 1px; }
.switchImageArea button.switchButton { height: 26px; }
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
</style>
