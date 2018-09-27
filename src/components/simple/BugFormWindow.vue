<template>
  <WindowFrame titleText="バグ報告状況" display-property="bugFormWindow" align="center" fixSize="800, 800">
    <iframe src="https://9224.teacup.com/quoridorn_bug/bbs?"></iframe>
  </WindowFrame>
</template>

<script>
import WindowFrame from '../WindowFrame'

export default {
  components: {
    WindowFrame: WindowFrame
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
