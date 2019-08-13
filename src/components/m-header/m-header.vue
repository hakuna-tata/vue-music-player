<template>
    <div class="m-header">
        <h1 class="text">FXMUSIC</h1>
        <router-link to="/user" class="mine" tag="div">
            <i class="icon icon-list"></i>
        </router-link>
        <router-link to="/search" class="search" tag="div">
            <i class="icon icon-chaxun"></i>
        </router-link>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .m-header {
        position: relative;
        height: 44px;
        width: 100%;
        text-align: center;
        background: $color-theme;
        .text {
            line-height: 44px;
            font-weight: bold;
            color: $color-text-l;
            letter-spacing: 3px;
        }
        .mine {
            position: absolute;
            top: -1.5px;
            left: 0;
            .icon {
                display: block;
                padding: 11px;
                font-size: 22px;
                color: $color-theme-l;
            }
        }
        .search {
            position: absolute;
            top: 0;
            right: 2px;
            .icon {
                display: block;
                padding: 12px;
                font-size: 18px;
                color: $color-theme-l;
            }
        }
}
</style>