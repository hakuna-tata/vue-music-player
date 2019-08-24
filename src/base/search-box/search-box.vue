<template>
  <div class="search-box">
    <input :placeholder="placeholder" v-model="query" type="text" class="box">
    <i v-show="query" class="icon icon-quxiao" @click="clear"></i>
  </div>
</template>

<script>

import {debounce} from '@/utils/utl';

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: '',
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 300))
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  }
}
</script>

<style scoped lang="scss">

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 25px;
  border-bottom: 1px solid rgb(235, 235, 235);
  .box {
    flex: 1;
    line-height: 25px;
    background: $color-theme;
    color: #fff;
    font-size: $font-size-medium;
    border: none;
    outline: medium;
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .icon {
    position: absolute;
    right: 20px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    border: none;
  }
  .search {
    padding: 0 5px;
    font-size: 14px;
    color: $color-text;
  }
}
</style>