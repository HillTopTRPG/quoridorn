<template>
  <WindowBase title="チャット">
    <div class="tabs">
      <span class="tab" v-for="tabObj in chatTabList" :key="tabObj.text" :class="{ active: tabObj.isActive, hover: tabObj.isHover }" @mouseover.prevent="tabHover(tabObj, true)" @mouseout.prevent="tabHover(tabObj, false)" @mousedown.prevent="tabSelect(tabObj)">{{tabObj.text}}/0</span><!--
    --><span class="tab addButton" @click="addTab">＋</span>
    </div>
    <ul class="log">
      <li v-for="(chatLog, index) in currentTabLogs" v-html="chatLog.viewHtml" :key="index"></li>
    </ul>
    <div class="oneLine">
      <span class="label">名前</span>
      <input type="text" v-model="name">
      <select></select>
      <select></select>
      <img src="../assets/dice.png" alt='ダイスボット' title='ダイスボットの設定'>
    </div>
    <div class="sendLine">
      <span class="label">発言</span>
      <textarea v-model="currentMessage" @keydown.enter.prevent="sendMessage" @keyup.enter.prevent></textarea>
      <button>送信</button>
    </div>
  </WindowBase>
</template>

<script>
import WindowBase from './WindowBase'

export default {
  name: 'chat',
  mixins: [WindowBase],
  components: {
    WindowBase: WindowBase
  },
  data () {
    return {
      chatTabList: [
        {
          text: 'メイン',
          isActive: true,
          isHover: false
        },
        {
          text: '雑談',
          isActive: false,
          isHover: false
        }
      ],
      chatLogList: {
        'メイン': [
          {
            peerId: 12345,
            text: '課題',
            viewHtml: '<b>SYSTEM</b>：abcdefgだぜぇ'
          },
          {
            peerId: 12345,
            text: 'おはようございますだぜぇ',
            viewHtml: '<span style="color: green;"><b>SYSTEM</b>：おはようございますだぜぇ</span>'
          },
          {
            peerId: 12345,
            text: 'おはようございますだぜぇ',
            viewHtml: '<span style="color: green;"><b>SYSTEM</b>：おはようございますだぜぇ</span>'
          },
          {
            peerId: 12345,
            text: 'おはようございますだぜぇ',
            viewHtml: '<span style="color: green;"><b>SYSTEM</b>：おはようございますだぜぇ</span>'
          },
          {
            peerId: 12345,
            text: 'おはようございますだぜぇ',
            viewHtml: '<span style="color: green;"><b>SYSTEM</b>：おはようございますだぜぇ</span>'
          }
        ],
        '雑談': [
        ]
      },
      currentTab: 'メイン',
      currentMessage: '',
      name: ''
    }
  },
  methods: {
    addTab: function () {
      alert('タブの追加は未実装')
    },
    sendMessage: function (e) {
      if (e.shiftKey || e.ctrlKey) {
        this.currentMessage += '\r\n'
        return
      }
      let htmlText = '<b>' + this.name + '</b>：' + this.currentMessage.replace(/\r?\n/g, '<br>')
      console.log(htmlText)
      if (!this.chatLogList[this.currentTab]) {
        this.chatLogList[this.currentTab] = []
        this.chatLogList = this.chatLogList
      }
      this.chatLogList[this.currentTab].push({
        peerId: 12345,
        text: this.currentMessage,
        viewHtml: htmlText
      })
      this.currentMessage = ''
    },
    tabHover: function (tabObj, flg) {
      tabObj.isHover = flg
    },
    tabSelect: function (tabObj) {
      this.currentTab = tabObj.text
      for (let chatTabObj of this.chatTabList) {
        chatTabObj.isActive = chatTabObj.text === tabObj.text
      }
    }
  },
  computed: {
    currentTabLogs: function () {
      return this.chatLogList[this.currentTab]
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
  box-flex: 1;
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
