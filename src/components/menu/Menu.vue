<template>
  <div id="menu">
    <!-- 接続ボタン -->
    <div class="holder connectBtn" v-if="!isConnected || isConnectHover">
      <div class="first"></div>
      <div class="second"></div>
      <div class="third"></div>
      <div class="menu-button" @click="clickConnect" :title="isConnectHover ? '新しいお部屋に移りますか？\n古い部屋への接続は自動で切断されます。' : 'さぁ！お部屋を立てましょう！！'" @mouseleave="hoverConnect(false)">接続</div>
    </div>
    <div class="connectBtn" v-if="isConnected && !isConnectHover">
      <div class="menu-button" @click="clickConnect" @mouseenter="hoverConnect(true)">接続</div>
    </div>
    <!-- 操作ボタングループ -->
    <div class="span-group">
      <span @click="menuClick()" @mouseenter="menuHover('ファイル')" :class="{isHover : isShow('ファイル')}">ファイル</span>
      <span @click="menuClick()" @mouseenter="menuHover('表示')" :class="{isHover : isShow('表示', 'ウィンドウ')}">表示</span>
      <span @click="menuClick()" @mouseenter="menuHover('コマ')" :class="{isHover : isShow('コマ')}">コマ</span>
      <span @click="menuClick()" @mouseenter="menuHover('マップ')" :class="{isHover : isShow('マップ')}">マップ</span>
      <span @click="menuClick()" @mouseenter="menuHover('画像')" :class="{isHover : isShow('画像')}">画像</span>
      <span @click="menuClick()" @mouseenter="menuHover('ヘルプ')" :class="{isHover : isShow('ヘルプ')}">ヘルプ</span>
      <span @click="menuClick()" @mouseenter="menuHover('デモ')" :class="{isHover : isShow('デモ')}">デモ</span>
    </div>
    <!-- 部屋情報 -->
    <div class="menu-button" @click="clickRoomInfo" :title="roomInfoTitle" :class="{isDisconnect : !isConnected}">
      ルームID.<span :class="{isDisconnect : !isConnected}">{{ roomId }}</span>
      :
      <span>{{ memberNum }}</span>名
    </div>
    <!-- 共有メモ -->
    <div class="menu-button" @click="clickPublicMemo" :title="publicMemoTitle">共有メモ</div>
    <!-- ログアウト -->
    <div class="menu-button" @click="clickLogOut" :class="{isDisconnect : !isConnected}" :title="logoutTitle">ログアウト</div>

    <!--------------------------------------------------
     ! ファイル
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu2" v-show="isShow('ファイル')">
      <div class="item" @click="clickExport">セーブ</div>
      <div class="item" @click="clickImport">ロード</div>
    </div>
    <!--------------------------------------------------
     ! 表示
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu3" v-show="isShow('表示', 'ウィンドウ')">
      <div class="item" @mouseenter="menuHover('ウィンドウ')">ウィンドウ<span class="triangle"></span></div>
      <hr @mouseenter="menuHover('表示')">
      <MenuBooleanItem property="private.setting.standImage" @mouseenter="menuHover('表示')">立ち絵表示</MenuBooleanItem>
      <MenuBooleanItem property="private.setting.cutIn" @mouseenter="menuHover('表示')">カットイン表示</MenuBooleanItem>
      <hr @mouseenter="menuHover('表示')">
      <MenuBooleanItem property="public.setting.gridId" @mouseenter="menuHover('表示')">座標表示</MenuBooleanItem>
      <MenuBooleanItem property="public.setting.gridLine" @mouseenter="menuHover('表示')">マス目表示</MenuBooleanItem>
      <hr @mouseenter="menuHover('表示')">
      <MenuBooleanItem property="public.setting.isFitGrid" @mouseenter="menuHover('表示')">マス目にキャラクターを合わせる</MenuBooleanItem>
      <MenuBooleanItem property="private.setting.standImageAutoResize" @mouseenter="menuHover('表示')">立ち絵のサイズを自動調整する</MenuBooleanItem>
      <hr @mouseenter="menuHover('表示')">
      <div class="item" @click="clickSettingFontSize" @mouseenter="menuHover('表示')">フォントサイズ調整</div>
      <hr @mouseenter="menuHover('表示')">
      <div class="item" @click="clickResetWindowLocate" @mouseenter="menuHover('表示')">ウィンドウ配置初期化</div>
    </div>
    <!--------------------------------------------------
     ! コマ
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu4" v-show="isShow('コマ')">
      <div class="item" @click="clickAddCharacter">キャラクター追加</div>
      <div class="item" @click="clickAddRange">範囲追加</div>
      <hr>
      <div class="item" @click="clickAddChit">チット作成</div>
      <hr>
      <div class="item" @click="clickGraveyard">墓場</div>
      <div class="item" @click="clickWaitingRoom">キャラクター待合室</div>
      <hr>
      <MenuBooleanItem property="public.setting.pieceRotateMarker">回転マーカーを表示する</MenuBooleanItem>
    </div>
    <!--------------------------------------------------
     ! マップ
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu5" v-show="isShow('マップ')">
      <div class="item" @click="clickChangeMap">マップ変更</div>
      <div class="item" @click="clickFloorTileMode">フロアタイル変更モード</div>
      <div class="item" @click="clickAddMapMask">マップマスク追加</div>
      <div class="item" @click="clickCreateEasyMap">簡易マップ作成</div>
      <hr>
      <div class="item" @click="clickSaveMap">マップ状態保存</div>
      <div class="item" @click="clickSwitchMap">マップ切り替え</div>
    </div>
    <!--------------------------------------------------
     ! 画像
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu6" v-show="isShow('画像')">
      <div class="item" @click="clickFileUploader">ファイルアップローダー</div>
      <hr>
      <div class="item" @click="clickTagEdit">タグ編集</div>
      <div class="item" @click="clickDeleteImage">画像削除</div>
    </div>
    <!--------------------------------------------------
     ! ヘルプ
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu7" v-show="isShow('ヘルプ')">
      <div class="item" @click="clickWelcome">ようこそ画面</div>
      <div class="item" @click="clickVersion">バージョン</div>
      <div class="item" @click="clickManual">マニュアル</div>
      <hr>
      <div class="item" @click="clickOfficialSite">オフィシャルサイトへ</div>
    </div>
    <!--------------------------------------------------
     ! ウィンドウ
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu8" v-show="isShow('ウィンドウ')">
      <MenuBooleanItem property="private.display.chatWindow">チャット表示</MenuBooleanItem>
      <MenuBooleanItem property="private.setting.dice">ダイス表示</MenuBooleanItem>
      <MenuBooleanItem property="private.display.initiativeWindow">イニシアティブ表示</MenuBooleanItem>
      <MenuBooleanItem property="private.display.resourceWindow">リソース表示</MenuBooleanItem>
      <hr>
      <MenuBooleanItem property="private.display.chatPaletteWindow">チャットパレット表示</MenuBooleanItem>
      <MenuBooleanItem property="private.display.counterRemoConWindow">カウンターリモコン表示</MenuBooleanItem>
    </div>
    <!--------------------------------------------------
     ! デモ
     !-------------------------------------------------->
    <div class="hoverMenu hoverMenu9" v-show="isShow('デモ')">
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
    MenuBooleanItem
  },
  data () {
    return {
      isConnectHover: false,
      isSelecting: false,
      currentMenu: null
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
    menuClick () { this.isSelecting = !this.isSelecting },
    isShow (...props) { return this.isSelecting && props.filter(prop => prop === this.currentMenu)[0] },
    menuHover (prop) { this.currentMenu = prop },
    hoverConnect (flg) { this.isConnectHover = flg },

    /** 接続ボタン押下 */
    clickConnect () { this.windowOpen('private.display.createRoomWindow') },
    /** 部屋情報ボタン押下 */
    clickRoomInfo () { this.windowOpen('private.display.roomInfoWindow') },
    /** 共有メモボタン押下 */
    clickPublicMemo () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '共有メモ', logOff: true}); this.windowOpen('private.display.unSupportWindow') },
    /** ログアウトボタン押下 */
    clickLogOut () {
      this.menuHover(false, 'ファイル')
      location.href = location.href.replace(/\?.+$/, '')
    },

    /* --------------------
     * ファイル
     * ----------------- */
    /** セーブ */
    clickExport () { this.exportStart(); this.menuClick() },
    /** ロード */
    clickImport () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ロード', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },

    /* --------------------
     * 表示
     * ----------------- */
    /** フォントサイズ調整 */
    clickSettingFontSize () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'フォントサイズ変更', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** ウィンドウ配置初期化 */
    clickResetWindowLocate () { this.doResetWindowLocate(); this.menuClick() },

    /* --------------------
     * コマ
     * ----------------- */
    /** キャラクター追加 */
    clickAddCharacter () { this.windowOpen('private.display.addCharacterSettingWindow'); this.menuClick() },
    /** 範囲追加 */
    clickAddRange () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '範囲追加', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** チット作成 */
    clickAddChit () { this.windowOpen('private.display.addChitWindow'); this.menuClick() },
    /** 墓場 */
    clickGraveyard () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '墓地', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** キャラクター待合室 */
    clickWaitingRoom () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '待合室', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },

    /* --------------------
     * マップ
     * ----------------- */
    /** マップ変更 */
    clickChangeMap () { this.windowOpen('private.display.editMapWindow'); this.menuClick() },
    /** フロアタイル変更モード */
    clickFloorTileMode () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'フロアタイルモード', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** マップマスク追加 */
    clickAddMapMask () { this.windowOpen('private.display.addMapMaskWindow'); this.menuClick() },
    /** 簡易マップ作成 */
    clickCreateEasyMap () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '簡易マップ', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** マップ状態保存 */
    clickSaveMap () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップ保存', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** マップ切り替え */
    clickSwitchMap () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップ切り替え', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },

    /* --------------------
     * 画像
     * ----------------- */
    /** ファイルアップローダー */
    clickFileUploader () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ファイルアップローダー', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** タグ編集 */
    clickTagEdit () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '画像タグ編集', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** 画像削除 */
    clickDeleteImage () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '画像削除', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },

    /* --------------------
     * ヘルプ
     * ----------------- */
    /** ようこそ */
    clickWelcome () { this.windowOpen('private.display.welcomeWindow'); this.menuClick() },
    /** バージョン */
    clickVersion () { this.windowOpen('private.display.versionWindow'); this.menuClick() },
    /** マニュアル */
    clickManual () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マニュアル', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },
    /** オフィシャルサイトへ */
    clickOfficialSite () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '公式サイト', logOff: true}); this.windowOpen('private.display.unSupportWindow'); this.menuClick() },

    /* --------------------
     * デモ
     * ----------------- */
    /** 開発履歴 */
    clickDevHistory () { this.windowOpen('private.display.devLogWindow'); this.menuClick() },
    /** 現時点の仕様 */
    clickViewFunction () { this.windowOpen('private.display.functionListWindow'); this.menuClick() },
    /** 不具合の報告 */
    clickBufForm () { window.open('https://9224.teacup.com/quoridorn_bug/bbs', '_blank'); this.menuClick() }
  },
  watch: {
    volatileSaveData (newValue) {
      if (newValue.length === this.memberNum) {
        this.doExport()
      }
    }
  },
  computed: mapState({
    isConnected () {
      const peerId = this.$store.state.private.self.peerId
      if (!peerId) return false
      const filtered = this.$store.state.public.room.members.filter(memberObj => memberObj.peerId === peerId)
      if (filtered.length === 0) return false
      return filtered[0].isCame
    },
    roomId: state => state.public.room.id !== '' ? state.public.room.id : '未接続',
    memberNum: state => state.public.room.members.filter(memberObj => memberObj.isCame).length,
    volatileSaveData: state => state.volatileSaveData,
    roomInfoTitle () { return this.isConnected === true ? 'メンバーの一覧を見たり、部屋の設定を変えることができますよ。' : 'お部屋に入っていません。\n「接続」ボタンを押してお部屋を作りましょう！！' },
    publicMemoTitle () { return this.isConnected === true ? 'メンバーに共有したいテキストはこちらにどうぞ' : '部屋に入る前から準備しておくのですね！？\nなんと準備の良いお方でしょう！' },
    logoutTitle () { return this.isConnected === true ? 'この部屋から退室するのですか？' : 'お部屋に入っていません。\n「接続」ボタンを押してお部屋を作りましょう！！' }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#menu {
  display: flex;
  justify-content: left;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  /*overflow-x: auto;*/
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(rgba(247, 248, 249, 1), rgba(0, 0, 0, 0));
  border-bottom: solid gray 1px;
  padding: 0.5em 1em;
  font-size: 10px;
  z-index: 900000000;
}
#menu > *:not(:first-child) {
  margin-left: 1em;
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
  display: flex;
  flex-direction: row;
  background-color: rgba(250, 250, 250, 0.2);
  border: solid gray 1px;
  box-sizing: border-box;
  padding: 0 1em;
  height: 2em;
}
.span-group span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0 1em;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.span-group span:hover,
.span-group span.isHover {
  background: linear-gradient(rgba(186, 195, 199, 0.6), rgba(247, 248, 249, 1));
}

