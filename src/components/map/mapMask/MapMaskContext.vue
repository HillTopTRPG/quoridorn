
<template>
  <ContextFrame displayProperty="private.display.mapMaskContext">
    <div class="item" @click.left.prevent="viewEditMapMask">変更</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="!isLock">固定</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="isLock">固定を解除</div>
    <div class="item" @click.left.prevent="deleteMapMask">削除</div>
  </ContextFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ContextFrame from '../../ContextFrame'
import WindowMixin from '../../WindowMixin'

export default {
  components: {
    ContextFrame
  },
  mixins: [WindowMixin],
  methods: {
    ...mapActions([
      'windowOpen',
      'setProperty',
      'changePieceInfo',
      'deletePieceInfo',
      'windowClose'
    ]),
    viewEditMapMask () {
      console.qLog(`  [methods] select context => item: MapMask(${this.objKey}).viewEditMapMask`)
      this.setProperty({property: 'private.display.editMapMaskWindow.key', value: this.objKey, logOff: true})
      this.windowOpen('private.display.editMapMaskWindow')
      this.windowClose('private.display.mapMaskContext')
    },
    changeMapMaskLock () {
      console.qLog(`  [methods] select context => item: MapMask(${this.objKey}).changeMapMaskLock`)
      this.changePieceInfo({ propName: 'mapMask', key: this.objKey, isLock: !this.isLock, isNotice: true })
      this.windowClose('private.display.mapMaskContext')
    },
    deleteMapMask () {
      console.qLog(`  [methods] select context => item: MapMask(${this.objKey}).deleteMapMask`)
      this.deletePieceInfo({ propName: 'mapMask', key: this.objKey, isNotice: true })
      this.windowClose('private.display.mapMaskContext')
    }
  },
  computed: mapState({
    ...mapGetters([
      'isWindowOpen',
      'getPieceObj'
    ]),
    objKey: state => state.private.display['mapMaskContext'].key,
    storeObj () {
      const type = 'mapMask'
      const key = this.objKey
      // console.qLog(`key:${key}`)
      return this.getPieceObj(type, key)
    },
    isLock () {
      if (!this.isWindowOpen('private.display.mapMaskContext')) {
        return false
      }
      if (!this.storeObj) {
        return false
      }
      const isLock = this.storeObj.isLock
      console.qLog(` [computed] isLock => ${isLock}`)
      return isLock
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
