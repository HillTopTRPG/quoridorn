<template>
  <WindowFrame titleText="ようこそ" display-property="private.display.welcomeWindow" align="center" fixSize="500, 500" :fontSizeBar="true">
    <div class="contents" id="welcomeWindowContents">
      <!----------------------------------------------------------------------------------
       ! ロゴ
       !--------------------------------------------------------------------------------->
      <div id="logo-container">
        <Logo></Logo>
      </div>

      <!----------------------------------------------------------------------------------
       ! タブ
       !--------------------------------------------------------------------------------->
      <div class="tab_wrap">
        <input id="welcomeWindow-tab1" type="radio" name="tab_btn" checked>
        <input id="welcomeWindow-tab2" type="radio" name="tab_btn">
        <input id="welcomeWindow-tab3" type="radio" name="tab_btn">
        <input id="welcomeWindow-tab4" type="radio" name="tab_btn">

        <div class="tab_area">
          <label class="tab1_label" for="welcomeWindow-tab1">仕様一覧</label>
          <label class="tab2_label" for="welcomeWindow-tab2">出典元情報</label>
          <label class="tab3_label" for="welcomeWindow-tab3">開発支援</label>
          <!--<label class="tab4_label" for="welcomeWindow-tab4">????</label>-->
        </div>
        <div class="panel_area">
          <!--------------------------------
           ! タブ１ - 仕様一覧
           !------------------------------->
          <div id="panel1" class="tab_panel">
            <div class="spec-header">
              <button class="open" @click="specAll(true)">全て開く</button>
              <button class="close" @click="specAll(false)">全て閉じる</button>
            </div>
            <div class="menu">
              <Environment/><!-- 動作環境 -->
              <MenuBar/><!-- メインメニュー -->
              <Save/><!-- セーブ機能 -->
              <Load/><!-- ロード機能 -->
              <ChatWindow/><!-- チャット画面 -->
              <DiceWindow/><!-- ダイス画面 -->
              <ChangeFontSizeWindow/><!-- フォントサイズ調整画面 -->
              <ResetAllWindow/><!-- ウィンドウ配置初期化機能 -->
              <AddCharacterWindow/><!-- キャラクター追加画面 -->
              <AddRangeWindow/><!-- 範囲追加画面 -->
              <AddChitWindow/><!-- チット追加画面 -->
              <GraveyardWindow/><!-- 墓場画面 -->
              <WaitingRoomWindow/><!-- キャラクター待合室画面 -->
              <EditMapWindow/><!-- マップ変更画面 -->
              <EditFloorTileMode/><!-- フロアタイル変更モード -->
              <AddMapMaskWindow/><!-- マップマスク追加機能 -->
              <CreateEasyMapWindow/><!-- 簡易マップ作成機能 -->
              <SaveMapWindow/><!-- マップ状態保存画面 -->
              <LoadMapWindow/><!-- マップ切り替え画面 -->
              <FileUploaderWindow/><!-- ファイルアップローダー画面 -->
              <EditImageTagWindow/><!-- (画像)タグ編集画面 -->
              <DeleteImageWindow/><!-- 画像削除画面 -->
              <WelcomeWindowSpec/><!-- ようこそ画面 -->
              <VersionWindow/><!-- バージョン画面 -->
              <ManualWindow/><!-- マニュアル画面 -->
              <OfficialSiteLink/><!-- オフィシャルサイトへ -->
              <RoomInfoWindow/><!-- プレイルーム情報表示画面 -->
              <AddPublicMemoWindow/><!-- 共有メモ追加画面 -->
              <Logout/><!-- ログアウト -->
            </div>
            <a class="toTop" href="#logo-container"><div class="rotate90">＜</div><div>TOP</div></a>
          </div>
          <!--------------------------------
           ! タブ２ - 出典元情報
           !------------------------------->
          <div id="panel2" class="tab_panel"><Source/></div>
          <!--------------------------------
           ! タブ３ - 開発支援
           !------------------------------->
          <div id="panel3" class="tab_panel"><DevSupport/></div>
        </div>
      </div>
      <!-- tab_wrap -->
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'

import Environment from './spec/Environment'
import MenuBar from './spec/MenuBar'
import Save from './spec/Save'
import Load from './spec/Load'
import ChatWindow from './spec/ChatWindow'
import DiceWindow from './spec/DiceWindow'
import ChangeFontSizeWindow from './spec/ChangeFontSizeWindow'
import ResetAllWindow from './spec/ResetAllWindow'
import AddCharacterWindow from './spec/AddCharacterWindow'
import AddRangeWindow from './spec/AddRangeWindow'
import AddChitWindow from './spec/AddChitWindow'
import GraveyardWindow from './spec/GraveyardWindow'
import WaitingRoomWindow from './spec/WaitingRoomWindow'
import EditMapWindow from './spec/EditMapWindow'
import EditFloorTileMode from './spec/EditFloorTileMode'
import AddMapMaskWindow from './spec/AddMapMaskWindow'
import CreateEasyMapWindow from './spec/CreateEasyMapWindow'
import SaveMapWindow from './spec/SaveMapWindow'
import LoadMapWindow from './spec/LoadMapWindow'
import FileUploaderWindow from './spec/FileUploaderWindow'
import EditImageTagWindow from './spec/EditImageTagWindow'
import DeleteImageWindow from './spec/DeleteImageWindow'
import WelcomeWindowSpec from './spec/WelcomeWindowSpec'
import VersionWindow from './spec/VersionWindow'
import ManualWindow from './spec/ManualWindow'
import OfficialSiteLink from './spec/OfficialSiteLink'
import RoomInfoWindow from './spec/RoomInfoWindow'
import AddPublicMemoWindow from './spec/AddPublicMemoWindow'
import Logout from './spec/Logout'

