
<template>
  <ContextFrame displayProperty="private.display.chitContext">
    <div class="item" @click.left.prevent="viewEditChit">変更</div>
    <div class="item" @click.left.prevent="copyChit">複製</div>
    <div class="item" @click.left.prevent="deleteChit">削除</div>
  </ContextFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ContextFrame from '../../ContextFrame'

export default {
  components: {
    ContextFrame: ContextFrame
  },
  methods: {
    ...mapActions([
      'windowOpen',
      'setProperty',
      'deletePieceInfo',
      'windowClose'
    ]),
    viewEditChit () {
      console.log(`  [methods] select context item => Chit(${this.objKey}).viewEditChit`)
      this.setProperty({property: 'private.display.editChitWindow.key', value: this.objKey})
      this.windowOpen('private.display.editChitWindow')
      this.windowClose('private.display.chitContext')
    },
    copyChit () {
      console.log(`  [methods] select context item => Chit(${this.objKey}).copyChit`)
      alert('未実装の機能です')
      this.windowClose('private.display.chitContext')
    },
    deleteChit () {
      console.log(`  [methods] select context item => Chit(${this.objKey}).deleteChit`)
      this.deletePieceInfo({ propName: 'chit', key: this.objKey, isNotice: true })
      this.windowClose('private.display.chitContext')
    }
  },
  computed: mapState({
    ...mapGetters([
      'getPieceObj'
    ]),
    objKey: state => state.private.display['chitContext'].key,
    storeObj () {
      const type = 'chit'
      const key = this.objKey
      // console.log(`key:${key}`)
      return this.getPieceObj(type, key)
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
