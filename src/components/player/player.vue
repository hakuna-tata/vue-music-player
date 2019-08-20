<template>
    <div class="player" v-show="playlist.length > 0">
        <transition name="normal">
            <div class="normal-player" v-show="fullScreen" @touchstart.once="firstPlay">
                <div class="background">
                    <div class="filter"></div>
                    <img :src="currentSong.image" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back">
                        <i class="iconfont icon-down" @click="back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" @click="changeMiddle">
                    <transition name="middleL">
                        <div class="middle-l" v-show="currentShow === 'cd'">
                            <div class="cd-wrapper">
                                <div class="cd" :class="cdCls" >
                                    <img :src="currentSong.image" class="image">
                                </div>
                            </div>
                        </div>
                    </transition>
                    <!-- <transition name="middleR">
                        <scroll class="middle-r" ref="lyricList" v-show="currentShow === 'lyric'" :data="currentLyric && currentLyric.lines">
                            <div class="lyric-wrapper">
                                <div class="currentLyric" v-if="currentLyric">
                                    <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}"
                                        v-for="(line, index) in currentLyric.lines" :key="line.key">
                                        {{line.txt}}
                                    </p>
                                </div>
                                <p class="no-lyric" v-if="currentLyric === null">{{upDatecurrentLyric}}</p>
                            </div>
                        </scroll>
                    </transition> -->
                </div>
                <div class="bottom">
                    <!-- <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChangeEnd="percentChangeEnd" @percentChange="percentChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(duration)}}</span>
                    </div> -->
                    <div class="operators">
                        <div class="icon i-left" >
                            <i class="iconfont mode" :class="iconMode" @click="changeMode"></i>
                        </div>
                        <div class="icon i-left" >
                            <i class="iconfont icon-Rew" @click="prev"></i>
                        </div>
                        <div class="icon i-center" >
                            <i class="iconfont" @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" >
                            <i class="iconfont icon-ffw" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="iconfont"  @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
           <div class="mini-player" v-show="!fullScreen" @click.stop="open">
                <div class="icon">
                    <img :class="cdCls"  :src="currentSong.image" width="40" height="40">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <div class="desc" v-html="currentSong.singer"></div>
                </div>
                <div class="control" @click.stop="togglePlaying">
                    <progress-circle :radius="radius" :percent="percent">
                        <i class="fa" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="iconfont icon-musicList"></i>
                </div>
            </div>
        </transition>
        <audio ref="audio" autoplay @canplay="ready"></audio>
    </div>
</template>

<script>
import ProgressCircle from '@/base/progress-circle/progress-circle';
import ProgressBar from '@/base/progress-bar/progress-bar';
import Scroll from '@/base/scroll/scroll';
import {playMode} from '@/utils/config';
import {shuffle} from '@/utils/utl';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {getSong, getLyric} from '@/api/song'

export default {
    components:{ProgressCircle,ProgressBar,Scroll},
    computed:{
        iconMode () {
            if (this.mode === playMode.sequence) {
                return 'icon-liebiaoxunhuan'
            } else if (this.mode === playMode.loop) {
                return 'icon-danquxunhuan'
            } else {
                return 'icon-suiji'
            }
        },
        cdCls () {
            return this.playing ? 'play' : 'play pause'
        },
        miniIcon () {
            return this.playing ? 'fa-stop' : 'fa-play'
        },
        playIcon () {
            return this.playing ?  'icon-bofang' : 'icon-zanting'
        },
        upDatecurrentLyric () {
            if (this.noLyric) {
                return '暂无歌词'
            }
            if (!this.noLyric) {
                return '歌词加载中'
            }
        },
        ...mapGetters([
            'playlist',
            'fullScreen',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList',
        ])
    },
    watch:{
        currentSong (newVal, oldVal) {
            if (!newVal.id) {
                return
            }
            if (newVal.id === oldVal.id) {
                return
            }
            this.$refs.audio.pause()
            this.$refs.audio.currentTime = 0
            this._getSong(newVal.id)
        },
        url(newUrl){
            this.$refs.audio.src = newUrl
        },
        playing(newPlaying) {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause()
            })
        },
    },
    data(){
        return{
            url: '',
            songReady: false,
            currentTime: 0,
            duration: 0,
            percent: 0,
            radius: 32,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: '',
            noLyric: false
        }
    },
    methods:{
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlaylist: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList',
            'savePlayHistory'
        ]),
        firstPlay(){

        },
        back(){
            this.setFullScreen(false);
            this.currentShow = 'cd'
        },
        open () {
            this.setFullScreen(true)
        },
        togglePlaying(){
            this.setPlayingState(!this.playing);
        },
        prev(){
            if (!this.songReady) {
                return
            }
            this.songReady = false;
            let index = this.currentIndex - 1;
            if (index === -1) {
                index = this.playlist.length - 1
            }
            this.setCurrentIndex(index)
            if (!this.playing) {
                this.togglePlaying()
            }
            this.songReady = true;
        },
        next(){
            if (!this.songReady) {
                return
            }
            if (this.playlist.length === 1) {
                this.loop()
                return
            } else {
                let index = this.currentIndex + 1
                if (index === this.playlist.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
            }
            this.songReady = false
        },
        ready () {
            this.songReady = true
        },
        changeMiddle(){

        },
        percentChangeEnd(){

        },
        percentChange(){

        },
        format (interval) {
            interval = interval | 0
            let minute = interval / 60 | 0
            let second = interval % 60
            if (second < 10) {
                second = '0' + second
            }
            return minute + ':' + second
        },
        changeMode(){

        },
        
        toggleFavorite(){

        },
        getFavoriteIcon(){

        },
        _getSong (id) {
            getSong(id).then((res) => {
                this.url = res.data.data[0].url
            })
        },
    },
    created () {
        this.move = false
    },
}
</script>

