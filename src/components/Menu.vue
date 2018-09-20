<template>
  <div id="menu">
    <div class="menu-button connect" @click="clickConnect">接続</div>
    <div class="span-group">
      <span @mouseenter="menuHover(2, true)" @mouseleave="menuHover(2, false)" :class="{isHover : hover2}">ファイル</span><!--
    --><span @mouseenter="menuHover(3, true)" @mouseleave="menuHover(3, false)" :class="{isHover : hover3}">表示</span><!--
    --><span @mouseenter="menuHover(4, true)" @mouseleave="menuHover(4, false)" :class="{isHover : hover4}">コマ</span><!--
    --><span @mouseenter="menuHover(5, true)" @mouseleave="menuHover(5, false)" :class="{isHover : hover5}">マップ</span><!--
    --><span @mouseenter="menuHover(6, true)" @mouseleave="menuHover(6, false)" :class="{isHover : hover6}">画像</span><!--
    --><span @mouseenter="menuHover(7, true)" @mouseleave="menuHover(7, false)" :class="{isHover : hover7}">ヘルプ</span>
    </div>
    <div class="menu-button room-id" @click="clickRoomInfo">
      ルームID.<span id="room-id">{{ roomId }}</span>
      :
      <span id="member-num">{{ memberNum }}</span>名
    </div>
    <div class="menu-button public-memo" @click="clickPublicMemo">共有メモ</div>
    <div class="menu-button logout" @click="clickLogout">ログアウト</div>
    <div class="hoverMenu hoverMenu2" v-if="menuHoverNum === 2" @mouseenter="menuHover(2, true)" @mouseleave="menuHover(2, false)">
      <div class="item">セーブ</div>
      <div class="item">ロード</div>
      <hr>
      <div class="item">ログアウト</div>
    </div>
    <div class="hoverMenu hoverMenu3" v-if="menuHoverNum === 3" @mouseenter="menuHover(3, true)" @mouseleave="menuHover(3, false)">
      <div class="item">ウィンドウ</div>
      <hr>
      <div class="item">立ち絵表示</div>
      <div class="item">カットイン表示</div>
      <hr>
      <div class="item">座標表示</div>
      <div class="item">マス目表示</div>
      <hr>
      <div class="item">マス目にキャラクターを合わせる</div>
      <div class="item">立ち絵のサイズを自動調整する</div>
      <hr>
      <div class="item">フォントサイズ調整</div>
      <hr>
      <div class="item">ウィンドウ配置初期化</div>
      <div class="item">表示状態初期化</div>
    </div>
    <div class="hoverMenu hoverMenu4" v-if="menuHoverNum === 4" @mouseenter="menuHover(4, true)" @mouseleave="menuHover(4, false)">
      <div class="item">キャラクター追加</div>
      <div class="item">範囲追加</div>
      <div class="item">魔法タイマー追加</div>
      <hr>
      <div class="item">チット作成</div>
      <hr>
      <div class="item">墓場</div>
      <div class="item">キャラクター待合室</div>
      <hr>
      <div class="item">回転マーカーを表示する</div>
    </div>
    <div class="hoverMenu hoverMenu5" v-if="menuHoverNum === 5" @mouseenter="menuHover(5, true)" @mouseleave="menuHover(5, false)">
      <div class="item">マップ変更</div>
      <div class="item">フロアタイル変更モード</div>
      <div class="item">マップマスク追加</div>
      <div class="item">簡易マップ作成</div>
      <hr>
      <div class="item">マップ状態保存</div>
      <div class="item">マップ切り替え</div>
      <hr>
      <div class="item">回転マーカーを表示する</div>
    </div>
    <div class="hoverMenu hoverMenu6" v-if="menuHoverNum === 6" @mouseenter="menuHover(6, true)" @mouseleave="menuHover(6, false)">
      <div class="item">ファイルアップローダー</div>
      <div class="item">Webカメラ撮影</div>
      <hr>
      <div class="item">タグ編集</div>
      <div class="item">画像削除</div>
    </div>
    <div class="hoverMenu hoverMenu7" v-if="menuHoverNum === 7" @mouseenter="menuHover(7, true)" @mouseleave="menuHover(7, false)">
      <div class="item">バージョン</div>
      <div class="item">マニュアル</div>
      <hr>
      <div class="item">チュートリアル動画</div>
      <div class="item">オフィシャルサイトへ</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'menu',
  data () {
    return {
      roomId: '0a1b2c3d4e5f',
      memberNum: 1,
      menuHoverNum: 0
    }
  },
  methods: {
    menuHover: function (_num, _flg) {
      this.menuHoverNum = (!_flg ? 0 : _num)
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
  background: linear-gradient(#F7F8F9, #8BA0AA);
  border-bottom: solid gray 1px;
  padding: 0px 10px;
  font-size: 16px;
}
#menu > * {
  margin: 5px;
  font-size: 80%;
}
.span-group {
  display: inline-block;
  background: linear-gradient(#F7F8F9, #BAC3C7);
  border: solid gray 1px;
  padding: 0px 15px;
}
.span-group span {
  display: inline-block;
  padding: 2px 10px;
}
.span-group span:hover, .span-group span.isHover {
  background: linear-gradient(#BAC3C7, #F7F8F9);
}
.menu-button {
  display: inline-block;
  background: linear-gradient(#F7F8F9, #BAC3C7);
  border: solid gray 1px;
  padding: 2px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.menu-button:hover {
  border: solid #0092ED 1px;
  background: linear-gradient(#EBECED, #AFB8BB);
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
</style>
