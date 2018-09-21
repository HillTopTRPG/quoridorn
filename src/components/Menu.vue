<template>
  <div id="menu">
    <div class="menu-button connect" @click="clickConnect">接続</div>
    <div class="span-group">
      <span @mouseenter="menuHover(true, 'ファイル')" @mouseleave="menuHover(false, 'ファイル')" :class="{isHover : hover2}">ファイル</span><!--
    --><span @mouseenter="menuHover(true, '表示')" @mouseleave="menuHover(false, '表示')" :class="{isHover : hover3}">表示</span><!--
    --><span @mouseenter="menuHover(true, 'コマ')" @mouseleave="menuHover(false, 'コマ')" :class="{isHover : hover4}">コマ</span><!--
    --><span @mouseenter="menuHover(true, 'マップ')" @mouseleave="menuHover(false, 'マップ')" :class="{isHover : hover5}">マップ</span><!--
    --><span @mouseenter="menuHover(true, '画像')" @mouseleave="menuHover(false, '画像')" :class="{isHover : hover6}">画像</span><!--
    --><span @mouseenter="menuHover(true, 'ヘルプ')" @mouseleave="menuHover(false, 'ヘルプ')" :class="{isHover : hover7}">ヘルプ</span>
    </div>
    <div class="menu-button room-id" @click="clickRoomInfo">
      ルームID.<span id="room-id">{{ roomId }}</span>
      :
      <span id="member-num">{{ memberNum }}</span>名
    </div>
    <div class="menu-button public-memo" @click="clickPublicMemo">共有メモ</div>
    <div class="menu-button logout" @click="clickLogout">ログアウト</div>
    <div class="hoverMenu hoverMenu2" v-show="menu['ファイル']" @mouseenter="menuHover(true, 'ファイル')" @mouseleave="menuHover(false, 'ファイル')">
      <div class="item">セーブ</div>
      <div class="item">ロード</div>
      <hr>
      <div class="item">ログアウト</div>
    </div>
    <div class="hoverMenu hoverMenu3" v-show="menu['表示']" @mouseenter="menuHover(true, '表示')" @mouseleave="menuHover(false, '表示')">
      <div class="item" @mouseenter="menuHover(true, '表示', 'ウィンドウ')" @mouseleave="menuHover(false, 'ウィンドウ')">ウィンドウ<span class="triangle"></span></div>
      <hr>
      <BooleanItem property="standImage">立ち絵表示</BooleanItem>
      <div class="item"></div>
      <BooleanItem property="cutIn">カットイン表示</BooleanItem>
      <hr>
      <BooleanItem property="gridLine">座標表示</BooleanItem>
      <BooleanItem property="gridId">マス目表示</BooleanItem>
      <hr>
      <BooleanItem property="gridOn">マス目にキャラクターを合わせる</BooleanItem>
      <BooleanItem property="standImageAutoResize">立ち絵のサイズを自動調整する</BooleanItem>
      <hr>
      <div class="item">フォントサイズ調整</div>
      <hr>
      <div class="item">ウィンドウ配置初期化</div>
      <div class="item">表示状態初期化</div>
    </div>
    <div class="hoverMenu hoverMenu4" v-show="menu['コマ']" @mouseenter="menuHover(true, 'コマ')" @mouseleave="menuHover(false, 'コマ')">
      <div class="item">キャラクター追加</div>
      <div class="item">範囲追加</div>
      <div class="item">魔法タイマー追加</div>
      <hr>
      <div class="item">チット作成</div>
      <hr>
      <div class="item">墓場</div>
      <div class="item">キャラクター待合室</div>
      <hr>
      <BooleanItem property="pieceRotateMarker">回転マーカーを表示する</BooleanItem>
    </div>
    <div class="hoverMenu hoverMenu5" v-show="menu['マップ']" @mouseenter="menuHover(true, 'マップ')" @mouseleave="menuHover(false, 'マップ')">
      <div class="item">マップ変更</div>
      <div class="item">フロアタイル変更モード</div>
      <div class="item">マップマスク追加</div>
      <div class="item">簡易マップ作成</div>
      <hr>
      <div class="item">マップ状態保存</div>
      <div class="item">マップ切り替え</div>
    </div>
    <div class="hoverMenu hoverMenu6" v-show="menu['画像']" @mouseenter="menuHover(true, '画像')" @mouseleave="menuHover(false, '画像')">
      <div class="item">ファイルアップローダー</div>
      <div class="item">Webカメラ撮影</div>
      <hr>
      <div class="item">タグ編集</div>
      <div class="item">画像削除</div>
    </div>
    <div class="hoverMenu hoverMenu7" v-show="menu['ヘルプ']" @mouseenter="menuHover(true, 'ヘルプ')" @mouseleave="menuHover(false, 'ヘルプ')">
      <div class="item">バージョン</div>
      <div class="item">マニュアル</div>
      <hr>
      <div class="item">チュートリアル動画</div>
      <div class="item">オフィシャルサイトへ</div>
    </div>
    <div class="hoverMenu hoverMenu8" v-show="menu['ウィンドウ']" @mouseenter="menuHover(true, '表示', 'ウィンドウ')" @mouseleave="menuHover(false, '表示', 'ウィンドウ')">
      <BooleanItem property="chatWindow">チャット表示</BooleanItem>
      <BooleanItem property="dice">ダイス表示</BooleanItem>
      <BooleanItem property="initiativeWindow">イニシアティブ表示</BooleanItem>
      <BooleanItem property="resourceWindow">リソース表示</BooleanItem>
      <hr>
      <BooleanItem property="chatpaletteWindow">チャットパレット表示</BooleanItem>
      <BooleanItem property="counterRemoConWindow">カウンターリモコン表示</BooleanItem>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import MenuBooleanItem from './MenuBooleanItem'

export default {
  name: 'menu',
  components: {
    BooleanItem: MenuBooleanItem
  },
  data () {
    return {
      roomId: '0a1b2c3d4e5f',
      checkImg: require('../assets/check.png'),
      memberNum: 1,
      menu: {
        'ファイル': false,
        '表示': false,
        'コマ': false,
        'マップ': false,
        '画像': false,
        'ヘルプ': false,
        'ウィンドウ': false
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeDisplay'
    ]),
    menuHover: function (flg, ...targets) {
      for (let target of targets) {
        this.menu[target] = flg
      }
    },
    clickConnect: function () {
      alert('接続は未実装')
    },
    clickRoomInfo: function () {
      alert('ルーム情報は未実装')
    },
    clickPublicMemo: function () {
      alert('共有メモは未実装')
    },
    clickLogout: function () {
      alert('ログアウトは未実装')
    }
  },
  computed: {
    hover1: function () { return this.menuHoverNum === 1 },
    hover2: function () { return this.menuHoverNum === 2 },
    hover3: function () { return this.menuHoverNum === 3 },
    hover4: function () { return this.menuHoverNum === 4 },
    hover5: function () { return this.menuHoverNum === 5 },
    hover6: function () { return this.menuHoverNum === 6 },
    hover7: function () { return this.menuHoverNum === 7 }
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
  z-index: 100;
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
.hoverMenu2 { left: 88px; }
.hoverMenu3 { left: 159px; }
.hoverMenu4 { left: 205px; }
.hoverMenu5 { left: 250px; }
.hoverMenu6 { left: 309px; }
.hoverMenu7 { left: 354px; }
.hoverMenu8 { left: 385px; }

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
