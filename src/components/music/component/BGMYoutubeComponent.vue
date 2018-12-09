<template>
  <BGMCoreComponent
    :tag="tag"
    :isLoop="isLoop"
    :title="title"
    :initVolume="initVolume"
    :url="url"
    :maxSecond="maxSecond"
    @mounted="mounted"
    @destroyed="destroyed"
    @mute="mute"
    @volume="volume"
    @play="play"
    @pause="pause"
    @seekTo="seekTo"
    @end="end"
    ref="core"
  ></BGMCoreComponent>
</template>

<script>
import { mapActions } from 'vuex'
import BGMCoreComponent from './BGMCoreComponent'

export default {
  name: 'bgmYoutubeComponent',
  props: {
    'bgmKey': { type: String, required: true },
    'tag': { type: String, required: true },
    'isLoop': { type: Boolean, required: true },
    'title': { type: String, required: true },
    'initVolume': { type: Number, required: true },
    'url': { type: String, required: true },
    'maxSecond': { type: Number, required: true }
  },
  components: {
    BGMCoreComponent: BGMCoreComponent
  },
  data () {
    return {}
  },
  mounted () {
  },
  destroyed () {
    this.destroyed()
  },
  methods: {
    ...mapActions([
      'setProperty'
    ]),
    onReady () {
    },
    onPlaying (duration, target) {
      this.$refs.core.setDuration(duration)
      this.$refs.core.play()
    },
    onError (event) {
      console.qLog(event)
    },
    onPaused () {
      this.$refs.core.pause()
    },
    onReject () {
      console.qLog('youtube - onReject => reload')
      this.setProperty({property: 'private.display.jukeboxWindow.command', logOff: true, value: {command: 'add', payload: this.bgmKey}})
    },
    mounted () {
      const result = window.youtube.registration(this.tag, this.url, 0, {
        onReady: this.onReady,
        timeUpdate: this.timeUpdate,
        onPlaying: this.onPlaying,
        onError: this.onError,
        onPaused: this.onPaused,
        onReject: this.onReject
      })
      // this.jukeboxAudio.loop = this.isLoop
      if (!result) {
        this.$emit('end')
      }
    },
    destroyed () {
      window.youtube.destroyed(this.tag)
    },
    mute (mute) {
      window.youtube[mute ? 'mute' : 'unMute'](this.tag)
    },
    volume (volume) {
      window.youtube.setVolume(this.tag, volume * 100)
    },
    play () {
      window.youtube.play(this.tag)
    },
    pause () {
      window.youtube.pause(this.tag)
    },
    seekTo (time) {
      window.youtube.seekTo(this.tag, time, true)
    },
    end () {
      this.$emit('end')
    },
    timeUpdate (time) {
      this.$refs.core.timeUpdate(time)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
