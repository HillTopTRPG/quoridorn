<template>
  <WindowFrame titleText="チャット" display-property="chatWindow" align="left-bottom" baseSize="-300, 240">
    <div class="container">
      <div class="tabs">
        <span class="tab" v-for="(tabObj, index) in chatTabList" :key="tabObj.text" :class="{ active: tabObj.isActive }" @click.prevent="chatTabSelect(tabObj.name)" :tabindex="index + 1">{{tabObj.name}}/0</span><!--
      --><span class="tab addButton" @click="addTab" :tabindex="chatTabList.length + 1">＋</span>
      </div>
      <ul id="chatLog" @wheel.stop>
        <li v-for="(chatLog, index) in chatLogList" v-html="chatLog.viewHtml" :key="index"></li>
      </ul>
      <div class="oneLine">
        <span class="label">名前</span>
        <input type="text" v-model="name" :tabindex="chatTabList.length + 2">
        <select :tabindex="chatTabList.length + 5"></select>
        <select :tabindex="chatTabList.length + 6" :title="helpMessage" class="diceBotSystem" v-model="currentDiceBotSystem"><option v-for="(systemObj, index) in diceBotSystems" :key="index" :value="systemObj.value">{{systemObj.name}}</option></select>
        <img v-img="require('../../assets/dice.png')" alt='ダイスボット' title='ダイスボットの設定' @click="settingDiceBot" :tabindex="chatTabList.length + 7">
        <img v-img="require('../../assets/font.png')" alt='フォント' title='フォントの設定' @click="settingFont" :tabindex="chatTabList.length + 8">
      </div>
      <div class="sendLine">
        <span class="label">発言</span>
        <textarea v-model="currentMessage" @keydown.enter.prevent="sendMessage" @keyup.enter.prevent :tabindex="chatTabList.length + 3"></textarea>
        <button :tabindex="chatTabList.length + 4">送信</button>
      </div>
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
      currentDiceBotSystem: 'DiceBot',
      bcDice: new BCDice(),
      name: '',
      baseHelpMessage:
        '【ダイスボット】チャットにダイス用の文字を入力するとダイスロールが可能\n' +
        '入力例）2d6+1 攻撃！\n' +
        '上記のようにダイス文字の後ろに空白を入れて発信することも可能\n' +
        '以下、使用例\n' +
        '　3D6+1>=9 ：3d6+1で目標値9以上かの判定\n' +
        '　1D100<=50 ：D100で50%目標の下方ロールの例\n' +
        '　3U6[5] ：3d6のダイス目が5以上の場合に振り足しして合計する(上方無限)\n' +
        '　3B6 ：3d6のダイス目をバラバラのまま出力する（合計しない）\n' +
        '　10B6>=4 ：10d6を振り4以上のダイス目の個数を数える\n' +
        '　(8/2)D(4+6)<=(5*3) ：個数・ダイス・達成値には四則演算も使用可能\n' +
        '　C(10-4*3/2+2) ：C(計算式)で計算だけの実行も可能\n' +
        '　choice[a,b,c] ：列挙した要素から一つを選択表示。ランダム攻撃対象決定などに\n' +
        '　S3d6 ：各コマンドの先頭に「S」を付けると他人から結果が見えないシークレットロール\n' +
        '　3d6/2 ：ダイス出目を割り算（切り捨て）。切り上げは /2U、四捨五入は /2R。\n' +
        '　D66 ：D66ダイス。順序はゲームに依存。D66N：そのまま、D66S：昇順\n'
    }
  },
  created () {
    this.$store.commit('changeChatTab', '雑談')

    this.diceBotSystems.push({
      name: 'ダイスボット(指定なし)',
      value: 'DiceBot',
      helpMessage:
        this.baseHelpMessage +
        `==【ダイスボット(指定なし)専用】====================\n` +
        'ゲーム固有の判定がある場合はこの場所に記載されます。'
    })
    setTimeout(function () {
      // console.log(`bcdice-js ダイスボット一覧`)
      DiceBotLoader.collectDiceBots().forEach(function (diceBot) {
        // console.log(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`)
        this.diceBotSystems.push({
          name: diceBot.gameName(),
          value: diceBot.gameType(),
          diceBot: diceBot,
          helpMessage:
            this.baseHelpMessage +
            `==【${diceBot.gameName()}専用】====================\n` +
            diceBot.getHelpMessage()
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
    onFocus: function () {
      this.$emit('onFocus')
    },
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
        if (isSecret) {
          this.addChatLog({
            name: this.currentDiceBotSystem,
            text: `シークレットダイス`,
            color: 'black'
          })
        } else {
          this.addChatLog({
            name: this.currentDiceBotSystem,
            text: diceResult,
            color: 'black'
          })
        }
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
      const currentDiceBotSystem = this.currentDiceBotSystem
      const diceObj = this.diceBotSystems.filter(obj => obj.value === currentDiceBotSystem)[0]
      this.bcDice.setDiceBot(diceObj.diceBot)
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
    },
    helpMessage: function () {
      const currentDiceBotSystem = this.currentDiceBotSystem
      const diceObj = this.diceBotSystems.filter(obj => obj.value === currentDiceBotSystem)[0]
      return diceObj.helpMessage
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-box;
  display: -ms-flexbox;
  flex-direction: column;
}
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
  vertical-align: middle;
}
.oneLine * {
  vertical-align: middle;
  padding: 2px
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
.diceBotSystem {
  margin-right: 10px;
}
img {
  width:auto;
  height:auto;
  max-width:20px;
  max-height:20px;
  cursor: pointer;
  margin: 0 2px;
  border: solid rgba(0, 0, 0, 0) 1px;
}
img:hover {
  border-color: #0092ED;
}

</style>
