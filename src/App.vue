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
  </div>
</template>

<script>
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
    PublicMemoWindow: PublicMemoWindow
  },
  methods: {
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
