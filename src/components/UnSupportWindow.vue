<template>
  <WindowFrame :titleText="title" display-property="private.display.unSupportWindow" align="center" fixSize="200, 120">
    <div class="contents">
      <div>未実装の機能です。</div>
      <button @click="close">閉じる</button>
    </div>
  </WindowFrame>
</template>

<script>
import { mapMutations } from 'vuex'
import WindowFrame from './WindowFrame'

export default {
  components: {
    WindowFrame: WindowFrame
  },
  methods: {
    ...mapMutations([
      'windowClose'
    ]),
    close: function () {
      this.windowClose('private.display.unSupportWindow')
    }
  },
  computed: {
    title: function () {
      return this.$store.state.private.display.unSupportWindow.title
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contents {
    position: relative;
    height: 100%;
  }
  .contents > * {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  button {
    bottom: 0;
    height: 30px;
    width: 70px;
  }
</style>
