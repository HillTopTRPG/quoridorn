<template>
  <WindowFrame titleText="部屋接続確認画面" display-property="private.display.confirmLoadRoomWindow" align="center" fixSize="385, 300" :isBanClose="true">
    <div class="contents">
      <div>部屋「{{roomId}}」は既に存在します。<br>どうしますか？</div>
      <div class="operateArea">
        <button @click="clickJoinRoom">この部屋に入室する</button>
        <button @click="clickExitRoomAndLoad">退室してセーブデータを展開する</button>
        <button @click="clickLoad">入室せずにセーブデータを展開する</button>
        <button @click="cancel">何もしない</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'confirmLoadRoomWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      currentPeerId: null
    }
  },
  methods: {
    ...mapMutations([
      'windowClose',
      'logout',
      'createPeer',
      'windowOpen',
      'updateCame'
    ]),
    cancel: function () {
      this.windowClose('private.display.confirmLoadRoomWindow')
    },
    clickJoinRoom: function () {
      if (!this.importData) {
        return
      }
      this.logout()
      const roomId = this.importData.public.room.id
      const peerId = this.importData.private.connect.peerId
      this.createPeer({
        roomId: roomId,
        peerId: peerId
      })
      this.windowClose('private.display.confirmLoadRoomWindow')
    },
    clickExitRoomAndLoad: function () {
      this.logout()
      alert('ログアウト後のセーブデータ読込は未実装')
    },
    clickLoad: function () {
      alert('未実装')
    }
  },
  computed: {
    ...mapGetters([]),
    importData: function () {
      return this.$store.state.private.display.confirmLoadRoomWindow.importData
    },
    roomId: function () {
      if (!this.importData) {
        return ''
      }
      return this.importData.public.room.id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
}
.operateArea {
  margin-top: 10px;
  text-align: center;
}
button {
  margin-top: 10px;
  width: 80%;
}
</style>
