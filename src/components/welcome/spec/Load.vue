<template>
  <SpecFrame property="import" label-str="ロード機能" lastVersion="1.0.0b1" :isSpecFixed="false">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「ファイル」を選択</li>
      <li>「ロード」を選択</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>読み込ませたファイルのどのデータを使うかを選択できるようにする</li>
      <li>
        データの取り込み方法は以下の通り
        <ol>
          <li>
            差分取り込み
            <ol class="importTypeItem">
              <li>取り込み対象情報と完全に一致するデータが無ければ、追加する形で取り込む</li>
              <li>
                「画像を参照するデータ」を一緒にロードした場合、その「参照画像ID」を適切に設定。<br>
                画像を取り込んでいた場合は新しく割り振られた画像IDを設定。<br>
                既存に全く同じデータが存在して取り込まなかった場合は既存の画面IDを設定。
              </li>
            </ol>
          </li>
        </ol>
      </li>
      <li>
        読み込めるデータと取り込み方法は以下の通り
        <ol>
          <li>
            <div class="kind">画像データ</div>
            <ol class="kindItem">
              <li>タグ</li>
              <li>パスワード</li>
              <li>画像データもしくはURL</li>
            </ol>
            <div class="importType">取り込み方法：差分取り込み</div>
          </li>
          <li>
            <div class="kind">キャラクター</div>
            <div class="kindItem">
              <label>情報項目：</label>
              <ol>
                <li>キャラクター機能で使う情報すべて</li>
                <li>そのキャラの立ち絵設定</li>
                <li>そのキャラのチャットパレット</li>
                <li>そのキャラのイニシアティブ表の情報</li>
              </ol>
            </div>
            <div class="importType"><label>取り込み方法：</label><span>差分取り込み</span></div>
          </li>
          <li>
            <div class="kind">カード</div>
            <div class="kindItem">
              <label>情報項目：</label>
              <ol>
                <li>山札情報</li>
                <li>各カードの所在と順序と状態(裏表など)</li>
              </ol>
            </div>
            <div class="importType"><label>取り込み方法：</label><span>差分取り込み</span></div>
          </li>
          <li>
            <div class="kind">BGM</div>
            <div class="kindItem">
              <label>情報項目：</label>
              <ol>
                <li>BGM機能で使う情報すべて</li>
                <li>再生中のBGM情報</li>
              </ol>
            </div>
            <div class="importType"><label>取り込み方法：</label><span>差分取り込み</span></div>
          </li>
          <li>
            <div class="kind">カットイン</div>
            <div class="kindItem">
              <label>情報項目：</label>
              <ol>
                <li>カットイン機能で使う情報すべて</li>
                <li>再生中のカットイン情報</li>
              </ol>
            </div>
            <div class="importType"><label>取り込み方法：</label><span>差分取り込み</span></div>
          </li>
          <li>
            <div class="kind">範囲</div>
          </li>
          <li>
            <div class="kind">チット</div>
          </li>
          <li>
            <div class="kind">フロアタイル</div>
          </li>
          <li>
            <div class="kind">マップマスク</div>
          </li>
          <li>
            <div class="kind">簡易マップ</div>
          </li>
          <li>
            <div class="kind">マップマーカー</div>
          </li>
          <li>
            <div class="kind">ダイスシンボル</div>
          </li>
          <li>
            <div class="kind">ダイスボット表</div>
          </li>
          <li>
            <div class="kind">ダイスシンボル</div>
            <div class="kindItem"><label>情報項目：</label><span>当該機能で使う情報すべて。</span></div>
            <div class="importType"><label>取り込み方法：</label><span>差分取り込み</span></div>
          </li>
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
      <li>現状を整理中</li>
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
