<template>
  <SpecFrame property="playerBoxWindow" label-str="プレイヤーボックス画面" lastVersion="1.0.0b2" :isSpecFixed="false">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「表示」を選択</li>
      <li>「ウィンドウ」にカーソルをあてる</li>
      <li>「プレイヤーボックス表示」を選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>セレクトボックスからプレイヤーを選ぶことで、そのプレイヤーが所持するオブジェクトの一覧を表示する。</li>
      <li>プレイヤーのチャット文字色を変更できる</li>
      <li>プレイヤーが所持するキャラクターのチャット文字色を変更できる</li>
      <li>その他簡易的な設定変更機能を随時追加していく予定</li>
    </SpecItem>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <SpecItem class-str="request" label-str="ユーザ要望">
      <li>なし</li>
    </SpecItem>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <SpecItem class-str="unImplemented" label-str="未実装事項">
      <li>その他簡易的な設定変更機能<br>→ 便利そうな機能があれば追加していく。</li>
    </SpecItem>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <SpecItem class-str="unSupport" label-str="実装しない機能">
      <li>なし</li>
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
