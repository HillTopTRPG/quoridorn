<template>
  <WindowFrame titleText="画像データ登録" display-property="dropChooseWindow" align="center" fixSize="385, 660">
    <div class="contents">
      <div v-if="!imageList">画像読込中...</div>
      <fieldset v-if="imageList" v-for="imageObj in imageList" :key="imageObj.key">
        <legend>{{imageObj.name}}</legend>
        <div>
          <img class="image" v-img="imageObj.image" draggable="false" />
          <button class="passwordButton">隠し画像パスワード設定</button>
          <label class="passwordLabel">隠し画像パスワード：{{imageObj.password !== '' ? 'あり' : 'なし'}}</label>
          <span class="tagLabel">付与するタグ(半角・全角スペースで区切り)</span>
          <input class="tagInput" type="text" @change="changeTag(imageObj.key)" v-model="imageObj.currentTag" />
          <select class="tagSelect" list="dropChooseWindowTags" @change="selectTag(imageObj.key)" v-model="imageObj.selectTag">
          <!-- <datalist id="dropChooseWindowTags"> -->
            <option v-for="tagObj in tagList" :key="tagObj.key" :value="tagObj.name">{{tagObj.name}}</option>
          <!-- </datalist> -->
          </select>
        </div>
      </fieldset>
      <div class="operateArea">
        <button @click="commit" :disabled="!imageList">決定</button>
        <button @click="cancel" :disabled="!imageList">キャンセル</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'dropChooseWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      imageList: null
    }
  },
  methods: {
    ...mapMutations([
      'windowActive',
      'imageTagChange',
      'addImage',
      'windowClose'
    ]),
    commit: function () {
      this.imageList.forEach(imageObj => {
        this.addImage({
          tag: imageObj.currentTag,
          image: imageObj.image
        })
      })
      this.windowClose('dropChooseWindow')
    },
    cancel: function () {
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
    changeTag: function (key) {
      this.imageList.forEach(imageObj => {
        console.log(`@@@@  ` + imageObj.currentTag)
      })
      this.imageTagChange({key: key, imageList: this.imageList})
    },
    selectTag: function (key) {
      const imgObj = this.getKeyObj(this.imageList, key)
      imgObj.currentTag = imgObj.selectTag
      this.imageList.forEach(imageObj => {
        console.log(`++++++  ` + imageObj.currentTag)
      })
      this.imageTagChange({key: key, imageList: this.imageList})
    }
  },
  watch: {
    storeImageList: function (newValue, oldValue) {
      this.imageList = []
      newValue.forEach(imgObj => {
        this.imageList.push({
          image: imgObj.image,
          name: imgObj.name,
          key: imgObj.key,
          currentTag: 'キャラクター',
          selectTag: 'キャラクター',
          password: ''
        })
      })
    }
  },
  computed: {
    ...mapGetters([
    ]),
    storeImageList: function () {
      return this.$store.state.display.dropChooseWindow.imageDataList
    },
    tagList: function () {
      const result = this.$store.state.images.tags.concat()
      result.shift()
      return result
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 12px;
}
fieldset > div {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto 1fr auto auto;
  grid-template-areas:
      "viewImage passwordButton passwordButton"
      "viewImage passwordLabel  passwordLabel"
      "viewImage .............. .............."
      "tagLabel  tagLabel       tagLabel"
      "tagInput  tagInput       tagSelect";
}
button {
  font-size: 11px;
}
legend {
}
input {
  display: inline;
}
.password {
  width: 100px;
}
.image {
  grid-area: viewImage;
  width: 96px;
  height: 96px;
  border: solid gray 1px;
}
.passwordButton {
  grid-area: passwordButton;
}
.passwordLabel {
  grid-area: passwordLabel;
}
.tagLabel {
  grid-area: tagLabel;
}
.tagInput {
  margin-right: 5px;
  grid-area: tagInput;
}
.tagSelect {
  grid-area: tagSelect;
}
.operateArea {
  vertical-align: middle;
  text-align: center;
  margin-top: 10px;
}
</style>
