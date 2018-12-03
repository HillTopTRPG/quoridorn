<template>
  <WindowFrame titleText="バージョン" display-property="private.display.versionWindow" align="center" fixSize="300, 158">
    <div class="contents">
      <div class="logo-container">
        <Logo></Logo>
      </div>
      <div class="footer">
        <span>Quoridorn Ver.{{version}}</span>
        <button @click="cancel">閉じる</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'
import Logo from './Logo'

export default {
  name: 'selectPeerWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    Logo
  },
  methods: {
    ...mapActions([
      'windowClose'
    ]),
    cancel () {
      this.windowClose('private.display.versionWindow')
    }
  },
  computed: mapState({
    version: state => state.setting.version
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
}
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.3em;
  font-size: 16px;
  pointer-events: none;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.footer {
  display: flex;
  justify-content: space-between;
}
</style>
