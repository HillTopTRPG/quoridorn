<template>
  <WindowFrame titleText="部屋データ読込" display-property="private.display.dropZipWindow" align="center" fixSize="385, 660">
    <div class="contents">
      <div v-if="!saveDataList">部屋データを読み込んでいます...</div>
      <div v-if="saveDataList">複数のセーブデータで同じ項目を読み込ませる場合、各セーブデータで順次上書きされていきます。</div>
      <fieldset v-if="saveDataList" v-for="(saveDataObj, index) in saveDataList" :key="index">
        <legend>{{saveDataObj.fileName}}</legend>
        <button @click="allSelect(index)">全て対象</button><button @click="allDisSelect(index)">全て除外</button>
        <div class="useCheckList">
          <label v-for="propObj in saveDataObj.useList" :key="propObj.label">
            <input type="checkbox" v-model="propObj.isUse" />
            {{propObj.label}}
          </label>
        </div>
      </fieldset>
      <div class="operateArea">
        <button @click="commit" :disabled="!saveDataList">決定</button>
        <button @click="cancel" :disabled="!saveDataList">キャンセル</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'dropImageWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      saveDataList: null
    }
  },
  methods: {
    ...mapMutations([
      'windowClose',
      'windowOpen',
      'doImport'
    ]),
    commit: function () {
      const importData = {
        private: this.$store.state.private,
        public: {}
      }
      console.log('#### ', this.saveDataList)
      this.saveDataList.forEach(saveData => {
        const propProc = (target, props) => {
          for (const prop in props) {
            const val = props[prop]
            if (!(val instanceof Object) || (val instanceof Array)) {
              target[prop] = val
            } else {
              if (!target[prop]) {
                target[prop] = {}
              }
              // console.log(target[prop], val)
              propProc(target[prop], val)
            }
          }
        }
        saveData.useList.forEach(useObj => {
          if (!useObj.isUse) { return }
          const target = useObj.target
          let toObj = importData.public
          let fromObj = saveData.saveData.public
          const props = target.split('.')
          props.forEach(prop => {
            if (toObj === null) return
            if (!toObj[prop]) {
              if (fromObj[prop] instanceof Array) {
                toObj[prop] = fromObj[prop]
                toObj = null
                return
              } else {
                toObj[prop] = {}
              }
            }
            toObj = toObj[prop]
            fromObj = fromObj[prop]
          })
          // console.log('$$ ', toObj, fromObj, importData)
          if (toObj) {
            propProc(toObj, fromObj)
          }
        })
        propProc(importData.private, saveData.saveData.private)
      })
      this.doImport(importData)
      console.log(importData, this.members)
      this.windowClose('private.display.dropZipWindow')
    },
    cancel: function () {
      this.windowClose('private.display.dropZipWindow')
    },
    allSelect: function (index) {
      const useList = this.saveDataList[index].useList
      useList.forEach((useObj, ind) => {
        useObj.isUse = true
        useList.splice(ind, 1, useObj)
      })
    },
    allDisSelect: function (index) {
      const useList = this.saveDataList[index].useList
      useList.forEach((useObj, ind) => {
        useObj.isUse = false
        useList.splice(ind, 1, useObj)
      })
    }
  },
  watch: {
    storeZipList: function (newValue, oldValue) {
      this.saveDataList = []
      if (!newValue) {
        return
      }
      newValue.forEach(saveDataObj => {
        const useList = []
        const publicData = saveDataObj.saveData.public
        if (publicData.setting) {
          useList.push({ label: '設定情報(マス目表示、回転マーカーの表示など)', isUse: true, target: 'setting' })
        }
        if (publicData.room) {
          useList.push({ label: '部屋情報(継続卓なら必須)', isUse: true, target: 'room' })
        }
        if (publicData.chat) {
          useList.push({ label: 'チャット履歴(部屋情報とセットで)', isUse: true, target: 'chat' })
        }
        if (publicData.images) {
          useList.push({ label: '画像情報', isUse: true, target: 'images' })
        }
        if (publicData.map) {
          useList.push({ label: 'マップ情報(画像情報とセットで)', isUse: true, target: 'map' })
        }
        if (publicData.mapMasks) {
          useList.push({ label: 'マップマスク情報(画像情報とセットで)', isUse: true, target: 'mapMasks' })
        }
        if (publicData.characters) {
          useList.push({ label: 'キャラクター情報(画像情報とセットで)', isUse: true, target: 'characters' })
        }
        if (publicData.publicMemo) {
          useList.push({ label: '共有メモ', isUse: true, target: 'publicMemo' })
        }
        this.saveDataList.push({
          fileName: saveDataObj.fileName,
          useList: useList,
          saveData: saveDataObj.saveData
        })
      })
    }
  },
  computed: {
    ...mapGetters([]),
    storeZipList: function () {
      return this.$store.state.private.display.dropZipWindow.zipList
    },
    members: function () {
      return this.$store.state.public.room.members
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
  overflow-y: auto;
  font-size: 12px;
}
fieldset > div {
  display: grid;
  width: 100%;
  height: 100%;
  /*
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto 1fr auto auto;
  grid-template-areas:
      "viewImage passwordButton passwordButton"
      "viewImage passwordLabel  passwordLabel"
      "viewImage .............. .............."
      "tagLabel  tagLabel       tagLabel"
      "tagInput  tagInput       tagSelect";
  */
}
</style>
