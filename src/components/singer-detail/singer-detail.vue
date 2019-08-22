<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {getSingerDetail} from '@/api/singer';
import {ERR_OK} from '@/utils/config';
import {createSong} from '@/utils/song';
import {mapGetters} from 'vuex';


export default {
    components: {MusicList},
    data(){
        return{
            songs: [],
        }
    },
    computed:{
        title () {
            let name = ''
            if (this.singer.aliaName) {
                name = this.singer.name + ` (${this.singer.aliaName})`
            } else {
                name = this.singer.name
            }
            return name
        },
        bgImage () {
            return this.singer.avatar
        },
        ...mapGetters([
            'singer'
        ])
    },
    methods:{
        _getDetail () {
            if (!this.singer.id) {
                this.$router.push('/singer')
            }
            getSingerDetail(this.singer.id).then((res) => {
                if (res.status === ERR_OK) {
                    this.songs = this._normalizeSongs(res.data.hotSongs) 
                }
            })
        },
        _normalizeSongs (list) {
            let ret = []
            list.forEach((item) => {
                ret.push(createSong(item))
            })
            return ret
        },
    },
    created(){
        this._getDetail()  
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