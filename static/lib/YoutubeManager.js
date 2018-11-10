const script = document.createElement('script')
script.src = 'https://www.youtube.com/player_api'
const firstScript = document.getElementsByTagName('script')[0]
firstScript.parentNode.insertBefore(script, firstScript)

const YoutubeControlManager = () => {
  let playerArr = []
  const playerMapping = {}

  const registration = (tag, url, startSeconds, eventHandler) => {
    let playerObj = playerMapping[tag]
    if (!playerObj) {
      const indexArr = []
      for (const _tag in playerMapping) {
        if (!playerMapping.hasOwnProperty(_tag)) continue
        indexArr.push(playerMapping[_tag].index)
      }
      indexArr.sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      let useIndex = 0
      for (const i of indexArr) {
        if (useIndex !== i) break
        useIndex++
      }

      const usePlayer = playerArr[useIndex]
      if (!usePlayer) {
        alert('アクティブなYoutube再生の上限を超えました。\nこの操作をキャンセルします。')
        return false
      }
      const index = playerArr.indexOf(usePlayer)
      playerObj = {
        player: usePlayer,
        index: index,
        using: true,
        eventHandler: eventHandler
      }
      playerMapping[tag] = playerObj
    } else {
      playerObj.using = true
      playerObj.eventHandler = eventHandler
    }

    const videoId = window['getUrlParam']('v', url)
    youtubeMethod.loadVideoById(tag, videoId, startSeconds, 'small')

    return true
  }
  const destroyed = (tag) => {
    let playerObj = playerMapping[tag]
    if (!playerObj) return
    playerObj.using = false
    playerObj.eventHandler = {}
  }
  /**
   * ===================================================================================================================
   * サポートするYoutubeメソッド
   */
  const doPlayerMethod = (methodName, ...args) => {
    const yPlayer = playerMapping[args.shift()]
    if (!yPlayer) return
    // console.log('doPlayerMethod', methodName, ...args)
    return yPlayer.player[methodName](...args)
  }
  const youtubeMethod = {
    /** IDを指定して読み込ませる */
    loadVideoById (tag, videoId, startSeconds, suggestedQuality) {
      doPlayerMethod('loadVideoById', ...arguments)
      youtubeMethod.play(tag)
    },
    /** 再生する */
    play (tag) {
      doPlayerMethod('playVideo', ...arguments)
    },
    /** 一時停止する */
    pause (tag) {
      doPlayerMethod('pauseVideo', ...arguments)
    },
    /** 再生経過時間の設定 */
    seekTo (tag, seconds, allowSeekAhead) {
      doPlayerMethod('seekTo', ...arguments)
    },
    /** ミュート設定 */
    mute (tag) {
      doPlayerMethod('mute', ...arguments)
    },
    /** ミュート解除 */
    unMute (tag) {
      doPlayerMethod('unMute', ...arguments)
    },
    /** ミュート状態の取得 */
    isMuted (tag) {
      doPlayerMethod('isMuted', ...arguments)
    },
    /** 音量設定 */
    setVolume (tag, volume) {
      doPlayerMethod('setVolume', ...arguments)
    },
    /** 音量取得 */
    getVolume (tag) {
      doPlayerMethod('getVolume', ...arguments)
    },
    /** ループ状態の設定 */
    setLoop (tag) {
      doPlayerMethod('setLoop', ...arguments)
    },
    /** プレーヤーがバッファ済みの動画の割合を 0～1 の数値で取得 */
    getVideoLoadedFraction (tag) {
      doPlayerMethod('getVideoLoadedFraction', ...arguments)
    },
    /**
     * プレーヤーの状態の取得
     * YT.PlayerState.ENDED
     * YT.PlayerState.PLAYING
     * YT.PlayerState.PAUSED
     * YT.PlayerState.BUFFERING
     * YT.PlayerState.CUED
     */
    getPlayerState (tag) {
      doPlayerMethod('getPlayerState', ...arguments)
    },
    /** 動画の再生を開始してからの経過時間を秒数で取得 */
    getCurrentTime (tag) {
      doPlayerMethod('getCurrentTime', ...arguments)
    },
    /**
     * 現在の動画の実際の画質を取得
     * small
     * medium
     * large
     * hd720
     * hd1080
     * highres
     */
    getPlaybackQuality (tag) {
      doPlayerMethod('getPlaybackQuality', ...arguments)
    },
    /** 現在の動画の推奨画質を設定 */
    setPlaybackQuality (tag) {
      doPlayerMethod('setPlaybackQuality', ...arguments)
    },
    /** 現在の動画で有効な画質のセットを取得 */
    getAvailableQualityLevels (tag) {
      doPlayerMethod('getAvailableQualityLevels', ...arguments)
    },
    /** 再生中の動画の長さを秒数で取得 */
    getDuration (tag) {
      doPlayerMethod('getDuration', ...arguments)
    },
    /** 読み込み済みまたは再生中の動画の YouTube.com URLを取得 */
    getVideoUrl (tag) {
      doPlayerMethod('getVideoUrl', ...arguments)
    },
    /** 埋め込まれた <iframe> に対する DOM ノードを取得 */
    getIframe (tag) {
      doPlayerMethod('getIframe', ...arguments)
    }
  }

  /**
   * ===================================================================================================================
   * サポートするYoutubeイベント
   */
  const getPlayerObj = (index) => {
    let playerObj = null
    for (const tag in playerMapping) {
      if (!playerMapping.hasOwnProperty(tag)) continue
      if (playerMapping[tag].player === playerArr[index]) {
        playerObj = playerMapping[tag]
        break
      }
    }
    return playerObj
  }
  const callEventHandler = (index, eventName, ...args) => {
    if (eventName !== 'timeUpdate') {
      // console.log(`--- ${eventName} => ${index}`, ...args)
    }
    let playerObj = getPlayerObj(index)
    if (!playerObj) {
      return
    }
    if (playerObj.eventHandler[eventName]) {
      playerObj.eventHandler[eventName](...args)
    }
  }
  const eventHandler = {
    onReady: (index) => {
      callEventHandler(index, 'onReady')
    },
    onEnded: (index, event) => {
      callEventHandler(index, 'onEnded')
      event.target.playVideo()
    },
    onPlaying: (index, event) => {
      try {
        let playerObj = getPlayerObj(index)
        if (!playerObj) return

        // 既にタイマーが張られていたら停止する
        if (playerObj.timeUpdateTimer) clearInterval(playerObj.timer)

        // 100ミリ秒毎に現在の再生経過時間を通知する
        playerObj.timeUpdateTimer = setInterval(() => {
          callEventHandler(index, 'timeUpdate', event.target.getCurrentTime())
        }, 100)
      } catch (error) {
        console.error(error)
      }
      callEventHandler(index, 'onPlaying', event.target.getDuration(), event.target)
    },
    onPaused: index => {
      callEventHandler(index, 'onPaused')
    },
    onBuffering: index => {
      callEventHandler(index, 'onBuffering')
    },
    onCued: index => {
      callEventHandler(index, 'onCued')
    },
    onPlaybackQualityChange: index => {
      callEventHandler(index, 'onPlaybackQualityChange')
    },
    onPlaybackRateChange: index => {
      callEventHandler(index, 'onPlaybackRateChange')
    },
    onError: (index, event) => {
      callEventHandler(index, 'onError', event)
    },
    onApiChange: index => {
      callEventHandler(index, 'onApiChange')
    }
  }

  return {
    init: () => {
      const ypContainer = document.getElementById('YoutubePlayerContainer')
      Array.from(ypContainer.children).forEach((elm, i) => {
        let player = new window['YT']['Player'](elm.id, {
          width: '0',
          height: '0',
          events: {
            'onReady': event => eventHandler.onReady(i, event),
            'onStateChange': event => {
              switch (event.data) {
                case window['YT']['PlayerState']['ENDED']:
                  eventHandler.onEnded(i, event)
                  break
                case window['YT']['PlayerState']['PLAYING']:
                  eventHandler.onPlaying(i, event)
                  break
                case window['YT']['PlayerState']['PAUSED']:
                  eventHandler.onPaused(i, event)
                  break
                case window['YT']['PlayerState']['BUFFERING']:
                  eventHandler.onBuffering(i, event)
                  break
                case window['YT']['PlayerState']['CUED']:
                  eventHandler.onCued(i, event)
                  break
                default:
              }
            },
            'onPlaybackQualityChange': event => eventHandler.onPlaybackQualityChange(i, event),
            'onPlaybackRateChange': event => eventHandler.onPlaybackRateChange(i, event),
            'onError': event => eventHandler.onError(i, event),
            'onApiChange': event => eventHandler.onApiChange(i, event)
          },
          'playerVars': {
            autoplay: 0, // 0:自動再生しない or 1:自動再生
            controls: 1, // 再生ボタンとか出さない
            disablekb: 1, // ショートカットキー無効
            enablejsapi: 1, // JavaScript API 有効
            list: 'search', // 検索クエリ使用
            listType: 'search', // 検索クエリ使用
            loop: 1, // 0:ループしない or 1:ループする 後で再設定する
            rel: 0, // 関連動画出さない
            showinfo: 0 // 動画名とか出さない
          }
        })
        playerArr.push(player)
      })
    }, // end of init
    'play': youtubeMethod.play,
    'pause': youtubeMethod.pause,
    'seekTo': youtubeMethod.seekTo,
    'mute': youtubeMethod.mute,
    'unMute': youtubeMethod.unMute,
    'isMuted': youtubeMethod.isMuted,
    'setVolume': youtubeMethod.setVolume,
    'getVolume': youtubeMethod.getVolume,
    'setLoop': youtubeMethod.setLoop,
    'getVideoLoadedFraction': youtubeMethod.getVideoLoadedFraction,
    'getPlayerState': youtubeMethod.getPlayerState,
    'getCurrentTime': youtubeMethod.getCurrentTime,
    'getPlaybackQuality': youtubeMethod.getPlaybackQuality,
    'setPlaybackQuality': youtubeMethod.setPlaybackQuality,
    'getAvailableQualityLevels': youtubeMethod.getAvailableQualityLevels,
    'getDuration': youtubeMethod.getDuration,
    'getVideoUrl': youtubeMethod.getVideoUrl,
    'getIframe': youtubeMethod.getIframe,
    'registration': registration,
    'destroyed': destroyed
  }
}
window.youtube = YoutubeControlManager()
window.onYouTubeIframeAPIReady = () => {
  window.youtube.init()
}
