<template>
  <div id="menu">
    <div class="holder" v-show="!isConnected || isConnectHover">
      <div class="first"></div>
      <div class="second"></div>
      <div class="third"></div>
      <div class="menu-button" @click="clickConnect" :title="isConnectHover ? '新しいお部屋に移りますか？\n古い部屋への接続は自動で切断されます。' : 'さぁ！お部屋を立てましょう！！'" @mouseleave="hoverConnect(false)">接続</div>
    </div>
    <div class="menu-button" v-show="isConnected && !isConnectHover" @click="clickConnect" @mouseenter="hoverConnect(true)">接続</div>
    <div class="span-group">
      <span @mouseenter="menuHover(true, 'ファイル')" @mouseleave="menuHover(false, 'ファイル')" :class="{isHover : hover2}">ファイル</span><!--
    --><span @mouseenter="menuHover(true, '表示')" @mouseleave="menuHover(false, '表示')" :class="{isHover : hover3}">表示</span><!--
    --><span @mouseenter="menuHover(true, 'コマ')" @mouseleave="menuHover(false, 'コマ')" :class="{isHover : hover4}">コマ</span><!--
    --><span @mouseenter="menuHover(true, 'マップ')" @mouseleave="menuHover(false, 'マップ')" :class="{isHover : hover5}">マップ</span><!--
    --><span @mouseenter="menuHover(true, '画像')" @mouseleave="menuHover(false, '画像')" :class="{isHover : hover6}">画像</span><!--
    --><span @mouseenter="menuHover(true, 'ヘルプ')" @mouseleave="menuHover(false, 'ヘルプ')" :class="{isHover : hover7}">ヘルプ</span><!--
  --><span @mouseenter="menuHover(true, 'デモ')" @mouseleave="menuHover(false, 'デモ')" :class="{isHover : hover8}">デモ</span>
    </div>
    <div class="menu-button" @click="clickRoomInfo" :title="roomInfoTitle" :class="{isDisconnect : !isConnected}">
      ルームID.<span :class="{isDisconnect : !isConnected}">{{ roomId }}</span>
      :
      <span>{{ memberNum }}</span>名
    </div>
    <div class="menu-button" @click="clickPublicMemo" :title="publicMemoTitle">共有メモ</div>
    <div class="menu-button" @click="clickLogOut" :class="{isDisconnect : !isConnected}" :title="logoutTitle">ログアウト</div>
    <div class="hoverMenu hoverMenu2" v-show="menu['ファイル']" @mouseenter="menuHover(true, 'ファイル')" @mouseleave="menuHover(false, 'ファイル')">
      <div class="item" @click="clickExport">セーブ</div>
      <div class="item" @click="clickImport">ロード</div>
    </div>
    <div class="hoverMenu hoverMenu3" v-show="menu['表示']" @mouseenter="menuHover(true, '表示')" @mouseleave="menuHover(false, '表示')">
      <div class="item" @mouseenter="menuHover(true, '表示', 'ウィンドウ')" @mouseleave="menuHover(false, 'ウィンドウ')">ウィンドウ<span class="triangle"></span></div>
      <hr>
      <BooleanItem property="private.setting.standImage">立ち絵表示</BooleanItem>
      <div class="item"></div>
      <BooleanItem property="private.setting.cutIn">カットイン表示</BooleanItem>
      <hr>
      <BooleanItem property="public.setting.gridId">座標表示</BooleanItem>
      <BooleanItem property="public.setting.gridLine">マス目表示</BooleanItem>
      <hr>
      <BooleanItem property="public.setting.isFitGrid">マス目にキャラクターを合わせる</BooleanItem>
      <BooleanItem property="private.setting.standImageAutoResize">立ち絵のサイズを自動調整する</BooleanItem>
      <hr>
      <div class="item" @click="clickSettingFontSize">フォントサイズ調整</div>
      <hr>
      <div class="item" @click="clickResetWindowLocate">ウィンドウ配置初期化</div>
    </div>
    <div class="hoverMenu hoverMenu4" v-show="menu['コマ']" @mouseenter="menuHover(true, 'コマ')" @mouseleave="menuHover(false, 'コマ')">
      <div class="item" @click="clickAddCharacter">キャラクター追加</div>
      <div class="item" @click="clickAddRange">範囲追加</div>
      <hr>
      <div class="item" @click="clickAddChit">チット作成</div>
      <hr>
      <div class="item" @click="clickGraveyard">墓場</div>
      <div class="item" @click="clickWaitingRoom">キャラクター待合室</div>
      <hr>
      <BooleanItem property="public.setting.pieceRotateMarker">回転マーカーを表示する</BooleanItem>
    </div>
    <div class="hoverMenu hoverMenu5" v-show="menu['マップ']" @mouseenter="menuHover(true, 'マップ')" @mouseleave="menuHover(false, 'マップ')">
      <div class="item" @click="clickChangeMap">マップ変更</div>
      <div class="item" @click="clickFloorTileMode">フロアタイル変更モード</div>
      <div class="item" @click="clickAddMapMask">マップマスク追加</div>
      <div class="item" @click="clickCreateEasyMap">簡易マップ作成</div>
      <hr>
      <div class="item" @click="clickSaveMap">マップ状態保存</div>
      <div class="item" @click="clickSwitchMap">マップ切り替え</div>
    </div>
    <div class="hoverMenu hoverMenu6" v-show="menu['画像']" @mouseenter="menuHover(true, '画像')" @mouseleave="menuHover(false, '画像')">
      <div class="item" @click="clickFileUploader">ファイルアップローダー</div>
      <hr>
      <div class="item" @click="clickTagEdit">タグ編集</div>
      <div class="item" @click="clickDeleteImage">画像削除</div>
    </div>
    <div class="hoverMenu hoverMenu7" v-show="menu['ヘルプ']" @mouseenter="menuHover(true, 'ヘルプ')" @mouseleave="menuHover(false, 'ヘルプ')">
      <div class="item" @click="clickVersion">バージョン</div>
      <div class="item" @click="clickManual">マニュアル</div>
      <hr>
      <div class="item" @click="clickOfficialSite">オフィシャルサイトへ</div>
    </div>
    <div class="hoverMenu hoverMenu8" v-show="menu['ウィンドウ']" @mouseenter="menuHover(true, '表示', 'ウィンドウ')" @mouseleave="menuHover(false, '表示', 'ウィンドウ')">
      <BooleanItem property="private.display.chatWindow">チャット表示</BooleanItem>
      <BooleanItem property="private.setting.dice">ダイス表示</BooleanItem>
      <BooleanItem property="private.display.initiativeWindow">イニシアティブ表示</BooleanItem>
      <BooleanItem property="private.display.resourceWindow">リソース表示</BooleanItem>
      <hr>
      <BooleanItem property="private.display.chatpaletteWindow">チャットパレット表示</BooleanItem>
      <BooleanItem property="private.display.counterRemoConWindow">カウンターリモコン表示</BooleanItem>
    </div>
    <div class="hoverMenu hoverMenu9" v-show="menu['デモ']" @mouseenter="menuHover(true, 'デモ')" @mouseleave="menuHover(false, 'デモ')">
      <div class="item" @click="clickDevHistory">開発履歴</div>
      <div class="item" @click="clickViewFunction">現時点の仕様</div>
      <hr>
      <div class="item" @click="clickBufForm">不具合の報告</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MenuBooleanItem from './MenuBooleanItem'

