<template>
  <div class="bgmComponent">
    <div class="attrArea">
      <span class="tag" :title="'【タグ】\n' + tag">{{tag}}</span><!--
   --><span class="title" :title="'【タイトル】\n' + title">{{title}}</span><!--
   --><span class="icon loop" disabled v-if="isLoop"><i class="icon-infinite" title="ループ再生します"></i></span>
    </div>
    <div class="controlArea">
      <span class="icon play" :class="{isPlay: isPlay}" @click="changePlay()" v-show="isPlay"><i class="icon-play"></i></span>
      <span class="icon play" :class="{isPlay: isPlay}" @click="changePlay()" v-show="!isPlay"><i class="icon-pause"></i></span>
      <VolumeComponent
        :initVolume="initVolume"
        @volume="volume"
        @mute="mute"
        @mounted="volumeMounted"
        ref="volumeComponent"/>
    </div>
    <div class="secondArea">
      <input class="second" :class="{isPlay: isPlay}" :style="secondStyle" type="range" min="0" :max="Math.round(bgmLength * 100) / 100" step="0.01" v-model="second" @input="changeTime">
      <span class="secondText">{{Math.round(second)}}/{{Math.round(bgmLength)}}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VolumeComponent from './VolumeComponent'

export default {
  name: 'bgmComponent',
  props: {
    'tag': { type: String, required: true },
    'isLoop': { type: Boolean, required: true },
    'title': { type: String, required: true },
    'initVolume': { type: Number, required: true },
    'paramMasterMute': { type: Boolean, required: true },
    'paramMasterVolume': { type: Number, required: true },
    'path': { type: String, required: true },
    'maxSecond': { type: Number, required: true }
  },
  components: {
    VolumeComponent: VolumeComponent
  },
  data () {
    return {
      jukeboxAudio: null,
      isPlay: true,
      second: 0,
      duration: 0,
      masterMute: false,
      masterVolume: 0.5
    }
  },
  beforeMount () {
    this.masterMute = this.paramMasterMute
    this.masterVolume = this.paramMasterVolume

    this.jukeboxAudio = new Audio()
    this.jukeboxAudio.autoplay = true
    this.jukeboxAudio.loop = this.isLoop
    this.jukeboxAudio.volume = this.initVolume * this.masterVolume
    this.jukeboxAudio.addEventListener('timeupdate', this.timeUpdate)
    // console.log(111111111, this.path, this.jukeboxAudio)
    this.jukeboxAudio.addEventListener('play', () => {
      // console.log(2222222222, this.jukeboxAudio)
      if (!this.jukeboxAudio) return
      this.duration = this.jukeboxAudio.duration
    })
    this.jukeboxAudio.src = this.path
  },
  destroyed () {
    // console.log('!!!! destroyed !!!!')
    this.changePlay(false)
    this.jukeboxAudio = null
  },
  methods: {
    ...mapActions([]),
    volumeMounted () {
      this.$refs.volumeComponent.setMasterMute(this.masterMute)
      this.$refs.volumeComponent.setMasterVolume(this.masterVolume)
    },
    mute (flg) { this.jukeboxAudio.muted = flg },
    volume (volume) {
      this.jukeboxAudio.volume = volume
    },
    setMasterMute (flg) {
      this.masterMute = flg
      this.$refs.volumeComponent.setMasterMute(flg)
    },
    setMasterVolume (volume) {
      this.masterVolume = volume
      this.$refs.volumeComponent.setMasterVolume(volume)
    },
    changePlay (flg = !this.isPlay) {
      this.isPlay = flg
      if (this.isPlay) {
        this.jukeboxAudio.play()
      } else {
        this.jukeboxAudio.pause()
      }
    },
    changeTime () {
      this.jukeboxAudio.currentTime = this.second
      this.changePlay(true)
    },
    timeUpdate (event) {
      if (!this.jukeboxAudio) return
      this.second = this.jukeboxAudio.currentTime
      if (this.second >= this.bgmLength) {
        if (this.jukeboxAudio.loop) {
          this.second = 0
          this.jukeboxAudio.currentTime = 0
        } else {
          this.jukeboxAudio.pause()
          this.$emit('end')
        }
      }
    }
  },
  computed: mapState({
    secondStyle () {
      const per = this.second * 100 / this.bgmLength
      const useColor = this.isPlay ? 'black' : '#8A084B'
      return {
        background: `linear-gradient(to right, ${useColor} 0%, ${useColor} ${per}%, rgba(100, 100, 100, 1) ${per}%, rgba(100, 100, 100, 1) 100%)`,
        'border-color': 'black'
      }
    },
    bgmLength () {
      return this.maxSecond > 0 ? this.maxSecond : this.duration
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgmComponent {
  display: flex;
  flex-direction : column;
  min-height: 54px;
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
.icon.play i {
  border-radius: 50% 50% 0% 0%;
  cursor: pointer;
}
.icon.play:not(.isPlay) i {
  border-color: #8A084B;
  background-color: #8A084B;
  color: white;
}

.bgmComponent > div {
  flex-direction : row;
  position: relative;
}
.bgmComponent > div.attrArea {
  height: 1.5em;
}
.bgmComponent > div:not(.attrArea) {
  display: flex;
}

.bgmComponent > div > span {
  /* はみ出た文字省略 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bgmComponent > div.attrArea > span.tag {
  display: inline-block;
  /* position: absolute; */
  font-size: 10px;
  padding: 0 2px;
  background-color: lightyellow;
  /* 罫線 */
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 5px;
  /* 縮小表示で限界を超えた小さいフォント対応 */
  max-width: calc((3em + 2px * 2) / 0.8);
  transform-origin: left;
  transform: scale(0.8);
  cursor: default;
}
.bgmComponent > div.attrArea > span.title {
  display: inline-block;
  position: absolute;
  left: calc(3em);
  text-align: left;
  font-weight: bold;
  cursor: default;
  width: calc(100% - 3em - 17px)
}
.bgmComponent > div.attrArea > .icon.loop {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  margin: auto;
  transform-origin: right top;
  transform: scale(0.8);
}
.bgmComponent > div.attrArea > .icon.loop i {
  font-weight: bold;
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
.secondText {
  position: absolute;
  right: 24px;
  bottom: 6px;
  transform-origin: right bottom;
  transform: scale(0.7);
  color: white;
  pointer-events: none;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
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

input[type="range"].second {
  height: 8px;
  position: relative;
  cursor: pointer;
  margin-bottom: 8px;
  flex: 1;
  width: 100%;
}
input[type=range].second::-webkit-slider-runnable-track{
  height: 8px;
  background: rgba(0,0,0,0);
  box-sizing: border-box;
}
input[type="range"].second::-webkit-slider-thumb {
  box-sizing: border-box;
  width: 6px;
  height: 16px;
  margin-top: 0px;
  background-color: black;
}
</style>
