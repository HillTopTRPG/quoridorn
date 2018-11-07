<template>
  <WindowFrame titleText="マップ変更" display-property="private.display.editMapWindow" align="center" fixSize="401, 435" @open="initWindow" @reset="initWindow" @cancel="cancel" @close="close">
    <div class="container">
      <div class="choseImage">
        <div class="tagImages"><img v-for="image in imageList" :class="{active : image.key === edit.imageKey}" :key="image.key" v-img="image.data" @click="selectImage(image.key)" draggable="false" /></div>
      </div>
      <div class="imageInfo">
        <div class="selectedImage"><label>タグ名：</label><select class="tagSelect" v-model="edit.imageTag"><option v-for="tagObj in tagList" :key="tagObj.key" :value="tagObj.name">{{tagObj.name}}</option></select><span>{{selectedTagIndexText}}</span></div>
        <button>隠し画像</button>
        <button @click="doReverse">反</button>
      </div>
      <div class="initiativeTable">
      </div>
      <fieldset class="imageAreaSettings">
        <legend>イメージ部分</legend>
        <div>
          <div class="totalRow"><label>縦マス：<input type="number" min="1" class="size" v-model="edit.totalRow" /></label></div>
          <div class="totalColumn"><label>横マス：<input type="number" min="1" class="size" v-model="edit.totalColumn" /></label></div>
          <div class="gridColor"><label>マス目の色：<input type="color" class="size" v-model="edit.gridColor" /></label></div>
        </div>
      </fieldset>
      <fieldset class="marginAreaSettings">
        <legend>余白部分</legend>
        <div>
          <div class="marginGridSize"><label>マス数：<input type="number" min="0" class="size" v-model="edit.marginGridSize" /></label></div>
          <div class="borderWidth"><label>外周罫線の太さ：<input type="number" min="0" class="size" v-model="edit.borderWidth" /></label></div>
          <div class="isUseImage"><label>ぼかし画像：<input type="checkbox" v-model="edit.isUseImage" /></label></div>
        </div>
        <div>
          <div class="isUseGridColor"><label>被せ色：<input type="color" class="size" v-model="edit.maskColor" /><input type="range" class="maskAlpha" min="0" max="1" step="0.1" v-model="edit.maskAlpha" /></label></div>
          <div class="isUseGridColor"><label>方眼罫線：<input type="checkbox" v-model="edit.isUseGridColor" /><input v-show="edit.isUseGridColor" type="color" class="size" v-model="edit.marginGridColor" /></label></div>
        </div>
      </fieldset>
      <fieldset class="backgroundAreaSettings">
        <legend>背景部分</legend>
        <div>
          <div class="backgroundColor"><label>背景色：<input type="color" class="size" v-model="edit.backgroundColor" /></label></div>
        </div>
      </fieldset>
      <div class="buttonArea">
        <div>
          <button @click="commit">確定</button>
          <button @click="cancel">キャンセル</button>
        </div>
        <p>確定ボタンを押下しないとルームメンバーには反映されません。</p>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'editMapWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      edit: {
        imageTag: 'マップ',
        imageKey: 'image-0',
        isReverse: false,
        marginGridSize: 5,
        marginGridColor: '#FFFFFF',
        maskColor: '#145014',
        maskAlpha: 0.1,
        isUseGridColor: true,
        isUseImage: true,
        borderWidth: 20,
        totalColumn: 20,
        totalRow: 15,
        gridColor: '#000000',
        backgroundColor: '#92A8B3'
      },
      original: {
        imageTag: 'マップ',
        imageKey: 'image-0',
        isReverse: false,
        marginGridSize: 5,
        marginGridColor: '#FFFFFF',
        maskColor: '#145014',
        maskAlpha: 0.1,
        isUseGridColor: true,
        isUseImage: true,
        borderWidth: 20,
        totalColumn: 20,
        totalRow: 15,
        gridColor: '#000000',
        backgroundColor: '#92A8B3'
      }
    }
  },
  methods: {
    ...mapActions([
      'setProperty',
      'windowOpen',
      'windowClose'
    ]),
    initWindow () {
      console.log(this.storeMapObj.isEditting, this.peerId)
      if (this.storeMapObj.isEditting && this.storeMapObj.isEditting !== this.peerId) {
        alert('ルームメイトとマップ変更操作が競合しますので、この操作はキャンセルします。')
        this.windowClose('private.display.editMapWindow')
        return
      }
      this.edit.imageTag = this.storeMapObj.imageTag
      this.edit.imageKey = this.storeMapObj.imageKey
      this.edit.isReverse = this.storeMapObj.isReverse
      this.edit.marginGridSize = this.storeMapObj.margin.gridSize
      this.edit.isUseGridColor = this.storeMapObj.margin.isUseGridColor
      this.edit.isUseImage = this.storeMapObj.margin.isUseImage
      this.edit.marginGridColor = this.storeMapObj.margin.gridColor
      this.edit.maskColor = this.storeMapObj.margin.maskColor
      this.edit.maskAlpha = this.storeMapObj.margin.maskAlpha
      this.edit.borderWidth = this.storeMapObj.margin.borderWidth
      this.edit.totalColumn = this.storeMapObj.grid.totalColumn
      this.edit.totalRow = this.storeMapObj.grid.totalRow
      this.edit.gridColor = this.storeMapObj.grid.color
      this.edit.backgroundColor = this.storeMapObj.background

      this.original.imageTag = this.storeMapObj.imageTag
      this.original.imageKey = this.storeMapObj.imageKey
      this.original.isReverse = this.storeMapObj.isReverse
      this.original.marginGridSize = this.storeMapObj.margin.gridSize
      this.original.isUseGridColor = this.storeMapObj.margin.isUseGridColor
      this.original.isUseImage = this.storeMapObj.margin.isUseImage
      this.original.marginGridColor = this.storeMapObj.margin.gridColor
      this.original.maskColor = this.storeMapObj.margin.maskColor
      this.original.maskAlpha = this.storeMapObj.margin.maskAlpha
      this.original.borderWidth = this.storeMapObj.margin.borderWidth
      this.original.totalColumn = this.storeMapObj.grid.totalColumn
      this.original.totalRow = this.storeMapObj.grid.totalRow
      this.original.gridColor = this.storeMapObj.grid.color
      this.original.backgroundColor = this.storeMapObj.background
      this.setProperty({property: 'public.map.isEditting', isNotice: true, value: this.peerId})
    },
    commit () {
      if (this.storeMapObj.isEditting === this.peerId) {
        this.setProperty({
          property: 'public.map',
          isNotice: true,
          value: {
            imageTag: this.edit.imageTag,
            imageKey: this.edit.imageKey,
            isReverse: this.edit.isReverse,
            margin: {
              gridSize: parseInt(this.edit.marginGridSize, 10),
              borderWidth: parseInt(this.edit.borderWidth, 10),
              gridColor: this.edit.marginGridColor,
              isUseGridColor: this.edit.isUseGridColor,
              isUseImage: this.edit.isUseImage,
              maskColor: this.edit.maskColor,
              maskAlpha: parseFloat(this.edit.maskAlpha)
            },
            grid: {
              totalColumn: parseInt(this.edit.totalColumn, 10),
              totalRow: parseInt(this.edit.totalRow, 10),
              color: this.edit.gridColor
            },
            background: this.edit.backgroundColor,
            isEditting: false
          }
        })
      } else {
        alert('ルームメイトとマップ変更操作が競合しますので、この操作はキャンセルします。')
      }
      this.setProperty({property: 'public.map.isEditting', isNotice: true, value: null})
      this.windowClose('private.display.editMapWindow')
    },
    cancel () {
      if (this.storeMapObj.isEditting === this.peerId) {
        this.setProperty({
          property: 'public.map',
          isNotice: true,
          value: {
            imageTag: this.original.imageTag,
            imageKey: this.original.imageKey,
            isReverse: this.original.isReverse,
            margin: {
              gridSize: parseInt(this.original.marginGridSize, 10),
              borderWidth: parseInt(this.original.borderWidth, 10),
              gridColor: this.original.marginGridColor,
              isUseGridColor: this.original.isUseGridColor,
              isUseImage: this.original.isUseImage,
              maskColor: this.original.maskColor,
              maskAlpha: parseFloat(this.original.maskAlpha)
            },
            grid: {
              totalColumn: parseInt(this.original.totalColumn, 10),
              totalRow: parseInt(this.original.totalRow, 10),
              color: this.original.gridColor
            },
            background: this.original.backgroundColor,
            isEditting: false
          }
        })
      }
      this.windowClose('private.display.editMapWindow')
    },
    close () {
      this.setProperty({property: 'public.map.isEditting', isNotice: true, value: null})
    },
    doReverse () { this.edit.isReverse = !this.edit.isReverse },
    selectImage (key) { this.edit.imageKey = key },
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
  watch: {
    'edit.imageTag': function (imageTag) {
      this.setProperty({property: 'public.map.imageTag', value: imageTag})
    },
    'edit.imageKey': function (imageKey) {
      this.setProperty({property: 'public.map.imageKey', value: imageKey})
    },
    'edit.isReverse': function (isReverse) {
      this.setProperty({property: 'public.map.isReverse', value: isReverse})
    },
    'edit.marginGridSize': function (marginGridSize) {
      this.setProperty({property: 'public.map.margin.gridSize', value: parseInt(marginGridSize, 10)})
    },
    'edit.isUseGridColor': function (isUseGridColor) {
      this.setProperty({property: 'public.map.margin.isUseGridColor', value: isUseGridColor})
    },
    'edit.isUseImage': function (isUseImage) {
      this.setProperty({property: 'public.map.margin.isUseImage', value: isUseImage})
    },
    'edit.marginGridColor': function (marginGridColor) {
      this.setProperty({property: 'public.map.margin.gridColor', value: marginGridColor})
    },
    'edit.maskColor': function (maskColor) {
      this.setProperty({property: 'public.map.margin.maskColor', value: maskColor})
    },
    'edit.maskAlpha': function (maskAlpha) {
      this.setProperty({property: 'public.map.margin.maskAlpha', value: parseFloat(maskAlpha)})
    },
    'edit.borderWidth': function (borderWidth) {
      this.setProperty({property: 'public.map.margin.borderWidth', value: parseInt(borderWidth, 10)})
    },
    'edit.totalColumn': function (totalColumn) {
      this.setProperty({property: 'public.map.grid.totalColumn', value: parseInt(totalColumn, 10)})
    },
    'edit.totalRow': function (totalRow) {
      this.setProperty({property: 'public.map.grid.totalRow', value: parseInt(totalRow, 10)})
    },
    'edit.gridColor': function (gridColor) {
      this.setProperty({property: 'public.map.grid.color', value: gridColor})
    },
    'edit.backgroundColor': function (backgroundColor) {
      this.setProperty({property: 'public.map.background', value: backgroundColor})
    }
  },
  computed: mapState({
    ...mapGetters([]),
    selectedTagIndexText () {
      const imageList = this.imageList
      const keyObj = this.getKeyObj(imageList, this.edit.imageKey)
      const index = keyObj ? imageList.indexOf(keyObj) + 1 : 0
      return `${index}/${imageList.length}`
    },
    tagList: state => state.public.image.tags.list,
    storeImages: state => state.public.image.list,
    currentImage () { return this.getKeyObj(this.storeImages, this.edit.imageKey).data },
    imageList () {
      return this.$store.state.public.image.list.filter((obj) => {
        if (this.edit.imageTag === '(全て)') { return true }
        return obj.tag.indexOf(this.edit.imageTag) >= 0
      })
    },
    storeMapObj: state => state.public.map,
    peerId: state => state.private.connect.peerId
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  margin: 0;
  padding: 0;
  font-size: 10px;
}
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  font-size: 12px;
  position: absolute;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto auto auto auto;
  grid-template-areas:
      "choseImage"
      "imageInfo"
      "imageAreaSettings"
      "marginAreaSettings"
      "backgroundAreaSettings"
      "buttonArea";
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
fieldset {
  padding: 0;
}
legend {
  margin-left: 10px;
}
fieldset > div {
  display: flex;
  display: -moz-flex;
  display: -o-flex;
  display: -webkit-flex;
  display: -ms-flex;
  flex-direction: row;
  -moz-flex-direction: row;
  -o-flex-direction: row;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  height: 2.2em;
  margin-bottom: 5px;
}
fieldset > div > div {
  display: inline-block;
  white-space: nowrap;
  margin-left: 10px;
}
fieldset > div > div > label {
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  display: flex;
  display: -moz-flex;
  display: -o-flex;
  display: -webkit-flex;
  display: -ms-flex;
  align-items: center;
  justify-content: center;
}
/* .container > * { padding: 1px 0; } */
.viewImage { grid-area: viewImage; }
.viewImage img { display: inline-block; width: 200px; height: 200px; }
.choseImage { grid-area: choseImage; overflow-y: scroll; height: 130px; }
.imageInfo { grid-area: imageInfo; display: flex; }
.imageInfo .selectedImage { flex: 1; display: flex; }
.imageInfo .selectedImage > * { display: flex; align-items: center; justify-content: center; }
.imageInfo .selectedImage select { flex: 1; }
.imageInfo > button { margin-left: 10px; }
.initiativeTable { grid-area: initiativeTable; }
.imageAreaSettings { grid-area: imageAreaSettings; }
.marginAreaSettings { grid-area: marginAreaSettings; }
.backgroundAreaSettings { grid-area: backgroundAreaSettings; }
/*
.totalRow { grid-area: totalRow; }
.totalColumn { grid-area: totalColumn; }
.marginGridSize { grid-area: marginGridSize; }
.borderWidth { grid-area: borderWidth; }
.marginGridColor { grid-area: marginGridColor; }
.backgroundColor { grid-area: backgroundColor; }
.gridColor { grid-area: gridColor; }
*/
.size { width: 33px; }
.maskAlpha { width: 66px; background-color: red; border: 1px solid red; }
.viewImage { grid-area: viewImage; }
.otherText { grid-area: otherText; resize: none; width: 100%; height: 100%; box-sizing: border-box; }
.buttonArea { grid-area: buttonArea; text-align: center; padding-top: 15px; padding-bottom: 10px; }
.buttonArea > div { display: inline-block; }
input { padding: 2px; margin: 0; }
</style>
