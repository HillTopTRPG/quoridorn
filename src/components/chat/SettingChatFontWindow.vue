<template>
  <WindowFrame titleText="チャットフォント設定画面" display-property="private.display.settingChatFontWindow" align="center" fixSize="320, 132" @open="initWindow" @reset="initWindow">
    <div class="contents">
      <div>この画面の操作は即時反映されます。</div>
      <label v-if="members.length === 0">文字色<input type="color" :value="privateFontColor" @change="event => changePrivateFontColor(event)"></label>
      <label v-if="members.length === 0">過去ログ反映<input type="checkbox" v-model="historyChange"></label>
      <fieldset v-if="members.length > 0" class="memberArea" v-for="member in members" :key="member.peerId">
        <legend>{{member.name ? member.name : `(${member.peerId})`}}</legend>
        <div>
          <label>文字色<input type="color" :value="member.color" @change="event => changePeerFontColor(member.peerId, event)"></label>
          <label>過去ログ反映<input type="checkbox" value="false"></label>
        </div>
      </fieldset>
      <div class="operateArea">
        <button @click="cancel">閉じる</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'

export default {
  name: 'settingChatFontWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  data () {
    return {
      historyChange: false
    }
  },
  methods: {
    ...mapActions([
      'windowClose',
      'setProperty',
      'changeChatTab'
    ]),
    initWindow () {
      this.historyChange = false
    },
    changePrivateFontColor (event) {
      const color = event.target.value
      const historyChange = event.target.parentNode.nextElementSibling.firstElementChild['checked']
      this.setProperty({property: `private.self.color`, value: color, isNotice: false})
      this.historyChange = historyChange
      this.doHistoryChange(color)
    },
    changePeerFontColor (peerId, event) {
      const color = event.target.value
      const historyChange = event.target.parentNode.nextElementSibling.firstElementChild['checked']
      const matchMember = this.members.filter(member => member.peerId === peerId)[0]
      if (!matchMember) return
      const index = this.members.indexOf(matchMember)
      this.setProperty({property: `public.room.members.${index}.color`, value: color, isNotice: true})
      this.setProperty({property: `private.self.color`, value: color, isNotice: false})
      this.historyChange = historyChange
      this.doHistoryChange(color, peerId)
    },
    doHistoryChange (color, peerId = null) {
      if (!this.historyChange) return
      const change = {}
      for (const tab in this.chatLogs) {
        if (!this.chatLogs.hasOwnProperty(tab)) continue
        const changeTab = {}
        change[tab] = changeTab
        this.chatLogs[tab]
          .forEach((log, index) => {
            if (log.peerId !== peerId) return
            changeTab[index] = {
              viewHtml: log.viewHtml.replace(/^(<span style="color: )([^;]+)(;">)/, `$1${color}$3`)
            }
          })
      }
      this.setProperty({property: `public.chat.logs`, value: change, isNotice: true})
    },
    cancel () {
      this.windowClose('private.display.settingChatFontWindow')
    }
  },
  computed: mapState({
    members: state => state.public.room.members,
    privateFontColor: state => state.private.self.color,
    chatLogs: state => state.public.chat.logs
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
  div, button {
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }
  label {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }
  label input[type="color"] {
    width: 30px;
    margin-left: 5px;
  }
  .operateArea {
    margin-top: 5px;
    text-align: center;
  }
</style>
