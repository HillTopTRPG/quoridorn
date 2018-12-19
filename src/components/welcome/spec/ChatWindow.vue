<template>
  <SpecFrame property="chatWindow" label-str="チャット画面" lastVersion="1.0.0b2" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「表示」を選択</li>
      <li>「ウィンドウ」にカーソルをあてる</li>
      <li>「チャット表示」を選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>名前の入力</li>
      <li>発言するタブの選択</li>
      <li>タブの編集</li>
      <li>発言内容の入力</li>
      <li>
        機能メニュー
        <ol>
          <li>ボイスチャット</li>
          <li>秘匿チャット</li>
          <li>グループチャット</li>
          <li>
            簡易コマンド<br>一覧に一致する名前の入力で絞り込みが可能<br>ESCキー押下で選択キャンセル
            <ol>
              <li>「!」または「！」<br>→ 発言者の選択</li>
              <li>「>」または「＞」<br>→ グループチャットまたは秘匿チャット先(個人)の選択</li>
              <li>「#」または「＃」<br>→ 出力先タブの選択</li>
            </ol>
          </li>
          <li>使用するダイスボットの選択</li>
          <li>ダイスボットのヘルプを子画面で表示</li>
          <li>独自ダイスボットの登録</li>
          <li>ノベルゲーム風表示</li>
          <li>チャットログ全削除</li>
          <li>
            チャット文字設定
            <ol>
              <li>文字色</li>
              <li>背景色</li>
              <li>文字サイズ</li>
              <li>フォーマット（「時：分」表示）</li>
              <li>別タブメッセージ表示有無</li>
              <li>タブの色分け</li>
            </ol>
          </li>
          <li>点呼／投票</li>
          <li>卓時計</li>
          <li>目覚ましアラーム</li>
          <li>カットイン設定</li>
          <li>BGM設定</li>
          <li>立ち絵設定</li>
          <li>
            ログ保存
            <ol>
              <li>HTML形式<br>→ 出力されたHTML上で様々な見え方の制御ができるようにする。</li>
              <li>テキスト形式</li>
              <li>json形式</li>
            </ol>
          </li>
        </ol>
      </li>
    </SpecItem>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <SpecItem class-str="request" label-str="ユーザ要望">
      <li>複数人を相手にした秘匿チャット</li>
    </SpecItem>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <SpecItem class-str="unImplemented" label-str="未実装事項">
      <li>ボイスチャット</li>
      <li>ダイスボットのヘルプを子画面で表示</li>
      <li>独自ダイスボットの登録</li>
      <li>ノベルゲーム風表示</li>
      <li>チャットログ全削除</li>
      <li>
        チャット文字設定
        <ol>
          <li>背景色</li>
          <li>文字サイズ</li>
          <li>フォーマット（「時：分」表示）</li>
          <li>別タブメッセージ表示有無</li>
          <li>タブの色分け</li>
        </ol>
      </li>
      <li>点呼／投票</li>
      <li>卓時計</li>
      <li>目覚ましアラーム</li>
      <li>カットイン設定</li>
      <li>立ち絵設定</li>
      <li>
        ログ保存
        <ol>
          <li>HTML形式</li>
          <li>テキスト形式</li>
          <li>json形式</li>
        </ol>
      </li>
    </SpecItem>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <SpecItem class-str="unSupport" label-str="実装しない機能">
      <li>機能メニューの「音音声」<br>→ マスターボリューム調整機能で代用可能</li>
      <li>簡易ファイルアップローダー<br>→ 不要と判断</li>
      <li>テキスト読み上げ<br>→ 実装方法がすぐに思いつかない。どうしても欲しいという意見があれば考える</li>
    </SpecItem>
    <!----------------------
     ! 関連項目
     !--------------------->
    <SpecItem class-str="ref" label-str="関連項目">
      <li><SpecLink property="menuBar" title-str="">メインメニュー</SpecLink></li>
    </SpecItem>
  </SpecFrame>
</template>

<script>
import SpecMixin from './SpecMixin'
export default { mixins: [SpecMixin] }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./spec.css">
</style>
