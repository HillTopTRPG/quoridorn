<template>
  <SpecFrame property="addCharacterWindow" label-str="キャラクター追加画面" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作１">
      <li>画面上部メニューの「コマ」を選択</li>
      <li>「キャラクター追加」を選択</li>
    </SpecItem>
    <SpecItem class-str="operation" label-str="起動操作２">
      <li>マップを右クリック</li>
      <li>表示されたメニューの「キャラクター追加」を選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>画像選択 → 後述の「画像選択」の項参照</li>
      <li>画像切替設定（コマダブルクリックで画像を切替えるための設定）</li>
      <li>名前入力</li>
      <li>サイズ設定</li>
      <li>参照URLの指定</li>
      <li>マップマスクの下に隠す設定</li>
      <li>その他情報の指定</li>
      <li>イニシアティブ表の情報の入力</li>
      <li>「射界」の設定 → 後述の「射界」の項参照</li>
      <li>追加後に編集可能</li>
      <li>追加後に削除可能</li>
    </SpecItem>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <SpecItem class-str="request" label-str="ユーザ要望">
      <li>画像指定時に回転させたい（画像を用意する枚数削減）<br>→ 余裕があれば初回リリースに含める機能。「画像選択」の項目に転載</li>
      <li>キャラに「ステータス」を持たせて、それをコマに表示させたい<br>→ 余裕があれば初回リリースに含める機能。<br>→ イニシアティブ表への指定にて実装する予定。</li>
    </SpecItem>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <SpecItem class-str="unImplemented" label-str="未実装事項">
      <li>マップマスクの下に隠す設定<br>→ 初回リリースに含める機能。</li>
      <li>イニシアティブ表の情報の入力<br>→ 初回リリースに含める機能。</li>
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
