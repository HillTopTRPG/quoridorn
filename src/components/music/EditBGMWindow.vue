<template>
  <WindowFrame titleText="BGM編集画面" display-property="private.display.editBGMWindow" align="right-bottom" fixSize="300, 350" @open="initWindow">
    <div class="contents">
      <fieldset>
        <legend>読込</legend>
        <!-- URL -->
        <label class="url"><span>URL</span>
          <input type="text" v-model="url" v-if="!url || isYoutube || !isHideUrl" ref="urlElm" placeholder="指定なしで「停止」の操作になります">
          <!-- URLマスク -->
          <div class="mask" v-if="url && !isYoutube && isHideUrl" @click="isHideUrl = !isHideUrl">編集するにはここをクリックしてください。</div>
        </label>
      </fieldset>
      <fieldset>
        <legend>表示</legend>
        <div class="firstWide">
          <!-- 表示タイトル -->
          <label class="titleStr"><span>タイトル</span><input type="text" v-model="title"></label>
        </div>
        <div class="firstWide" v-if="!isYoutube">
          <!-- クレジットURL -->
          <label class="creditUrl"><span>CreditURL</span><input type="text" v-model="creditUrl" placeholder="未実装"></label>
          <!-- クレジット取得 -->
          <button class="getCredit" @click="getCredit">取得</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>再生</legend>
        <div>
          <!-- タグ -->
          <label class="tag"><span title="再生中のBGMはタグによって一意になります">タグ</span><input type="text" v-model="tag" list="bgmTagComboboxValues"></label>
          <datalist id="bgmTagComboboxValues">
            <option v-for="tag in tags" :key="tag" :value="tag">{{tag}}</option>
          </datalist>
          <!-- 音量 -->
          <VolumeComponent
            :initVolume="volume"
            @volume="setVolume"
            @mute="setIsMute"
            :mutable="false"
            ref="volumeComponent"/>
          <!-- プレビュー -->
          <button class="preview" @click="preview">プレビュー</button>
        </div>
        <div>
          <!-- </label> -->
          <!-- 再生時間 -->
          <label class="playLength"><span title="0で全て再生">時間</span><input type="number" min="0" step="0.1" max="10000" v-model="playLength"></label>
          <!-- フェードイン -->
          <label class="fadeIn"><span>fadeIn</span><input type="number" min="0" step="0.1" max="10" v-model="fadeIn" placeholder="秒"></label>
          <!-- フェードアウト -->
          <label class="fadeOut"><span>fadeOut</span><input type="number" min="0" step="0.1" max="10" v-model="fadeOut" placeholder="秒"></label>
          <!-- 無限ループ -->
          <span class="icon loop" :class="{active: isLoop}"><i class="icon-infinite" @click="change('isLoop')" :title="'リピート再生' + (isLoop ? 'あり' : 'なし')"></i></span>
        </div>
      </fieldset>
      <fieldset>
        <legend>チャット連動</legend>
        <div class="lastWide">
          <!-- チャット連動オプション -->
          <label class="option"><select v-model="chatLinkage">
            <option v-for="opt in options" :value="opt.value" :key="opt.value">{{opt.label}}</option>
          </select></label>
          <!-- 検索文字 -->
          <label
            class="search"
            v-show="chatLinkage === 1 || chatLinkage === 2">
            <input :placeholder="chatLinkage === 1 ? '' : 'Javascriptの正規表現'" type="text" v-model="chatLinkageSearch"></label>
        </div>
      </fieldset>
      <div class="buttonArea">
        <div>
          <button @click="commit">確定</button>
          <button @click="cancel">キャンセル</button>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'
import VolumeComponent from './component/VolumeComponent'

