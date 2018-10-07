
<template>
  <ContextFrame displayProperty="private.display.gameTableContext">
    <div class="item" @click.left.prevent="addCharacter">キャラクター追加</div>
    <div class="item" @click.left.prevent="addMapMask">マップマスク追加</div>
    <div class="item" @click.left.prevent="addMapMarker">マップマーカー追加</div>
    <hr>
    <div class="item" @click.left.prevent="addDiceSymbol">ダイスシンボル追加</div>
    <hr>
    <div class="item" @click.left.prevent="createHandCardArea">手札置き場の作成</div>
    <div class="item" @click.left.prevent="createMessageCard">メッセージカード作成</div>
    <hr>
    <div class="item" @click.left.prevent="resetWindowLocate">ウィンドウ配置初期化</div>
  </ContextFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import ContextFrame from '../ContextFrame'

export default {
  components: {
    ContextFrame: ContextFrame
  },
  methods: {
    ...mapMutations([
      'windowOpen',
      'setProperty',
      'windowClose',
      'doResetWindowLocate'
    ]),
    addCharacter: function (event) {
      console.log(`  [methods] select context item => GameTable.addCharacter`)
      this.windowOpen('private.display.addCharacterSettingWindow')
      this.windowClose('private.display.gameTableContext')
    },
    addMapMask: function (event) {
      console.log(`  [methods] select context item => GameTable.addMapMask`)
      this.windowOpen('private.display.addMapMaskWindow')
      this.windowClose('private.display.gameTableContext')
    },
    addMapMarker: function (event) {
      console.log(`  [methods] select context item => GameTable.addMapMarker`)
      this.setProperty({property: 'private.display.unSupportWindow.title', value: 'マップマーカー追加'})
      this.windowOpen('private.display.unSupportWindow')
      this.windowClose('private.display.gameTableContext')
    },
    addDiceSymbol: function (event) {
      console.log(`  [methods] select context item => GameTable.addDiceSymbol`)
      this.setProperty({property: 'private.display.unSupportWindow.title', value: 'ダイスシンボル追加'})
      this.windowOpen('private.display.unSupportWindow')
      this.windowClose('private.display.gameTableContext')
    },
    createHandCardArea: function (event) {
      console.log(`  [methods] select context item => GameTable.createHandCardArea`)
      alert('未実装の機能です。')
      this.windowClose('private.display.gameTableContext')
    },
    createMessageCard: function (event) {
      console.log(`  [methods] select context item => GameTable.createMessageCard`)
      this.setProperty({property: 'private.display.unSupportWindow.title', value: 'メッセージカード追加'})
      this.windowOpen('private.display.unSupportWindow')
      this.windowClose('private.display.gameTableContext')
    },
    resetWindowLocate: function (event) {
      console.log(`  [methods] select context item => GameTable.resetWindowLocate`)
      this.doResetWindowLocate()
      this.windowClose('private.display.gameTableContext')
    }
  },
  computed: {
    ...mapGetters([])
  }
}
</script>
