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
  name: 'bgmFileComponent',
  props: {
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
    return {
      jukeboxAudio: null
    }
  },
  destroyed () {
    this.destroyed()
  },
  methods: {
    ...mapActions([]),
    mounted () {
      this.jukeboxAudio = new Audio()
      this.jukeboxAudio.autoplay = true
      this.jukeboxAudio.loop = this.isLoop
      this.jukeboxAudio.addEventListener('timeupdate', this.timeUpdate)
      this.jukeboxAudio.addEventListener('play', () => {
        if (!this.jukeboxAudio) return
        this.$refs.core.setDuration(this.jukeboxAudio.duration)
      })
      this.jukeboxAudio.src = this.url
    },
    destroyed () {
      this.jukeboxAudio = null
    },
    mute (mute) {
      this.jukeboxAudio.muted = mute
    },
    volume (volume) {
      this.jukeboxAudio.volume = volume
    },
    play () {
      this.jukeboxAudio.play()
    },
    pause () {
      this.jukeboxAudio.pause()
    },
    seekTo (time) {
      this.jukeboxAudio.currentTime = time
    },
    end () {
      this.$emit('end')
    },
    timeUpdate () {
      if (!this.jukeboxAudio) return
      this.$refs.core.timeUpdate(this.jukeboxAudio.currentTime)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
