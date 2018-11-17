<template>
  <WindowFrame titleText="チャットタブ設定画面" display-property="private.display.settingChatTabWindow" align="center" fixSize="320, 132" @open="initWindow" @reset="initWindow">
    <div class="contents">
      <div>半角・全角スペースでタブ名を区切ってください。<br>（例：「雑談 打ち合わせ メモ用」）</div>
      <label>メイン<input type="text" v-model="tabsStr"></label>
      <div class="operateArea">
        <button @click="commit">変更</button>
        <button @click="cancel">キャンセル</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'

export default {
  name: 'selectPeerWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  data () {
    return {
      tabsStr: ''
    }
  },
  methods: {
    ...mapActions([
      'windowClose',
      'setProperty',
      'createPeer',
      'windowOpen',
      'updateCame',
      'changeChatTab'
    ]),
    initWindow () {
      this.tabsStr = this.storeTabs
    },
    commit () {
      this.changeChatTab(this.tabsStr)
      this.windowClose('private.display.settingChatTabWindow')
    },
    cancel () {
      this.windowClose('private.display.settingChatTabWindow')
    }
  },
  computed: mapState({
    storeTabs: state => state.public.chat.tabs
      .filter(tab => tab.name !== 'メイン')
      .map(tab => tab.name).join(' ')
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contents {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    font-size: 12px;
  }
  label {
    display: flex;
    margin-top: 5px;
  }
  label input {
    flex: 1;
    margin-left: 5px;
  }
  .operateArea {
    margin-top: 5px;
    text-align: center;
  }
</style>
