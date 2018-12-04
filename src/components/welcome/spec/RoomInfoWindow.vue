<template>
  <SpecFrame property="roomInfoWindow" label-str="プレイルーム情報表示画面" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「共有メモ」の左のボタンを選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>部屋を建てていない場合は未接続の旨を起動ボタンと画面内部に表示</li>
      <li>ルーム名をタイトルに表示</li>
      <li>部屋に招待するためのURLを表示</li>
      <li>ルームメンバーをすべて表示</li>
      <li>各ルームメンバーの部屋復帰用のURLを表示</li>
      <li>ゲームシステムの変更</li>
      <li>見学者の可否の選択</li>
      <li>使用するチャットのタブを設定できる機能</li>
      <li>
        各種初期設定の設定
        <ol>
          <li>チャット表示</li>
          <li>ダイス表示</li>
          <li>イニシアティブ表示</li>
          <li>リソース表示</li>
          <li>チャットパレット表示</li>
          <li>カウンターリモコン表示</li>
          <li>立ち絵表示</li>
          <li>カットイン表示</li>
          <li>座標表示</li>
          <li>マス目表示</li>
          <li>マス目にキャラクターを合わせる</li>
          <li>立ち絵のサイズを自動調整する</li>
          <li>回転マーカーを表示する</li>
          <li>カードピックアップウィンドウ表示</li>
          <li>カード操作ログを表示</li>
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
      <li>ゲームシステムの変更<br>→ 初回リリースに含める機能。</li>
      <li>見学者の可否の選択<br>→ 初回リリースには含めない。運用でカバーお願いします。</li>
      <li>使用するチャットのタブを設定できる機能<br>→ チャット欄から設定できるので初回リリースには含めない。</li>
      <li>各種初期設定の設定<br>→ 初回リリースには含めない機能。</li>
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
