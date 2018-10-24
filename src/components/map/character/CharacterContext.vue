
<template>
  <ContextFrame displayProperty="private.display.characterContext">
    <div class="item" @click.left.prevent="viewEditCharacter">変更</div>
    <hr>
    <div class="item" @click.left.prevent="deleteCharacter">削除</div>
    <hr>
    <div class="item" @click.left.prevent="copyCharacter">複製</div>
    <hr v-if="url">
    <div class="item" @click.left.prevent="openRefURL" v-if="url">データ参照先URLを開く</div>
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
      'changeMapMaskInfo',
      'deletePieceInfo',
      'windowClose'
    ]),
    viewEditCharacter () {
      console.log(`  [methods] select context item => Character(${this.objKey}).viewEditCharacter`)
      this.setProperty({property: 'private.display.editCharacterWindow.key', value: this.objKey})
      this.windowOpen('private.display.editCharacterWindow')
      this.windowClose('private.display.characterContext')
    },
    deleteCharacter () {
      console.log(`  [methods] select context item => Character(${this.objKey}).deleteCharacter`)
      this.deletePieceInfo({ propName: 'character', key: this.objKey, isNotice: true })
      this.windowClose('private.display.characterContext')
    },
    copyCharacter () {
      console.log(`  [methods] select context item => Character(${this.objKey}).copyCharacter`)
      this.windowClose('private.display.characterContext')
      alert('未実装の機能です。')
    },
    openRefURL () {
      // console.log(this.storeObj.url)
      window.open(this.storeObj.url, '_blank')
      this.windowClose('private.display.characterContext')
    }
  },
  computed: mapState({
    ...mapGetters([
      'getPieceObj'
    ]),
    objKey: state => state.private.display['characterContext'].key,
    url () { return this.objKey === -1 ? null : this.storeObj.url },
    storeObj () {
      const type = 'character'
      const key = this.objKey
      // console.log(`key:${key}`)
      return this.getPieceObj(type, key, true)
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
