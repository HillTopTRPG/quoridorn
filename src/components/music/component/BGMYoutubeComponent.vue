<template>
  <div>
    <img v-for="imgStr in images" :key="imgStr" v-img="imgStr" >
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BGMCoreComponent from './BGMCoreComponent'

export default {
  name: 'bgmYoutubeComponent',
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
      id: null,
      images: []
    }
  },
  mounted () {
    this.id = window['getUrlParam']('v', this.url)
    this.images.splice(0, this.images.length)
    this.images.push(`http://i.ytimg.com/vi/${this.id}/default.jpg`)
    this.images.push(`http://i.ytimg.com/vi/${this.id}/1.jpg`)
    this.images.push(`http://i.ytimg.com/vi/${this.id}/2.jpg`)
    this.images.push(`http://i.ytimg.com/vi/${this.id}/3.jpg`)
    console.log(this.images)
  },
  destroyed () {
    this.destroyed()
  },
  methods: {
    ...mapActions([]),
    onReady () {
    },
    onPlaying (duration, target) {
      this.$refs.core.setDuration(duration)
    },
    mounted () {
      const result = window.youtube.registration(this.tag, this.url, 0, {
        onReady: this.onReady,
        timeUpdate: this.timeUpdate,
        onPlaying: this.onPlaying
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
