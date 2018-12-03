<template>
  <WindowFrame titleText="チャット" display-property="private.display.chatWindow" align="left-bottom" baseSize="-300, 240" :fontSizeBar="true">
    <div class="container">
      <!----------------
       ! タブ
       !--------------->
      <div class="tabs">
        <span class="tab" v-for="(tabObj, index) in chatTabList" :key="tabObj.text" :class="{ active: tabObj.isActive, unRead: tabObj.unRead > 0 }" @click.prevent="chatTabSelect(tabObj.name)" :tabindex="index + 1">{{tabObj.name}}/{{tabObj.unRead}}</span><!--
      --><span class="tab addButton" @click="addTab" :tabindex="chatTabList.length + 1">タブ変更</span>
      </div>
      <!----------------
       ! チャットログ
       !--------------->
      <ul id="chatLog" @wheel.stop>
        <li v-for="(chatLog, index) in chatLogList" v-html="chatLog.viewHtml" :key="index"></li>
      </ul>
      <!----------------
       ! 操作盤
       !--------------->
      <div class="oneLine">
        <span class="label">名前</span>
        <input type="text" :value="name" :tabindex="chatTabList.length + 2" @change="inputName" title="">
        <select :tabindex="chatTabList.length + 5" v-model="secretTarget">
          <option></option>
          <option v-for="member in members" :key="member.peerId" :value="member.peerId">{{member.name}}</option>
        </select>
        <select :tabindex="chatTabList.length + 6" :title="helpMessage" class="diceBotSystem" v-model="currentDiceBotSystem"><option v-for="(systemObj, index) in diceBotSystems" :key="index" :value="systemObj.value">{{systemObj.name}}</option></select>
        <span class="icon"><i class="icon-dice" title="ダイスボットの設定" @click="settingDiceBot" :tabindex="chatTabList.length + 7"></i></span>
        <span class="icon"><i class="icon-font" title="フォントの設定" @click="settingFont" :tabindex="chatTabList.length + 8"></i></span>
        <span class="icon"><i class="icon-music" title="BGMの設定" @click="settingBGM" :tabindex="chatTabList.length + 9"></i></span>
      </div>
      <!----------------
       ! 発言
       !--------------->
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
import WindowMixin from '../WindowMixin'
import BCDice, { DiceBotLoader } from 'bcdice-js' // ES Modules

export default {
  name: 'chat',
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  data () {
    return {
      /** 利用可能なダイスボットの配列 */
      diceBotSystems: [],
      /** 入力されたチャット文字 */
      currentMessage: '',
      /** 選択されているシステム */
      currentDiceBotSystem: 'DiceBot',
      /** bc-dice本体 */
      bcDice: new BCDice(),
      /** 秘匿チャットの相手 */
      secretTarget: '',
      /** 入力中のルームメンバーのpeerIdの配列 */
      inputtingPeerIdList: [],
      /** ダイスボットの説明文の定型部分 */
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

      const elm = document.getElementById('chatLog')
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
      'sendRoomData',
      'changeName'
    ]),
    onInput () {
      this.sendRoomData({ type: 'NOTICE_INPUT', value: name })
    },
    inputName (event) {
      this.changeName({name: event.target.value})
    },
    onFocus () {
      this.$emit('onFocus')
    },
    addTab () {
      this.windowOpen('private.display.settingChatTabWindow')
    },
    settingDiceBot () {
      this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ダイスボット用表管理', logOff: true})
      this.windowOpen('private.display.unSupportWindow')
    },
    settingFont () {
      this.windowOpen('private.display.settingChatFontWindow')
    },
    settingBGM () {
      this.windowOpen('private.display.settingBGMWindow')
    },
    sendMessage (e) {
      if (e.shiftKey || e.ctrlKey) {
        this.currentMessage += '\r\n'
        return
      }

      this.addChatLog({
        name: this.name,
        text: this.currentMessage,
        color: this.fontColor
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
    },
    memberToName: member => member.name ? member.name : '名無し'
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
        const elm = document.getElementById('chatLog')
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
    },
    secretTarget (secretTarget) {
      if (!secretTarget) return
      console.log('selectSecretTalk', secretTarget)
      this.secretTarget = ''
    }
  },
  computed: mapState({
    chatLogList () {
      return this.$store.getters.chatLogs
    },
    chatTabList: state => state.public.chat.tabs,
    members: state => state.public.room.members.filter(member => member.peerId !== state.private.self.peerId),
    currentCount: state => state.count,
    name: state => state.private.self.playerName,
    helpMessage () {
      const currentDiceBotSystem = this.currentDiceBotSystem
      const diceObj = this.diceBotSystems.filter(obj => obj.value === currentDiceBotSystem)[0]
      return diceObj.helpMessage
    },
    inputting: state => state.public.chat.inputting,
    createInputtingMsg: state => peerId => {
      const memberObj = state.public.room.members.filter(memberObj => memberObj.peerId === peerId)[0]
      if (!memberObj) return ''
      return `${this.memberToName(memberObj)}が入力中...`
    },
    fontColor: state => state.private.self.color
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
  display: flex;
}
.tab {
  position: relative;
  display: inline;
  /*font-size: 10px;*/
  background: linear-gradient(rgba(240, 240, 240, 1), rgba(0, 0, 0, 0.2));
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid gray;
  border-bottom-width: 0;
  border-radius: 5px 5px 0 0;
  margin-right: -1px;
  margin-bottom: -1px;
  z-index: 10;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.tab.addButton {
  margin-left: 5rem;
  cursor: pointer;
}
.tab.active,
.tab:active {
  background: white none;
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
  background-color: white;
  flex: 1;
-moz-box-flex: 1;
  -webkit-box-flex: 1;
  border: 1px solid gray;
  overflow-y: scroll;
  overflow-x: auto;
  margin: 0;
  padding-left: 2px;
  list-style: none;
  /*font-size: 13px;*/
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
  /*font-size: 10px;*/
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.oneLine {
  display: flex;
  flex-direction : row;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: center;
  height: 26px;
  min-height: 26px;
  padding: 3px 0;
  vertical-align: middle;
}
.oneLine * {
  vertical-align: middle;
  padding: 2px;
}
.sendLine {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.sendLine * {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 42px;
  min-height: 42px;
}
.diceBotSystem {
  margin-right: 10px;
}
textarea {
  resize: none;
  flex: 1;
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
span.icon {
  padding: 0;
  margin-right: 4px;
}
i[class^="icon-"] {
  border: 1px solid #777;
  border-radius: 50%;
  font-size: 12px;
  padding: 5px;
  background-color: white;
}
i[class^="icon-"]:hover {
  border-color: black;
}
i.icon-dice { color: rgb(0, 0, 150); }
i.icon-font { color: rgb(150, 0, 150); }
i.icon-music { color: rgb(0, 150, 150); }
i.icon-dice:hover, i.icon-dice.hover { background-color: rgb(0, 0, 150); color: white; }
i.icon-font:hover, i.icon-font.hover { background-color: rgb(150, 0, 150); color: white; }
i.icon-music:hover, i.icon-music.hover { background-color: rgb(0, 150, 150); color: white; }

</style>
