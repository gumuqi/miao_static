<template>
    <i-tab-bar v-bind:current="current" v-on:change="handleChange" fixed="true">
        <i-tab-bar-item key="home" icon="homepage" current-icon="homepage_fill" title="首页"></i-tab-bar-item>
        <!--<i-tab-bar-item key="message" icon="remind" current-icon="remind_fill" count="3" title="消息"></i-tab-bar-item>-->
        <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" dot title="个人"></i-tab-bar-item>
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
        this.current = target.key;
        wx.switchTab({
            url: "/pages/"+target.key+"/main"
        })
    }
  }
}
</script>

<style scoped>

</style>

