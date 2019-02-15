<template>
  <div>
    <project-list v-bind:list="projectList"></project-list>
  </div>
</template>

<script>
import globalStore from '../../stores/global-store';
import ProjectList from '../../components/projects/index';

export default {
  components: {
    'project-list': ProjectList
  },
  data() {
    return {
      projectList: []
    }
  },
  beforeCreate() {
    
  },
  created() {

  },
  onShow() {
    this.getProjects();
  },
  methods: {
    /**
     * 过去项目列表
     */
    getProjects: function() {
      var userInfo = wx.getStorageSync('userInfo') || {}; 
      wx.request({
        url: process.env.API_BASE_URL + '/getMyDelivery',
        method: 'GET',
        data: {
          user_id: userInfo.openid
        },
        success: (res) => {
          this.setData(res.data);
        },
        fail: () => {

        }
      })
    },
    /**
     * 更新view
     */
    setData: function(list) {
      if (list instanceof Array) {
        this.projectList = list;
      }
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>

