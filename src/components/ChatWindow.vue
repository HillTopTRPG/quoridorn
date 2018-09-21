<template>
  <WindowBase title="チャット" displayPropery="chatWindow" align="left-bottom" baseSize="-200, 200">
    <div class="tabs">
      <span class="tab" v-for="tabObj in chatTabList" :key="tabObj.text" :class="{ active: tabObj.isActive }" @mousedown.prevent="chatTabSelect(tabObj.name)">{{tabObj.name}}/0</span><!--
    --><span class="tab addButton" @click="addTab">＋</span>
    </div>
    <ul class="log">
      <li v-for="(chatLog, index) in chatLogList" v-html="chatLog.viewHtml" :key="index"></li>
    </ul>
    <div class="oneLine">
      <span class="label">名前</span>
      <input type="text" v-model="name">
      <select></select>
      <select></select>
      <img src="../assets/dice.png" alt='ダイスボット' title='ダイスボットの設定'>
      <img src="../assets/font.png" alt='フォント' title='フォントの設定'>
    </div>
    <div class="sendLine">
      <span class="label">発言</span>
      <textarea v-model="currentMessage" @keydown.enter.prevent="sendMessage" @keyup.enter.prevent></textarea>
      <button>送信</button>
    </div>
  </WindowBase>
</template>

<script>
import { mapMutations } from 'vuex'
import WindowBase from './WindowBase'

export default {
  name: 'chat',
  mixins: [WindowBase],
  components: {
    WindowBase: WindowBase
  },
  created () {
    this.$store.commit('changeChatTab', '雑談')
  },
  data () {
    return {
      currentMessage: '',
      name: ''
    }
  },
  methods: {
    ...mapMutations([
      'chatTabSelect',
      'addChatLog'
    ]),
    addTab: function () {
      alert('タブの追加は未実装')
    },
    sendMessage: function (e) {
      if (e.shiftKey || e.ctrlKey) {
        this.currentMessage += '\r\n'
        return
      }
      this.addChatLog({
        name: this.name,
        text: this.currentMessage,
        color: 'black'
      })
      this.currentMessage = ''
    },
    tabSelect: function (tabObj) {
      this.currentTab = tabObj.text
      for (let chatTabObj of this.chatTabList) {
        chatTabObj.isActive = chatTabObj.text === tabObj.text
      }
    }
  },
  computed: {
    chatLogList: function () {
      return this.$store.getters.chatLogs
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
