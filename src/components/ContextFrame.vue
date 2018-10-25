
<template>
  <div class="context" v-if="isDisplay" :style="contextStyle" @mouseleave.prevent="windowClose(displayProperty)">
    <slot/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    'displayProperty': {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions([
      'windowClose'
    ])
  },
  computed: mapState({
    ...mapGetters([
      'isWindowOpen',
      'getState'
    ]),
    isDisplay () {
      return this.isWindowOpen(this.displayProperty)
    },
    contextStyle () {
      const displayObj = this.getState(this.displayProperty)
      const obj = {
        top: displayObj.y - 5 + 'px',
        left: displayObj.x - 5 + 'px'
      }
      return obj
    }
  })
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
.item {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
