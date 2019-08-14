<template>
    <scroll 
    class="listview"
    ref="listview">
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
    </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
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
    },
    data(){
        return{
            currentIndex: 0
        }
    },
    methods:{
        selectItem(item){

        },
        onShortcutStart(){

        },
        onShortcutMove(){

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
            margin-bottom: 10px;
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
                margin-bottom: 10px;
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
            padding: 200px 0;
            border-radius: 3px;
            text-align: center;
            font-family:Helvetica;
            .item {
                padding: 5px 5px;
                line-height: 1;
                color: $color-text-g;
                font-size: $font-size-small;
                font-weight: bold;
                &.current {
                    color: $color-theme;
                }
            }
        }
    }
</style>