import * as types from './mutation-types'

const mutations = {
    [types.SET_MUSIC_LIST] (state, musicList) {
        state.musicList = musicList
    },
    [types.SET_SINGER] (state, singer) {
        state.singer = singer
    },
}

export default mutations;