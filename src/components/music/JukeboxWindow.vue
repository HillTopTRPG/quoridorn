<template><!-- 150, 209 -->
  <WindowFrame titleText="BGM再生画面" fixSize="150, 209" display-property="private.display.jukeboxWindow" align="right-bottom" :isBanClose="true" @add="add">
    <div class="contents">
      <MasterVolumeComponent/>
      <BGMYoutubeComponent
        v-for="bgmObj in playList.filter(pl => /www\.youtube\.com/.test(pl.url))"
        :key="bgmObj.key"
        :ref="bgmObj.key"
        :tag="bgmObj.tag"
        :isLoop="bgmObj.isLoop"
        :title="bgmObj.title"
        :initVolume="bgmObj.volume"
        :url="bgmObj.url"
        @end="remove(bgmObj.key)"
        :maxSecond="bgmObj.playLength"></BGMYoutubeComponent>
      <BGMFileComponent
        v-for="bgmObj in playList.filter(pl => !/www\.youtube\.com/.test(pl.url))"
        :key="bgmObj.key"
        :ref="bgmObj.key"
        :tag="bgmObj.tag"
        :isLoop="bgmObj.isLoop"
        :title="bgmObj.title"
        :initVolume="bgmObj.volume"
        :url="bgmObj.url"
        @end="remove(bgmObj.key)"
        :maxSecond="bgmObj.playLength"></BGMFileComponent>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'
import BGMFileComponent from './component/BGMFileComponent'
import BGMYoutubeComponent from './component/BGMYoutubeComponent'
import MasterVolumeComponent from './component/MasterVolumeComponent'

export default {
  name: 'jukeboxWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    BGMFileComponent,
    BGMYoutubeComponent,
    MasterVolumeComponent
  },
  data () {
    return {
      playList: []
    }
  },
  methods: {
    ...mapActions([
      'windowClose',
      'windowOpen'
    ]),
    add (bgmKey) {
      if (!bgmKey) return
      const addBgmObj = this.bgmList.filter(bgmObj => bgmObj.key === bgmKey)[0]
      // 見つからなかったらタイミング悪く削除されたということなので、処理しない
      if (!addBgmObj) return

      // タグが同じものはプレイリストから削除する
      const delList = this.playList.filter(plObj => {
        const bgmObj = this.bgmList.filter(bgmObj => bgmObj.key === plObj.key)[0]
        if (!bgmObj) {
          // 見つからなかったらタイミング悪く削除されたということなので、削除リストに追加
          return true
        }
        return addBgmObj.tag === bgmObj.tag
      })
      delList.forEach(delObj => {
        const index = this.playList.indexOf(delObj)
        this.playList.splice(index, 1)
      })

      // 追加処理
      if (addBgmObj.url !== '') {
        setTimeout(() => {
          this.playList.unshift(addBgmObj)
          this.windowOpen('private.display.jukeboxWindow')
        }, 0)
      } else {
        if (this.playList.length === 0) {
          this.windowClose('private.display.jukeboxWindow')
        }
      }
    },
    remove (bgmKey) {
      const delBgmObj = this.bgmList.filter(bgmObj => bgmObj.key === bgmKey)[0]
      // 見つからなかったらタイミング悪く削除されたということなので、処理しない
      if (!delBgmObj) return

      const index = this.playList.indexOf(delBgmObj)
      this.playList.splice(index, 1)

      if (this.playList.length === 0) {
        this.windowClose('private.display.jukeboxWindow')
      }
    }
  },
  computed: mapState({
    bgmList: state => state.public.bgm.list
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction : column;
  overflow-y: auto;
}

.bgmComponent {
  padding-top: 5px;
  margin-top: 5px;
  border-top: 2px solid gray;
}
</style>
