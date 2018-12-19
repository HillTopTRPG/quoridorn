<template>
  <WindowFrame titleText="グループチャット設定画面" display-property="private.display.settingChatTargetTabWindow" align="center" :fixSize="`${windowSize.w}, ${windowSize.h}`" @open="initWindow" @reset="initWindow">
    <div class="contents">
      <div>
        <button type="button" @click="add">追加</button>
        <button type="button" @click="add">削除</button>
      </div>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead>
          <tr>
            <th :style="colStyle(0)">秘匿</th><Divider :index="0" prop="settingChatTargetTabWindow"/>
            <th :style="colStyle(1)">名前</th><Divider :index="1" prop="settingChatTargetTabWindow"/>
            <th :style="colStyle(2)">出力先タブ</th><Divider :index="2" prop="settingChatTargetTabWindow"/>
            <th :style="colStyle(3)">送信先</th><Divider :index="3" prop="settingChatTargetTabWindow"/>
            <th :style="colStyle(4)"></th>
          </tr>
          </thead>
          <tbody>
          <!-- ===============================================================
            コンテンツ
          -->
          <tr v-for="groupTargetTab in groupTargetTabList"
              :key="groupTargetTab.key"
              @click="selectLine(groupTargetTab.key)"
              :class="{isActive: selectLineKey === groupTargetTab.key}">

            <!-- 秘匿チェック -->
            <td :style="colStyle(0)">
              <span class="icon-checkmark" v-if="groupTargetTab.isSecret"></span>
            </td>
            <Divider :index="0" prop="settingChatTargetTabWindow"/>

            <!-- 名前 -->
            <td :style="colStyle(1)">
              {{groupTargetTab.name}}
            </td>
            <Divider :index="1" prop="settingChatTargetTabWindow"/>

            <!-- 出力先タブ -->
            <td :style="colStyle(2)">
              {{groupTargetTab.targetTab ? groupTargetTab.targetTab : '指定なし'}}
            </td>
            <Divider :index="2" prop="settingChatTargetTabWindow"/>

            <!-- 送信先 -->
            <td :style="colStyle(3)" style="text-align: left; padding: 0 0.3rem;">
              {{getViewNames(groupTargetTab)}}
            </td>
            <Divider :index="2" prop="settingChatTargetTabWindow"/>

            <!-- 編集ボタン -->
            <td :style="colStyle(4)">
              <button type="button" @click="edit(groupTargetTab.key)">編集</button>
            </td>
          </tr>
          <tr class="space">
            <td :style="colStyle(0)"></td><Divider :index="0" prop="settingChatTargetTabWindow"/>
            <td :style="colStyle(1)"></td><Divider :index="1" prop="settingChatTargetTabWindow"/>
            <td :style="colStyle(2)"></td><Divider :index="2" prop="settingChatTargetTabWindow"/>
            <td :style="colStyle(3)"></td><Divider :index="3" prop="settingChatTargetTabWindow"/>
            <td :style="colStyle(4)"></td>
          </tr>
          </tbody>
        </table>
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
  name: 'settingChatTargetTabWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    Divider
  },
  data () {
    return {
      tabsStr: ''
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
      this.tabsStr = this.storeTabs
    },
    commit () {
      this.changeChatTab(this.tabsStr)
      this.windowClose('private.display.settingChatTargetTabWindow')
    },
    cancel () {
      this.windowClose('private.display.settingChatTargetTabWindow')
    },
    add () {
      this.addGroupTargetTab({ ownerKey: this.getChatFromKey() })
    },
    edit (key) {
      this.setProperty({property: 'private.display.editGroupChatWindow.key', value: key, logOff: false})
      this.windowOpen('private.display.editGroupChatWindow')
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
            property: 'private.display.settingChatTargetTabWindow.widthList',
            value: paramObj,
            logOff: true
          })
        }
      }
    },
    moveDevEnd () {
      this.setProperty({
        property: 'private.display.settingChatTargetTabWindow',
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
        property: 'private.display.settingChatTargetTabWindow.selectLineKey',
        value: selectLineKey,
        logOff: true
      })
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
    }
  },
  computed: mapState({
    ...mapGetters([
      'getPeerActors',
      'getViewName',
      'getObj'
    ]),
    groupTargetTabList (state) {
      console.log('$$$$$$$', state.public.chat.groupTargetTab.list)
      return state.public.chat.groupTargetTab.list.filter(tab => {
        if (tab.isAll) return true
        console.log('!!!!', tab.group)
        const targetList = tab.group
          .map(g => this.getObj(g))
          .filter(obj => {
            console.log('---', obj)
            const kind = obj.key.split('-')[0]
            if (kind === 'player') {
              if (obj.key === this.selfPlayerKey) return true
            } else {
              if (obj.owner === this.selfPlayerKey) return true
            }
            return false
          })
        return targetList.length > 0
      })
    },
    /* Start 列幅可変テーブルのプロパティ */
    selectLineKey: state => state.private.display.settingChatTargetTabWindow.selectLineKey,
    widthList: state => state.private.display.settingChatTargetTabWindow.widthList,
    movingIndex: state => state.private.display.settingChatTargetTabWindow.movingIndex,
    startX: state => state.private.display.settingChatTargetTabWindow.startX,
    startLeftWidth: state => state.private.display.settingChatTargetTabWindow.startLeftWidth,
    startRightWidth: state => state.private.display.settingChatTargetTabWindow.startRightWidth,
    colStyle: () => function (index) { return { width: `${this.widthList[index]}px` } },
    /* End 列幅可変テーブルのプロパティ */
    players: state => state.public.player.list,
    windowSize: state => state.private.display.settingChatTargetTabWindow.windowSize,
    chatTabList: state => state.public.chat.tabs,
    selfPlayerKey: state => {
      const player = state.public.player.list.filter(player => player.name === state.private.self.playerName)[0]
      return player ? player.key : null
    },
    currentChatName: state => state.private.self.currentChatName
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
  }
  label {
    display: flex;
    margin-top: 5px;
  }
  label input {
    flex: 1;
    margin-left: 5px;
  }
  .operateArea {
    margin-top: 5px;
    text-align: center;
  }
  /* Start 列幅可変テーブルのCSS */
  .tableContainer {
    overflow-y: scroll;
    flex: 1;
    width: 100%;
    height: 216px;
    border: 1px solid rgb(183, 186, 188);
    font-size: 10px;
    box-sizing: border-box;
  }
  table {
    width: calc(100% - 19px);
    height: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    background-image: linear-gradient( 0deg, white 0%, white 50%, rgb(247, 247, 247) 51%, rgb(247, 247, 247) 100% );
    background-size: 5em 5em;
  }
  tr { height: 2.5em; }
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
    height: 2.5em;
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
  table tbody td {
    text-align: center;
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
  button {
    /*height: 2.5em;*/
    font-size: inherit;
    box-sizing: border-box;
    border-radius: 3px;
    padding: 0.3em 0.5em;
    line-height: 1em;
  }
  /* End 列幅可変テーブルのCSS */
</style>
