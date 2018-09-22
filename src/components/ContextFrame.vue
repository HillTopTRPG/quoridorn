
<template>
  <div class="context" v-show="isDisplay" :style="contextStyle" @mouseleave.prevent="windowClose(displayProperty)">
    <slot/>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: {
    'displayProperty': {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapMutations([
      'windowClose'
    ])
  },
  computed: {
    ...mapGetters([
      'isWindowOpen'
    ]),
    isDisplay: function () {
      return this.isWindowOpen(this.displayProperty)
    },
    contextStyle: function () {
      const obj = {
        display: this.isDisplay ? 'block' : 'none',
        top: this.$store.state.display[this.displayProperty].y - 5 + 'px',
        left: this.$store.state.display[this.displayProperty].x - 5 + 'px'
      }
      return obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.context {
  position: fixed;
  z-index: 90;
  padding: 0;
  min-width: 50px;
  background-color: white;
  border: solid gray 1px;
  box-sizing: border-box;
  cursor: default;
}
.context > * {
  display: block;
  min-width: 50px;
  font-size: 14px;
  padding: 0 5px;
}
.context > :hover {
  background-color: lightblue;
}
</style>
