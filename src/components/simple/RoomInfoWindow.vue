<template>
  <WindowFrame titleText="プレイルーム情報表示" display-property="private.display.roomInfoWindow" align="center" fixSize="400, 200">
    <div class="container">
      <div class="name">{{roomName}}</div>
      <ul>
        <li v-for="(memberObj, index) in memberList" :key="memberObj.peerId"><b v-if="index === 0">[親]</b>{{memberObj.name}} (ユーザID：{{memberObj.peerId}})</li>
      </ul>
    </div>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'roomInfoWindow',
  components: {
    WindowFrame: WindowFrame
  },
  methods: {
    ...mapMutations([])
  },
  computed: {
    ...mapGetters([]),
    roomName: function () { return this.$store.state.public.room.id },
    memberList: function () { return this.$store.state.public.room.members }
  }
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
</style>
