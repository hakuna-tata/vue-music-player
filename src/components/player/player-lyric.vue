<template>
    <transition name="lyricPage">
        <scroll  class="root" ref="lyricList" v-show="currentShow === 'lyric'" :data="currentLyric">
            <div class="lyric-wrapper">
                <div class="currentLyric" v-if="currentLyric">
                    <p
                        class="text"
                        :class="{'current': lyricIndex === index}" 
                        v-for="(line, index) in currentLyric" :key="index">
                        {{ line.text }}
                    </p>
                </div>
                 <p class="no-lyric" v-if="currentLyric === null">{{noLyric ? "暂无歌词" : "歌词加载中"}}</p>
            </div>
        </scroll>
    </transition>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
export default {
    components:{Scroll},
    props: {
        currentShow: {
            type: String,
            default: ""
        },
        currentLyric: {
            type: Array,
            default: () => null
        },
        lyricIndex: {
            type: Number,
            default: 0
        },
        noLyric: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss" scoped>
    .lyricPage-enter-active, .lyricPage-leave-active {
        transition: opacity .5s ease-in-out;
    }
    .lyricPage-enter, .lyricPage-leave-to {
        opacity: 0;
    }
    .root{
        display: inline-block;
        position: absolute;
        top: 0;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

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
                    color: $color-theme;
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

</style>