<template>
    <transition name="slide">
        <div class="user">
            <div class="back">
                <i class="iconfont icon-fanhui" @click="back"></i>
            </div>
            <div class="switches-wrapper">
                <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
            </div>
        </div>
    </transition>
</template>

<script>
import Switches from '@/base/switches/switches'

export default {
    components:{Switches},
    data(){
        return{
            currentIndex: 0,
            switches: [
                {name: '我的收藏'},
                {name: '最近播放'}
            ]
        }
    },
    methods:{
        back () {
            this.$router.back()
        },
        switchItem (index) {
            this.currentIndex = index
        },
    }
}
</script>

<style lang="scss" scoped>
    .slide-enter-active, .slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(-50%, 0, 0);
        opacity: 0;
    }
    .user {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: $color-background;
        .back {
            position: absolute;
            top: 10px;
            left: 0;
            .iconfont{
                padding: 3px 10px;
                font-size: 25px;
                color: #fff;
            }
        }

        .switches-wrapper {
            display: flex;
            align-items: center;
            background: $color-theme;
            height: 44px;
        }
    }
</style>