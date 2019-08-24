<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" :playCount="playCount"></music-list>
    </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list';
import {getRecommendListDetail} from '@/api/recommend';
import {ERR_OK} from '@/utils/config';
import {createRecommendListSong} from '@/utils/song';
import {mapGetters} from 'vuex'

export default {
    components: {MusicList},
    data(){
        return{
            songs:[],
        }
    },
    computed:{
        title() {
            return this.recommendList.name
        },
        bgImage() {
            return this.recommendList.picUrl || this.recommendList.coverImgUrl
        },
        playCount () {
        if (!this.recommendList.playCount) {
            return
        }
        if (this.recommendList.playCount < 1e5) {
            return Math.floor(this.recommendList.playCount)
        } else {
            return Math.floor(this.recommendList.playCount / 10000) + '万'
        }
        },
        ...mapGetters([
            'recommendList'
        ])
    },
    created() {
        this._getRecommendListDetail(this.recommendList.id)
    },
    methods:{
        _getRecommendListDetail(id){
            if (!id) {
                this.$router.push('/recommend')
                return
            }
             getRecommendListDetail(id).then((res) => {
                if (res.status === ERR_OK) {
                    this.songs = res.data.playlist.tracks.map((item) => {
                        return createRecommendListSong(item)
                    })
                } else {
                    console.error('getRecommendListDetail 获取失败！')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .slide-enter-active, .slide-leave-active {
        transition: all 0.2s
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
</style>