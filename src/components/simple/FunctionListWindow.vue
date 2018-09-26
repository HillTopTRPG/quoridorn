<template>
  <WindowFrame title="デモ版 - 現時点の仕様" display-property="functionListWindow" align="center" fixSize="500, 600">
    <ol class="contents">
      <li>
        <h4>メニュー</h4>
        <label>[実装済みメニュー]</label>
        <ul>
          <li>「表示」>「ウィンドウ」>「チャット表示」</li>
          <li>「表示」>「座標表示」</li>
          <li>「表示」>「マス目表示」</li>
          <li>「表示」>「マス目にキャラクターを合わせる」</li>
          <li>「マップ」>「マップマスク追加」</li>
          <li>「デモ」>「開発履歴」</li>
          <li>「デモ」>「現時点の仕様」（このウィンドウの表示）</li>
        </ul>
        <label>[ポイント]</label>
        <ul>
          <li>右ドラッグによる回転は15度単位で調整します。</li>
          <li>「座標表示」オプション（画面上部メニュー > 「表示」>「座標表示」）</li>
          <li>「マス目表示」オプション（操作は同上）</li>
          <li>「マス目にキャラクターを合わせる」オプション（操作は同上）</li>
        </ul>
      </li>
      <li>
        <h4>マップ</h4>
        <label>[操作方法]</label>
        <ul>
          <li>左クリック：何もしない</li>
          <li>左ドラッグ：マップを上下左右に移動</li>
          <li>中クリック：何もしない</li>
          <li>ホイール：マップを拡大縮小</li>
          <li>右クリック：メニュー表示</li>
          <li>右ドラッグ：マップを回転</li>
        </ul>
        <label>[ポイント]</label>
        <ul>
          <li>右ドラッグによる回転は15度単位で調整します。</li>
          <li>「座標表示」オプション（画面上部メニュー >「表示」>「座標表示」）</li>
          <li>「マス目表示」オプション（操作は同上）</li>
          <li>「マス目にキャラクターを合わせる」オプション（操作は同上）</li>
        </ul>
      </li>
      <li>
        <h4>マップマスク</h4>
        <label>[表示方法1]</label>
        <ul>
          <li>画面上部メニュー >「マップ」>「マップマスク追加」</li>
          <li>マスク情報を入力して、右側に表示されているマスクをマップにドロップイン</li>
        </ul>
        <label>[表示方法2]</label>
        <ul>
          <li>マップ右クリック >「マップマスク追加」</li>
          <li>マスク情報を入力して、右側に表示されているマスクをマップにドロップイン</li>
        </ul>
        <label>[ポイント]</label>
        <ul>
          <li>マップ上のマスクはドラッグで移動可能</li>
          <li>マップマスクは回転しない</li>
        </ul>
        <label>[実装予定]</label>
        <ul>
          <li>「複数作成」オプションの適用</li>
          <li>「マス目にキャラクターを合わせる」オプションを外した際のマップマスクの移動先が、常にマウス位置を左上とした座標になってしまう不具合の修正</li>
        </ul>
      </li>
      <li>
        <h4>チャット</h4>
        <label>[表示方法]</label>
        <ul>
          <li>（消してしまったら…）</li>
          <li>画面上部メニュー >「表示」>「ウィンドウ」>「チャット表示」</li>
        </ul>
        <label>[ポイント]</label>
        <ul>
          <li>マップ上のマスクはドラッグで移動可能</li>
          <li>マップマスクは回転しない</li>
        </ul>
        <label>[実装予定]</label>
        <ul>
          <li>タブ追加機能</li>
          <li>ダイスボット表追加・管理機能</li>
          <li>チャットログ全削除機能</li>
          <li>チャット文字設定機能</li>
          <li>点呼機能</li>
          <li>カットイン機能</li>
          <li>立ち絵設定機能</li>
          <li>セレクトボックスにマウスカーソルを乗せることでのダイスボットのヘルプ文言の表示</li>
          <li>ダイスロールアニメーション</li>
          <li>ダイスロール効果音</li>
          <li>シークレットダイス結果表示機能</li>
          <li>キャラクターに設定された名前の選択機能</li>
          <li>秘匿チャット</li>
        </ul>
      </li>
    </ol>
  </WindowFrame>
</template>

<script>
import { mapMutations } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  components: {
    WindowFrame: WindowFrame
  },
  methods: {
    ...mapMutations([])
  },
  computed: {
    title: function () {
      return this.$store.state.display.unSupportWindow.title
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  overflow-y: scroll;
  height: calc(100% - 5px);
  white-space: normal;
  word-break: break-all;
  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
}
h4 {
  margin: 0;
  color: blue;
  display: inline;
}
ul {
  margin: 0;
  padding-left: 0px;
  font-size: 12px;
  display: block;
}
ol {
  padding-left: 0px;
  counter-reset: item;
  list-style-type: none;
  display: block;
  margin-top: 5px;
  margin-bottom: 0;
  margin-left: 15px;
}
label {
  font-size: 12px;
  font-weight: bold;
  display: block;
  margin-left: 20px;
}
ol > li {
  text-indent: -1.3em;
  padding-left: 1.3em;
}
ol > li:not(:last-child) {
  margin-bottom: 20px;
}
ol > li:before {
  counter-increment: item;
  content: counter(item)'. ';
  color: blue;
}
ul > li {
  color: rgb(60, 60, 60);
  text-indent: 0;
}
</style>
