<template>
    <transition name="slide">
        <div class="music-list">
            <div class="back" @click="back" ref="back">
                <i class="iconfont icon-fanhui"></i>
                <h1 class="title">{{headerTitle}}</h1>
            </div>
            <div class="bg-image" :style="bgStyle" ref="bgImage">
                <div class="filter"></div>
                <h1 class="list-title">{{headerTitleTouchDown}}</h1>
            </div>
            <scroll class="list"
                @scroll="scroll"
                :probe-type="probeType"
                :listen-scroll="listenScroll"
                :data="listDetail"
                ref="list">
                <div class="music-list-wrapper">
                    <div class="song-list-wrapper">
                        <div class="sequence-play" v-show="listDetail.length" @click="sequence">
                            <i class="iconfont icon-zanting"></i>
                            <span class="text">播放全部</span>
                            <span class="count">(共{{listDetail.length}}首)</span>
                        </div>
                        <song-list @select="selectItem" :songs="listDetail"></song-list>
                    </div>
                </div>
                <div class="loading-content" v-show="!listDetail.length">
                    <loading></loading>
                </div>
            </scroll>
        </div>
    </transition>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import SongList from '@/base/song-list/song-list';
import {getSingerDetail} from '@/api/singer';
import {ERR_OK} from '@/utils/config';
import {createSong} from '@/utils/song';
import {prefixStyle} from '@/utils/dom';
import {mapGetters, mapActions} from 'vuex';

const RESERVED_HEIGHT = 44;
const transform = prefixStyle('transform');

export default {
    components: {SongList,Scroll,Loading},
    data(){
        return{
            listDetail: [],
            scrollY:0,
            node:null,
            headerTitle: ""
        }
    },
    computed:{
        headerTitleTouchDown () {
            let name = ''
            if (this.singer.aliaName) {
                name = this.singer.name + ` (${this.singer.aliaName})`
            } else {
                name = this.singer.name
            }
            return name
        },
        bgStyle () {
            return `background-image: url(${this.singer.avatar})`
        },
        ...mapGetters([
            'singer'
        ])
    },
    watch:{
        node (val) {
            this.listDetail = this._normalizeSongs(val)
        },
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
                this.headerTitle = this.headerTitleTouchDown;
                this.$refs.bgImage.style.paddingTop = 0;
                this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
                
            }else {
                this.headerTitle = "";
                this.$refs.bgImage.style.paddingTop = '70%';
                this.$refs.bgImage.style.height = 0;
                
            }
            this.$refs.bgImage.style[transform] = `scale(${scale})`;
            this.$refs.bgImage.style.zIndex = zIndex;
        }
    },
    methods:{
        back(){
            this.$router.back()
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        sequence(){

        },
        selectItem(item){

        },
        _getDetail () {
            if (!this.singer.id) {
                this.$router.push('/singer')
            }
            getSingerDetail(this.singer.id).then((res) => {
                if (res.status === ERR_OK) {
                    this.node = res.data.hotSongs
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
        this._getDetail();
        this.probeType = 3;
        this.listenScroll = true;
    },
    mounted(){
        this.imageHeight = this.$refs.bgImage.clientHeight;
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
        this.$refs.list.$el.style.top = `${this.imageHeight}px`;
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

    .loading-content {
        width: 100%;
        height: 100%;
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
                left:50%;
                top:0;
                transform: translateX(-50%);
                font-size: $font-size-large-s;
            }
        }

        .bg-image {
            position: relative;
            width: 100%;
            height: 0;
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
                color: #fff;
                position: absolute;
                left: 20px;
                bottom: 10%;
                font-size: $font-size-large-s;
                font-weight: bold;
                letter-spacing: 1px;
            }
        }
    }

    .list {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: $color-background;

        .song-list-wrapper {
            position: relative;
            background: $color-background;

            .sequence-play {
                display: flex;
                align-items: center;
                width: 100%;
                height: 50px;
                padding-left: 16px;
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
</style>