<template>
    <transition name="slide">
        <music-list :rank="rank" :updateTime="updateTime" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import {getPlaylistDetail} from '@/api/recommend';
import MusicList from '@/components/music-list/music-list';
import {ERR_OK} from '@/utils/config';
import {createSong} from '@/utils/song';
import {mapMutations,mapGetters} from 'vuex'

export default {
    props:['id'],
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
        ...mapMutations({
            setTopList: 'SET_TOP_LIST'
        }),
        _getPlaylistDetail(){
            getPlaylistDetail(this.id).then(res => {
                if(res.data.code === 200){
                    this.setTopList(res.data.playlist)
                    this._normalizeSongs(res.data.playlist.tracks)
                }
            })
            .catch(err => {
                this.$router.push('/rank')
            })
        },
        _normalizeSongs(list){
            let ret = []
            list.forEach((item) => {
                ret.push(createSong(item))
            })
            this.songs = ret
        }
    },
    created(){
        this._getPlaylistDetail()
    },
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