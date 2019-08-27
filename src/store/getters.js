import {getSong} from '@/api/song'

export const recommendList = state => state.recommendList

export const topList = state => state.topList

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList

export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}
}