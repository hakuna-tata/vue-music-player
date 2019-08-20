import * as types from './mutation-types';
import {playMode} from '@/utils/config';
import {shuffle} from '@/utils/utl';

function findIndex (list, song) {
    return list.findIndex((item) => {
      return item.id === song.id
    })
}

export const selectPlay = function ({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    // 如果播放模式为随机
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      commit(types.SET_PLAYLIST, randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}
