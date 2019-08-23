<template>
    <transition name="search">
        <div class="search" ref="searchWrapper">
            <div class="search-box-wrapper">
                <i class="icon icon-fanhui" @click="back"></i>
                <search-box @query="onQueryChange" ref="searchBox"></search-box>
            </div>
            <scroll class="search-scroll-wrapper" ref="scroll" :pullup="pullup" @scrollToEnd="searchMore">
                <div ref="search">
                    <div class="search-hots">
                        <p class="title">热门搜索</p>
                        <span class="search-hots-item" v-for="item in hots" :key="item.id" @click="addQuery(item.first)">
                        {{item.first}}
                        </span>
                    </div>
                    <!-- <div class="shortcut-wrapper">
                        <div class="search-history" v-show="searchHistory.length">
                            <h1 class="title">
                                <span class="text">搜索历史</span>
                                <span class="clear" @click="showConfirm">
                                <i class="icon-del" ></i>
                                </span>
                            </h1>
                            <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
                        </div>
                    </div> -->
                </div>
            </scroll>
            <div class="search-result" v-show="query" ref="searchResult">
                <suggest @select="saveSearch" @refresh="refresh" :query="query" ref="suggest"></suggest>
            </div>
            <!-- <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm> -->
            <router-view></router-view>
        </div>
    </transition>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import SearchBox from '@/base/search-box/search-box';
import SearchList from '@/base/search-list/search-list';
import Suggest from '@/components/suggest/suggest';
import Confirm from '@/base/confirm/confirm'
import {getSearchHot} from '@/api/search';

export default {
    components:{SearchBox,SearchList,Scroll,Suggest,Confirm},
    data(){
        return{
            query:"",
            pullup: true,
            hots: []
        }
    },
    created () {
        this._getSearchHot()
    },

    methods:{
        back(){
            this.$router.back()
            this.$refs.searchBox.clear()
        },
        onQueryChange(query){
            this.query = query
        },
        searchMore(){
            this.$refs.suggest.searchMore()
        },
        addQuery (query) {
            this.$refs.searchBox.setQuery(query)
        },
        saveSearch(){

        },
        refresh () {
            setTimeout(() => {
                this.$refs.scroll.refresh()
            }, 20)
        },
        showConfirm(){

        },
        _getSearchHot(){
            getSearchHot().then(res => {
                this.hots = res.data.result.hots
            })
        }
    }
}
</script>

<style lang="scss" scoped>
   .search-enter-active, .search-leave-active {
        transition: all 0.3s;
    }
    .search-enter, .search-leave-to {
        transform: translate3d(50%, 0, 0);
        opacity: 0;
    } 
    .search{
        position: fixed;
        z-index: 100;
        width: 100%;
        top: 0;
        bottom: 0;
        background: $color-background;

        .search-box-wrapper {
            padding: 10px 40px 10px 43px;
            background: $color-theme;
            .icon {
                position: absolute;
                left:0;
                top:6px;
                padding: 3px 10px;
                font-size: 25px;
                color: #fff;
            }
        }

        .search-scroll-wrapper{
            height: 100%;
            overflow: hidden;

            .search-hots {
                margin: 0 10px;
                .title {
                    padding: 15px 5px 0 5px;
                    height: 30px;
                    line-height: 30px;
                    font-size:$font-size-small-x;
                    color: $color-text-g;
                }
                span {
                    display: inline-block;
                    padding: 3px 5px;
                    margin: 4px 4px;
                    border: 0.8px solid $color-text-ggg;
                    border-radius: 5px;
                    line-height: 20px;
                    color: $color-text;
                    font-size: $font-size-medium;
                }
            }

            .shortcut-wrapper{
                position: relative;
                margin: 0 auto;

                .search-history {
                    position: relative;
                    margin: 10px 25px;

                    .title {
                        display: flex;
                        align-items: center;
                        height: 30px;
                        font-size: $font-size-small-x;
                        color: $color-text-g;
                        .text {
                            flex: 1;
                        }
                    }
                }
            }
        }

        .search-result {
            position: relative;
            width: 100%;
            top: 10px;
            bottom: 0;
        }
    }
</style>