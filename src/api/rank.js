import axios from 'axios'
import {HOST} from '@/utils/config'

// 排行榜列表
export function getToplistDetail() {
  return axios.get(`${HOST}/toplist/detail`)
}