.connectBtn {
  width: 4em;
  height: 2em;
}
.connectBtn .menu-button {
  width: 100%;
  height: 100%;
}
.menu-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: rgba(250, 250, 250, 0.4);
  border: solid gray 1px;
  padding: 0 1em;
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  z-index: 100;
  height: 2em;
}
.menu-button:hover {
  border: solid #0092ED 1px;
  background: rgba(250, 250, 250, 0.5);
}
.hoverMenu {
  position: fixed;
  top: calc(2.5em - 1px);
  background: white;
  border: solid gray 1px;
  box-sizing: border-box;
  z-index: 200;
}
.hoverMenu > * {
  padding: 0 10px;
}
.hoverMenu > .item:hover {
  background: lightblue;
}
.hoverMenu2 { left: 6em; }
.hoverMenu3 { left: 12em; }
.hoverMenu4 { left: 16em; }
.hoverMenu5 { left: 20em; }
.hoverMenu6 { left: 25em; }
.hoverMenu7 { left: 29em; }
.hoverMenu8 { left: calc(30em - 1px); }
.hoverMenu9 { left: 34em; }

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
  width: 0;
  height: 0;
  border-left: 6px solid black;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

/*@import url(https://fonts.googleapis.com/css?family=Bitter);*/
.first,
.second,
.third {
  display: inline;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /*border: solid gray 1px;*/
  padding: 0;
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
