<template>
  <WindowFrame titleText="グループチャット編集画面" display-property="private.display.editGroupChatWindow" align="center" :fixSize="`${windowSize.w}, ${windowSize.h}`" @open="initWindow" @reset="initWindow">
    <div class="contents">
      <div class="scrollArea">
        <div>
          <label>秘匿チャット<input type="checkbox" v-model="isSecret"></label>
          <label>名前<input type="text" v-model="name"></label>
          <label>出力先のタブ<select v-model="targetTab">
            <option :value="null">指定なし</option>
            <option v-for="tabObj in chatTabList" :key="tabObj.name" :value="tabObj.name">{{tabObj.name}}</option>
          </select></label>
          <label>全体<input type="checkbox" v-model="isAll"></label>
        </div>
        <div class="tableContainer">
          <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
            <thead>
            <tr>
              <th :style="colStyle(0)">対象</th><Divider :index="0" prop="editGroupChatWindow"/>
              <th :style="colStyle(1)">名前</th>
            </tr>
            </thead>
            <tbody>
            <!-- ===============================================================
              コンテンツ
            -->
            <tr v-for="target in targetList"
                :key="target.key"
                @click="selectLine(target.key)"
                :class="{isActive: selectLineKey === target.key}">

              <!-- 対象チェック -->
              <td :style="colStyle(0)" class="target">
                <input
                  type="checkbox"
                  :checked="isContain(target.key)"
                  @change="event => changeTargetCheck(target.key, event.target.checked)"
                  @click.stop
                  :disabled="isAll"
                />
              </td>
              <Divider :index="0" prop="editGroupChatWindow"/>

              <!-- 名前 -->
              <td :style="colStyle(1)" class="name" :class="target.kind">{{getViewName(target.key)}}</td>
            </tr>
            <tr class="space">
              <td :style="colStyle(0)"></td><Divider :index="0" prop="editGroupChatWindow"/>
              <td :style="colStyle(1)"></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="buttonArea">
        <div>
          <button @click="commit">確定</button>
          <button @click="cancel">キャンセル</button>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'
import Divider from '../parts/Divider'

