
<template>
  <ContextFrame displayProperty="characterContext">
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
    viewEditCharacter: function () {
      console.log(`  [methods] select context item => Character(${this.objKey}).viewEditCharacter`)
      this.setProperty({property: 'display.editCharacterWindow.key', value: this.objKey})
      this.windowOpen('editCharacterWindow')
      this.windowClose('characterContext')
    },
    deleteCharacter: function () {
      console.log(`  [methods] select context item => Character(${this.objKey}).deleteCharacter`)
      this.deletePieceInfo({
        propName: 'characters',
        key: this.objKey
      })
      this.windowClose('characterContext')
    },
    copyCharacter: function () {
      console.log(`  [methods] select context item => Character(${this.objKey}).copyCharacter`)
      this.windowClose('characterContext')
      alert('未実装の機能です。')
    },
    openRefURL: function () {
      console.log(this.storeObj.url)
      window.open(this.storeObj.url, '_blank')
      this.windowClose('characterContext')
    }
  },
  computed: {
    ...mapGetters([
      'isWindowOpen',
      'getPieceObj'
    ]),
    objKey: function () {
      return this.$store.state.display['characterContext'].key
    },
    url: function () {
      if (this.objKey === -1) {
        return null
      }
      return this.stopreObj.url
    },
    storeObj: function () {
      const type = 'characters'
      const key = this.objKey
      console.log(`key:${key}`)
      return this.getPieceObj(type, key)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
