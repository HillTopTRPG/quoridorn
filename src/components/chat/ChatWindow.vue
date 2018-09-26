<template>
  <WindowFrame title="チャット" display-property="chatWindow" align="left-bottom" baseSize="-300, 240">
    <div class="tabs">
      <span class="tab" v-for="(tabObj, index) in chatTabList" :key="tabObj.text" :class="{ active: tabObj.isActive }" @mousedown.prevent="chatTabSelect(tabObj.name)" :tabindex="index + 1">{{tabObj.name}}/0</span><!--
    --><span class="tab addButton" @click="addTab" :tabindex="chatTabList.length + 1">＋</span>
    </div>
    <ul id="chatLog" @wheel.stop>
      <li v-for="(chatLog, index) in chatLogList" v-html="chatLog.viewHtml" :key="index"></li>
    </ul>
    <div class="oneLine">
      <span class="label">名前</span>
      <input type="text" v-model="name" :tabindex="chatTabList.length + 2">
      <select :tabindex="chatTabList.length + 5"></select>
      <select :tabindex="chatTabList.length + 6" class="diceBotSystem" v-model="currentDiceBotSystem"><option v-for="(systemObj, index) in diceBotSystems" :key="index" :value="systemObj.value">{{systemObj.name}}</option></select>
      <img src="../../assets/dice.png" alt='ダイスボット' title='ダイスボットの設定' @click="settingDiceBot" :tabindex="chatTabList.length + 7">
      <img src="../../assets/font.png" alt='フォント' title='フォントの設定' @click="settingFont" :tabindex="chatTabList.length + 8">
    </div>
    <div class="sendLine">
      <span class="label">発言</span>
      <textarea v-model="currentMessage" @keydown.enter.prevent="sendMessage" @keyup.enter.prevent :tabindex="chatTabList.length + 3"></textarea>
      <button :tabindex="chatTabList.length + 4">送信</button>
    </div>
  </WindowFrame>
</template>

<script>
// import 'bcdice-js/lib/preload-dicebots'
import { mapMutations } from 'vuex'
import WindowFrame from '../WindowFrame'
import BCDice, { DiceBotLoader } from 'bcdice-js' // ES Modules

export default {
  name: 'chat',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      diceBotSystems: [],
      currentMessage: '',
      currentDiceBotSystem: '',
      bcDice: new BCDice(),
      name: ''
    }
  },
  created () {
    this.$store.commit('changeChatTab', '雑談')

    this.diceBotSystems.push({
      name: 'ダイスボット(指定なし)',
      value: ''
    })
    setTimeout(function () {
      DiceBotLoader.collectDiceBots().forEach(function (diceBot) {
        this.diceBotSystems.push({
          name: diceBot.gameName(),
          value: diceBot.gameType()
        })
      }.bind(this))

      setTimeout(function () {
        var elm = document.getElementById('chatLog')
        elm.scrollTop = elm.scrollHeight
      }, 0)
    }.bind(this), 0)
  },
  methods: {
    ...mapMutations([
      'chatTabSelect',
      'addChatLog',
      'windowOpen',
      'setProperty'
    ]),
    addTab: function () {
      this.setProperty({property: 'display.unSupportWindow.title', value: 'タブ編集'})
      this.windowOpen('unSupportWindow')
    },
    settingDiceBot: function () {
      this.setProperty({property: 'display.unSupportWindow.title', value: 'ダイスボット用表管理'})
      this.windowOpen('unSupportWindow')
    },
    settingFont: function () {
      this.setProperty({property: 'display.unSupportWindow.title', value: 'チャット文字設定'})
      this.windowOpen('unSupportWindow')
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

      this.bcDice.setMessage(this.currentMessage)
      const resultObj = this.bcDice.dice_command()
      const diceResult = resultObj[0].replace(/(^: )/g, '').replace(/＞/g, '→')
      const isSecret = resultObj[1]
      if (diceResult !== '1') {
        this.addChatLog({
          name: this.name,
          text: diceResult,
          color: 'black'
        })
      }
      if (isSecret) {
        this.addChatLog({
          name: this.name,
          text: `シークレットダイス`,
          color: 'black'
        })
      }
      this.currentMessage = ''

      setTimeout(function () {
        var elm = document.getElementById('chatLog')
        elm.scrollTop = elm.scrollHeight
      }, 0)
    },
    tabSelect: function (tabObj) {
      this.currentTab = tabObj.text
      for (let chatTabObj of this.chatTabList) {
        chatTabObj.isActive = chatTabObj.text === tabObj.text
      }
    }
  },
  watch: {
    currentDiceBotSystem: function () {
      console.log(`ダイスボットシステムを${this.currentDiceBotSystem}に変更`)
      this.bcDice.setGameByTitle(this.currentDiceBotSystem)
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
#chatLog {
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
  white-space: normal;
  word-break: break-all;
  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
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
