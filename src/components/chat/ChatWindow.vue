<template>
  <WindowFrame titleText="チャット" display-property="private.display.chatWindow" align="left-bottom" baseSize="-300, 260" :fontSizeBar="true">
    <div class="container">
      <!----------------
       ! タブ
       !--------------->
      <div class="tabs dep">
        <span class="tab"
              v-for="(tabObj, index) in chatTabList"
              :key="tabObj.name"
              :class="{ active: tabObj.name === activeTab, unRead: tabObj.unRead > 0 }"
              @mousedown.prevent="selectChatTab(tabObj.name)"
              :tabindex="index + 1"
        >#{{tabObj.name}}/{{tabObj.unRead}}</span>
        <span class="tab addButton" @click="addTab" :tabindex="chatTabList.length + 1"><span class="icon-cog"></span></span>
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
      <div class="oneLine dep">
        <span class="label">名前(！)</span>
        <select :tabindex="chatTabList.length + 2" :value="nameToKeyView(currentChatName)" @change="inputName" title="">
          <option v-for="actor in getPeerActors" :key="actor.key" :value="actor.key">{{getViewName(actor.key)}}</option>
        </select>
        <!--<select :tabindex="chatTabList.length + 5" v-model="secretTarget">-->
          <!--<option></option>-->
          <!--<option v-for="member in members" :key="member.peerId" :value="member.peerId">{{member.name}}</option>-->
        <!--</select>-->
        <select :tabindex="chatTabList.length + 6" :title="helpMessage" class="diceBotSystem" v-model="currentDiceBotSystem"><option v-for="(systemObj, index) in diceBotSystems" :key="index" :value="systemObj.value">{{systemObj.name}}</option></select>
        <span class="icon"><i class="icon-dice" title="ダイスボットの設定" @click="settingDiceBot" :tabindex="chatTabList.length + 7"></i></span>
        <!--<span class="icon"><i class="icon-font" title="フォントの設定" @click="settingFont" :tabindex="chatTabList.length + 8"></i></span>-->
        <span class="icon"><i class="icon-music" title="BGMの設定" @click="settingBGM" :tabindex="chatTabList.length + 9"></i></span>
      </div>
      <!----------------
       ! 発言
       !--------------->
      <div class="sendLine dep">
        <div class="textAreaContainer">
          <!----------------
           ! グループチャットタブ
           !--------------->
          <div class="tabs">
            <span class="tab"
                  v-for="(tabObj, index) in groupTargetTabList"
                  :key="tabObj.key"
                  :class="{ active: tabObj.key === chatTarget }"
                  @mousedown.prevent="groupTargetTabSelect(tabObj.key)"
                  :tabindex="chatTabList.length + 12 + index"
            >> {{tabObj.name}}{{otherMatcherName(tabObj) ? `(${otherMatcherName(tabObj)})` : ''}}</span>
            <span class="tab addButton"
                  @click="addTargetTab"
                  :tabindex="chatTabList.length + chatTabList.length + 12"
            ><span class="icon-cog"></span></span>
            <label class="bracketOption">
              <input type="checkbox" v-model="addBrackets" :tabindex="chatTabList.length + chatTabList.length + 13" />
              発言時に「」を付与
            </label>
          </div>
          <!----------------
           ! チャットオプション（送信者）
           !--------------->
          <div class="chatOptionSelector dep" v-if="chatOptionSelectMode === 'from'">
            <span>送信者{{chatOptionPageMaxNum > 1 ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})` : ''}}</span>
            <ul>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1">[末尾へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1">[前へ]</li>
              <li v-for="actor in getPeerActors"
                  :key="actor.key"
                  :class="{selected: currentChatName === getViewName(actor.key)}"
                  tabindex="-1"
              >{{getViewName(actor.key)}}</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== chatOptionPageMaxNum">[次へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === chatOptionPageMaxNum">[先頭へ]</li>
            </ul>
          </div>
          <!----------------
           ! チャットオプション（対象）
           !--------------->
          <div class="chatOptionSelector dep" v-if="chatOptionSelectMode === 'target'">
            <span>送信先{{chatOptionPageMaxNum > 1 ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})` : ''}}</span>
            <ul>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1">[末尾へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1">[前へ]</li>
              <li v-for="target in chatOptionPagingList"
                  :key="target.key"
                  :class="{selected: chatTarget === target.key}"
                  tabindex="-1"
              >{{getViewName(target.key)}}</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== chatOptionPageMaxNum">[次へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === chatOptionPageMaxNum">[先頭へ]</li>
            </ul>
          </div>
          <!----------------
           ! チャットオプション（タブ）
           !--------------->
          <div class="chatOptionSelector dep" v-if="chatOptionSelectMode === 'tab'">
            <span>出力先のタブ{{chatOptionPageMaxNum > 1 ? ` (${chatOptionPageNum} / ${chatOptionPageMaxNum})` : ''}}</span>
            <ul>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === 1">[末尾へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== 1">[前へ]</li>
              <li :class="{selected: chatTargetTab === '[選択中]'}">[選択中]</li>
              <li
                v-for="tab in chatTabList"
                :key="tab.key"
                :class="{selected: chatTargetTab === tab.name}"
                tabindex="-1"
              >{{tab.name}}</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum !== chatOptionPageMaxNum">[次へ]</li>
              <li class="ope" v-if="chatOptionPageMaxNum > 1 && chatOptionPageNum === chatOptionPageMaxNum">[先頭へ]</li>
            </ul>
          </div>
          <div class="chatInputArea">
            <div class="chatOption" @click="clickChatOption">
              <div class="emphasis">! {{currentChatName}}</div>
              <div :class="{emphasis: chatTarget !== 'groupTargetTab-0'}">> {{getGroupTargetName()}}</div>
              <div :class="{emphasis: chatTargetTab !== '[選択中]'}"># {{chatTargetTab}}</div>
            </div>
            <!----------------
             ! 入力欄
             !--------------->
            <textarea id="chatTextArea"
                      v-model="currentMessage"
                      @input="onInput"
                      @blur="blurTextArea"
                      @keydown.up="event => chatOptionSelectChange('up', event)"
                      @keydown.down="event => chatOptionSelectChange('down', event)"
                      @keydown.esc.prevent="pressEsc"
                      @keypress.enter.prevent="event => sendMessage(event, true)"
                      @keyup.enter.prevent="event => sendMessage(event, false)"
                      :tabindex="chatTabList.length + chatTabList.length + 14"
                      :placeholder="'メッセージ（改行はShift + Enter）'"
            ></textarea>
          </div>
        </div>
        <button :tabindex="chatTabList.length + chatTabList.length + 15">送信</button>
      </div>
      <!----------------
       ! 入力者表示
       !--------------->
      <div class="inputtingArea dep">
        <div
          v-for="name in inputtingPeerIdList"
          :key="name"
        >
          <img
            v-show="inputtingPeerIdList.length>0"
            :src="require('../../assets/inputting.gif')"
          >
          {{createInputtingMsg(name)}}
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
// import 'bcdice-js/lib/preload-dicebots'
import { mapState, mapActions, mapGetters } from 'vuex'
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
      enterPressing: false,
      /** 利用可能なダイスボットの配列 */
      diceBotSystems: [],
      /** 入力されたチャット文字 */
      currentMessage: '',
      /** 発言時に「」を付与するかどうか */
      addBrackets: false,
      /** チャットオプション入力モード('tab':# or 'target':@ or '') */
      chatOptionSelectMode: '',
      chatOptionPagingSize: 8,
      /** 発言先 */
      chatTarget: 'groupTargetTab-0',
      /** 出力先のタブ */
      chatTargetTab: '[選択中]',
      /** 選択されているシステム */
      currentDiceBotSystem: 'DiceBot',
      /** 現在発言中のアクターのkey */
      currentActorKey: null,
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
      // console.qLog(`bcdice-js ダイスボット一覧`)
      DiceBotLoader.collectDiceBots().forEach(function (diceBot) {
        // console.qLog(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`)
        // console.qLog(`${diceBot.gameName()}, ${diceBot.gameType()}`)
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
    onInput (event) {
      const text = event.target.value

      let selectFrom = null
      if (text.startsWith('!') || text.startsWith('！')) {
        const useText = text.substring(1)
        if (useText.length === 0) {
          selectFrom = this.currentChatName
        }
        this.getPeerActors.forEach(target => {
          if (selectFrom) return
          if (this.getViewName(target.key).startsWith(useText)) {
            console.log(target)
            selectFrom = this.getViewName(target.key)
          }
        })
      }

      let selectTarget = null
      if (text.startsWith('>') || text.startsWith('＞')) {
        const useText = text.substring(1)
        if (useText.length === 0) {
          selectTarget = this.chatTarget
        }
        this.chatTargetList.forEach(target => {
          if (selectTarget) return
          if (target.name.startsWith(useText)) {
            console.log(target)
            selectTarget = target.key
          }
        })
      }

      let selectTab = null
      if (text.startsWith('#') || text.startsWith('＃')) {
        const useText = text.substring(1)
        if (useText.length === 0) {
          selectTab = this.chatTargetTab
        }
        const selection = [
          '[選択中]',
          ...this.chatTabList.map(tab => tab.name)
        ]
        selection.forEach(tabName => {
          if (selectTab) return
          if (tabName.startsWith(useText)) selectTab = tabName
        })
      }

      if (selectFrom) {
        this.chatOptionSelectMode = 'from'
        this.setProperty({property: 'private.self.currentChatName', value: selectFrom, isNotice: false, logOff: true})
      } else if (selectTarget) {
        this.chatOptionSelectMode = 'target'
        this.chatTarget = selectTarget
      } else if (selectTab) {
        this.chatOptionSelectMode = 'tab'
        this.chatTargetTab = selectTab
      } else {
        this.chatOptionSelectMode = ''
        this.sendRoomData({ type: 'NOTICE_INPUT', value: this.currentChatName })
      }
    },
    getGroupTargetName () {
      let target = null
      target = this.playerList.filter(obj => obj.key === this.chatTarget)[0]
      if (!target) target = this.groupTargetTabList.filter(obj => obj.key === this.chatTarget)[0]
      if (!target) target = this.characterList.filter(obj => obj.key === this.chatTarget)[0]
      return target ? this.getViewName(target.key) : null
    },
    chatOptionSelectChange (direction, event) {
      let selection = []
      let target = null

      if (!this.volatileFrom) this.volatileFrom = this.currentChatName
      if (!this.volatileTarget) this.volatileTarget = this.chatTarget
      if (!this.volatileActiveTab) this.volatileActiveTab = this.activeTab
      if (!this.volatileTargetTab) this.volatileTargetTab = this.chatTargetTab

      if (this.chatOptionSelectMode === 'from') {
        selection = this.getPeerActors
        target = selection.filter(s => this.getViewName(s.key) === this.currentChatName)[0]
        event.preventDefault()

        let index = selection.indexOf(target)
        index += direction === 'up' ? -1 : 1
        if (index < 0) index = selection.length - 1
        if (index === selection.length) index = 0
        const newValue = selection[index]

        this.setProperty({
          property: 'private.self.currentChatName',
          value: this.getViewName(newValue.key),
          isNotice: false,
          logOff: true
        })
      }

      if (this.chatOptionSelectMode === 'target') {
        selection = this.chatTargetList
        target = selection.filter(s => s.key === this.chatTarget)[0]
        event.preventDefault()

        let index = selection.indexOf(target)
        index += direction === 'up' ? -1 : 1
        if (index < 0) index = selection.length - 1
        if (index === selection.length) index = 0
        const newValue = selection[index]

        this.groupTargetTabSelect(newValue.key)
      }

      if (this.chatOptionSelectMode === 'tab') {
        selection = [
          '[選択中]',
          ...this.chatTabList.map(tab => tab.name)
        ]
        target = this.chatTargetTab
        event.preventDefault()

        let index = selection.indexOf(target)
        index += direction === 'up' ? -1 : 1
        if (index < 0) index = selection.length - 1
        if (index === selection.length) index = 0
        const newValue = selection[index]

        this.selectChatTab(newValue !== '[選択中]' ? newValue : this.volatileActiveTab)
        this.chatTargetTab = newValue
      }
    },
    blurTextArea () {
      if (this.chatOptionSelectMode) {
        this.currentMessage = ''
        if (this.volatileFrom) this.setProperty({property: 'private.self.currentChatName', value: this.volatileFrom, isNotice: false, logOff: true})
        if (this.volatileTarget) this.chatTarget = this.volatileTarget
        if (this.volatileActiveTab) this.selectChatTab(this.volatileActiveTab)
        if (this.volatileTargetTab) this.chatTargetTab = this.volatileTargetTab
      }
      this.chatOptionSelectMode = ''
      this.volatileFrom = ''
      this.volatileTarget = ''
      this.volatileActiveTab = ''
      this.volatileTargetTab = ''
    },
    pressEsc () {
      this.blurTextArea()
    },
    selectChatTab (name) {
      this.setProperty({property: 'chat.activeTab', value: name, logOff: true})
      this.chatTabSelect(name)
    },
    groupTargetTabSelect (targetKey) {
      this.chatTarget = targetKey

      if (this.chatTarget.split('-')[0] === 'groupTargetTab') {
        const tabObj = this.getObj(this.chatTarget)
        if (tabObj.targetTab) this.chatTargetTab = tabObj.targetTab
        const otherName = this.otherMatcherName(tabObj)
        if (otherName.length > 0) {
          this.setProperty({
            property: 'private.self.currentChatName',
            value: otherName,
            isNotice: false,
            logOff: true
          })
        }
      }
    },
    inputName (event) {
      const actorKey = event.target.value
      this.currentActorKey = actorKey
      const actor = this.getPeerActors.filter(actor => actor.key === actorKey)[0]
      this.changeName(this.getViewName(actor.key))
    },
    clickChatOption () {
      console.log('clickChatOption')
      document.getElementById('chatTextArea').focus()
    },
    addTab () {
      this.windowOpen('private.display.settingChatTabWindow')
    },
    addTargetTab () {
      this.windowOpen('private.display.settingChatTargetTabWindow')
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
    commitChatOption () {
      if (this.chatOptionSelectMode) {
        this.currentMessage = ''
      }
      this.chatOptionSelectMode = ''
      this.volatileFrom = ''
      this.volatileTarget = ''
      this.volatileActiveTab = ''
      this.volatileTargetTab = ''
    },
    sendMessage (e, flg) {
      if (this.enterPressing === flg) return
      this.enterPressing = flg
      if (!flg) return
      if (e.shiftKey) {
        this.currentMessage += '\r\n'
        return
      }
      if (this.currentMessage === '') return

      // チャット送信オプション選択中のEnterは特別仕様
      if (this.chatOptionSelectMode) {
        this.commitChatOption()
        return
      }

      // 文字色決定
      const actor = this.getPeerActors.filter(actor => actor.key === this.currentActorKey)[0]
      let color = 'black'
      if (actor) {
        if (actor.key.split('-')[0] === 'character') {
          if (actor.fontColorType === 0) {
            // プレイヤーと同じ色を使う
            color = this.getPeerActors[0].color
          } else {
            color = actor.fontColor
          }
        } else {
          color = actor.fontColor
        }
      }

      // 括弧をつけるオプション
      let text = this.currentMessage
      if (this.addBrackets) {
        text = `「${text}」`
      }

      // 出力先タブ決定
      let outputTab = this.chatTargetTab
      if (outputTab === '[選択中]') {
        outputTab = this.activeTab
      }

      let ownerKey = null
      const currentChatKey = this.nameToKey(this.currentChatName)
      if (currentChatKey) {
        const kind = currentChatKey.split('-')[0]
        if (kind === 'player') {
          ownerKey = this.selfPlayerKey
        } else if (kind === 'character') {
          ownerKey = this.getObj(currentChatKey).owner
        } else {
          ownerKey = undefined
        }
      } else {
        ownerKey = undefined
      }

      const messageObj = {
        name: this.currentChatName,
        text: text,
        color: color,
        tab: outputTab,
        from: ownerKey,
        target: this.chatTarget,
        owner: this.getPeerActors.filter(actor => actor.key === this.currentActorKey)[0].key
      }

      // 送信先決定
      // if (this.chatTarget !== 'groupTargetTab-0') {
      //   const kind = this.chatTarget.split('-')[0]
      //   if (kind === 'groupTargetTab') {
      //     // グループチャット向け
      //     const groupTargetTab = this.groupTargetTabList.filter(tab => tab.key === this.chatTarget)[0]
      //     if (groupTargetTab) {
      //       messageObj.to = groupTargetTab.group
      //       messageObj.isSecret = groupTargetTab.isSecret
      //     }
      //   } else {
      //     // 個人向け
      //     messageObj.to = [ this.chatTarget ]
      //     messageObj.isSecret = true
      //   }
      // }

      // -------------------
      // プレイヤー発言
      // -------------------
      this.addChatLog(messageObj)

      this.bcDice.setMessage(this.currentMessage)
      const resultObj = this.bcDice.dice_command()
      const diceResult = resultObj[0].replace(/(^: )/g, '').replace(/＞/g, '→')
      const isSecret = resultObj[1]
      if (diceResult !== '1') {
        if (isSecret) {
          this.addChatLog({
            name: this.currentDiceBotSystem,
            text: `シークレットダイス`,
            color: 'black',
            tab: this.activeTab,
            owner: 'SYSTEM'
          })
        } else {
          this.addChatLog({
            name: this.currentDiceBotSystem,
            text: diceResult,
            color: 'black',
            tab: this.activeTab,
            owner: 'SYSTEM'
          })
        }
      }
      this.currentMessage = ''

      // setTimeout(function () {
      //   var elm = document.getElementById('chatLog')
      //   elm.scrollTop = elm.scrollHeight
      // }, 0)
    },
    memberToName: member => member.name ? member.name : '名無し',
    nameToKeyView (name) {
      const key = this.nameToKey(name)
      this.currentActorKey = key
      return key
    },
    nameToKey (name) {
      const obj = this.getPeerActors
        .map(actor => ({name: this.getViewName(actor.key), key: actor.key}))
        .filter(obj => obj.name === name)[0]
      if (!obj) {
        return ''
      }
      return obj.key
    },
    otherMatcherName (tabObj) {
      if (tabObj.isAll) return ''
      const matchNameList = this.tabMatchObj(tabObj).map(obj => this.getViewName(obj.key))
      if (matchNameList.indexOf(this.currentChatName) >= 0) return ''
      return matchNameList[0]
    },
    tabMatchObj (tabObj) {
      return tabObj.group
        .map(g => this.getObj(g))
        .filter(obj => {
          const kind = obj.key.split('-')[0]
          if (kind === 'player') {
            if (obj.key === this.selfPlayerKey) return true
          } else {
            if (obj.owner === this.selfPlayerKey) return true
          }
          return false
        })
    }
  },
  watch: {
    currentDiceBotSystem () {
      console.qLog(`ダイスボットシステムを${this.currentDiceBotSystem}に変更`)
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
        for (const name in inputting) {
          if (inputting[name] > 0) {
            this.inputtingPeerIdList.push(name)
          }
        }
      },
      deep: true
    },
    secretTarget (secretTarget) {
      if (!secretTarget) return
      console.qLog('selectSecretTalk', secretTarget)
      this.secretTarget = ''
    }
  },
  computed: mapState({
    ...mapGetters([
      'getPeerActors',
      'getViewName',
      'getObj'
    ]),
    chatLogList (state) {
      return state.public.chat.logs[state.chat.activeTab].filter(log => {
        if (log.from === this.selfPlayerKey) return true
        if (!log.target) return true
        if (log.target === 'groupTargetTab-0') return true
        const kind = log.target.split('-')[0]
        if (kind === 'groupTargetTab') {
          const target = this.getObj(log.target)
          if (!target.isSecret) return true
          if (target.isAll) return true
          const findIndex = target.group.findIndex(g => {
            const kind = g.split('-')[0]
            if (kind === 'player') {
              if (g === this.selfPlayerKey) return true
            } else if (kind === 'character') {
              if (this.getObj(g).owner === this.selfPlayerKey) return true
            }
            return false
          })
          return findIndex > -1
        } else if (kind === 'player') {
          console.log('-----player', log.target, this.selfPlayerKey, log.target === this.selfPlayerKey)
          return log.target === this.selfPlayerKey
        } else {
          const target = this.getObj(log.target)
          return target.owner === this.selfPlayerKey
        }
      })
    },
    chatTabList: state => state.public.chat.tabs,
    playerList: state => state.public.player.list,
    characterList: state => state.public.character.list,
    groupTargetTabList (state) {
      return state.public.chat.groupTargetTab.list.filter(tab => {
        if (tab.isAll) return true
        const filterObj = tab.group.filter(targetKey => {
          if (targetKey === this.currentActorKey) return true
          if (this.currentActorKey.split('-')[0] === 'player') {
            const targetCharacter = this.characterList
              .filter(character => character.owner === this.currentActorKey)
              .filter(character => character.key === targetKey)[0]
            if (targetCharacter) return true
          } else if (this.currentActorKey.split('-')[0] === 'character') {
            const targetCharacter = this.characterList
              .filter(character => character.key === this.currentActorKey)[0]
            if (targetCharacter) return true
          }
          return false
        })
        if (filterObj.length > 0) return true
      })
    },
    members: state => state.public.room.members.filter(member => {
      return member.peerId !== state.private.self.peerId
    }),
    currentCount: state => state.count,
    currentChatName: state => state.private.self.currentChatName,
    helpMessage () {
      const currentDiceBotSystem = this.currentDiceBotSystem
      const diceObj = this.diceBotSystems.filter(obj => obj.value === currentDiceBotSystem)[0]
      return diceObj.helpMessage
    },
    inputting: state => state.public.chat.inputting,
    createInputtingMsg (state) {
      return function (name) {
        return `${name}が入力中...`
      }
    },
    fontColor: state => state.private.self.color,
    chatTargetList () {
      const list = [
        ...this.groupTargetTabList,
        ...this.playerList,
        ...this.characterList.filter(character => character.place === 'field')
      ]
      return list
    },
    activeTab: state => state.chat.activeTab,
    hoverTab: state => state.chat.hoverTab,
    selfPlayerKey: state => {
      const player = state.public.player.list.filter(player => player.name === state.private.self.playerName)[0]
      return player ? player.key : null
    },
    chatOptionPageNum () {
      if (this.chatOptionSelectMode === 'from') {
        const index = this.getPeerActors.findIndex(target => target.key === this.chatTarget)
        if (index === -1) return -1
        return Math.floor(index / this.chatOptionPagingSize) + 1
      }
      if (this.chatOptionSelectMode === 'target') {
        const index = this.chatTargetList.findIndex(target => target.key === this.chatTarget)
        if (index === -1) return -1
        return Math.floor(index / this.chatOptionPagingSize) + 1
      }
      if (this.chatOptionSelectMode === 'tab') {
        const index = this.chatTabList.findIndex(target => target.name === this.activeTab)
        if (index === -1) return -1
        return Math.floor(index / this.chatOptionPagingSize) + 1
      }
      return -1
    },
    chatOptionPageMaxNum () {
      if (this.chatOptionSelectMode === 'from') {
        return Math.floor(this.getPeerActors.length / this.chatOptionPagingSize) + 1
      }
      if (this.chatOptionSelectMode === 'target') {
        return Math.floor(this.chatTargetList.length / this.chatOptionPagingSize) + 1
      }
      if (this.chatOptionSelectMode === 'tab') {
        return Math.floor(this.chatTabList.length / this.chatOptionPagingSize) + 1
      }
      return 0
    },
    chatOptionPagingList () {
      const pageNum = this.chatOptionPageNum
      const startIndex = (pageNum - 1) * this.chatOptionPagingSize
      if (this.chatOptionSelectMode === 'from') {
        const endIndex = Math.min(pageNum * this.chatOptionPagingSize, this.getPeerActors.length)
        const result = this.getPeerActors.concat()
        return result.splice(startIndex, endIndex - startIndex)
      }
      if (this.chatOptionSelectMode === 'target') {
        const endIndex = Math.min(pageNum * this.chatOptionPagingSize, this.chatTargetList.length)
        const result = this.chatTargetList.concat()
        return result.splice(startIndex, endIndex - startIndex)
      }
      if (this.chatOptionSelectMode === 'tab') {
        const endIndex = Math.min(pageNum * this.chatOptionPagingSize, this.chatTabList.length)
        const result = this.chatTabList.concat()
        return result.splice(startIndex, endIndex - startIndex)
      }
      return 0
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
  position: relative;
  overflow: visible;
}
.tabs {
  display: flex;
  padding-left: 1em;
  width: 100%;
  box-sizing: border-box;
}
.tab {
  position: relative;
  display: inline;
  /*font-size: 1em;*/
  background: linear-gradient(rgba(240, 240, 240, 1), rgba(0, 0, 0, 0.2));
  padding: 0.2em 0.7em;
  height: 2em;
  box-sizing: border-box;
  border: 1px solid gray;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  margin-right: -1px;
  margin-bottom: -1px;
  z-index: 10;
  white-space: nowrap;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  outline: none;
}
.tab.addButton {
  /*margin-right: 2em;*/
  cursor: pointer;
}
.tab.addButton:active,
.tab.active {
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
.sendLine .label {
  width: 100%;
  text-align: center;
}
.sendLine > * {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 42px;
  min-height: 42px;
}
.sendLine > div:not(.textAreaContainer) {
  margin-top: 2em;
}
.sendLine > div {
  flex-direction: column;
}
.sendLine .textAreaContainer {
  height: 100%;
  flex: 1;
  position: relative;
  display: flex;
}
.sendLine > div > *:not(.chatOptionSelector) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chatInputArea {
  flex: 1;
  display: flex;
  width: 100%;
  font-size: 13px;
}
.chatOption {
  display: flex;
  height: 3.6em;
  padding: 0.2em 0 0.2em 0.4em;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 5px 0 0 5px;
  border: 1px solid gray;
  border-right: 1px dashed gray;
  color: #999;
  background-color: white;
  cursor: default;
}
.chatOption * {
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: left !important;
  align-items: center;
  padding-left: 0.2rem;
  padding-right: 0.4rem;
  border-radius: 5px 0 0 5px;
  font-size: 11px;
}
.chatOption .emphasis {
  color: black;
  font-weight: bold;
}
.diceBotSystem {
  margin-right: 10px;
}
textarea {
  resize: none;
  flex: 1;
  width: 100%;
  height: 3.6em;
  padding: 0.2em 0 0.2em 0.4em;
  font-size: inherit;
  line-height: 1.1em;
  /*border-radius: 0 5px 5px 0;*/
  border: 1px solid gray;
  border-left: none;
  outline: none;
}
textarea::placeholder {
  color: #999;
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

.dep {
  font-size: 11px;
}
.chatOptionSelector {
  padding: 0.5em;
  background-color: lightgreen;
  position: absolute;
  bottom: 100%;
  left: 0;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: default;
  z-index: 1000;
  max-height: 22.8em;
  overflow-y: auto;
}
.chatOptionSelector .ope {
  color: #777;
}
.chatOptionSelector > span {
  line-height: 1.8em;
}
.chatOptionSelector ul {
  padding: 0;
  margin: 0.5em 0 0;
  list-style: none;
}
.chatOptionSelector li {
  padding: 0.2em 0.8em;
  line-height: 1.6em;
}
.chatOptionSelector .selected {
  background-color: rgba(255, 255, 255, 0.8);
}
.bracketOption {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 1em;
}
</style>
