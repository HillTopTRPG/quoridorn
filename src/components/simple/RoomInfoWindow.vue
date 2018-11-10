<template>
  <WindowFrame :titleText="`プレイルーム${roomName === '' ? '' : `「${roomName}」`}情報表示`" display-property="private.display.roomInfoWindow" align="center" fixSize="400, 310">
    <div class="container">
      <div v-if="memberList.length === 0">お部屋に接続していません。</div>
      <div class="inviteUrlArea" v-if="memberList.length > 0">
        招待用URL：<input class="inviteUrl" type="text" readonly="readonly" :value="inviteUrl" />
      </div>
      <ul v-if="memberList.length > 0">
        <li v-for="(memberObj, index) in memberList" :key="memberObj.peerId">
          <b v-if="index === 0">[親]</b>
          <b v-if="memberObj.peerId === yourPeerId">[あなた]</b>
          <span>{{memberObj.name}} (peerID：{{memberObj.peerId}})</span>
          <div class="returnUrlArea">復帰用URL：<input class="returnUrl" type="text" readonly="readonly" :value="createURL(memberObj.peerId)"/></div>
        </li>
      </ul>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'

export default {
  name: 'roomInfoWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  methods: {
    createURL (peerId) {
      return `${this.inviteUrl}&peerId=${peerId}`
    }
    // open () {
    //   setTimeout(function () {
    //     const elms = document.querySelectorAll('.returnUrl')
    //     elms.forEach((elm) => {
    //       elm.focus()
    //       elm.value += ''
    //       console.log(elm.value)
    //     })
    //   }, 100)
    // }
  },
  watch: {
    // memberList () {
    //   setTimeout(function () {
    //     const elms = document.querySelectorAll('.returnUrl')
    //     elms.forEach((elm) => {
    //       elm.focus()
    //       elm.value += ''
    //       console.log(elm.value)
    //     })
    //   }, 0)
    // }
  },
  computed: mapState({
    roomName: state => state.public.room.id,
    password: state => state.public.room.password,
    memberList: state => state.public.room.members.filter(memberObj => memberObj.isCame),
    yourPeerId: state => state.private.connect.peerId,
    inviteUrl (state) {
      const baseUrl = location.href.replace(/\?.+$/, '')
      const roomName = state.public.room.id
      const password = state.public.room.password
      const passwordParam = password ? `&password=${password}` : ''
      return `${baseUrl}?roomId=${roomName}${passwordParam}`
    },
    text () { return location.pathname }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 12px;
}
.inviteUrlArea {
  display: flex;
}
.inviteUrl {
  flex: 1;
}
.returnUrlArea {
  display: flex;
}
.returnUrl {
  flex: 1;
  text-align: right;
}
ul {
  overflow-y: auto;
  padding-left: 20px;
  height: 227px;
}
li:not(:first-child) {
  margin-top: 8px;
}
</style>
