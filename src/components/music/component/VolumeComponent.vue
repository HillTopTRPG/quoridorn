<template>
  <div class="volumeComponent">
    <input class="volume" :class="{muted: mute, masterMute: masterMute, mutable: mutable}" type="range" min="0" max="1" step="0.01" v-model="volume">
    <span class="icon mute" :class="{muted: mute, masterMute: masterMute}" @click="setMute()" v-show="mutable && !mute"><i class="icon-volume-high"></i></span>
    <span class="icon mute" :class="{muted: mute, masterMute: masterMute}" @click="setMute()" v-show="mutable && mute"><i class="icon-volume-mute"></i></span>
    <span class="volumeText" :class="{mutable: mutable}">{{Math.round(volume * 100)}}</span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'volumeComponent',
  props: {
    'initVolume': { type: Number, required: true },
    'mutable': { type: Boolean, default: true }
  },
  data () {
    return {
      volume: 0,
      mute: false
    }
  },
  mounted () {
    this.volume = this.initVolume
  },
  methods: {
    ...mapActions([]),
    setMute (mute = !this.mute) {
      this.mute = mute
    },
    setVolume (volume) {
      this.volume = volume
    }
  },
  watch: {
    mute (mute) {
      this.$emit('mute', mute)
    },
    volume (volume) {
      this.mute = false
      this.$emit('volume', volume)
    }
  },
  computed: mapState({
    masterMute: state => state.private.display.jukeboxWindow.masterMute
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
  height: 20px;
  margin: auto;
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
  height: 100%;
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
  right: 4px;
  bottom: 2px;
  transform-origin: right bottom;
  transform: scale(0.7);
  color: white;
  pointer-events: none;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.volumeText.mutable {
  right: 24px;
}

input[type="range"] {
  -webkit-appearance:none;
  flex: 1;
  height: 100%;
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
input[type="range"].volume:not(.mutable) {
  border-right: 2px solid black;
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
