<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="iconfont" :class="iconMode" @click="changeMode"></i>
                        <span class="text">{{ modeText }}
                            (<span class="count">{{playlist.length}}</span>)
                        </span>
                        <span @click="showConfirm">
                            <i class="icon-shanchu"></i>
                        </span>
                    </h1>
                </div>
                <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
                    <transition-group name="list" ref="list" tag="ul">
                        <li class="item" ref="listItem" v-for="(item, index) in sequenceList" :key="item.id">
                            <i class="iconfont" :class="getCurrentIcon(item)"></i>
                            <span class="text" @click.stop="selectItem(item, index)">{{item.name}}</span>
                            <span class="like" @click.stop="toggleFavorite(item)" >
                                <i :class="getFavoriteIcon(item)"></i>
                            </span>
                            <span class="delete" @click.stop="deletOne(item)">
                                <i class="icon-del"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div @click="hide" class="list-close">
                    <span>关闭</span>
                </div>
            </div>
            <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
        </div>
    </transition>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Confirm from '@/base/confirm/confirm'
import {playMode} from '@/utils/config'
import {shuffle} from '@/utils/utl'
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
    components:{Scroll,Confirm},
    computed:{
        modeText () {
            return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
        },
        iconMode () {
            if (this.mode === playMode.sequence) {
                return 'icon-sequeue'
            } else if (this.mode === playMode.loop) {
                return 'icon-xunhuan'
            } else {
                return 'icon-suiji'
            }
        },
        ...mapGetters([
            'fullScreen',
            'playlist',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList',
            'favoriteList'
        ])
    },
    data(){
        return{
            showFlag: false,
            refreshDelay: 100
        }
    },
    methods:{
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'selectPlay',
            'saveFavoriteList',
            'deleteFavoriteList',
            'deleteSong',
            'deleteSongList'
        ]),
         getCurrentIcon (item) {
            if (this.currentSong.id === item.id) {
                return 'icon-voice'
            }
            return ''
        },
        show () {
            this.showFlag = true
            setTimeout(() => {
                this.$refs.listContent.refresh()
                this.scrollToCurrent(this.currentSong)
            }, 20)
        },
        hide () {
            this.showFlag = false
        },
        scrollToCurrent (current) {
            const index = this.sequenceList.findIndex((song) => {
                return current.id === song.id
            })
            this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
        },
        changeMode () {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex (list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        selectItem(item,index){
            if (this.mode === playMode.random) {
                // 找到需要播放的歌曲在播放列表里面的索引
                index = this.playlist.findIndex((song) => {
                    return song.id === item.id
                })
            }
            this.selectPlay({
                list: this.playlist,
                index: index
            })
        },
        showConfirm(){
            this.$refs.confirm.show()
        },
        confirmClear () {
            this.deleteSongList()
            this.hide()
            this.$emit('stopMusic')
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
        deletOne(item){
            this.deleteSong(item)
            if (!this.playlist.length) {
                this.hide()
                this.$emit('stopMusic')
            }
        },  
    },
    watch:{
        currentSong(newSong, oldSong) {
            if (!this.showFlag || newSong.id === oldSong.id) {
                return
            }
            setTimeout(() => {
                this.scrollToCurrent(newSong)
            }, 20)
        }
    }
}
</script>

<style lang="scss" scoped>
    .list-fade-enter-active, .list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    .list-fade-enter, .list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .playlist {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 200;
        background-color: rgba(0, 0, 0, 0.3);

        .list-wrapper {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            border-radius: 8px;
            background-color: $color-background;

            .list-header {
                position: relative;
                padding: 20px 30px 10px 20px;
                .title {
                    display: flex;
                    align-items: center;
                    .iconfont {
                        margin-right: 10px;
                        font-size: 20px;
                        color: $color-text-g;
                    }
                    .text {
                        flex: 1;
                        font-size: $font-size-medium;
                        color: $color-text;
                        .count {
                            position: relative;
                            top: 1px;
                        }
                    }            
                }
            }

            .list-content {
                max-height: 260px;
                overflow: hidden;
                .item {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    padding: 0 30px 0 20px;
                    overflow: hidden;
                    &.list-enter-active, &.list-leave-active {
                        transition: all 0.1s;
                    }
                    &.list-enter, &.list-leave-to {
                        height: 0;
                    }
                    .iconfont {
                        color: $color-theme;
                        margin-right: 5px;
                    }
                    .text {
                        flex: 1;
                        @include no-wrap();
                        line-height: 20px;
                        font-size: $font-size-medium;
                        color: $color-text;
                    }
                    .like{
                        margin-right: 15px;
                        font-size: $font-size-small;
                        color: $color-theme;
                        .icon-like{
                            color: $color-sub-theme
                        }
                    } 
                    .delete {
                        font-size: $font-size-small;
                        color: $color-theme;
                    }
                }
            }

            .list-close {
                text-align: center;
                line-height: 50px;
                background: $color-background;
                font-size: $font-size-medium-x;
                color: $color-text;
            }
        }
    }
</style>