
<template>
  <ContextFrame displayProperty="private.display.mapMaskContext">
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
      'setProperty',
      'changeMapMaskInfo',
      'deletePieceInfo',
      'windowClose'
    ]),
    viewEditMapMask: function () {
      console.log(`  [methods] select context item => MapMask(${this.objKey}).viewEditMapMask`)
      this.setProperty({property: 'private.display.editMapMaskWindow.key', value: this.objKey})
      this.windowOpen('private.display.editMapMaskWindow')
      this.windowClose('private.display.mapMaskContext')
    },
    changeMapMaskLock: function () {
      console.log(`  [methods] select context item => MapMask(${this.objKey}).changeMapMaskLock`)
      this.changeMapMaskInfo({
        key: this.objKey,
        isLock: !this.isLock,
        isNotice: true
      })
      this.windowClose('private.display.mapMaskContext')
    },
    deleteMapMask: function () {
      console.log(`  [methods] select context item => MapMask(${this.objKey}).deleteMapMask`)
      this.deletePieceInfo({
        propName: 'mapMasks',
        key: this.objKey,
        isNotice: true
      })
      this.windowClose('private.display.mapMaskContext')
    }
  },
  computed: {
    ...mapGetters([
      'isWindowOpen',
      'getPieceObj'
    ]),
    objKey: function () {
      return this.$store.state.private.display['mapMaskContext'].key
    },
    storeObj: function () {
      const type = 'mapMasks'
      const key = this.objKey
      // console.log(`key:${key}`)
      return this.getPieceObj(type, key)
    },
    isLock: function () {
      if (!this.isWindowOpen('private.display.mapMaskContext')) {
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