export default {
  name: 'menuComponent',
  components: {
    BooleanItem: MenuBooleanItem
  },
  data () {
    return {
      checkImg: require('../../assets/check.png'),
      isConnectHover: false,
      menu: {
        'ファイル': false,
        '表示': false,
        'コマ': false,
        'マップ': false,
        '画像': false,
        'ヘルプ': false,
        'ウィンドウ': false,
        'デモ': false
      }
    }
  },
  methods: {
    ...mapActions([
      'windowOpen',
      'setProperty',
      'doResetWindowLocate',
      'exportStart',
      'doExport'
    ]),
    menuHover (flg, ...targets) {
      for (let target of targets) {
        this.menu[target] = flg
      }
    },
    hoverConnect (flg) {
      this.isConnectHover = flg
    },
    clickConnect () {
      this.windowOpen('private.display.createRoomWindow')
    },
    clickRoomInfo () { this.windowOpen('private.display.roomInfoWindow') },
    clickPublicMemo () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '共有メモ'}); this.windowOpen('private.display.unSupportWindow') },
    clickExport () { this.exportStart(); this.menuHover(false, 'ファイル') },
    clickImport () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ロード'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ファイル') },
    clickLogOut () {
      this.menuHover(false, 'ファイル')
      const baseUrl = location.href.replace(/\?.+$/, '')
      location.href = baseUrl
    },
    clickSettingFontSize () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'フォントサイズ変更'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '表示') },
    clickResetWindowLocate () { this.doResetWindowLocate(); this.menuHover(false, '表示') },
    clickAddCharacter () { this.windowOpen('private.display.addCharacterSettingWindow'); this.menuHover(false, 'コマ') },
    clickAddRange () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '範囲追加'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'コマ') },
    clickAddChit () { this.windowOpen('private.display.addChitWindow'); this.menuHover(false, 'コマ') },
    clickGraveyard () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '墓地'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'コマ') },
    clickWaitingRoom () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '待合室'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'コマ') },
    clickChangeMap () { this.windowOpen('private.display.editMapWindow'); this.menuHover(false, 'マップ') },
    clickFloorTileMode () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'フロアタイルモード'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickAddMapMask (target) { this.windowOpen('private.display.addMapMaskWindow'); this.menuHover(false, 'マップ') },
    clickCreateEasyMap () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '簡易マップ'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickSaveMap () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップ保存'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickSwitchMap () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップ切り替え'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickFileUploader () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ファイルアップローダー'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '画像') },
    clickTagEdit () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '画像タグ編集'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '画像') },
    clickDeleteImage () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '画像削除'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '画像') },
    clickVersion () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'バージョン'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ヘルプ') },
    clickManual () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マニュアル'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ヘルプ') },
    clickOfficialSite () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '公式サイト'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ヘルプ') },
    clickDevHistory () { this.windowOpen('private.display.devLogWindow'); this.menuHover(false, 'デモ') },
    clickViewFunction () { this.windowOpen('private.display.functionListWindow'); this.menuHover(false, 'デモ') },
    clickBufForm () { window.open('https://9224.teacup.com/quoridorn_bug/bbs', '_blank'); this.menuHover(false, 'デモ') }
  },
  watch: {
    volatilSaveData (newValue) {
      if (newValue.length === this.memberNum) {
        this.doExport()
      }
    }
  },
  computed: mapState({
    hover1 () { return this.menuHoverNum === 1 },
    hover2 () { return this.menuHoverNum === 2 },
    hover3 () { return this.menuHoverNum === 3 },
    hover4 () { return this.menuHoverNum === 4 },
    hover5 () { return this.menuHoverNum === 5 },
    hover6 () { return this.menuHoverNum === 6 },
    hover7 () { return this.menuHoverNum === 7 },
    hover8 () { return this.menuHoverNum === 8 },
    isConnected () {
      const peerId = this.$store.state.private.connect.peerId
      if (!peerId) return false
      const filtered = this.$store.state.public.room.members.filter(memberObj => memberObj.peerId === peerId)
      if (filtered.length === 0) return false
      return filtered[0].isCame
    },
    roomId: state => state.public.room.id !== '' ? state.public.room.id : '未接続',
    memberNum: state => state.public.room.members.filter(memberObj => memberObj.isCame).length,
    volatilSaveData: 'volatilSaveData',
    roomInfoTitle () { return this.isConnected === true ? 'メンバーの一覧を見たり、部屋の設定を変えることができますよ。' : 'お部屋に入っていません。\n「接続」ボタンを押してお部屋を作りましょう！！' },
    publicMemoTitle () { return this.isConnected === true ? 'メンバーに共有したいテキストはこちらにどうぞ' : '部屋に入る前から準備しておくのですね！？\nなんと準備の良いお方でしょう！' },
    logoutTitle () { return this.isConnected === true ? 'この部屋から退室するのですか？' : 'お部屋に入っていません。\n「接続」ボタンを押してお部屋を作りましょう！！' }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(rgba(247, 248, 249, 1), rgba(0, 0, 0, 0));
  border-bottom: solid gray 1px;
  padding: 0px 10px;
  font-size: 16px;
  z-index: 900000000;
}
#menu > * {
  margin: 5px;
  font-size: 80%;
}
div.isDisconnect {
  background-color: rgba(200, 200, 200, 0.5);
}
div.isDisconnect:hover {
  background-color: rgba(200, 200, 200, 0.5);
}
span.isDisconnect {
  color: red;
  font-weight: bold;
}
.span-group {
  display: inline-block;
  background-color: rgba(250, 250, 250, 0.2);
  border: solid gray 1px;
  padding: 0px 15px;
}
.span-group span {
  display: inline-block;
  padding: 2px 10px;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.span-group span:hover, .span-group span.isHover {
  background: linear-gradient(rgba(186, 195, 199, 0.6), rgba(247, 248, 249, 1));
}
.menu-button {
  display: inline-block;
  position: relative;
  background: rgba(250, 250, 250, 0.4);
  border: solid gray 1px;
  padding: 2px 10px;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  z-index: 100;
}
.meun-button.isDisconnect {
  background: rgba(250, 250, 250, 0);
}
.menu-button:hover {
  border: solid #0092ED 1px;
  background: rgba(250, 250, 250, 0.5);
}
.hoverMenu {
  position: fixed;
  top: 25px;
  background: white;
  border: solid gray 1px;
  z-index: 200;
}
.hoverMenu > * {
  padding: 0 10px;
}
.hoverMenu > .item:hover {
  background: lightblue;
}
.hoverMenu2 { left: 87px; }
.hoverMenu3 { left: 158px; }
.hoverMenu4 { left: 204px; }
.hoverMenu5 { left: 249px; }
.hoverMenu6 { left: 308px; }
.hoverMenu7 { left: 353px; }
.hoverMenu8 { left: 384px; }
.hoverMenu9 { left: 412px; }

.item {
  position: relative;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.item > * {
  display: inline;
  vertical-align: middle;
}
.item img.check {
  display: inline;
  width: 10px;
  height: 10px;
  min-width: 10px;
  min-height: 10px;
  margin-right: 5px;
  border: none;
}
.triangle {
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
  display: inline-block;
  vertical-align: middle;
  width: 0px;
  height: 0px;
  border-left: 6px solid black;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

@import url(https://fonts.googleapis.com/css?family=Bitter);
.first,
.second,
.third {
  display: inline;
  position: absolute;
  left: 0;
  right: 0;
  top: -3px;
  bottom: -3px;
  border: solid gray 1px;
  padding: 2px 10px;
  border-radius: 5px;
}
.second,
.third {
  opacity: 0;
}
.holder {
  position: relative;
  padding: 0;
  display: inline;
  z-index: 1;
}
.first {
  animation: first 4s infinite;
  background: linear-gradient(#5ff8ca, #60e08c);
  z-index: 10;
}
  @keyframes first {
    0% {opacity: 1.0;}
    10% {opacity: 0.8;}
    20% {opacity: 0.6;}
    30% {opacity: 0.4;}
    40% {opacity: 0.2;}
    50% {opacity: 0.1;}
    60% {opacity: 0.2;}
    70% {opacity: 0.4;}
    80% {opacity: 0.6;}
    90% {opacity: 0.8;}
    100% {opacity: 1.0;}
  }

.second {
  animation: second 4s infinite; animation-delay: 0.8s;
  background: linear-gradient(#19eaa6, #00a1f0);
  z-index: 20;
}
  @keyframes second {
    0% {opacity: 0;}
    10% {opacity: 0.2;}
    20% {opacity: 0.4;}
    30% {opacity: 0.6;}
    40% {opacity: 0.8;}
    50% {opacity: 1.0;}
    60% {opacity: 0.8;}
    70% {opacity: 0.6;}
    80% {opacity: 0.4;}
    90% {opacity: 0.2;}
    100% {opacity: 0;}
  }

.third {
  animation: third 4s infinite;
  animation-delay: 3.2s;
  background: linear-gradient(#aab7f8, #ff75c6);
  z-index: 30;
}
  @keyframes third {
    0% {opacity: 0;}
    10% {opacity: 0.2;}
    20% {opacity: 0.4;}
    30% {opacity: 0.6;}
    40% {opacity: 0.8;}
    50% {opacity: 1.0;}
    60% {opacity: 0.8;}
    70% {opacity: 0.6;}
    80% {opacity: 0.4;}
    90% {opacity: 0.2;}
    100% {opacity: 0;}
  }

</style>
