<template>
  <div id="menu">
    <div class="menu-button" @click="clickConnect">接続</div>
    <div class="span-group">
      <span @mouseenter="menuHover(true, 'ファイル')" @mouseleave="menuHover(false, 'ファイル')" :class="{isHover : hover2}">ファイル</span><!--
    --><span @mouseenter="menuHover(true, '表示')" @mouseleave="menuHover(false, '表示')" :class="{isHover : hover3}">表示</span><!--
    --><span @mouseenter="menuHover(true, 'コマ')" @mouseleave="menuHover(false, 'コマ')" :class="{isHover : hover4}">コマ</span><!--
    --><span @mouseenter="menuHover(true, 'マップ')" @mouseleave="menuHover(false, 'マップ')" :class="{isHover : hover5}">マップ</span><!--
    --><span @mouseenter="menuHover(true, '画像')" @mouseleave="menuHover(false, '画像')" :class="{isHover : hover6}">画像</span><!--
    --><span @mouseenter="menuHover(true, 'ヘルプ')" @mouseleave="menuHover(false, 'ヘルプ')" :class="{isHover : hover7}">ヘルプ</span><!--
  --><span @mouseenter="menuHover(true, 'デモ')" @mouseleave="menuHover(false, 'デモ')" :class="{isHover : hover8}">デモ</span>
    </div>
    <div class="menu-button" @click="clickRoomInfo">
      ルームID.<span>{{ roomId }}</span>
      :
      <span>{{ memberNum }}</span>名
    </div>
    <div class="menu-button" @click="clickPublicMemo">共有メモ</div>
    <div class="menu-button" @click="clickLogOut">ログアウト</div>
    <div class="hoverMenu hoverMenu2" v-show="menu['ファイル']" @mouseenter="menuHover(true, 'ファイル')" @mouseleave="menuHover(false, 'ファイル')">
      <div class="item" @click="clickExport">セーブ</div>
      <div class="item" @click="clickImport">ロード</div>
      <hr>
      <div class="item" @click="clickLogOut">ログアウト</div>
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
import { mapMutations, mapGetters } from 'vuex'
import MenuBooleanItem from './MenuBooleanItem'

export default {
  name: 'menuComponent',
  components: {
    BooleanItem: MenuBooleanItem
  },
  data () {
    return {
      checkImg: require('../../assets/check.png'),
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
    ...mapMutations([
      'windowOpen',
      'setProperty',
      'doResetWindowLocate',
      'createPeer'
    ]),
    menuHover: function (flg, ...targets) {
      for (let target of targets) {
        this.menu[target] = flg
      }
    },
    clickConnect: function () {
      // this.setProperty({property: 'private.display.unSupportWindow.title', value: '接続'})
      // this.windowOpen('private.display.unSupportWindow')
      this.createPeer()
    },
    clickRoomInfo: function () { this.windowOpen('private.display.roomInfoWindow') },
    clickPublicMemo: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '共有メモ'}); this.windowOpen('private.display.unSupportWindow') },
    clickExport: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'セーブ'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ファイル') },
    clickImport: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ロード'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ファイル') },
    clickLogOut: function () { alert('未実装の機能です。'); this.menuHover(false, 'ファイル') },
    clickSettingFontSize: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'フォントサイズ変更'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '表示') },
    clickResetWindowLocate: function () { this.doResetWindowLocate(); this.menuHover(false, '表示') },
    clickAddCharacter: function () { this.windowOpen('private.display.addCharacterSettingWindow'); this.menuHover(false, 'コマ') },
    clickAddRange: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '範囲追加'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'コマ') },
    clickAddChit: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'チット追加'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'コマ') },
    clickGraveyard: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '墓地'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'コマ') },
    clickWaitingRoom: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '待合室'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'コマ') },
    clickChangeMap: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップ変更'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickFloorTileMode: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'フロアタイルモード'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickAddMapMask: function (target) { this.windowOpen('private.display.addMapMaskWindow'); this.menuHover(false, 'マップ') },
    clickCreateEasyMap: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '簡易マップ'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickSaveMap: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップ保存'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickSwitchMap: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップ切り替え'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'マップ') },
    clickFileUploader: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ファイルアップローダー'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '画像') },
    clickTagEdit: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '画像タグ編集'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '画像') },
    clickDeleteImage: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '画像削除'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, '画像') },
    clickVersion: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'バージョン'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ヘルプ') },
    clickManual: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マニュアル'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ヘルプ') },
    clickOfficialSite: function () { this.setProperty({property: 'private.display.unSupportWindow.title', value: '公式サイト'}); this.windowOpen('private.display.unSupportWindow'); this.menuHover(false, 'ヘルプ') },
    clickDevHistory: function () { this.windowOpen('private.display.devLogWindow'); this.menuHover(false, 'デモ') },
    clickViewFunction: function () { this.windowOpen('private.display.functionListWindow'); this.menuHover(false, 'デモ') },
    clickBufForm: function () { window.open('https://9224.teacup.com/quoridorn_bug/bbs', '_blank'); this.menuHover(false, 'デモ') }
  },
  computed: {
    ...mapGetters([]),
    hover1: function () { return this.menuHoverNum === 1 },
    hover2: function () { return this.menuHoverNum === 2 },
    hover3: function () { return this.menuHoverNum === 3 },
    hover4: function () { return this.menuHoverNum === 4 },
    hover5: function () { return this.menuHoverNum === 5 },
    hover6: function () { return this.menuHoverNum === 6 },
    hover7: function () { return this.menuHoverNum === 7 },
    hover8: function () { return this.menuHoverNum === 8 },
    roomId: function () {
      return this.$store.state.public.room.id
    },
    memberNum: function () {
      return this.$store.state.public.room.members.length
    }
  }
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
  z-index: 10100;
}
#menu > * {
  margin: 5px;
  font-size: 80%;
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
  background: rgba(250, 250, 250, 0.4);
  border: solid gray 1px;
  padding: 2px 10px;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
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

</style>
