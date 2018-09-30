<template>
  <div id="app" @wheel.passive="onWheel" @contextmenu.prevent>
    <!--
    <img src="./assets/logo.png">
    -->
    <GameTable ref="gameTable"/>
    <ChatWindow/>
    <Menu/>
    <AddMapMaskWindow/>
    <EditMapMaskWindow/>
    <MapMaskContext/>
    <UnSupportWindo/>
    <GameTableContext/>
    <DevLogWindow/>
    <FunctionListWindow/>
    <PublicMemoWindow/>
    <AddCharacterSettingWindow/>
    <AddCharacterWindow/>
    <CharacterContext/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Menu from './components/menu/Menu'
import ChatWindow from './components/chat/ChatWindow'
import AddMapMaskWindow from './components/map/mapMask/AddMapMaskWindow'
import EditMapMaskWindow from './components/map/mapMask/EditMapMaskWindow'
import MapMaskContext from './components/map/mapMask/MapMaskContext'
import GameTable from './components/map/GameTable'
import UnSupportWindo from './components/UnSupportWindow'
import GameTableContext from './components/map/GameTableContext'
import DevLogWindow from './components/simple/DevLogWindow'
import FunctionListWindow from './components/simple/FunctionListWindow'
import PublicMemoWindow from './components/public-memo/PublicMemoWindow'
import AddCharacterSettingWindow from './components/map/character/AddCharacterSettingWindow'
import AddCharacterWindow from './components/map/character/AddCharacterWindow'
import CharacterContext from './components/map/character/CharacterContext'

export default {
  name: 'App',
  components: {
    GameTable: GameTable,
    Menu: Menu,
    ChatWindow: ChatWindow,
    AddMapMaskWindow: AddMapMaskWindow,
    EditMapMaskWindow: EditMapMaskWindow,
    MapMaskContext: MapMaskContext,
    UnSupportWindo: UnSupportWindo,
    GameTableContext: GameTableContext,
    DevLogWindow: DevLogWindow,
    FunctionListWindow: FunctionListWindow,
    PublicMemoWindow: PublicMemoWindow,
    AddCharacterSettingWindow: AddCharacterSettingWindow,
    AddCharacterWindow: AddCharacterWindow,
    CharacterContext: CharacterContext
  },
  mounted: function () {
    this.onMount()
  },
  methods: {
    ...mapMutations([
      'onMount'
    ]),
    onWheel: function (e) {
      this.$refs['gameTable'].onWheel(e.wheelDelta)
    }
  }
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
  background-color: #92A8B3;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* サイズ調整（コンテンツを比率を変えずに内側にフィット） */
img { object-fit: contain; }
div.img { opacity: 0; background-size: contain; background-repeat: no-repeat; background-position: center; }

.anime { opacity: 0; }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

</style>
