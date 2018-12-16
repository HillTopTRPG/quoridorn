<template>
  <WindowFrame titleText="BGM設定画面" display-property="private.display.settingBGMWindow" align="center" fixSize="394, 334" @open="initWindow">
    <div class="contents">
      <div class="playOperationArea">
        <button @click="doPlay">送信</button>
        <span class="space"></span>
        <button @click="doPreview">プレビュー(自分のみ)</button>
      </div>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead>
            <tr>
              <th :style="colStyle(0)">連動</th><Divider :index="0" prop="settingBGMWindow"/>
              <th :style="colStyle(1)">タグ</th><Divider :index="1" prop="settingBGMWindow"/>
              <th :style="colStyle(2)">種別</th><Divider :index="2" prop="settingBGMWindow"/>
              <th :style="colStyle(3)">タイトル</th><Divider :index="3" prop="settingBGMWindow"/>
              <th :style="colStyle(4)">時間</th><Divider :index="4" prop="settingBGMWindow"/>
              <th :style="colStyle(5)">繰</th><Divider :index="5" prop="settingBGMWindow"/>
              <th :style="colStyle(6)">音量</th><Divider :index="6" prop="settingBGMWindow"/>
              <th :style="colStyle(7)">fade</th>
            </tr>
          </thead>
          <tbody>
            <!-- ===============================================================
              コンテンツ
            -->
            <tr v-for="bgmObj in bgmList"
              :key="bgmObj.key"
              @click="selectLine(bgmObj.key)"
              @dblclick="playBGM()"
              :class="{isActive: selectBgmKey === bgmObj.key}">
              <td :style="colStyle(0)" :title="linkageStr(bgmObj)">{{bgmObj.chatLinkage > 0 ? 'あり' : 'なし'}}</td><Divider :index="0" prop="settingBGMWindow"/>
              <td :style="colStyle(1)">{{bgmObj.tag}}</td><Divider :index="1" prop="settingBGMWindow"/>
              <td :style="colStyle(2)">
                <i class="icon-youtube2" v-if="isYoutube(bgmObj.url)"></i>
                <i class="icon-stop2" v-if="!bgmObj.url"></i>
                <i class="icon-file-music" v-if="bgmObj.url && !isYoutube(bgmObj.url)"></i>
              </td><Divider :index="2" prop="settingBGMWindow"/>
              <td :style="colStyle(3)">{{bgmObj.title}}</td><Divider :index="3" prop="settingBGMWindow"/>
              <td :style="colStyle(4)">{{bgmObj.url ? convertSecond(bgmObj.playLength) : '-'}}</td><Divider :index="4" prop="settingBGMWindow"/>
              <td :style="colStyle(5)"><i class="icon-infinite" v-if="bgmObj.url && bgmObj.isLoop"></i>{{bgmObj.url && bgmObj.isLoop ? '' : '-'}}</td><Divider :index="5" prop="settingBGMWindow"/>
              <td :style="colStyle(6)">{{bgmObj.url ? bgmObj.volume * 100 : '-'}}</td><Divider :index="6" prop="settingBGMWindow"/>
              <td :style="colStyle(7)" :title="fadeTitle(bgmObj)">{{bgmObj.url ? fadeStr(bgmObj) : '-'}}</td>
            </tr>
            <tr class="space">
              <td :style="colStyle(0)"></td><Divider :index="0" prop="settingBGMWindow"/>
              <td :style="colStyle(1)"></td><Divider :index="1" prop="settingBGMWindow"/>
              <td :style="colStyle(2)"></td><Divider :index="2" prop="settingBGMWindow"/>
              <td :style="colStyle(3)"></td><Divider :index="3" prop="settingBGMWindow"/>
              <td :style="colStyle(4)"></td><Divider :index="4" prop="settingBGMWindow"/>
              <td :style="colStyle(5)"></td><Divider :index="5" prop="settingBGMWindow"/>
              <td :style="colStyle(6)"></td><Divider :index="6" prop="settingBGMWindow"/>
              <td :style="colStyle(7)"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="operateArea">
        <button @click="doAdd">追加</button>
        <button @click="doModify">変更</button>
        <button @click="doDelete">削除</button>
        <label><input type="checkbox" @change="changeSortMode" />並べ替え許可</label>
        <span class="comment">※ fadeIn/fadeOutは未実装</span>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'
import WindowMixin from '../WindowMixin'
import Divider from '../parts/Divider'
import PropNumber from './component/PropNumber'

