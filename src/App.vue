<template>
  <div id="app" @wheel.passive="onWheel" @contextmenu.prevent>
    <!--
    <img src="./assets/logo.png">
    -->
    <GameTable ref="gameTable"/>
    <ChatWindow title="ChatWindow"/>
    <Menu/>
    <AddMapMaskWindow title="AddMapMaskWindow"/>
    <EditMapMaskWindow title="EditMapMaskWindow"/>
    <MapMaskContext/>
    <UnSupportWindo/>
    <GameTableContext/>
    <DevLogWindow/>
    <FunctionListWindow/>
    <PublicMemoWindow/>
    <BugFormWindow/>
    <AddCharacterSettingWindow/>
    <AddCharacterWindow/>
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
import BugFormWindow from './components/simple/BugFormWindow'
import AddCharacterSettingWindow from './components/map/character/AddCharacterSettingWindow'
import AddCharacterWindow from './components/map/character/AddCharacterWindow'

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
    BugFormWindow: BugFormWindow,
    AddCharacterSettingWindow: AddCharacterSettingWindow,
    AddCharacterWindow: AddCharacterWindow
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

img { opacity: 0; }
canvas { opacity: 0; }
img.loaded,
canvas.loaded {
  opacity: 0;
}

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
