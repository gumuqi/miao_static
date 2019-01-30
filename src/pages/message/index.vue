<template>
  <div>
    <div class="msg" v-show="msgList.length==0"></div>
    <tab-bar current="message"></tab-bar>
  </div>
</template>

<script>
import globalStore from '../../stores/global-store';
import TabBar from '../../components/tabbar/index';

export default {
  components: {
    'tab-bar': TabBar
  },
  data() {
    return {
      msgList: []
    }
  },
  beforeCreate() {
    
  },
  created() {
    this.getMsg();
    //this.getUserInfo();
  },
  methods: {
    /**
     * 过去项目列表
     */
    getMsg: function() {
      
    },
    /**
     * 更新view
     */
    setData: function(list) {
     
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>

