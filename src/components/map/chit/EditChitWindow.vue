<template>
  <WindowFrame titleText="チット変更" display-property="private.display.editChitWindow" align="center" fixSize="653, 312" @open="initWindow" @reset="initWindow">
    <div class="container">
      <div class="viewImage"><img class="img" v-img="currentImage" draggable="false" :class="{isReverse : isReverse}"/></div>
      <!-- <div class="viewImage"><img v-img="currentImage" draggable="false" :class="{isReverse : isReverse}"/></div> -->
      <div class="choseImage">
        <div class="tagImages"><img v-for="image in imageList" :class="{active : image.key === imageKey}" :key="image.key" v-img="image.data" @click="selectImage(image.key)" draggable="false"/></div>
      </div>
      <div class="imageInfo">
        <div class="selectedImage"><label>タグ名：</label><select class="tagSelect" v-model="currentImageTag"><option v-for="tagObj in tagList" :key="tagObj.key" :value="tagObj.name">{{tagObj.name}}</option></select><span>{{selectedTagIndexText}}</span></div>
        <button>隠し画像</button>
        <button @click="doReverse">反</button>
      </div>
      <div class="initiativeTable">
      </div>
      <div class="rowsNum"><label>縦マス：</label><input type="number" min="1" class="size" v-model="rows"/></div>
      <div class="columnsNum"><label>横マス：</label><input type="number" min="1" class="size" v-model="columns"/></div>
      <textarea class="otherText" v-model="description" placeholder="説明"></textarea>
      <div class="buttonArea">
        <div>
          <button @click="commit">確定</button>
          <button @click="cancel">キャンセル</button>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import WindowFrame from '../../WindowFrame'

export default {
  name: 'editChitWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      currentImageTag: 'フロアタイル',
      imageKey: 'image-11',
      isReverse: false,
      rows: 1,
      columns: 1,
      description: ''
    }
  },
  methods: {
    ...mapActions([
      'setProperty',
      'windowOpen',
      'windowClose',
      'changePieceInfo'
    ]),
    commit () {
      console.log(this.key)
      this.changePieceInfo({ propName: 'chit', key: this.key, currentImageTag: this.currentImageTag, imageKey: this.imageKey, isReverse: this.isReverse, rows: this.rows, columns: this.columns, description: this.description, isNotice: true })
      this.windowClose('private.display.editChitWindow')
    },
    cancel () {
      this.windowClose('private.display.editChitWindow')
    },
    doReverse () { this.isReverse = !this.isReverse },
    selectImage (key) { this.imageKey = key },
    getImage (key) { return this.getKeyObj(this.storeImages, key).data },
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
    initWindow () {
      console.log(this.key)
      let chitObj = this.getPieceObj('chit', this.key)
      this.currentImageTag = chitObj.currentImageTag
      this.imageKey = chitObj.imageKey
      this.isReverse = chitObj.isReverse
      this.rows = chitObj.rows
      this.columns = chitObj.columns
      this.description = chitObj.description
    }
  },
  computed: mapState({
    ...mapGetters([
      'getPieceObj'
    ]),
    key: state => state.private.display['editChitWindow'].key,
    selectedTagIndexText () {
      const imageList = this.imageList
      const keyObj = this.getKeyObj(imageList, this.imageKey)
      const index = keyObj ? imageList.indexOf(keyObj) + 1 : 0
      return `${index}/${imageList.length}`
    },
    tagList: state => state.public.image.tags.list,
    storeImages: state => state.public.image.list,
    currentImage () { return this.getKeyObj(this.storeImages, this.imageKey).data },
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
  grid-template-columns: 100px 100px 1fr;
  grid-template-rows: auto auto auto 1fr auto;
  grid-template-areas:
      "viewImage  viewImage  choseImage"
      "viewImage  viewImage  imageInfo"
      "viewImage  viewImage  otherText"
      "rowsNum    columnsNum otherText"
      "buttonArea buttonArea buttonArea"
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
.choseImage { grid-area: choseImage; overflow-y: scroll; height: 130px; }
.imageInfo { grid-area: imageInfo; display: flex; }
.imageInfo .selectedImage { flex: 1; display: flex; }
.imageInfo .selectedImage > * { display: flex; align-items: center; justify-content: center; }
.imageInfo .selectedImage select { flex: 1; }
.imageInfo > button { margin-left: 10px; }
.initiativeTable { grid-area: initiativeTable; }
.rowsNum { grid-area: rowsNum; }
.columnsNum { grid-area: columnsNum; }
.size { width: 33px; }
.viewImage { grid-area: viewImage; }
.otherText { grid-area: otherText; resize: none; width: 100%; height: 100%; box-sizing: border-box; }
.buttonArea { grid-area: buttonArea; text-align: center; padding-top: 15px; padding-bottom: 10px; }
.buttonArea > div { display: inline-block; }
input { padding: 2px; }
</style>
