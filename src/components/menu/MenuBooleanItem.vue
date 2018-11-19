<template>
  <div class="item" @click="changeDisplay({property:property})" @mouseenter="mouseEnter">
    <span class="check"><i v-show="propValue" class="icon-checkmark"></i></span>
    <!-- <img v-img="propValue ? checkImg : ''" class="check" alt=""> -->
  <span><slot></slot></span></div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'menuBooleanItem',
  props: {
    'property': {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions([ 'changeDisplay' ]),
    mouseEnter (event) {
      this.$emit('mouseenter', event)
    }
  },
  computed: mapState({
    ...mapGetters([ 'isWindowOpen' ]),
    propValue () { return this.isWindowOpen(this.property) }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  position: relative;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.item > * {
  display: inline;
  vertical-align: middle;
}
.item .check {
  width: 10px;
  height: 10px;
  min-width: 10px;
  min-height: 10px;
  margin-right: 5px;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
