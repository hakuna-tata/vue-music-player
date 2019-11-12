import axios from 'axios'
import { HOST } from '@/utils/config'

export function getBanner () {
    const url = HOST + '/banner'
    return axios.get(url)
}

export function getRecommendList () {
    const url = HOST + '/personalized'
    return axios.get(url)
}

export function getRecommendMusic () {
    const url = HOST + '/personalized/newsong'
    return axios.get(url)
}

export function getPlaylistDetail(id) {
    return axios.get(`${HOST}/playlist/detail`, {
      params: {
        id
      }
    })
  }