<template>
  <SpecFrame property="environment" label-str="動作環境" lastVersion="1.0.0b1" :isSpecFixed="true">
    <!----------------------
     ! 現在の推奨環境
     !--------------------->
    <SpecItem class-str="spec" label-str="現在の推奨環境">
      <li><i class="icon-windows"></i>Windows10 - <i class="icon-chrome"></i>Google Chrome最新版</li>
    </SpecItem>
    <!----------------------
     ! 理想の推奨環境
     !--------------------->
    <SpecItem class-str="spec" label-str="理想の推奨環境">
      <li><i class="icon-windows"></i>Windows10 - <i class="icon-chrome"></i>Google Chrome最新版</li>
      <li><i class="icon-windows"></i>Windows10 - <i class="icon-firefox"></i>Fire Fox最新版</li>
    </SpecItem>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <SpecItem class-str="request" label-str="ユーザ要望">
      <li><i class="icon-appleinc"></i>Macintosh (- <i class="icon-safari"></i>Safari)</li>
    </SpecItem>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <SpecItem class-str="unImplemented" label-str="未実装事項">
      <li><i class="icon-windows"></i>Windows10 - <i class="icon-firefox"></i>Fire Fox最新版<br>→ 初回リリースには含めない。</li>
      <li><i class="icon-appleinc"></i>Macintosh (- <i class="icon-safari"></i>Safari)<br>→ 開発者がMac持ってない。<br>→ Mac対応希望の旨を明記した開発支援が合計4万円を超えたらMac購入。</li>
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
