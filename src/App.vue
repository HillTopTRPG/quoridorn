<template>
  <div id="app" @wheel.passive="onWheel">
    <!--
    <img src="./assets/logo.png">
    -->
    <GameTable ref="gameTable"/>
    <ChatWindow title="ChatWindow"/>
    <Menu/>
    <AddMapMaskWindow title="AddMapMaskWindow"/>
    <EditMapMaskWindow title="EditMapMaskWindow"/>
    <MapMaskContext/>
  </div>
</template>

<script>
import Menu from './components/Menu'
import ChatWindow from './components/ChatWindow'
import AddMapMaskWindow from './components/AddMapMaskWindow'
import EditMapMaskWindow from './components/EditMapMaskWindow'
import MapMaskContext from './components/MapMaskContext'
import GameTable from './components/GameTable'

export default {
  name: 'App',
  components: {
    GameTable: GameTable,
    Menu: Menu,
    ChatWindow: ChatWindow,
    AddMapMaskWindow: AddMapMaskWindow,
    EditMapMaskWindow: EditMapMaskWindow,
    MapMaskContext: MapMaskContext
  },
  methods: {
    onWheel: function (e) {
      this.$refs['gameTable'].wheel(e.wheelDelta)
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
  color: #2c3e50;
  font-size: 16px;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
