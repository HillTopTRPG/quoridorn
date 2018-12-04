<template>
  <SpecFrame property="addMapMaskWindow" label-str="マップマスク追加機能" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作１">
      <li>画面上部メニューの「マップ」を選択</li>
      <li>「マップマスク追加」を選択</li>
    </SpecItem>
    <SpecItem class-str="operation" label-str="起動操作２">
      <li>マップを右クリック</li>
      <li>表示されたメニューの「マップマスク追加」を選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>中に表示する文字の入力</li>
      <li>表示色（＋透明度）の選択</li>
      <li>サイズ指定</li>
      <li>「射界」の設定 → 後述の「射界」の項参照</li>
      <li>マップマスクはすべてのマップオブジェクトの中で最も下に表示される</li>
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
      <li>「射界」機能<br>→ マップマスクへの反映は優先度低め。余裕があれば初回リリースに含める。</li>
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
