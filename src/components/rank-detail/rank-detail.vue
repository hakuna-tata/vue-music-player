<template>
    <transition name="slide">
        <music-list :rank="rank" :updateTime="updateTime" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list';
import {ERR_OK} from '@/utils/config';
import {createSong} from '@/utils/song';
import {mapGetters} from 'vuex'

export default {
    components: {MusicList},
    computed:{
        title() {
            return this.topList.name
        },
        bgImage() {
            return this.topList.coverImgUrl
        },
        updateTime () {
            let time = new Date(this.topList.updateTime)
            let month = time.getMonth() + 1
            let day = time.getDate()
            return `最近更新:${month}月${day}日`
        },
        ...mapGetters([
            'topList'
        ])
    },
    data(){
        return{
            songs:[],
            rank: true
        }
    },
    methods:{
        _normalizeSongs(list){
            if (!this.topList.id) {
                this.$router.push('/rank')
            }
            let ret = []
            list.forEach((item) => {
                ret.push(createSong(item))
            })
            this.songs = ret
        }
    },
    created(){
        this._normalizeSongs(this.topList.tracks)
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