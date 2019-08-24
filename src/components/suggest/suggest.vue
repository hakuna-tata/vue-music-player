<template>
    <scroll class="suggest" 
            ref="suggest"
            :pullup="pullup"
            :data="songs">
        <div class="search-suggest">
            <p class="title">最佳匹配</p>
            <div v-if="artists">
                <div v-for="item in artists" @click="selectSinger(item)" class="search-suggest-item" >
                    <img :src="item.img1v1Url" style="border-radius:50%">
                    <p>歌手:{{item.name}}</p>
                </div>
            </div>
            <div v-if="playlists">
                <div v-for="item in playlists" @click="selectList(item)" class="search-suggest-item" >
                    <img :src="item.coverImgUrl">
                    <div class="playlists">
                        <p>歌单:{{item.name}}</p>
                        <div>
                            <span>{{item.trackCount}}首</span>
                            <span>播放{{item.playCount}}次</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="songs">
                <div v-for="item in songs" @click="selectMusic(item)" class="search-suggest-item" >
                    <div class="name">
                        <p class="song">{{item.name}}</p>
                        <p class="singer">{{item.artists[0].name}}</p>
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
            artists: [],
            playlists:[],
            songs: [],
            pullup:true,
            haveMore: true
        }
    },
    methods:{
        ...mapMutations({
            setSinger: 'SET_SINGER',
            setRecommendList: 'SET_RECOMMEND_LIST'
        }),
        selectSinger(item){
            let aliaName = item.trans ? item.trans : item.alias[0] ? item.alias[0] : ""
            this.$router.push({path:`/singer/${item.id}`})
            this.setSinger({
                aliaName: aliaName,
                avatar:item.img1v1Url,
                id:item.id,
                name:item.name
            })
        },
        selectList(item){
            this.$router.push({path: `/recommend/${item.id}`})
            this.setRecommendList(item)
        },
        selectMusic(){

        },
        search(newVal){
            this.haveMore = true
            this.$refs.suggest.scrollTo(0, 0)
            getSearchSuggest(newVal).then((res) => {
                let {artists,playlists,songs} = res.data.result
                this.artists = artists;
                this.playlists = playlists;
                this.songs = songs;
                this.$emit('refresh')
            })
            
        },
        searchMore () {
            if (!this.haveMore) {
                return
            }
            if (!this.songs.length) {
                return
            }
        },
    },
    watch:{
        query(newVal){
            if(newVal === ''){
                return
            }
            this.search(newVal)
        }
    }
}
</script>

<style lang="scss" scoped>
    .suggest {
        overflow: hidden;
        height: 100%;
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
                height: 50px;
                padding: 8px 5px;
                border-bottom: 1px solid rgb(228, 228, 228);
                font-size: $font-size-medium;
                img {
                    flex: 0 0 50px;
                    width:50px;
                    height:50px;
                    margin-right: 15px;
                }
                p {
                    @include no-wrap();
                }
                .playlists {
                    width: calc(100% - 65px);
                    div{
                        margin-top:10px;
                        font-size: 12px;
                        color: $color-text;
                        span + span{
                            margin-right: 10px;
                        }
                    }
                    
                }
                .name {
                    flex: 1;
                    font-size: $font-size-medium;
                    color: $color-text;
                    .song {
                        font-size: $font-size-medium-x;
                        color: $color-text;
                    }
                    .singer {
                        margin-top:10px;
                        font-size: 12px;
                        color: $color-text-g;
                    }
                }
            }
        }
    }
</style>