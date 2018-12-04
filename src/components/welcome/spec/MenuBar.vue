<template>
  <SpecFrame property="menuBar" label-str="メインメニュー" lastVersion="1.0.0b1" :isSpecFixed="false">
    <!----------------------
     ! 起動操作
     !--------------------->
    <SpecItem class-str="operation" label-str="起動操作">
      <li>画面上部に最初から表示されているメニュー</li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="仕様">
      <li>角丸のボタンと展開型の選択肢で構成する</li>
      <li>項目は今後の機能増強に伴って増減する可能性あり<span class="unFixed">[仕様未確定事項]</span></li>
      <li>
        メニュー項目
        <ol>
          <li><SpecLink property="connect" title-str="「接続機能」の項へ">「接続」ボタン</SpecLink></li>
          <li>
            展開型の選択肢
            <ol>
              <li>
                ファイル
                <ol>
                  <li><SpecLink property="export" title-str="">セーブ</SpecLink></li>
                  <li><SpecLink property="import" title-str="">ロード</SpecLink></li>
                </ol>
              </li>
              <li>
                表示
                <ol>
                  <li>
                    ウィンドウ
                    <ol>
                      <li><SpecLink property="chatWindow" title-str="">チャット表示</SpecLink></li>
                      <li><SpecLink property="settingViewDice" title-str="">ダイス表示</SpecLink></li>
                      <li><SpecLink property="initiativeWindow" title-str="">イニシアティブ表示</SpecLink></li>
                      <li><SpecLink property="resourceWindow" title-str="">リソース表示</SpecLink></li>
                      <li><SpecLink property="chatPaletteWindow" title-str="">チャットパレット表示</SpecLink></li>
                      <li><SpecLink property="counterRemoteControlWindow" title-str="">カウンターリモコン表示</SpecLink></li>
                    </ol>
                  </li>
                  <li><SpecLink property="changeFontSizeWindow" title-str="">フォントサイズ調整</SpecLink></li>
                  <li><SpecLink property="resetAllWindow" title-str="">ウィンド配置初期化</SpecLink></li>
                </ol>
              </li>
              <li>
                コマ
                <ol>
                  <li><SpecLink property="addCharacterWindow" title-str="">キャラクター追加</SpecLink></li>
                  <li><SpecLink property="addRangeWindow" title-str="">範囲追加</SpecLink></li>
                  <li><SpecLink property="addChitWindow" title-str="">チット追加</SpecLink></li>
                  <li><SpecLink property="graveyardWindow" title-str="">墓場</SpecLink></li>
                  <li><SpecLink property="waitingRoomWindow" title-str="">キャラクター待合室</SpecLink></li>
                </ol>
              </li>
              <li>
                マップ
                <ol>
                  <li><SpecLink property="editMapWindow" title-str="">マップ変更</SpecLink></li>
                  <li><SpecLink property="editFloorTileMode" title-str="">フロアタイル変更モード</SpecLink></li>
                  <li><SpecLink property="addMapMaskWindow" title-str="">マップマスク追加</SpecLink></li>
                  <li><SpecLink property="createEasyMapWindow" title-str="">簡易マップ作成</SpecLink></li>
                  <li><SpecLink property="saveMapWindow" title-str="">マップ状態保存</SpecLink></li>
                  <li><SpecLink property="loadMapWindow" title-str="">マップ切り替え</SpecLink></li>
                </ol>
              </li>
              <li>
                画像
                <ol>
                  <li><SpecLink property="fileUploaderWindow" title-str="">ファイルアップローダー</SpecLink></li>
                  <li><SpecLink property="editImageTagWindow" title-str="">タグ編集</SpecLink></li>
                  <li><SpecLink property="deleteImageWindow" title-str="">画像削除</SpecLink></li>
                </ol>
              </li>
              <li>
                ヘルプ
                <ol>
                  <li><SpecLink property="welcomeWindowSpec" title-str="">ようこそ画面</SpecLink></li>
                  <li><SpecLink property="versionWindow" title-str="">バージョン</SpecLink></li>
                  <li><SpecLink property="manualWindow" title-str="">マニュアル</SpecLink></li>
                  <li><SpecLink property="officialSiteLink" title-str="">オフィシャルサイトへ</SpecLink></li>
                </ol>
              </li>
            </ol>
          </li>
          <li><SpecLink property="roomInfoWindow" title-str="「プレイルーム情報表示画面」の項へ">「プレイルーム情報表示」ボタン</SpecLink></li>
          <li><SpecLink property="addPublicMemoWindow" title-str="「共有メモ追加画面」の項へ">「共有メモ」ボタン</SpecLink></li>
          <li><SpecLink property="logout" title-str="「ログアウト」の項へ">「ログアウト」ボタン</SpecLink></li>
        </ol>
      </li>
    </SpecItem>
    <!----------------------
     ! 仕様
     !--------------------->
    <SpecItem class-str="spec" label-str="展開型の選択肢の仕様">
      <li>初期表示の各項目を選択すると展開モードになる</li>
      <li>展開モード中はマウス移動に合わせて各選択肢が展開・格納される</li>
      <li>展開モードが解除されるのは初期表示の各項目を再度選択するか、画面を起動する選択肢を選択した場合</li>
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
      <li>なし</li>
    </SpecItem>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <SpecItem class-str="unSupport" label-str="実装しない機能">
      <li>なし</li>
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
