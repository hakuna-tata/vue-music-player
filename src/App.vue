<template>
    <div id="app" @touchmove.prevent>
        <m-header></m-header>
        <tab></tab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
import MHeader from '@/components/m-header/m-header';
import Tab from '@/components/tab/tab';
import Player from '@/components/player/player';
export default {
    name: 'App',
    components:{
        MHeader,
        Tab,
        Player
    }
}
</script>

<style>
</style>
