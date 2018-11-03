<template>
  <div class="volumeComponent">
    <input class="volume" :class="{muted: isMuted, masterMute: masterMute}" type="range" min="0" max="1" step="0.01" v-model="volume" @input="changeVolume">
    <span class="icon mute" :class="{muted: isMuted, masterMute: masterMute}" @click="clickMuted()" v-show="!isMuted"><i class="icon-volume-high"></i></span>
    <span class="icon mute" :class="{muted: isMuted, masterMute: masterMute}" @click="clickMuted()" v-show="isMuted"><i class="icon-volume-mute"></i></span>
    <span class="volumeText">{{Math.round(volume * 100)}}</span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'volumeComponent',
  props: {
    'initVolume': { type: Number, required: true }
  },
  data () {
    return {
      volume: 0,
      isMuted: false,
      masterVolume: 1,
      masterMute: false
    }
  },
  mounted () {
    this.volume = this.initVolume
    // this.changeVolume()
    this.$emit('mounted')
  },
  methods: {
    ...mapActions([]),
    clickMuted (flg = !this.isMuted) {
      if (this.isMuted === flg) return
      this.isMuted = flg
      this.changeMuted()
    },
    changeMuted () {
      this.$emit('mute', this.masterMute || this.isMuted)
    },
    changeVolume () {
      this.clickMuted(false)
      this.$emit('volume', this.volume * this.masterVolume)
    },
    setMasterMute (flg) {
      this.masterMute = flg
      this.$emit('mute', this.masterMute || this.isMuted)
    },
    setMasterVolume (volume) {
      this.masterVolume = volume
      this.changeVolume()
    }
  },
  computed: mapState({
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.volumeComponent {
  display: flex;
  flex-direction : row;
  flex: 1;
  position: relative;
}
.icon {
  color: black;
  font-size: 10px;
  padding: 0;
}
.icon i {
  box-sizing: border-box;
  border: 2px solid black;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.icon[disabled] i {
  background-color: lightgray;
}
.icon:not([disabled]) i:hover {
  border-color: #610B21;
  color: #610B21;
}
.icon:not([disabled]) i:active {
  border-color: #B40431;
  color: #B40431;
}
.icon.mute i {
  border-radius: 0 50% 0 0;
  cursor: pointer;
  border-color: black;
  color: black;
}
.icon.mute.muted i,
.icon.mute.masterMute i {
  border-color: #8A084B;
  border-bottom-color: black;
  background-color: #8A084B;
  color: white;
}
.volumeText {
  position: absolute;
  right: 24px;
  bottom: 2px;
  transform-origin: right bottom;
  transform: scale(0.7);
  color: white;
  pointer-events: none;
}

input[type="range"] {
  -webkit-appearance:none;
  flex: 1;
  margin: 0;
  position: relative;
  background: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  outline: 0;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-thumb {
  position: relative;
  -webkit-appearance: none;
  cursor: pointer;
}
input[type="range"].volume::-webkit-slider-thumb {
  background: black;
  width: 6px;
  height: 20px;
  margin-top: -4px;
  margin-bottom: -4px;
  box-sizing: border-box;
  border: 2px solid black;
}

input[type="range"].volume {
  width: calc(100% - 20px * 2);
  background: linear-gradient(to bottom right, rgba(0,0,0,0) 47%, black 49.5%) no-repeat top left/105% 100%;
  border-bottom: 2px solid black;
}
input[type="range"].volume.muted,
input[type="range"].volume.masterMute {
  background: linear-gradient(to bottom right, rgba(0,0,0,0) 47%, #8A084B 49.5%) no-repeat top left/105% 100%;
}
input[type="range"].volume:before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background: linear-gradient(to bottom right, rgba(255,255,255,0) 55%, rgb(80,120,100) 57.5%) no-repeat top left/105% 100%;
}
input[type="range"].volume.muted:before {
  background: linear-gradient(to bottom right, rgba(255,255,255,0) 55%, #8A084B 57.5%) no-repeat top left/105% 100%;
}
</style>
