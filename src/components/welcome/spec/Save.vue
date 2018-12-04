<template>
  <SpecFrame property="export" label-str="セーブ機能" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作１">
      <li>画面上部メニューの「ファイル」を選択</li>
      <li>「セーブ」を選択</li>
    </SpecItem>
    <SpecItem class-str="operation" label-str="起動操作２">
      <li>ショートカットで起動<ul>
          <li>Windowsの場合：Ctrl + s</li>
          <li>Macの場合：Command + s</li>
        </ul>
      </li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>その時点でのQuoridornの状態をzipファイルでダウンロード</li>
      <li>メニューから選択できるオプション<a href="#ref_menuOption_selectSaveData">「セーブデータの選択」</a>が有効の場合、zipファイルに含めるデータを選ぶ画面<a href="#ref_selectSaveDataWindow">「セーブデータ選択画面」</a>を表示する</li>
      <li>セーブデータを選択しない場合、すべての状態をzipファイルとしてダウンロードする</li>
      <li>画像や音楽のデータ部分、秘匿チャットの内容については暗号化を施す</li>
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
      <li>Macの場合のショートカット<br>→ Macが買えたら実装する</li>
      <li><a href="#ref_selectSaveDataWindow">「セーブデータ選択画面」</a>が未実装のため、画面表示機能がない<br>→ 初回リリースに含める機能。</li>
      <li>データの暗号化<br>→ 初回リリースに含める機能。</li>
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
