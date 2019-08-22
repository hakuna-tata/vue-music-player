<template>
    <div class="singer" ref="singer">
        <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
import ListView from '@/base/listview/listview';
import {getSingers} from '@/api/singer';
import {playlistMixin} from '@/utils/mixin'
import {mapMutations} from 'vuex';

const pinyin = require('pinyin');
const HOT_NAME = '热门';
const HOT_SINGERS = 10

export default {
    mixins: [playlistMixin],
    components:{ListView},
    data () {
        return {
            singers: []
        }
    },
    methods:{
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.list.refresh()
        },
        selectSinger(singer){
            this.$router.push({path:`/singer/${singer.id}`});
            this.setSinger(singer)
        },
        _getSingers(){
            getSingers().then((res) => {
                let s = res.data.artists;
                s.map((item,index) => {
                    let py = pinyin(item.name[0], {
                        style: pinyin.STYLE_FIRST_LETTER
                    });
                    item.initial = py[0][0].toUpperCase()
                })
                this.singers = this._normalizeSinger(s)
            })
        },
        _normalizeSinger(list){
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            };
            list.forEach((item,index) => {
                if (index < HOT_SINGERS) {
                    map.hot.items.push({
                        id: item.id,
                        name: item.name,
                        avatar: item.img1v1Url,
                        aliaName: item.alias.join(' / ')
                    })
                }

                const key = item.initial;
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    }
                }
                map[key].items.push({
                    id: item.id,
                    name: item.name,
                    avatar: item.img1v1Url,
                    aliaName: item.alias[0]
                })
            })
            let hot = []
            let ret = []
            for (const key in map) {
                let val = map[key]
                if (val.title.match(/[A-Z]/)) {
                    ret.push(val)
                } else if (val.title === HOT_NAME) {
                    hot.push(val)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        }
    },
    created(){
        this._getSingers()
    }
}
</script>

<style lang="scss" scoped>
    .singer {
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 100%;
    }
</style>