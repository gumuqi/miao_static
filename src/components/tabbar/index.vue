<template>
    <i-tab-bar v-bind:current="current" v-on:change="handleChange" color="#2d8cf0" fixed="true">
        <i-tab-bar-item key="homepage" icon="homepage" current-icon="homepage_fill" title="首页"></i-tab-bar-item>
        <i-tab-bar-item key="pubProject" icon="add" current-icon="add_fill" title="发布"></i-tab-bar-item>
        <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" title="个人"></i-tab-bar-item>
    </i-tab-bar>
</template>

<script>

export default {
  props: ["current"],
  data() {
    return {
        
    }
  },
  methods: {
    handleChange: function({ target }) {
        if (target.key == 'pubProject') {
            wx.navigateTo({
                url: "/pages/"+target.key+"/main"
            })
        } else {
            wx.switchTab({
                url: "/pages/"+target.key+"/main"
            })
        }
    }
  }
}
</script>

<style scoped>

</style>

