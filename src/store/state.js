import {playMode} from '@/utils/config'
import {loadPlay,loadFavorite} from '@/utils/cache'

const state = {
    recommendList: {},
    topList: {},
    singer: {},
    // 播放
    playing: false,
    // 全屏
    fullScreen: false,
    playlist: [],
    // 顺序列表
    sequenceList: [],
    // 播放模式
    mode: playMode.sequence,
    // 当前播放索引
    currentIndex: -1,
    playHistory: loadPlay(),
    favoriteList:loadFavorite(),
}

export default state;