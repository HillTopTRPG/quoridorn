
<template>
  <ContextFrame displayProperty="mapMaskContext">
    <div class="item" @click.left.prevent="viewEditMapMask">変更</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="!isLock">固定</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="isLock">固定を解除</div>
    <div class="item" @click.left.prevent="deleteMapMask">削除</div>
  </ContextFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import ContextFrame from '../../ContextFrame'

export default {
  components: {
    ContextFrame: ContextFrame
  },
  methods: {
    ...mapMutations([
      'windowOpen',
      'changeDisplayValue',
      'changeMapMaskInfo',
      'deleteMapMaskInfo',
      'windowClose'
    ]),
    viewEditMapMask: function () {
      console.log('$$ viewEditMapMask', this.value.index)
      this.changeDisplayValue({ main: 'editMapMaskWindow', sub: 'index', value: this.value.index })
      this.windowOpen('editMapMaskWindow')
      this.windowClose('mapMaskContext')
    },
    changeMapMaskLock: function () {
      console.log('$$ changeMapMaskLock')
      this.changeMapMaskInfo({
        index: this.index,
        isLock: !this.isLock
      })
      this.windowClose('mapMaskContext')
    },
    deleteMapMask: function () {
      console.log('$$ deleteMapMask')
      this.deleteMapMaskInfo(this.index)
      this.windowClose('mapMaskContext')
    }
  },
  computed: {
    ...mapGetters([
      'isWindowOpen'
    ]),
    value: function () {
      return this.$store.state.display['mapMaskContext']
    },
    index: function () {
      return this.value.index
    },
    isLock: function () {
      if (!this.isWindowOpen('mapMaskContext')) {
        return false
      }
      return this.$store.state.map.mapMasks[this.index].isLock
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
