<template>
  <WindowFrame titleText="共有メモ" display-property="publicMemoWindow" align="center" baseSize="300, 240" @open="open">
    <div class="tabs">
      <span class="tab" v-for="(textObj, index) in texts" :key="index" @mousedown.prevent="selectTab(textObj.tab)">{{textObj.tab}}</span><!--
    --><span class="tab addButton" @click="addTab">＋</span>
    </div>
    <div class="sendLine">
      <span class="label">メモ:</span>
      <textarea v-model="currentText"></textarea>
    </div>
    <button @click.prevent="clickAdd">追加</button><button @click.prevent="clickCancel">キャンセル</button>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'publicMemo',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      texts: [
        {tab: 'メイン', text: ''}
      ],
      currentText: ''
    }
  },
  methods: {
    ...mapMutations([
      'chatTabSelect',
      'addChatLog',
      'windowOpen',
      'setProperty'
    ]),
    open: function () {
      // TODO get data
    },
    addTab: function () {
      let tabs = ''
      this.texts.forEach(function (textObj, index) {
        textObj.replace(/"/g, '\\"')
        tabs += `"${textObj.tab}",`
      })
      tabs = tabs.substr(0, tabs.length - 1)

      this.setProperty({property: 'publicMemo.editTab', value: tabs})
      this.setProperty({property: 'display.unSupportWindow.title', value: 'タブ編集'})
      this.windowOpen('unSupportWindow')
    },
    tabSelect: function (tabObj) {
      this.currentTab = tabObj.text
      for (let chatTabObj of this.chatTabList) {
        chatTabObj.isActive = chatTabObj.text === tabObj.text
      }
    },
    clickAdd: function () {
      this.setProperty({property: 'display.unSupportWindow.title', value: 'ダイスボット用表管理'})
      this.windowOpen('unSupportWindow')
    },
    clickCancel: function () {
      this.setProperty({property: 'display.unSupportWindow.title', value: 'チャット文字設定'})
      this.windowOpen('unSupportWindow')
    }
  },
  computed: {
    ...mapGetters([
      'isWindowOpen',
      'doResetPosition'
    ]),
    chatLogList: function () {
      return this.$store.state.publicMemo
    },
    chatTabList: function () {
      return this.$store.state.chat.tabs
    },
    currentCount: function () {
      return this.$store.state.count
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabs {
  display: inline-block;
}
.tab {
  position: relative;
  display: inline;
  font-size: 10px;
  background: linear-gradient(rgba(240, 240, 240, 1), rgba(0, 0, 0, 0.2));
  padding: 4px 10px;
  border-style: solid;
  border-width: 1px 1px 0px 1px;
  border-color: gray;
  border-radius: 5px 5px 0px 0px;
  margin-right: -1px;
  z-index: 10;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.tab.addButton {
  margin-left: 100px;
  cursor: pointer;
}
.tab.active,
.tab:active {
  background: none;
  background-color: white;
}
.tab:hover {
  border-color: #0092ED;
  z-index: 100;
}
.log {
  display: block;
  margin-top: 0px;
  background-color: white;
  flex: 1;
-moz-box-flex: 1;
  -webkit-box-flex: 1;
  border-style: solid;
  border-width: 1px 1px 1px 1px;
  border-color: gray;
  overflow-y: scroll;
  overflow-x: auto;
  margin: 0;
  padding-left: 2px;
  list-style: none;
  font-size: 13px;
  min-height: 70px;
  position: relative;
  z-index: 0;
}
.log li:last-child {
  margin-bottom: 100px;
}
.label {
  font-size: 10px;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.oneLine {
  height: 26px;
  min-height: 26px;
  padding: 3px 0;
}
.oneLine * {
  vertical-align: middle;
}
.sendLine {
}
.sendLine * {
  display: inline;
  height: 42px;
  min-height: 42px;
  vertical-align: middle;
}
textarea {
  width: calc(100% - 85px);
  resize: none;
}
img {
  width:auto;
  height:auto;
  max-width:100%;
  max-height:100%;
  cursor: pointer;
  margin: 0 10px;
  border: solid rgba(0, 0, 0, 0) 1px;
}
img:hover {
  border-color: #0092ED;
}

</style>
