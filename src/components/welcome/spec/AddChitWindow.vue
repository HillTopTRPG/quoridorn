<template>
  <SpecFrame property="addChitWindow" label-str="チット追加" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「コマ」を選択</li>
      <li>「チット追加」を選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>マップオブジェクトの一種</li>
      <li>画像とマウスオーバー時に表示される説明文のみが設定できる</li>
      <li>画像選択 → 後述の「画像選択」の項参照</li>
      <li>「射界」の設定 → 後述の「射界」の項参照</li>
      <li>追加後に編集可能（どどんとふではチットの編集不可）</li>
      <li>追加後に削除可能</li>
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
      <li>「射界」機能<br>→ チットへの反映は優先度低め。余裕があれば初回リリースに含める。</li>
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