export default {
  name: 'editGroupChatWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    Divider
  },
  data () {
    return {
      isSecret: false,
      name: '',
      targetTab: null,
      isAll: false,
      group: []
    }
  },
  methods: {
    ...mapActions([
      'windowClose',
      'windowOpen',
      'changeChatTab',
      'setProperty',
      'addGroupTargetTab'
    ]),
    initWindow () {
      this.isSecret = this.storeObj.isSecret
      this.name = this.storeObj.name
      this.targetTab = this.storeObj.targetTab
      this.isAll = this.storeObj.isAll
      this.group = this.storeObj.group.concat()
      console.log('!!!!initWindow', this.isSecret, this.name, this.targetTab, this.isAll, this.group)
    },
    commit () {
      const tab = this.groupTargetTabList.filter(tab => tab.key === this.objKey)[0]
      const index = this.groupTargetTabList.indexOf(tab)
      this.setProperty({
        property: `public.chat.groupTargetTab.list.${index}`,
        value: {
          isSecret: this.isSecret,
          name: this.name,
          targetTab: this.targetTab,
          isAll: this.isAll,
          group: this.group
        },
        isNotice: true,
        logOff: false
      })
      this.windowClose('private.display.editGroupChatWindow')
    },
    cancel () {
      this.windowClose('private.display.editGroupChatWindow')
    },
    moveDev (event) {
      if (this.movingIndex > -1) {
        const diff = event.clientX - this.startX
        const afterLeftWidth = this.startLeftWidth + diff
        const afterRightWidth = this.startRightWidth - diff
        if (afterLeftWidth >= 10 && afterRightWidth >= 10) {
          const paramObj = {}
          paramObj[this.movingIndex] = afterLeftWidth
          paramObj[this.movingIndex + 1] = afterRightWidth
          this.setProperty({
            property: 'private.display.editGroupChatWindow.widthList',
            value: paramObj,
            logOff: true
          })
        }
      }
    },
    moveDevEnd () {
      this.setProperty({
        property: 'private.display.editGroupChatWindow',
        value: {
          hoverDevIndex: -1,
          movingIndex: -1,
          startX: -1,
          startLeftWidth: -1,
          startRightWidth: -1
        },
        logOff: true
      })
    },
    selectLine (selectLineKey) {
      this.setProperty({
        property: 'private.display.editGroupChatWindow.selectLineKey',
        value: selectLineKey,
        logOff: true
      })
      if (!this.isAll) {
        this.changeTargetCheck(selectLineKey, !this.isContain(selectLineKey))
      }
    },
    isSelected (groupTargetTab, player) {
      return !!groupTargetTab.group.filter(t => t === player.key)[0]
    },
    changeProp (groupTargetTab, prop, newValue) {
      const target = this.groupTargetTabList.filter(tab => tab.key === groupTargetTab.key)[0]
      if (!target) return
      const index = this.groupTargetTabList.indexOf(target)

      const value = {}
      value[prop] = newValue
      if (prop === 'isAll' && newValue) {
        value.group = []
      }

      this.setProperty({property: `public.chat.groupTargetTab.list.${index}`, value: value, logOff: false, isNotice: true})
    },
    changeGroupTargetMember (groupTargetTab, player, flg) {
      const newArr = groupTargetTab.group.concat()
      if (flg) {
        // 追加の場合
        newArr.push(player.key)
      } else {
        // 除外の場合
        const index = groupTargetTab.group.indexOf(player.key)
        newArr.splice(index, 1)
      }
      this.changeProp(groupTargetTab, 'group', newArr)
    },
    getChatFromKey () {
      const obj = this.getPeerActors
        .map(actor => ({name: this.getViewName(actor.key), key: actor.key}))
        .filter(obj => obj.name === this.currentChatName)[0]
      if (!obj) {
        return ''
      }
      return obj.key
    },
    getViewNames (tab) {
      return tab.isAll ? '全員' : tab.group.map(g => this.getViewName(g)).join(', ')
    },
    changeTargetCheck (key, value) {
      console.log(key, value, this.group)
      if (value) {
        this.group.push(key)
      } else {
        const index = this.group.indexOf(key)
        this.group.splice(index, 1)
      }
      console.log(this.group)
    },
    isContain (key) {
      return !!this.group.filter(g => g === key)[0]
    }
  },
  watch: {
    isAll (isAll) {
      if (isAll) {
        this.group.splice(0, this.group.length)
      }
    }
  },
  computed: mapState({
    ...mapGetters([
      'getPeerActors',
      'getViewName'
    ]),
    objKey: state => state.private.display['editGroupChatWindow'].key,
    storeObj () { return this.groupTargetTabList.filter(tab => tab.key === this.objKey)[0] },
    groupTargetTabList: state => state.public.chat.groupTargetTab.list,
    /* Start 列幅可変テーブルのプロパティ */
    selectLineKey: state => state.private.display.editGroupChatWindow.selectLineKey,
    widthList: state => state.private.display.editGroupChatWindow.widthList,
    movingIndex: state => state.private.display.editGroupChatWindow.movingIndex,
    startX: state => state.private.display.editGroupChatWindow.startX,
    startLeftWidth: state => state.private.display.editGroupChatWindow.startLeftWidth,
    startRightWidth: state => state.private.display.editGroupChatWindow.startRightWidth,
    colStyle: () => function (index) { return { width: `${this.widthList[index]}px` } },
    /* End 列幅可変テーブルのプロパティ */
    playerList: state => state.public.player.list,
    characterList: state => state.public.character.list,
    windowSize: state => state.private.display.editGroupChatWindow.windowSize,
    chatTabList: state => state.public.chat.tabs,
    selfPlayerKey: state => {
      const player = state.public.player.list.filter(player => player.name === state.private.self.playerName)[0]
      return player ? player.key : null
    },
    currentChatName: state => state.private.self.currentChatName,
    targetList () {
      const result = []
      this.playerList.forEach(player => {
        result.push(player)
        this.characterList
          .filter(character => character.owner === player.key)
          .filter(character => character.place === 'field')
          .forEach(character => result.push(character))
      })
      console.log(this.characterList)
      return result
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contents {
    position: absolute;
    height: 100%;
    width: 100%;
    /*overflow-y: scroll;*/
    font-size: 12px;
    display: flex;
    flex-direction: column;
  }
  .scrollArea {
    flex: 1;
    overflow-y: scroll;
  }
  .buttonArea {
    display: flex;
    justify-content: center;
    align-content: start;
  }
  label {
    display: flex;
    margin-top: 5px;
  }
  label input[type=text] {
    flex: 1;
    margin-left: 5px;
  }
  .operateArea {
    margin-top: 5px;
    text-align: center;
  }
  /* Start 列幅可変テーブルのCSS */
  .tableContainer {
    flex: 1;
    width: 100%;
    /*height: 216px;*/
    border: 1px solid rgb(183, 186, 188);
    font-size: 8px;
    box-sizing: border-box;
  }
  table {
    width: calc(100% - 19px);
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    background-image: linear-gradient( 0deg, white 0%, white 50%, rgb(247, 247, 247) 51%, rgb(247, 247, 247) 100% );
    background-size: 4em 4em;
  }
  tr { height: 2em; }
  tr.space { height: auto; }
  th, td {
    padding: 0;
    white-space: nowrap;
    cursor: default;
  }
  th, td:not(.selectable) {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  th, td:not(.divider) {
    overflow: hidden;
  }
  table tbody {
    height: 100%;
  }
  table thead {
    background: linear-gradient( to bottom, rgba(255, 255, 255, 1) 0%, rgba(234, 234, 234, 1) 100%);
  }
  table thead tr {
    border-bottom: 1px solid rgb(183, 186, 188);
  }
  table tbody tr {
    height: 2em;
  }
  table tbody tr:not(.space).isActive {
    background-color: rgb(127, 206, 255) !important;
  }
  table thead tr th:hover {
    background: rgb(178, 225, 255);
  }
  table tbody tr:not(.space):nth-child(odd):hover {
    background: rgb(178, 225, 255);
  }
  table tbody tr:not(.space):nth-child(even):hover {
    background: rgb(178, 225, 255);
  }
  table tbody td.target {
    text-align: center;
  }
  table tbody td.name {
    text-align: left;
    padding-left: 0.5em;
  }
  table tbody td.name.character {
    padding-left: 1.5em;
  }
  table td.dev {
    background-color: rgb(183, 186, 188);
    cursor: col-resize;
    position: relative;
    width: 1px;
  }
  table td.dev:after {
    position: absolute;
    height: 100%;
    top: 0;
    left: -2px;
    content: '';
    width: 5px;
  }
  td i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  table select {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
  }
  table input {
    background: none;
    border: none;
  }
  /* End 列幅可変テーブルのCSS */
</style>
