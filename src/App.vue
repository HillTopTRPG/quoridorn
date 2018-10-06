<template>
  <div id="app" @wheel.passive="onWheel" @contextmenu.prevent>
    <!--
    <img src="./assets/logo.png">
    -->
    <GameTable ref="gameTable"/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import GameTable from './components/map/GameTable'

export default {
  name: 'App',
  components: {
    GameTable: GameTable
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
