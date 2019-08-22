<template>
    <div class="music-list">
        <div class="back" ref="back">
            <i class="iconfont icon-fanhui" @click="back"></i>
            <h1 class="title" v-show="scrollY < minTranslateY">{{title}}</h1>
        </div>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="filter"></div>
            <h1 class="list-title">{{title}}</h1>
            <p class="play-count" v-if="playCount">
              <i class="icon-erji"></i>{{playCount}}
            </p>
            <p class="play-count" v-if="updateTime">{{updateTime}}</p>
        </div>
        <scroll class="list"
            @scroll="scroll"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            :data="songs"
            ref="list">
            <div class="song-list-wrapper">
                <div class="sequence-play" v-show="songs.length" @click="sequence">
                    <i class="iconfont icon-zanting"></i>
                    <span class="text">播放全部</span>
                    <span class="count">(共{{songs.length}}首)</span>
                </div>
                <song-list @select="selectItem" :rank="rank" :songs="songs"></song-list>
            </div>
            <div class="loading-content" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import SongList from '@/base/song-list/song-list';
import {prefixStyle} from '@/utils/dom';
import {playlistMixin} from '@/utils/mixin';
import {mapGetters, mapActions} from 'vuex';

const RESERVED_HEIGHT = 44;
const transform = prefixStyle('transform');

export default {
    mixins: [playlistMixin],
    components: {SongList,Scroll,Loading},
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        },
        playCount:{
            type:[String,Number],
            default:''
        },
        updateTime: {
            type: String,
            default: ''
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            scrollY:0,
            minTranslateY:0,
        }
    },
    computed:{
        bgStyle () {
            return `background-image: url(${this.bgImage})`
        },
    },
    methods:{
        ...mapActions([
            'selectPlay',
            'sequencePlay'
        ]),
        handlePlaylist(playlist){
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.list.$el.style.bottom = bottom
            this.$refs.list.refresh()
        },
        back(){
            this.$router.back()
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        sequence(){
            let list = this.songs
            this.sequencePlay({
                list: list
            })
        },
        selectItem(item,index){
            this.selectPlay({
                list: this.songs,
                index: index
            })
        },
        
    },
    created() {
        this.probeType = 3
        this.listenScroll = true
    },
    mounted(){
        this.imageHeight = this.$refs.bgImage.clientHeight;
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    },
     watch: {
        scrollY (newY) {
            const percent = Math.abs(newY / this.imageHeight);
            let scale = 1;
            let zIndex = 0;
            if(newY > 0){
                scale = 1 + percent;
                zIndex = 10;
                this.$refs.back.style.background = `rgba(212, 68, 57, 0)`; 
                
            }else{
                this.$refs.back.style.background = `rgba(212, 68, 57, ${percent})`;
            }

            if (newY < this.minTranslateY) {
                this.$refs.bgImage.style.paddingTop = 0;
                this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
                
            }else {
                this.$refs.bgImage.style.paddingTop = '70%';
                this.$refs.bgImage.style.height = 0;
                
            }
            this.$refs.bgImage.style[transform] = `scale(${scale})`;
            this.$refs.bgImage.style.zIndex = zIndex;
        }
    },
}
</script>

<style lang="scss" scoped>
    .loading-content {
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);

    }
    .music-list {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: $color-background;
        
        .back {
            position:fixed;
            width: 100%;
            height: 44px;
            line-height: 44px;
            top: 0;
            z-index: 50;
            color:#fff;
            .iconfont {
                margin-left: 15px;
                font-size: 25px;
            }
            .title{
                 position: absolute;
                width: 50%;
                text-align: center;
                left:50%;
                top:0;
                transform: translateX(-50%);
                font-size: $font-size-large-s;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .bg-image {
            position: relative;
            width: 100%;
            padding-top: 70%;
            transform-origin: top;
            background-size: cover;
            background-position: 0 20%;

            .filter {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
                opacity: 0.2;
            }

            .list-title {
                color: $color-background;
                position: absolute;
                left:15px;
                bottom: 15%;
                font-size: $font-size-large-s;
                font-weight: bold;
                letter-spacing: 1px;
            }

            .play-count {
                color: $color-background;
                position: absolute;
                left:15px;
                bottom: 5%;
                font-size: $font-size-small;
            }
        }

        .list {
            position: fixed;
            bottom: 0;
            top:70vw;
            width: 100%;
            .song-list-wrapper {
                position: relative;
                background: $color-background;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                .sequence-play {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 50px;
                    padding-left: 16px;
                    box-sizing: border-box;
                    border-bottom: 1px solid rgb(228, 228, 228);
                    .iconfont {
                        font-size: 18px;
                        color: $color-text;
                        padding-right: 14px;
                    }
                    .text {
                        font-size: $font-size-medium-x;
                    }
                    .count {
                        font-size: $font-size-medium;
                        color: $color-text-g;
                    }
                }
            }
        }
    }
</style>