<template>
  <div class="item" @click="changeDisplay({property:property})"><img v-img="propValue ? checkImg : ''" class="check" alt=""><span><slot></slot></span></div>
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
  data () {
    return {
      checkImg: require('../../assets/check.png')
    }
  },
  methods: {
    ...mapActions([ 'changeDisplay' ])
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
.item img.check {
  display: inline;
  width: 10px;
  height: 10px;
  min-width: 10px;
  min-height: 10px;
  margin-right: 5px;
  border: none;
}
</style>
