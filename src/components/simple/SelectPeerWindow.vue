<template>
  <WindowFrame titleText="ユーザID選択画面" display-property="private.display.selectPeerWindow" align="center" fixSize="385, 300" :isBanClose="true">
    <div class="contents">
      <div>以下のルームメンバーが保存されていました。<br>あなたを選んでください。</div>
      <ul>
        <li v-for="memberObj in members" :key="memberObj.peerId"><label><input type="radio" name="peerId" :value="memberObj.peerId" v-model="currentPeerId" />{{memberObj.name}}({{memberObj.peerId}})</label></li>
      </ul>
      <div class="operateArea">
        <button @click="commit">決定</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'selectPeerWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      currentPeerId: null
    }
  },
  methods: {
    ...mapActions([
      'windowClose',
      'setProperty',
      'createPeer',
      'windowOpen',
      'updateCame'
    ]),
    commit () {
      console.log(this.currentPeerId)
      const currentMemberObj = this.currentMemberObj
      if (!currentMemberObj) {
        alert('ルームメンバーからあなたを選んでください。')
        return
      }
      console.log(currentMemberObj)
      const privateData = currentMemberObj.private
      if (!privateData) {
        this.windowClose('private.display.selectPeerWindow')
        return
      }
      this.setProperty({property: `private`, value: privateData})

      const peerId = privateData.connect.peerId
      this.updateCame(peerId)
      this.createPeer({
        peerId: peerId,
        roomId: this.roomId
      })
      this.windowOpen('private.display.inviteLinkWindow')
      this.windowClose('private.display.selectPeerWindow')
    }
  },
  watch: {
    yourPeerId (yourPeerId) {
      this.currentPeerId = yourPeerId
    }
  },
  computed: mapState({
    yourPeerId () {
      const privatePeerId = this.$store.state.private.connect.peerId
      if (privatePeerId) {
        const filtered = this.members.filter(memberObj => memberObj.peerId === privatePeerId)
        if (filtered.length > 0) { return privatePeerId }
      }
      if (this.members.length > 0) {
        return this.members[0].peerId
      }
      return null
    },
    members: state => state.public.room.members,
    roomId: state => state.public.room.id,
    currentMemberObj () { return this.members.filter(memberObj => memberObj.peerId === this.currentPeerId)[0] }
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
</style>
