<template>
  <div id="app" @wheel.passive="onWheel">
    <!--
    <img src="./assets/logo.png">
    -->
    <MapView ref="map"/>
  </div>
</template>

<script>
import MapView from './components/Map'

export default {
  name: 'App',
  components: {
    MapView: MapView
  },
  methods: {
    onWheel: function (e) {
      this.$refs['map'].wheel(e.wheelDelta)
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 100%;
  height: 100%;
}

</style>