export default {
  name: 'editBGMWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    VolumeComponent
  },
  data () {
    return {
      isHideUrl: true,
      isYoutube: false,
      url: '',
      title: '',
      creditUrl: '',
      tag: '',
      isLoop: false,
      fadeIn: 0,
      fadeOut: 0,
      start: 0,
      end: 0,
      playLength: 0,
      isMute: false,
      volume: 0.8,
      options: [
        { value: 0, label: 'なし' },
        { value: 1, label: '末尾文字' },
        { value: 2, label: '正規表現' }
      ],
      tags: [
        'BGM',
        'SE'
      ],
      chatLinkage: 0,
      chatLinkageSearch: ''
    }
  },
  methods: {
    ...mapActions([
      'windowClose',
      'windowOpen',
      'setProperty'
    ]),
    initWindow () {
      const key = this.key
      const bgmObj = this.bgmList.filter(bgmObj => bgmObj.key === key)[0]
      if (!bgmObj) {
        alert('そのBGMは既に削除されたようです。')
        this.windowClose('private.display.editBGMWindow')
      }
      this.isHideUrl = true
      this.url = bgmObj.url
      this.isYoutube = /www\.youtube\.com/.test(this.url)
      this.title = bgmObj.title
      this.creditUrl = bgmObj.creditUrl
      this.tag = bgmObj.tag
      this.isLoop = bgmObj.isLoop
      this.fadeIn = bgmObj.fadeIn
      this.fadeOut = bgmObj.fadeOut
      this.playLength = bgmObj.playLength
      this.isMute = bgmObj.isMute
      this.volume = Math.floor(parseFloat(bgmObj.volume) * 100) / 100
      this.$refs.volumeComponent.setVolume(this.volume)
      this.chatLinkage = bgmObj.chatLinkage
      this.chatLinkageSearch = bgmObj.chatLinkageSearch
    },
    commit () {
      const key = this.key
      const storeBgmObj = this.bgmList.filter(bgmObj => bgmObj.key === key)[0]
      const index = this.bgmList.indexOf(storeBgmObj)
      const bgmObj = {
        url: this.url,
        title: this.title,
        creditUrl: this.creditUrl,
        tag: this.tag,
        isLoop: this.isLoop,
        fadeIn: Math.floor(parseFloat(this.fadeIn) * 10) / 10,
        fadeOut: Math.floor(parseFloat(this.fadeOut) * 10) / 10,
        playLength: Math.floor(parseFloat(this.playLength) * 10) / 10,
        isMute: this.isMute,
        volume: this.volume,
        chatLinkage: this.chatLinkage,
        chatLinkageSearch: this.chatLinkageSearch
      }
      this.setProperty({property: `public.bgm.list.${index}`, value: bgmObj, logOff: false})
      this.windowClose('private.display.editBGMWindow')
    },
    cancel () {
      this.windowClose('private.display.editBGMWindow')
    },
    getCredit () {
      this.creditUrl = this.url.replace(/^(https?:\/\/[^/]+).+$/, '$1')
    },
    preview () {
      alert('未実装の機能です')
    },
    change (param) { this[param] = !this[param] },
    setIsMute (isMute) { this.isMute = isMute },
    setVolume (volume) { this.volume = Math.floor(parseFloat(volume) * 100) / 100 }
  },
  watch: {
    isHideUrl (isHideUrl) {
      if (!isHideUrl) {
        this.url = ''
        setTimeout(() => this.$refs.urlElm.focus(), 0)
      }
    }
  },
  computed: mapState({
    key: state => state.private.display['editBGMWindow'].key,
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
fieldset {
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 5px;
}
fieldset:not(:last-child) {
  margin-bottom: 5px;
}
fieldset > div {
  display: flex;
  justify-content: left;
  align-content: center;
}
fieldset > div:not(:last-child) {
  margin-bottom: 5px;
}
.icon { display: flex; }
.icon i {
  position: relative;
  color: black;
  border-radius: 50%;
  font-size: 12px;
  width: 1.4em;
  height: 1.4em;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-content: start;
}
.icon i:before {
  display: flex;
  justify-content: center;
  align-content: start;
  position: absolute;
  top: 50%;
  margin-top: calc(-12px / 2);
}
.icon:not(.active) i:hover { background-color: lightyellow;}
.icon.active.loop i { font-weight: bold; background-color: deepskyblue; }
.icon.active.fadeIn i { font-weight: bold; background-color: deepskyblue; }
.icon.active.fadeOut i { font-weight: bold; background-color: deepskyblue; }

fieldset > div i:not(:first-child) {
  margin-left: 7px;
}
.firstWide > :first-child {
  flex: 1;
}
.lastWide > :last-child {
  flex: 1;
}
input[type="text"] {
  width: 50px;
}
legend, label, button {
  font-size: 10px;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
select, input[type="text"], input[type="number"] {
  font-size: 11px;
}
label {
  display: flex;
  justify-content: left;
  align-content: center;
  vertical-align: middle;
  white-space: nowrap;
  padding: auto;
}
label span {
  display: flex;
  justify-content: center;
  align-content: center;
  margin: auto;
}
label input,
label .mask {
  flex: 1;
  padding: 2.5px 0;
}
label .mask {
  border: 1px solid black;
  background-color: lightgray;
  padding: 2px 0;
}
.volumeComponent {
  flex: 1;
}
.tag input {
  width: 52px;
}
.playLength,
.fadeIn,
.fadeOut {
  flex: 1;
  margin-right: 5px;
}
.playLength input {
  width: 45px;
}
.fadeIn input,
.fadeOut input {
  width: 32px;
}
.regexp input {
  width: 50px;
}
.buttonArea {
  display: flex;
  justify-content: center;
  align-content: start;
}
</style>
