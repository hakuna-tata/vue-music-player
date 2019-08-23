<template>
    <scroll class="suggest" ref="suggest">
        <div class="search-suggest">
            <p class="title">最佳匹配</p>
            <div v-if="suggest.artists">
                <div v-for="item in suggest.artists" @click="selectItem(item)" class="search-suggest-item" >
                    <img :src="item.img1v1Url" width="50" height="50">
                    <span>歌手：{{item.name}}</span>
                </div>
            </div>
            <div v-if="suggest.playlists">
                <div v-for="item in suggest.playlists" @click="selectList(item)" class="search-suggest-item" >
                    <img :src="item.coverImgUrl" width="50" height="50">
                    <div class="text">
                        <p>歌单:{{item.name}}</p>
                        <p class="singer">{{suggest.albums[0].artist.name}}</p>
                    </div>
                </div>
            </div>
        </div>
    </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading';
import {getSearchSuggest,getSearchSongs, getSongDetail} from '@/api/search';
import {createSearchSong} from '@/utils/song';
import {mapMutations, mapActions} from 'vuex';

export default {
    components:{Scroll},
    props:{
        query: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            suggest: {},
            singer: {},
            songs: [],
            page: 0,
            update: true,
            haveMore: true
        }
    },
    methods:{
        selectItem(){

        },
        selectList(){

        },
        search(){
            this.haveMore = true
            this.$refs.suggest.scrollTo(0, 0)
            getSearchSuggest(this.query).then((res) => {
                this.suggest = res.data.result
                console.log(this.suggest)
            })
            
        },
        searchMore () {
            if (!this.haveMore) {
                return
            }
            if (!this.songs.length) {
                return
            }
            getSearchSongs(this.query, this.page).then((res) => {
                let list = res.data.result.songs
                if (!res.data.result.songs) {
                    this.haveMore = false
                    return
                }
                let ret = []
                list.forEach((item) => {
                    ret.push(createSearchSong(item))
                })
                this.songs = this.songs.concat(ret)
                this.$emit('refresh')
                this.page += 30
            })
        },
    },
    watch:{
        query(newVal){
            if(newVal === ''){
                return
            }
            this.search()
        }
    }
}
</script>

<style lang="scss" scoped>
    .suggest {
        overflow: hidden;

        .search-suggest {
            margin:0 10px;
            .title {
                padding:0 5px 10px;
                color: $color-theme;
                font-size: 11px;
            }
            .search-suggest-item {
                display: flex;
                align-items: center;
                padding: 8px 5px;
                border-bottom: 1px solid rgb(228, 228, 228);
                font-size: $font-size-medium;
                img {
                    flex: 0 0 50px;
                    padding-right: 15px;
                }
                .text {
                    width: 100%;
                    p {
                        padding: 3px 0;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .singer {
                        font-size: 12px;
                        color: $color-text;
                    }
                }
            }
        }
    }
</style>