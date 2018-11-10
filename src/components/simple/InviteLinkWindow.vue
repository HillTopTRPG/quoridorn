<template>
  <WindowFrame titleText="ユーザ招待URL表示画面" display-property="private.display.inviteLinkWindow" align="center" fixSize="500, 300">
    <div class="contents">
      <div>おかえりなさい！！<br>他のメンバーをこの部屋に呼び戻すには、<br>メンバーに以下のURLを開いてもらってください！</div>
      <ul>
        <li v-for="memberObj in members" :key="memberObj.peerId"><label>{{memberObj.name}}({{memberObj.peerId}})：<input type="text" readonly="readonly" :value="createURL(memberObj.peerId)" /></label></li>
      </ul>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'

export default {
  name: 'inviteLinkWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  data () { return {} },
  methods: {
    createURL (peerId) {
      const baseUrl = location.href.replace(/\?.+$/, '')
      const url = `${baseUrl}?roomId=${this.roomId}&password=${this.password}&peerId=${peerId}`
      return url
    }
  },
  computed: mapState({
    members () { return this.$store.state.public.room.members.filter(memberObj => memberObj.peerId !== this.$store.state.private.connect.peerId) },
    roomId: state => state.public.room.id,
    password: state => state.public.room.password
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  font-size: 12px;
}
ul {
  padding-left: 20px;
}
li {
  margin-bottom: 10px;
  width: auto;
  position: relative;
  width: 100%;
}
input[type=text] {
  display: block;
  width: calc(100% - 4px);
}
</style>
