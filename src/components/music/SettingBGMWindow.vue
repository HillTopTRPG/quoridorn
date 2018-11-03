<template>
  <WindowFrame titleText="BGM設定画面" display-property="private.display.settingBGMWindow" align="center" fixSize="390, 400" @open="initWindow" @close="close">
    <div class="contents">
      <div>
        <button @click="doPlay">送信</button>
        <span class="space"></span>
        <button @click="doPreview">プレビュー(自分のみ)</button>
      </div>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead>
            <tr>
              <th :style="{width: widthList[0] + 'px'}">末尾発動</th>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 0}"
                @mouseover="hoverDev(0, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 0)"></td>
              <th :style="{width: widthList[1] + 'px'}">fadeIn</th>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 1}"
                @mouseover="hoverDev(1, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 1)"></td>
              <th :style="{width: widthList[2] + 'px'}">タイトル</th>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 2}"
                @mouseover="hoverDev(2, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 2)"></td>
              <th :style="{width: widthList[3] + 'px'}">音楽ファイル名</th>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 3}"
                @mouseover="hoverDev(3, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 3)"></td>
              <th :style="{width: widthList[4] + 'px'}">時間</th>
            </tr>
          </thead>
          <tbody>
            <!-- ===============================================================
              コンテンツ
            -->
            <tr v-for="(bgmObj, index) in bgmList"
              :key="index"
              @click="selectLine(index)"
              @dblclick="playBGM(bgmObj.key)"
              :class="{isActive: selectLineIndex === index, space: bgmObj.isEmpty}">
              <td :style="{width: widthList[0] + 'px'}"><input type="checkbox" v-model="bgmObj.charHandle" v-if="!bgmObj.isEmpty"></td>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 0}"
                @mouseover="hoverDev(0, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 0)"></td>
              <td :style="{width: widthList[1] + 'px'}"><input type="checkbox" v-model="bgmObj.charHandle" v-if="!bgmObj.isEmpty"></td>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 1}"
                @mouseover="hoverDev(1, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 1)"></td>
              <td :style="{width: widthList[2] + 'px'}">{{bgmObj.isEmpty ? '' : bgmObj.title}}</td>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 2}"
                @mouseover="hoverDev(2, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 2)"></td>
              <td :style="{width: widthList[2] + 'px'}">{{bgmObj.isEmpty ? '' : bgmObj.path}}</td>
              <td class="dev"
                :class="{isHover: hoverDevIndex === 3}"
                @mouseover="hoverDev(3, true)"
                @mouseout="hoverDev()"
                @mousedown="event => moveDevStart(event, 3)"></td>
              <td :style="{width: widthList[4] + 'px'}">{{bgmObj.isEmpty ? '' : convertSecond(bgmObj.second)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="operateArea">
        <button @click="doAdd">追加</button>
        <button @click="doModify">変更</button>
        <button @click="doDelete">削除</button>
        <label><input type="checkbox" @change="changeSortMode" />並べ替え許可</label>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WindowFrame from '../WindowFrame'

export default {
  name: 'settingBGMWindow',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      widthList: [50, 50, 120, 100, 30],
      hoverDevIndex: -1,
      movingIndex: -1,
      startX: -1,
      startLeftWidth: -1,
      startRightWidth: -1,
      selectLineIndex: -1,
      bgmList: []
    }
  },
  methods: {
    ...mapActions([]),
    initWindow () {
      // クリア
      this.bgmList.splice(0, this.bgmList.length)
      // 10件追加
      const storeBGMList = this.storeBGMList
      storeBGMList.forEach((bgmObj, index) => {
        this.bgmList.push(JSON.parse(JSON.stringify(bgmObj)))
      })
      this.bgmList.push({ isEmpty: true })
    },
    doPlay () {
      console.log(`doPlay: ${this.selectLineIndex}`)
    },
    doPreview () {
      console.log(`doPreview: ${this.selectLineIndex}`)
    },
    doAdd () {
      console.log(`doAdd`)
    },
    doModify () {
      console.log(`doModify: ${this.selectLineIndex}`)
    },
    doDelete () {
      console.log(`doDelete: ${this.selectLineIndex}`)
    },
    changeSortMode (event) {
      const val = event.target.checked
      console.log(`changeSortMode: ${val}`)
    },
    hoverDev (index) {
      if (this.movingIndex === -1) {
        this.hoverDevIndex = index !== undefined ? index : -1
      }
    },
    selectLine (index) {
      this.selectLineIndex = index
    },
    moveDevStart (event, index) {
      this.movingIndex = index
      this.startX = event.clientX
      this.startLeftWidth = this.widthList[index]
      this.startRightWidth = this.widthList[index + 1]
    },
    moveDev (event, index) {
      if (this.movingIndex > -1) {
        const diff = event.clientX - this.startX
        const afterLeftWidth = this.startLeftWidth + diff
        const afterRightWidth = this.startRightWidth - diff
        if (afterLeftWidth >= 10 && afterRightWidth >= 10) {
          this.widthList.splice(this.movingIndex, 1, afterLeftWidth)
          this.widthList.splice(this.movingIndex + 1, 1, afterRightWidth)
        }
      }
    },
    playBGM (key) {
      this.jukebox.add(key)
    },
    moveDevEnd () {
      this.movingIndex = -1
      this.startX = -1
      this.startLeftWidth = -1
      this.startRightWidth = -1
      // this.hoverDevIndex = -1
    },
    close () {
      // クリア
      this.bgmList.splice(0, this.bgmList.length)
    }
  },
  watch: {
    storeBGMList () {
      this.initWindow()
    }
  },
  computed: mapState({
    importData: state => state.private.display.confirmLoadRoomWindow.importData,
    convertSecond: state => second => {
      if (second > 0) {
        return `${second}秒`
      }
      return '全'
    },
    storeBGMList: state => state.public.bgm.list,
    jukebox: state => state.private.display.jukeboxWindow.ref
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
  margin-bottom: 5px;
  border-radius: 5px;
}
.operateArea {
  margin-top: 10px;
  text-align: center;
}
.tableContainer {
  overflow-y: scroll;
  flex: 1;
  width: 100%;
  height: 216px;
  border: 1px solid rgb(183, 186, 188);
  font-size: 8px;
}
table {
  width: calc(100% - 19px);
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
    background-image: linear-gradient( 0deg, #f5eeed 0%, #f5eeed 50%, #f4e2de 50%, #f4e2de 100% );
    background-size: 4em 4em;
}
tr { height: 2em; }
tr.space { height: auto; }
th,
td {
  padding: 0;
  white-space: nowrap;
}
th,
td:not(.dev) {
  overflow: hidden;
}
table tbody {
  height: 100%;
}
table thead tr {
  background: linear-gradient(rgba(255, 255, 255, 1), rgba(234, 234, 234, 1));
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
table tbody tr:nth-child(odd) {
  /* background-color: rgb(247, 247, 247); */
}
table tbody tr:not(.space):nth-child(odd):hover {
  background: rgb(178, 225, 255);
}
table tbody tr:nth-child(even) {
  /* background-color: rgb(255, 255, 255); */
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
table td.dev.isHover:after {
  /* background-color: rgb(183, 186, 188); */
}
</style>
