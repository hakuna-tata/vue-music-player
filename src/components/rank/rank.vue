<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" ref="scroll">
            <div>
                <div class="official">
                    <div class="title">官方榜</div>
                    <ul>
                        <li class="item"  v-for="item in yunTopList" :key="item.id" @click="selectItem(item)">
                            <div class="icon">
                                <img v-lazy="item.coverImgUrl" width="100" height="100">
                            </div>
                            <ul class="songlist">
                                <li class="song" v-for="(song, index) in item.tracks" :key="index">
                                <span>{{index + 1}}.</span>
                                <span>{{song.first}} - {{song.second}}</span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="more">
                    <div class="title">更多榜单</div>
                    <ul>
                        <li class="list" v-for="item in moreTopList" :key="item.id">
                            <div class="icon" @click="selectItem(item)">
                                <div class="gradients"></div>
                                <img v-lazy="item.coverImgUrl">
                                <p class="update-time">
                                    {{ item.updateFrequency }}
                                </p>
                            </div>
                            <div class="text">
                                <p class="name">{{item.name}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-show="showLoading" class="loading-content">
                    <loading></loading>
                </div>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import {getToplistDetail} from '@/api/rank';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import {playlistMixin} from '@/utils/mixin';
import {mapMutations} from 'vuex';

export default {
    mixins: [playlistMixin],
    components:{Scroll,Loading},
    data () {
        return {
            yunTopList: [],
            moreTopList: [],
            showLoading: true
        }
    },
    created () {
        this._getToplistDetail()
    },
    methods: {
        ...mapMutations({
            setTopList: 'SET_TOP_LIST'
        }),
        handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.rank.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        selectItem (item){
            this.$router.push({
                path: `/rank/${item.id}`
            })    
        },
        _getToplistDetail (){
            getToplistDetail().then(res => {
                if(res.data.code === 200){
                    this.yunTopList = res.data.list.filter(item => {
                        if (item.ToplistType) {
                            return item
                        }
                    })
                    this.moreTopList = res.data.list.filter(item => {
                        if (!item.ToplistType && item.name) {
                            return item
                        }
                    })
                }
                this.showLoading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .rank {
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;
        .toplist {
            height: 100%;
            overflow: hidden;
            padding-top: 5px;

            .title{
                height: 30px;
                line-height: 30px;
                text-align: left;
                font-size: $font-size-large-s;
                font-weight: bold;
                color: $color-text;
            }

            .official{
                margin: 10px;
                .item {
                    display: flex;
                    padding: 3px 0;
                    height: 100px;
                    border-bottom: 1px solid rgb(228, 228, 228);
                    &:last-child {
                        padding-bottom: 0;
                    }
                    .icon {
                        flex: 0 0 100px;
                        width: 100px;
                        height: 100px;
                        img {
                            border-radius: 3px;
                        }
                    }

                    .songlist {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding: 0 20px;
                        height: 100px;
                        overflow: hidden;
                        color: $color-text;
                        font-size: $font-size-small-x;
                        .song {
                            @include no-wrap();
                            line-height: 30px;
                        }
                    }                
                }
            }
           

            .more{
                margin: 10px;
                width: calc(100%-20px);
                & > ul {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    padding: 3px 0;
                }
                .list {
                    position: relative;
                    width: 30%;
                    height: 30%;
                    .icon {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        margin-bottom: 5px;
                        .gradients {
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            height: 35px;
                            border-radius: 3px;
                            background: linear-gradient(rgba(109, 109, 109, 0.6),rgba(255, 255, 255, 0));
                        }
                        img {
                            width: 100%;
                            height:100%;
                            border-radius: 3px;
                        }
                        .update-time {
                            position: absolute;
                            bottom: 10px;
                            left: 4px;
                            font-size: $font-size-small-s;
                            color: $color-text-l
                        }
                    }
                    .text {
                        float: left;
                        line-height: 16px;
                        text-align: left;
                        height: 16px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        margin-bottom: 10px;
                        font-size: $font-size-small;
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