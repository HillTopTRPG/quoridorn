<template>
  <SpecFrame property="loadMapWindow" label-str="マップ切り替え" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作">
        <li>画面上部メニューの「マップ」を選択</li>
        <li>「マップ切り替え」を選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>マップ状態保存機能で保存したデータを参照させることで、マップ状態を復元する</li>
      <li>
        復元時に、復元前に配置されていた以下のデータを削除するか選択する
        <ol>
          <li>フロアタイル</li>
          <li>マップマスク</li>
          <li>簡易マップ</li>
        </ol>
      </li>
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
      <li>本機能自体が未実装<br>→ 初回リリースには含めない。しばらくは運用でカバーをお願いします。</li>
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
import SpecMixIn from './SpecMixIn'
export default { mixins: [SpecMixIn] }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./spec.css">
</style>
