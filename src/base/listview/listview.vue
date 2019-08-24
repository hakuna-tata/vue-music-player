<template>
    <scroll 
    class="listview"
    ref="listview"
    :data="data"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll">
        <ul>
            <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
                <h2 class="list-group-title">{{ group.title }}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{ item.name }}</span>
                    </li>
                 </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutStart" @touchmove.stop.prevent="onShortcutMove">
            <ul>
                <li v-for="(item, index) in shortcutList"
                    class="item"
                    :data-index="index"
                    :key="item.id"
                    :class="{'current': currentIndex === index}"
                    >
                    {{ item }}
                </li>
            </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <h2 class="fixed-title">{{fixedTitle}} </h2>
        </div>
    </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import {getData} from '@/utils/dom';

const ANCHOR_HEIGHT = 19;
const TITLE_HEIGHT = 20;

export default {
    components: {Scroll},
    props: {
        data: {
            type: Array
        }
    },
    computed:{
        shortcutList () {
            return this.data.map((group) => {
                return group.title.substr(0, 1)
            })
        },
        fixedTitle() {
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
    },
    data(){
        return{
            scrollY: -1,
            currentIndex: 0,
            diff: -1
        }
    },
    created(){
        this.touch = {};
        this.listenScroll = true;
        this.probeType = 3;
        this.listHeight = []
    },
    methods:{
        selectItem(item){
            this.$emit('select', item)
        },
        refresh () {
            this.$refs.listview.refresh()
        },
        scroll(pos){
            this.scrollY = pos.y;
        },
        onShortcutStart(e){
            let anchorIndex = getData(e.target, 'index');
            let firstTouch = e.touches[0];
            this.touch.y1 = firstTouch.pageY;
            this.touch.anchorIndex = anchorIndex;
            this._scrollTo(anchorIndex);
        },
        onShortcutMove(e){
            let firstTouch = e.touches[0];
            this.touch.y2 = firstTouch.pageY;
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
            this._scrollTo(anchorIndex);
        },
        _scrollTo(index){
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
        },
        _calculateHeight(){
            this.listHeight = [];
            const list = this.$refs.listGroup;
            let height = 0;
            this.listHeight.push(height)
            for (let i = 0; i < list.length; i++) {
                let item = list[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch:{
        data () {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        },
        scrollY(newVal){
            const listHeight = this.listHeight;
            // 滚动到顶部,newVal>0
            if(newVal > 0){
                this.currentIndex = 0;
                return
            }
            // 中间滚动
             for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i];
                let height2 = listHeight[i + 1];
                if (-newVal >= height1 && -newVal < height2) {
                    this.diff = height2 + newVal;
                    this.currentIndex = i;
                    return
                }
            }
            // 滚动到底部,-newVal大于最后一个元素
            this.currentIndex = listHeight.length - 2
        },
        diff(newValue){
            let fixedTop = (newValue > 0 && newValue < TITLE_HEIGHT) ? (newValue - TITLE_HEIGHT) : 0;
            if (this.fixedTop === fixedTop) {
                return
            }
            this.fixedTop = fixedTop;
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
        }
    }
}
</script>

<style lang="scss" scoped>
    .listview {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: $color-background;

        .list-group-title {
            height: 20px;
            line-height: 20px;
            padding-left: 12px;
            font-size: $font-size-small;
            color: #fff;
            background:rgba(0, 0, 0, 0.1);
        }
        .list-group-item {
            display: flex;
            align-items: center;
            padding: 5px 0;
            margin: 0 5px;
            border-bottom: 1px solid rgb(228, 228, 228);

            &:last-child {
                border: none;
            }
            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 3px;
            }
            .name {
                margin-left: 20px;
                color: $color-text;
                font-size: $font-size-medium;
            }
        }

        .list-shortcut {
            position: absolute;
            z-index: 30;
            right: 3px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            text-align: center;
            .item {
                padding: 2px 5px 5px;
                line-height: 1;
                color: $color-text-g;
                font-size: $font-size-small;
                font-weight: bold;
                &.current {
                    color: $color-theme;
                }
            }
        }

        .list-fixed{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;

            .fixed-title{
                height: 20px;
                line-height: 20px;
                padding-left: 12px;
                font-size: $font-size-small;
                color: #fff;
                background:rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>