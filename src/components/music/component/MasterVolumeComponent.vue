<template>
  <div class="masterVolumeComponent">
    <div class="attrArea">
      <span class="title" title="すべてのBGMの再生音量を割合で補正します">【マスターボリューム】</span>
    </div>
    <div class="controlArea">
      <VolumeComponent
        :initVolume="0.5"
        @mute="mute"
        @volume="volume"
        ref="volumeComponent"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VolumeComponent from './VolumeComponent'

export default {
  name: 'masterVolumeComponent',
  components: {
    VolumeComponent: VolumeComponent
  },
  mounted () {
    this.$refs.volumeComponent.setMute(this.masterMute)
    this.$refs.volumeComponent.setVolume(this.masterVolume)
  },
  methods: {
    ...mapActions([
      'setProperty'
    ]),
    mute (mute) {
      this.$refs.volumeComponent.setMute(mute)
      this.setProperty({property: `private.display.jukeboxWindow.masterMute`, value: mute, logOff: true})
    },
    volume (volume) {
      this.$refs.volumeComponent.setVolume(volume)
      this.setProperty({property: `private.display.jukeboxWindow.masterVolume`, value: volume, logOff: true})
    }
  },
  computed: mapState({
    masterMute: state => state.private.display.jukeboxWindow.masterMute,
    masterVolume: state => state.private.display.jukeboxWindow.masterVolume
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.masterVolumeComponent {
  display: flex;
  flex-direction : column;
  min-height: 38px;
}

.masterVolumeComponent > div {
  flex-direction : row;
  position: relative;
}
.masterVolumeComponent > div.attrArea {
  height: 1.5em;
}
.masterVolumeComponent > div:not(.attrArea) {
  display: flex;
}

.masterVolumeComponent > div > span {
  /* はみ出た文字省略 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.masterVolumeComponent > div.attrArea > span.tag {
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
  /* margin-right: calc((3em + 2px * 2) / 0.8 * (1 - 0.8) * -1); */
}
.masterVolumeComponent > div.attrArea > span.title {
  display: inline-block;
  text-align: left;
  font-weight: bold;
  cursor: default;
  font-size: 10px;
}
</style>