import Logo from '../simple/Logo'
import Source from './source/Source'
import DevSupport from './devSupport/DevSupport'

export default {
  name: 'welcomeWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    Logo,
    Environment,
    MenuBar,
    Save,
    Load,
    ChatWindow,
    DiceWindow,
    ChangeFontSizeWindow,
    ResetAllWindow,
    AddCharacterWindow,
    AddRangeWindow,
    AddChitWindow,
    GraveyardWindow,
    WaitingRoomWindow,
    EditMapWindow,
    EditFloorTileMode,
    AddMapMaskWindow,
    CreateEasyMapWindow,
    SaveMapWindow,
    LoadMapWindow,
    FileUploaderWindow,
    EditImageTagWindow,
    DeleteImageWindow,
    WelcomeWindowSpec,
    VersionWindow,
    ManualWindow,
    OfficialSiteLink,
    RoomInfoWindow,
    AddPublicMemoWindow,
    Logout,
    Source,
    DevSupport
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions([]),
    specAll (openFlg) {
      const elms = document.getElementById('welcomeWindowContents').querySelectorAll('input[type=checkbox]')
      Array.prototype.slice.call(elms)
        .filter(elm => elm.checked !== openFlg)
        .forEach(elm => elm.click())
    }
  },
  computed: mapState({
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contents {
    /*position: absolute;*/
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  #logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.3em;
    font-size: 16px;
    pointer-events: none;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }

  .tab_wrap { width: 100%; margin: 0; }
  input[type="radio"] { display:none; }
  .tab_area { font-size: 0; margin:0; }
  .tab_area label {
    width: 23.5%;
    margin: 0 0 0 1.2%;
    box-sizing: border-box;
    display: inline-block;
    padding: 0.2em 0;
    color: #999;
    background: #ddd;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
    /*transition: ease 0.2s opacity;*/
    border: 1px solid #777;
    border-top-left-radius: 0.5em;
    -webkit-border-top-left-radius: 0.5em;
    -moz-border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    -webkit-border-top-right-radius: 0.5em;
    -moz-border-top-right-radius: 0.5em;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }
  /*.tab_area label:hover { opacity:0.5; }*/
  .panel_area {
    /*background:#fff;*/
    /*border: 1px solid red;*/
    margin-top: -1px;
    /*padding: 0 0.5em 0.5em;*/
  }
  .tab_panel { padding: 0; display: none; }
  .tab_panel p { font-size:14px; letter-spacing:1px; text-align:center; }

  #welcomeWindow-tab1:checked ~ .tab_area .tab1_label,
  #welcomeWindow-tab2:checked ~ .tab_area .tab2_label,
  #welcomeWindow-tab3:checked ~ .tab_area .tab3_label,
  #welcomeWindow-tab4:checked ~ .tab_area .tab4_label {
    background: #fff;
    color: #000;
    border-bottom-color: transparent;
  }
  #welcomeWindow-tab1:checked ~ .panel_area #panel1,
  #welcomeWindow-tab2:checked ~ .panel_area #panel2,
  #welcomeWindow-tab3:checked ~ .panel_area #panel3,
  #welcomeWindow-tab4:checked ~ .panel_area #panel4 {
    display:block;
  }

  .spec-header {
    padding: 0.2rem;
    border: 1px solid #777;
    border-bottom: none;
    background-color: white;
    line-height: 1em;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .spec-header button {
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0 0 0 1em;
    margin-right: 0.5rem;
    position: relative;
    color: rgb(90, 131, 177);
    font-size: 90%;
    box-sizing: border-box;
  }
  .spec-header button:hover {
    color: rgb(231, 50, 45);
  }
  .spec-header button:before {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 50%;
    left: 0;
    border: 0.4em solid transparent;
  }
  .spec-header button.open:before {
    border-top: 0.4em solid rgb(90, 131, 177);
    transform: translateY(-25%);
  }
  .spec-header button.open:hover:before {
    border-top-color: rgb(231, 50, 45);
  }
  .spec-header button.close:before {
    border-bottom: 0.4em solid rgb(90, 131, 177);
    transform: translateY(-75%);
  }
  .spec-header button.close:hover:before {
    border-bottom-color: rgb(231, 50, 45);
  }

  .menu {
    padding: 0 0.5em 0.5em;
    background-color: white;
    border: 1px solid #777;
    border-top: none;
  }

  .toTop {
    position: absolute;
    bottom: 0.5rem;
    right: 1.5rem;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    background-color: rgb(50, 146, 246);
    color: rgb(227, 253, 255);
    display: flex;
    flex-direction : column;
    justify-content: center;
    align-items: center;
    box-shadow: 1px 1px 2px #94866a;
    cursor: pointer;
    text-decoration: none;
  }
  .toTop:hover {
    background-color: rgb(30, 126, 226);
  }
  .rotate90 {
    transform: rotate(90deg);
  }
</style>