export default {
  name: 'settingBGMWindow',
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    Divider,
    PropNumber
  },
  methods: {
    ...mapActions([
      'setProperty',
      'windowOpen'
    ]),
    isYoutube (url) {
      return /www\.youtube\.com/.test(url)
    },
    initWindow () {
      this.setProperty({
        property: 'private.display.settingBGMWindow.selectBgmKey',
        value: -1,
        logOff: true
      })
    },
    doPlay () {
      this.playBGM()
    },
    doPreview () {
      this.playBGM(true)
    },
    doAdd () {
      this.windowOpen('private.display.addBGMWindow')
    },
    doModify () {
      if (this.selectBgmKey < 0) {
        alert('BGMを選択してください')
        return
      }
      this.setProperty({
        property: 'private.display.editBGMWindow.key',
        value: this.selectBgmKey,
        logOff: true
      })
      this.windowOpen('private.display.editBGMWindow')
    },
    doDelete () {
      console.qLog(`doDelete: ${this.selectBgmKey}`)
      alert('未実装の機能です。')
    },
    changeSortMode (event) {
      const val = event.target.checked
      console.qLog(`changeSortMode: ${val}`)
      if (val) {
        setTimeout(() => { alert('未実装の機能です。') }, 20)
      }
    },
    selectLine (bgmKey) {
      this.setProperty({
        property: 'private.display.settingBGMWindow.selectBgmKey',
        value: bgmKey,
        logOff: true
      })
    },
    playBGM (isPreview = false) {
      this.setProperty({property: 'private.display.jukeboxWindow.command', logOff: true, isNotice: !isPreview, value: {command: 'add', payload: this.selectBgmKey}})
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
            property: 'private.display.settingBGMWindow.widthList',
            value: paramObj,
            logOff: true
          })
        }
      }
    },
    moveDevEnd () {
      this.setProperty({
        property: 'private.display.settingBGMWindow',
        value: {
          hoverDevIndex: -1,
          movingIndex: -1,
          startX: -1,
          startLeftWidth: -1,
          startRightWidth: -1
        },
        logOff: true
      })
    }
  },
  computed: mapState({
    importData: state => state.private.display.confirmLoadRoomWindow.importData,
    convertSecond: () => playLength => {
      if (playLength > 0) {
        return `${playLength}秒`
      }
      return 'All'
    },
    bgmList: state => state.public.bgm.list,
    /* Start 列幅可変テーブルのプロパティ */
    selectBgmKey: state => state.private.display.settingBGMWindow.selectBgmKey,
    widthList: state => state.private.display.settingBGMWindow.widthList,
    movingIndex: state => state.private.display.settingBGMWindow.movingIndex,
    startX: state => state.private.display.settingBGMWindow.startX,
    startLeftWidth: state => state.private.display.settingBGMWindow.startLeftWidth,
    startRightWidth: state => state.private.display.settingBGMWindow.startRightWidth,
    colStyle: () => function (index) { return { width: `${this.widthList[index]}px` } },
    /* End 列幅可変テーブルのプロパティ */
    fadeStr: () => bgmObj => {
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut > 0) return 'in/out'
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut === 0) return 'in'
      if (bgmObj.fadeIn === 0 && bgmObj.fadeOut > 0) return 'out'
      return '-'
    },
    fadeTitle: () => bgmObj => {
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut > 0) return `in:${bgmObj.fadeIn}\nout:${bgmObj.fadeOut}`
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut === 0) return `in:${bgmObj.fadeIn}`
      if (bgmObj.fadeIn === 0 && bgmObj.fadeOut > 0) return `out:${bgmObj.fadeOut}`
      return '-'
    },
    linkageStr: () => bgmObj => {
      if (bgmObj.chatLinkage === 1) return `【末尾文字】\n${bgmObj.chatLinkageSearch}`
      if (bgmObj.chatLinkage === 2) return `【正規表現】\n${bgmObj.chatLinkageSearch}`
      return 'なし'
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
  font-size: 12px;
  display: flex;
  flex-direction : column;
}
.contents > div {
  display: flex;
  flex-direction: row;
}
.contents > div > .space {
  display: block;
  flex: 1;
}
button {
  font-size: 10px;
  border-radius: 5px;
}
.playOperationArea button {
  margin-bottom: 5px;
}
.operateArea {
  margin-top: 5px;
  text-align: center;
}
.operateArea label,
.operateArea span {
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
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
.comment {
  font-size: 10px;
  font-weight: bold;
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-file-music {
  font-size: 1.5em;
}
</style>