<style lang="scss" scoped>
    .normal-enter-active, .normal-leave-active {
        transition: all 0.4s;
        .top, .bottom {
            transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
    }
    .normal-enter, .normal-leave-to {
        opacity: 0;
    }
    .mini-enter-active, .mini-leave-active {
      transition: all 0.4s;
    }
    .mini-enter, .mini-leave-to {
      opacity: 0;
    }
    .player{
        .normal-player {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 150;
            background: $color-background;

            .background {
                position: absolute;
                left: -50%;
                top: -50%;
                width: 300%;
                height: 300%;
                z-index: -1;
                opacity: 0.6;
                filter: blur(30px);
                .filter {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: black;
                    opacity: 0.6;
                }
            }

            .top {
                position: relative;
                margin-bottom: 25px;
                .back {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 50;
                    .iconfont {
                        display: block;
                        margin-left: 15px;
                        font-size: 25px;
                        color: $color-theme-l;
                    }
                }
                .title {
                    width: 70%;
                    margin: 0 auto;
                    padding-top: 10px;
                    line-height: 20px;
                    text-align: center;
                    @include no-wrap();
                    font-size: $font-size-large;
                    font-weight: bold;
                    color: $color-text-l;
                }
                .subtitle {
                    width: 70%;
                    margin: 0 auto;
                    line-height: 20px;
                    text-align: center;
                    @include no-wrap();
                    font-size: $font-size-small-x;
                    color: $color-text-l;
                }
            }

            .middle {
                display: flex;
                align-items: center;
                position: fixed;
                width: 100%;
                top: 80px;
                bottom: 170px;
                white-space: nowrap;
                font-size: 0;

                .middle-l {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;

                    &.middleL-enter-active, &.middleL-leave-active {
                        transition: all 0.3s
                    }
                    &.middleL-enter, &.middleL-leave-to {
                        opacity: 0
                    }
                    .cd-wrapper {
                        position: absolute;
                        left: 10%;
                        top: 0;
                        width: 80%;
                        height: 100%;
                        .cd {
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 15px solid rgba(255, 255, 255, 0.1);
                            border-radius: 50%;
                            .image {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }  
                    }
                }

                .middle-r {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;

                    &.middleR-enter-active, &.middleR-leave-active {
                        transition: all 0.2s;
                    }
                    &.middleR-enter, &.middleR-leave-to {
                        opacity: 0;
                    }
                    .lyric-wrapper {
                        width: 80%;
                        margin: 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .text {
                            line-height: 40px;
                            color: $color-text-ggg;
                            font-size: $font-size-medium;
                            &.current {
                                color: #FFF;
                            }
                        }
                        .no-lyric {
                            line-height: 40px;
                            margin-top: 60%;
                            color: $color-text-ggg;
                            font-size: $font-size-medium;
                        }
                    }
                }
            }

            .bottom {
                position: absolute;
                bottom: 50px;
                width: 100%;

                .progress-wrapper {
                    display: flex;
                    align-items: center;
                    width: 80%;
                    margin: 0px auto;
                    padding: 10px 0;
                    .time {
                        color: $color-text-l;
                        font-size: $font-size-small;
                        flex: 0 0 30px;
                        line-height: 30px;
                        width: 30px;
                        &.time-l {
                            text-align: left;
                        }
                        &.time-r {
                            text-align: right;
                            color: $color-text-gg;
                        }
                    }
                    .progress-bar-wrapper {
                        flex: 1;
                    }
                }

                .operators {
                    display: flex;
                    align-items: center;
                    .icon {
                        flex: 1;
                        color: $color-theme-l;
                        &.disable {
                            color: $color-theme;
                        }
                        i {
                            font-size: 30px;
                        }
                        .mode {
                            font-size: 25px;
                        }
                        &.i-left {
                            text-align: right;
                        }
                        &.i-center {
                            padding: 0 20px;
                            text-align: center;
                            i {
                                font-size: 40px;
                            }
                        }
                        &.i-right {
                            text-align: left;
                        }
                        .icon-like {
                            color: $color-sub-theme;
                        }
                    }
                }
            }

        }

        .mini-player {
            display: flex;
            align-items: center;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 180;
            width: 100%;
            height: 60px;
            background: rgba(255, 255, 255, 0.85);

            .icon {
                flex: 0 0 40px;
                width: 40px;
                padding: 0 10px 0 20px;
                img {
                    border-radius: 50%;
                }
            }

            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                overflow: hidden;
                .name {
                    margin-bottom: 2px;
                    line-height: 14px;
                    @include no-wrap();
                    font-size: $font-size-medium;
                    color: $color-text;
                }
                .desc {
                    @include no-wrap();
                    font-size: $font-size-small;
                    color: $color-text;
                }
            }
        }
    }
    .play {
        animation: rotate 30s linear infinite;
    }
    .pause {
        animation-play-state: paused;
    }

     @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>