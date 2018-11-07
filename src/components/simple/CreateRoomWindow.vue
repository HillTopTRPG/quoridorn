<template>
  <WindowFrame titleText="入室画面" display-property="private.display.createRoomWindow" align="center" fixSize="400, 300" @open="open">
    <div class="contents">
      <div class="message">入室する部屋の情報を入力してください。<br>継続卓の場合は保存データを読み込んで、表示される招待用URLでアクセスしてください。</div>
      <label class="nameLabel">部屋名：</label>
      <input class="nameInput" type="text" v-model="roomName" placeholder="必須項目です。" />
      <button class="nameCheckBtn" @click="checkRoomExist">部屋存在確認</button>
      <label class="passwordLabel">パスワード：</label>
      <input class="passwordInput" type="text" v-model="password" />
      <div class="existMsg" v-show="existCheckMessage !== ''"><b>{{existCheckMessage}}</b></div>
      <label class="systemLabel">システム：</label>
      <select class="systemSelect" v-model="currentSystem">
        <option v-for="systemObj in diceBotSystems" :key="systemObj.value" :value="systemObj.value">{{systemObj.name}}</option>
      </select>
      <div class="operateArea">
        <button @click="commit">決定</button>
        <button @click="cancel">キャンセル</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapActions } from 'vuex'
import { DiceBotLoader } from 'bcdice-js' // ES Modules
import WindowFrame from '../WindowFrame'

export default {
  name: 'createRoomWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      roomName: '',
      password: '',
      currentSystem: 'DiceBot',
      diceBotSystems: [],
      existCheckMessage: ''
    }
  },
  created () {
    this.diceBotSystems.push({
      name: '指定なし',
      value: 'DiceBot'
    })
    setTimeout(function () {
      // console.log(`bcdice-js ダイスボット一覧`)
      DiceBotLoader.collectDiceBots().forEach(function (diceBot) {
        // console.log(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`)
        this.diceBotSystems.push({
          name: diceBot.gameName(),
          value: diceBot.gameType()
        })
      }.bind(this))
    }.bind(this), 0)
  },
  watch: {
    roomName () {
      this.existCheckMessage = ''
    }
  },
  methods: {
    ...mapActions([
      'windowClose',
      'createPeer',
      'setProperty',
      'checkRoomName',
      'emptyMember'
    ]),
    open () {
      this.roomName = ''
      this.password = ''
      this.currentSystem = 'DiceBot'
    },
    commit () {
      if (this.roomName === '') {
        alert(`部屋名は必須項目です。\n入力をお願いします。`)
        return
      }
      this.setProperty({property: 'public.room.system', value: this.currentSystem})
      this.setProperty({property: 'private.connect.password', value: this.password, logOff: true})
      this.emptyMember()
      this.createPeer({
        roomId: this.roomName
      })
      this.windowClose('private.display.createRoomWindow')
    },
    cancel () {
      this.windowClose('private.display.createRoomWindow')
    },
    checkRoomExist () {
      if (this.roomName === '') {
        this.existCheckMessage = '部屋名を入力してください。'
        return
      }
      this.existCheckMessage = '存在確認中です...'
      const _ = this
      this.checkRoomName({
        roomName: this.roomName,
        roomFindFunc: message => (_.existCheckMessage = message),
        roomNonFindFunc: () => (_.existCheckMessage = 'この部屋は存在しません。新しく部屋を作ることになります。')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  display: grid;
  width: 100%;
  font-size: 12px;
  position: absolute;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto auto auto auto auto;
  grid-template-areas:
    "message       message       message"
    "nameLabel     nameInput     nameCheckBtn"
    "existMsg      existMsg      existMsg"
    "passwordLabel passwordInput ....."
    "systemLabel   systemSelect  systemSelect"
    "operateArea   operateArea   operateArea";
}
.message { grid-area: message; }
.nameLabel { grid-area: nameLabel; }
.nameInput { grid-area: nameInput; }
.nameCheckBtn { grid-area: nameCheckBtn; }
.existMsg { grid-area: existMsg; }
.passwordLabel { grid-area: passwordLabel; }
.passwordInput { grid-area: passwordInput; }
.systemLabel { grid-area: systemLabel; }
.systemSelect { grid-area: systemSelect; }
.operateArea { grid-area: operateArea; text-align: center; }
</style>
