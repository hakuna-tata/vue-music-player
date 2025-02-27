<template>
    <div class="player" v-show="playlist.length > 0">
        <transition name="normal">
            <div class="normal-player" v-show="fullScreen">
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
                    <player-cd 
                        :currentShow="currentShow" 
                        :playing="playing"
                        :playingLyric="playingLyric"
                        :currentSongImage="currentSong.image" >
                    </player-cd>
                    <player-lyric
                        :currentShow="currentShow" 
                        :currentLyric="currentLyric"
                        :lyricIndex="lyricIndex"
                        :noLyric="noLyric"
                        @setLyric="setLyric">
                    </player-lyric>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(duration)}}</span>
                    </div>
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
                            <i class="iconfont" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
           <div class="mini-player" v-show="!fullScreen" @click.stop="open">
                <div class="icon">
                    <img :class="this.playing ? 'play' : 'play pause'"  :src="currentSong.image" width="40" height="40">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <div class="desc" v-html="currentSong.singer"></div>
                </div>
                <div class="control" @click.stop="togglePlaying">
                    <progress-circle :radius="radius" :percent="percent">
                        <i class="mini-icon" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="iconfont icon-shunxu"></i>
                </div>
            </div>
        </transition>
        <playlist @stopMusic="stopMusic" ref="playlist"></playlist>
        <audio ref="audio" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script>
import ProgressCircle from '@/base/progress-circle/progress-circle';
import ProgressBar from '@/base/progress-bar/progress-bar';
import playerCd from './player-cd';
import playerLyric from './player-lyric';
import Playlist from '@/components/play-list/play-list';
import {playMode} from '@/utils/config';
import {shuffle} from '@/utils/utl';
import {parseLyric} from '@/utils/lyric';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {getSong, getLyric} from '@/api/song'

export default {
    components:{ProgressCircle,ProgressBar,playerCd,playerLyric,Playlist},
    computed:{
        iconMode () {
            if (this.mode === playMode.sequence) {
                return 'icon-sequeue'
            } else if (this.mode === playMode.loop) {
                return 'icon-xunhuan'
            } else {
                return 'icon-suiji'
            }
        },
        miniIcon () {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        playIcon () {
            return this.playing ?  'icon-bofang' : 'icon-zanting'
        },
        ...mapGetters([
            'playlist',
            'fullScreen',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList',
            'favoriteList'
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
            this.$refs.audio.currentTime = 0;
            this._getSong(newVal.id)
        },
        url(newUrl){
            this.$refs.audio.src = newUrl;
            let timeStamp = setInterval(() => {
                this.duration = this.$refs.audio.duration;
                if (this.duration) {
                    clearInterval(timeStamp)
                }
            }, 20)

            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.$refs.audio.play()
                this._getLyric(this.currentSong.id)
            }, 1000)
        },
        playing(newPlaying) {
            this.$nextTick(() => {
                newPlaying ? this.$refs.audio.play() : this.$refs.audio.pause()
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
            playingLyric: "", // 当前播放的歌词
            currentShow: "cd", // cd界面还是lyric界面
            currentLyric: null, // 歌词
            lyricIndex: 0, // 当前播放歌词下标
            noLyric: false  // 是否有歌词
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
            'savePlayHistory',
            'saveFavoriteList',
            'deleteFavoriteList',
        ]),
        back(){
            this.setFullScreen(false);
            this.currentShow = 'cd'
        },
        open () {
            this.setFullScreen(true)
        },
        changeMiddle(){
            if (this.currentShow === 'cd') {
                this.currentShow = 'lyric'
            } else {
                this.currentShow = 'cd'
            }
        },
        togglePlaying(){
            if (!this.songReady) {
                return
            }
            this.setPlayingState(!this.playing)
        },
        changeMode(){
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            }else {
                list = this.sequenceList
            }
            this._resetCurrentIndex(list);
            this.setPlaylist(list);
        },  
        prev(){
            if (!this.songReady) {
                return
            }
            if (this.playlist.length === 1) {
                this.loop()
                return
            } else{
                let index = this.currentIndex - 1;
                if (index === -1) {
                    index = this.playlist.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
            }
            this.songReady = false;
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
        loop(){
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            this.setPlayingState(true)
        },
        ready () {
            this.songReady = true
            this.savePlayHistory(this.currentSong)
        },
        error(){
            this.songReady = true
        },
        updateTime (e) {
            this._showPercent(e.target.currentTime)
            this._findLyricIndex(e.target.currentTime)
        },
        end(){
            if (this.mode === playMode.loop) {
                this.loop()
            } else {
                this.next()
            }
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
        onProgressBarChange(percent){
            this.$refs.audio.currentTime = this.duration * percent;
            if (!this.playing) {
                this.togglePlaying()
            }
        },
        toggleFavorite(song){
            if (this.isFavorite(song)) {
                this.deleteFavoriteList(song)
            } else {
                this.saveFavoriteList(song)
            }
        },
        getFavoriteIcon(song){
            if (this.isFavorite(song)) {
                return 'icon-like'
            }
            return 'icon-dislike'
        },
        isFavorite (song) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === song.id
            })
            return index > -1
        },
        showPlaylist(){
            this.$refs.playlist.show()
        },
        stopMusic(){
            this.$refs.audio.pause()
        },
        setLyric(text){
            this.playingLyric = text
        },
        _getSong (id) {
            getSong(id).then((res) => {
                this.url = res.data.data[0].url
            })
        },
        _getLyric(id){
            this.noLyric = false;
            if(this.currentLyric){
                this.currentLyric = null
            }
            getLyric(id).then(res => {
                if (res.status === 200) {
                    if (res.data.nolyric) {
                        this.nolyric = true
                    } else {
                        this.nolyric = false
                        this.currentLyric = parseLyric(res.data.lrc.lyric)
                    }
                }
            }).catch( err => {
                this.currentLyric = null
                this.noLyric = true
            })
        },
        _showPercent(newTime){
            this.currentTime = newTime
            this.percent = newTime / this.duration
        },
        _findLyricIndex(newTime){
            if(this.noLyric || !this.currentLyric){
                return
            }
            let lyricIndex = 0
            for (let i = 0; i < this.currentLyric.length; i++) {
                if (newTime > this.currentLyric[i].time) {
                    lyricIndex = i
                }
            }
            this.lyricIndex = lyricIndex
        }, 
        _resetCurrentIndex (list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
    }
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

            .control {
                flex: 0 0 30px;
                width: 30px;
                padding: 0 10px;
                
                .iconfont {
                    position: relative;
                    font-size: 25px;
                    left: 0;
                    top: -2px;
                }

                .mini-icon{
                    color: $color-theme-d;
                    font-size: 30px;
                    position: absolute;
                    left:1px;
                    top: 1px;
                }
                
            }           
        }
    }
</style>