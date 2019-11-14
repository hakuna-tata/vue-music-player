<template>
    <transition name="cdPage">
        <div class="root" v-show="currentShow === 'cd'">
            <div class="cd-wrapper">
                <div class="cd" :class="playing ? 'play' : 'play pause'" >
                    <img :src="currentSongImage" class="image">
                </div>
            </div>
            <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric ? playingLyric : ""}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        currentShow: {
            type: String,
            default: ""
        },
        playing:{
            type: Boolean,
            default: false
        },
        currentSongImage:{
            type: String,
            default: ""
        },
        playingLyric:{
            type: String,
            required: true
        }
    },
}
</script>

<style lang="scss" scoped>
    .cdPage-enter-active, .cdPage-leave-active {
        transition: opacity .5s ease-in-out;
    }
    .cdPage-enter, .cdPage-leave-to {
        opacity: 0;
    }
    .root{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

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

        .playing-lyric-wrapper{
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
                height: 20px;
                line-height: 20px;
                font-size: $font-size-medium;
                color: $color-text-l;
            }
        }
    }
</style>