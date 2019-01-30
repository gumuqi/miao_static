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
        list.map(item => {
          switch(item.status) {
            case 0:
              item.statusTxt = '招募中';
              break;
            case 1:
              item.statusTxt = '开发中';
              break;
            case 2:
              item.statusTxt = '已结束';
              break;
            default:
              item.statusTxt = '招募中';
          }
        });
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

