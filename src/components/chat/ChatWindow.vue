<template>
  <WindowFrame titleText="チャット" display-property="private.display.chatWindow" align="left-bottom" baseSize="-300, 240">
    <div class="container">
      <div class="tabs">
        <span class="tab" v-for="(tabObj, index) in chatTabList" :key="tabObj.text" :class="{ active: tabObj.isActive, unRead: tabObj.unRead > 0 }" @click.prevent="chatTabSelect(tabObj.name)" :tabindex="index + 1">{{tabObj.name}}/{{tabObj.unRead}}</span><!--
      --><span class="tab addButton" @click="addTab" :tabindex="chatTabList.length + 1">＋</span>
      </div>
      <ul id="chatLog" @wheel.stop>
        <li v-for="(chatLog, index) in chatLogList" v-html="chatLog.viewHtml" :key="index"></li>
      </ul>
      <div class="oneLine">
        <span class="label">名前</span>
        <input type="text" :value="name" :tabindex="chatTabList.length + 2" @change="changeName">
        <select :tabindex="chatTabList.length + 5"></select>
        <select :tabindex="chatTabList.length + 6" :title="helpMessage" class="diceBotSystem" v-model="currentDiceBotSystem"><option v-for="(systemObj, index) in diceBotSystems" :key="index" :value="systemObj.value">{{systemObj.name}}</option></select>
        <img v-img="require('../../assets/dice.png')" alt='ダイスボット' title='ダイスボットの設定' @click="settingDiceBot" :tabindex="chatTabList.length + 7">
        <img v-img="require('../../assets/font.png')" alt='フォント' title='フォントの設定' @click="settingFont" :tabindex="chatTabList.length + 8">
      </div>
      <div class="sendLine">
        <span class="label">発言</span>
        <textarea id="chatTextArea" v-model="currentMessage" @input="onInput" @keypress.enter.prevent="sendMessage" @keyup.enter.prevent :tabindex="chatTabList.length + 3"></textarea>
        <button :tabindex="chatTabList.length + 4">送信</button>
      </div>
      <div class="inputtingArea">
        <div v-for="peerId in inputtingPeerIdList" :key="peerId"><img v-show="inputtingPeerIdList.length>0" :src="require('../../assets/inputting.gif')" >{{createInputtingMsg(peerId)}}</div>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
// import 'bcdice-js/lib/preload-dicebots'
import { mapState, mapActions } from 'vuex'
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
      inputtingPeerIdList: [],
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
    this.$store.dispatch('changeChatTab', '雑談')
    // this.changeChatTab('雑談')

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
        // console.log(`${diceBot.gameName()}, ${diceBot.gameType()}`)
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

      var elm = document.getElementById('chatLog')
      if (elm) {
        elm.scrollTop = elm.scrollHeight
      }
    }.bind(this), 0)
  },
  methods: {
    ...mapActions([
      'addChatLog',
      'chatTabSelect',
      'windowOpen',
      'setProperty',
      'sendRoomData'
    ]),
    onInput (event) {
      this.sendRoomData({ type: 'NOTICE_INPUT', value: name })
    },
    changeName (event) {
      const name = event.target.value
      this.setProperty({property: 'private.connect.playerName', value: name})
      const myPeerId = this.$store.state.private.connect.peerId
      const members = this.$store.state.public.room.members
      const myMemberObjList = members.filter(memberObj => memberObj.peerId === myPeerId)
      if (myMemberObjList.length > 0) {
        const memberObj = myMemberObjList[0]
        const index = members.indexOf(memberObj)
        this.setProperty({property: `public.room.members.${index}.name`, value: name})
        this.sendRoomData({ type: 'CHANGE_PLAYER_NAME', value: name })
      }
    },
    onFocus () {
      this.$emit('onFocus')
    },
    addTab () {
      this.setProperty({property: 'private.display.unSupportWindow.title', value: 'タブ編集'})
      this.windowOpen('private.display.unSupportWindow')
    },
    settingDiceBot () {
      this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ダイスボット用表管理'})
      this.windowOpen('private.display.unSupportWindow')
    },
    settingFont () {
      this.setProperty({property: 'private.display.unSupportWindow.title', value: 'チャット文字設定'})
      this.windowOpen('private.display.unSupportWindow')
    },
    sendMessage (e) {
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

      // setTimeout(function () {
      //   var elm = document.getElementById('chatLog')
      //   elm.scrollTop = elm.scrollHeight
      // }, 0)
    },
    tabSelect (tabObj) {
      this.currentTab = tabObj.text
      for (let chatTabObj of this.chatTabList) {
        chatTabObj.isActive = chatTabObj.text === tabObj.text
      }
    }
  },
  watch: {
    currentDiceBotSystem () {
      console.log(`ダイスボットシステムを${this.currentDiceBotSystem}に変更`)
      const currentDiceBotSystem = this.currentDiceBotSystem
      const diceObj = this.diceBotSystems.filter(obj => obj.value === currentDiceBotSystem)[0]
      this.bcDice.setDiceBot(diceObj.diceBot)
    },
    chatLogList () {
      setTimeout(function () {
        var elm = document.getElementById('chatLog')
        if (elm) {
          elm.scrollTop = elm.scrollHeight
        }
      }, 0)
    },
    inputting: {
      handler (inputting) {
        this.inputtingPeerIdList.splice(0, this.inputtingPeerIdList.length)
        for (const peerId in inputting) {
          if (inputting[peerId] > 0) {
            this.inputtingPeerIdList.push(peerId)
          }
        }
      },
      deep: true
    }
  },
  computed: mapState({
    chatLogList () {
      return this.$store.getters.chatLogs
    },
    chatTabList: state => state.public.chat.tabs,
    currentCount: 'count',
    name: state => state.private.connect.playerName,
    helpMessage () {
      const currentDiceBotSystem = this.currentDiceBotSystem
      const diceObj = this.diceBotSystems.filter(obj => obj.value === currentDiceBotSystem)[0]
      return diceObj.helpMessage
    },
    inputting: state => state.public.chat.inputting,
    createInputtingMsg: state => peerId => {
      const memberObj = state.public.room.members.filter(memberObj => memberObj.peerId === peerId)[0]
      if (!memberObj) return ''
      return `${memberObj.name ? memberObj.name : '名無し'}が入力中...`
    }
  })
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
.tab.unRead {
  background-color: yellow;
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
.diceBotSystem {
  margin-right: 10px;
}
textarea {
  resize: none;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  width: calc(100% - 85px);
}
.inputtingArea {
  width: 100%;
  height: 20px;
  background-color: transparent;
  font-size: 10px;
}
.inputtingArea div {
  display: inline-flex;
  justify-content: left;
  align-items: center;
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
