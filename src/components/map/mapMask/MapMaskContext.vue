
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
      console.log(`  [methods] select context item => MapMask(${this.objKey}).viewEditMapMask`)
      this.changeDisplayValue({ main: 'editMapMaskWindow', sub: 'key', value: this.objKey })
      this.windowOpen('editMapMaskWindow')
      this.windowClose('mapMaskContext')
    },
    changeMapMaskLock: function () {
      console.log(`  [methods] select context item => MapMask(${this.objKey}).changeMapMaskLock`)
      this.changeMapMaskInfo({
        key: this.objKey,
        isLock: !this.isLock
      })
      this.windowClose('mapMaskContext')
    },
    deleteMapMask: function () {
      console.log(`  [methods] select context item => MapMask(${this.objKey}).deleteMapMask`)
      this.deleteMapMaskInfo(this.objKey)
      this.windowClose('mapMaskContext')
    }
  },
  computed: {
    ...mapGetters([
      'isWindowOpen',
      'getPieceObj'
    ]),
    objKey: function () {
      return this.$store.state.display['mapMaskContext'].key
    },
    storeObj: function () {
      const type = 'mapMasks'
      const key = this.objKey
      console.log(`key:${key}`)
      return this.getPieceObj(type, key)
    },
    isLock: function () {
      if (!this.isWindowOpen('mapMaskContext')) {
        return false
      }
      const isLock = this.storeObj.isLock
      console.log(` [computed] isLock => ${isLock}`)
      return isLock
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
