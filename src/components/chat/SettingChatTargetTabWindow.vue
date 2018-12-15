<template>
  <WindowFrame titleText="チャット対象タブ設定画面" display-property="private.display.settingChatTargetTabWindow" align="center" fixSize="320, 132" @open="initWindow" @reset="initWindow">
    <div class="contents">
      <div>半角・全角スペースでタブ名を区切ってください。<br>（例：「雑談 打ち合わせ メモ用」）</div>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead>
          <tr>
            <th :style="colStyle(0)">種類</th><Divider :index="0"/>
            <th :style="colStyle(1)">名前</th><Divider :index="1"/>
            <template v-for="(member, index) in members">
              <th :style="colStyle(index + 2)" :key="index">{{member.name}}</th>
              <Divider :key="index" :index="index + 2"/>
            </template>
            <th :style="colStyle(members.length + 2)"></th>
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
            <td :style="colStyle(0)">
              <select>
                <option value="0">グルチャ</option>
                <option value="1">秘匿チャ</option>
              </select>
            </td>
            <Divider :index="0"/>

            <td :style="colStyle(1)">
              <input
                type="text"
                :value="groupTargetTab.name"
                @input="inputGroupTargetTabName"
              >
            </td>
            <Divider :index="1"/>

            <template v-for="(member, index) in members">
              <th :style="colStyle(index + 2)" :key="index">
                <input
                  type="checkbox"
                  :value="isSelected(groupTargetTab, member.peerId)"
                  @click="changeGroupTargetMember(groupTargetTab, member.peerId)"
                >
              </th>
              <Divider :key="index" :index="index + 2"/>
            </template>

            <td :style="colStyle(members.length + 2)"></td>
          </tr>
          <tr class="space">
            <td :style="colStyle(0)"></td><Divider :index="0"/>
            <td :style="colStyle(1)"></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      'changeChatTab',
      'setProperty'
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
    inputGroupTargetTabName (event) {
      const text = event.target.value
      console.qLog(`inputGroupTargetTabName => text: ${text}`)
    },
    isSelected (groupTargetTab, member) {

    },
    changeGroupTargetMember (groupTargetTab, member) {

    }
  },
  computed: mapState({
    groupTargetTabList: state => state.public.chat.groupTargetTab,
    /* Start 列幅可変テーブルのプロパティ */
    selectLineKey: state => state.private.display.settingChatTargetTabWindow.selectLineKey,
    widthList: state => state.private.display.settingChatTargetTabWindow.widthList,
    movingIndex: state => state.private.display.settingBGMWindow.movingIndex,
    startX: state => state.private.display.settingBGMWindow.startX,
    startLeftWidth: state => state.private.display.settingBGMWindow.startLeftWidth,
    startRightWidth: state => state.private.display.settingBGMWindow.startRightWidth,
    colStyle: () => function (index) { return { width: `${this.widthList[index]}px` } },
    /* End 列幅可変テーブルのプロパティ */
    members: state => state.public.room.members
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contents {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
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
    font-size: 8px;
    box-sizing: border-box;
  }
  table {
    width: calc(100% - 19px);
    height: 100%;
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
  /* End 列幅可変テーブルのCSS */
</style>
