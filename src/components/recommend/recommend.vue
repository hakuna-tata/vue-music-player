<template>
    <div class="recommend" ref="recommend">
        <div class="decorate" ref="decorate"></div>
        <scroll class="recommend-content" 
                ref="scroll" 
                :probeType="probeType"
                :listenScroll="listenScroll"
                @scroll="scroll"
                :data="playList.concat(recommendMusic)">
            <div>
                <div v-if="banner.length" class="slider-wrapper" ref="sliderWrapper">
                    <slider>
                        <div v-for="item in banner" :key="item.id" @click="selectBanner(item)">
                            <img :src="item.imageUrl">
                        </div>
                    </slider>
                </div>
                <div class="recommend-list" ref="recommendList">
                    <h1 class="title">推荐歌单</h1>
                    <ul>
                        <li class="item" v-for="item in playList" :key="item.id">
                            <div class="icon" @click="selectList(item)">
                                <div class="gradients"></div>
                                <img v-lazy="item.picUrl">
                            </div>
                            <p class="play-count">
                                <i class="fa fa-headphones"></i>
                                {{Math.floor(item.playCount / 10000) }}万
                            </p>
                            <div class="text">
                                <p class="name">{{item.name}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="recommend-song" ref="recommendSong">
                    <h1 class="title">推荐歌曲</h1>
                    <ul>
                        <li class="item" v-for="item in recommendMusic" :key="item.id" @click="selectSong(item)">
                            <div class="icon">
                                <img v-lazy="item.image">
                            </div>
                            <p class="text">{{item.name}}</p>
                            <p class="singer">{{item.singer}}</p>
                        </li>
                    </ul>
                </div>
                <div class="loading-container" v-show="!playList.length">
                    <loading></loading>
                </div>
            </div>
        </scroll>
         <router-view></router-view>
    </div>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import Slider from '@/base/slider/slider';
 import Loading from '@/base/loading/loading';
import {getBanner, getRecommendList, getRecommendMusic} from '@/api/recommend';
import {createRecommendSong} from '@/utils/song';
import {ERR_OK} from '@/utils/config';
import {playlistMixin} from '@/utils/mixin';
import {mapMutations,mapActions} from 'vuex';

const offsetheight = 88 //decorate的高度

export default {
    mixins: [playlistMixin],
    components:{Scroll,Slider,Loading},
    data(){
        return{
            scrollY:-1,
            banner: [],
            playList: [],
            recommendMusic: []
        }
    },
    watch:{
        scrollY(newY){
            if(newY < -offsetheight){
                this.$refs.decorate.style.height = 0
            }
            this.$refs.decorate.style.height = (offsetheight + newY) + 'px'
           
        }
    },
    methods:{
        ...mapMutations({
            setRecommendList: 'SET_RECOMMEND_LIST'
        }),
        ...mapActions([
            'insertSong'
        ]),
        handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        scroll(pos){
             this.scrollY = pos.y;
        },
        selectBanner(item){
            console.log("fuck")
        },
        selectSong(item){
            this.insertSong(item)
        },
        selectList(item){
            this.$router.push({path: `/recommend/${item.id}`})
            this.setRecommendList(item)
        },
        _getBanner () {
            getBanner().then((res) => {
                if (res.status === ERR_OK) {
                   this.banner = res.data.banners.slice(0,6);
                } else {
                    console.error('Banner 获取失败')
                }
            })
        },
        _getRecommendList () {
            getRecommendList().then((res) => {
                if (res.status === ERR_OK) {
                    this.playList = res.data.result.slice(0,6);
                } else {
                    console.error('getRecommendList 获取失败')
                }
            })
        },
        _getRecommendMusic () {
            getRecommendMusic().then((res) => {
                if (res.status === ERR_OK) {
                    let list = res.data.result.map((item) => {
                        return createRecommendSong(item)
                    });
                    this.recommendMusic = list.slice(0,6);
                } else {
                    console.error('getRecommendMusic 获取失败')
                }
            })
        },
    },
    created(){
        this.listenScroll = true
        this.probeType = 3
        this._getBanner()
        this._getRecommendList()
        setTimeout(() => {
            this._getRecommendMusic()
        },1000)
    }
}
</script>

<style lang="scss" scoped>
    .recommend {
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;

        .decorate {
            position: absolute;
            height:88px;
            width: 100%;
            z-index:-10;
            background: $color-theme;
        }

        .recommend-content {
            width: 100%;
            height: 100%;
            overflow: hidden;

            .slider-wrapper {
                width: 96%;
                margin: 0 auto;
                border-radius: 5px;
                overflow: hidden;
            }

            .recommend-list {
                position: relative;
                box-sizing: border-box;
                width: 100%;
                text-align: center;

                .title {
                    height: 65px;
                    line-height: 65px;
                    padding-left: 1.5%;
                    text-align: left;
                    font-size: $font-size-medium;
                    font-weight: bold;
                    color: $color-text;
                }
                .item {
                    display: inline-block;
                    position: relative;
                    box-sizing: border-box;
                    width: 33%;
                    padding: 0 1%;
                    .icon {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        margin-bottom: 5px;
                        .gradients {
                            position: absolute;
                            top: 0;
                            width: 100%;
                            height: 35px;
                            border-radius: 3px;
                            background: linear-gradient(rgba(109, 109, 109, 0.4),rgba(255, 255, 255, 0));
                        }
                        img {
                            width: 100%;
                            height:100%;
                            border-radius: 3px;
                        }
                    }
                    .play-count {
                        position: absolute;
                        top: 5px;
                        right: 8px;
                        font-size: $font-size-small-s;
                        color: $color-text-l
                    }
                    .text {
                        float: left;
                        line-height: 16px;
                        text-align: left;
                        height: 32px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        margin-bottom: 10px;
                        font-size: $font-size-small;
                    }
                }
            }

            .recommend-song {
                margin-top: -20px;
                box-sizing: border-box;
                width: 100%;
                text-align: center;
                .title {
                    height: 65px;
                    line-height: 65px;
                    padding-left: 1.5%;
                    text-align: left;
                    font-size: $font-size-medium;
                    font-weight: bold;
                    color: $color-text;
                }
                .item {
                    display: inline-block;
                    position: relative;
                    box-sizing: border-box;
                    width: 33%;
                    padding: 0 1%;
                    .icon {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        margin-bottom: 5px;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 3px;
                        }
                    }
                    .text {
                        line-height: 16px;
                        text-align: left;
                        height: 16px;
                        @include no-wrap();
                        font-size: $font-size-small;
                    }
                    .singer {
                        line-height: 16px;
                        margin-bottom: 10px;
                        text-align: left;
                        @include no-wrap();
                        font-size: $font-size-small;
                        color: $color-text-g;
                    }
                }
            }

            .loading-container{
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%)
            }
        }   
    }
</style>
