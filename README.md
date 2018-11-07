# Quoridorn（コリドーン）

```
> Quoridornって何？
TRPGのオンラインセッションの土台となるツールとして開発中です。
どどんとふやユドナリウムと同じようなツールと思ってください。

> なぜ作るの？
Flashサポート停止によって使えなくなるどどんとふの代用品を作りたくて。

> コンセプト
ずばり「どどんとふユーザに優しい」です。
仕様的にはどどんとふを参考にします。
ただ、ベースとなっている技術が異なるので、使い勝手が変わる部分は多少あると思います。

> どんな技術を使っているの？
技術的にはユドナリウムさんが使っているものと同じものを使います。
つまり、HTML5でサポートされている「WebRTC」という技術を使います。
これによりブラウザ間で直接やりとりができるようになります。
例えば、Webカメラを使ったチャットとかができる技術です。
Quoridornでは、コマやマップに関する情報を、ブラウザ間で渡しあうことで、
みんなの操作が他の人にも反映されることになります。
```

## 素材参照

```
## デフォルトの背景画像
# TEDDY-PLAZA様
http://teddy-plaza.sakura.ne.jp/?cat=105
【麦畑と村】

## 入力中アイコン
# フリーで使えるローディング画像各種
https://www.benricho.org/loading_images/transparent01.html
【タイトル不明】

## BGM
# 楽しい・明るい - フリーBGM音楽素材
http://www.hmix.net/music_gallery/feeling/happy.htm
【馬車道】ほか

## SE
# 効果音ラボ
https://soundeffect-lab.info/sound/anime/
【出題1】ほか

## favicon
# LOGO Maker
https://supalogo.com/#
text: Q
SPECIFY THE EFFECT TO APPLY: Gradient colors #1e90ff #00ffff
SPECIFY A FONT FOR YOUR LOGO: Facon(new)
size: 21px

# icoファイルジェレネータ
http://www.xiconeditor.com/
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 機能実装予定

``` bash
# チャット欄作成
- 表示
- ダイスボット組み込み
- 秘匿チャット
- 複数行入力
- 文字色設定
- タブ

# 通信処理
- 設定画面表示
- WebRTC

# 立ち絵設定
- 表示
- チャット連携

# イニシアティブ表
- 表示
- コマのステータスと連動

# コマ作成
- 表示
- 右クリックから設定画面表示
- hoverでその他欄情報を吹き出しで表示
- ドロップインでコマ画設定
- ステータス
- チャットパレット設定
- コマ保存機能
  - その他欄情報
  - コマ絵
  - チャットパレット
  - ステータス

# キャラクター待合室
- 表示
- 個人タブ作成(new)

# カットイン
- 表示
- 設定画面
- チャット末尾連動

# フォントサイズ変更
# ウィンドウ配置初期化
# マス目表示・非表示切り替え
# 座標表示・非表示切り替え

# 部屋全体保存機能

# マップ
- 背景画像設定
- マスの数設定
- マップマスク設定
- マップ状態保存機能

# チャットパレット
- 画面表示
- チャット欄への連携

# BGM
- 流す
- チャット欄にあるアイコンから設定画面表示
-
```
