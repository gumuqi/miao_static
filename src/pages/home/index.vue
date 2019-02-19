<template>
  <div>
    <div v-if="showPowerWin" class="modal">
      <div class="modal-window">
        <div class="modal-content">
          <div class="modal-header">
            微信授权
          </div>
          <div class="modal-body">
            <view class="txt-cont">获取您的公开信息（昵称、头像）</view>
          </div>
          <div class="modal-footer">
            <i-row>
              <i-col span="12">
                <button class="btn" v-on:click="showPowerWin=!showPowerWin">拒绝</button>
              </i-col>
              <i-col span="12" i-class="col-class">
                <button class="btn btn-ok" open-type='getUserInfo' lang="zh_CN" v-on:getuserinfo="getPower">允许</button>
              </i-col>
            </i-row>
          </div>
        </div>
      </div>
    </div>

    <project-list v-bind:list="projectList"></project-list>
    <tab-bar current="home"></tab-bar>
  </div>
</template>

<script>
import cookies from 'weapp-cookie';
import globalStore from '../../stores/global-store';
import TabBar from '../../components/tabbar/index';
import ProjectList from '../../components/projects/index';

export default {
  components: {
    'tab-bar': TabBar,
    'project-list': ProjectList
  },
  data() {
    return {
      showPowerWin: false,
      projectList: []
    }
  },
  beforeCreate() {

  },
  created() {
    // 判断用户是否授权过，如果没有，弹出授权窗口
    let userInfo = wx.getStorageSync('userInfo') || {};
    if (!userInfo.nickName) {
      this.showPowerWin = true;
    }
  },
  onShow() {
    this.getProjects();
  },
  methods: {
    /**
     * 微信授权
     */
    getPower: function(e) {
      let userInfo = wx.getStorageSync('userInfo') || {};
      wx.getUserInfo({
        success: (res) => {
          userInfo.avatarUrl  = res.userInfo.avatarUrl;
          userInfo.nickName   = res.userInfo.nickName;
          userInfo.gender     = res.userInfo.gender;
          wx.setStorageSync('userInfo', userInfo); //存储userInfo
          this.showPowerWin = false;  // 授权后隐藏弹窗
          this.saveUserInfo(userInfo);
        },
        fail: (e) => {
          console.log('用户未授权过');
        }
      });
    },
    /**
     * 保存并返回用户信息
     */
    saveUserInfo: function(data) {
      console.log('用户信息' + JSON.stringify(data));
      wx.request({
        url: process.env.API_BASE_URL + '/login',
        method: 'POST',
        data: {
          user_id: data.openid,
          nick_name: data.nickName,
          avatarUrl: data.avatarUrl,
          gender: data.gender
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          
        },
        fail: () => {

        }
      })
    },
    /**
     * 过去项目列表
     */
    getProjects: function() {
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: process.env.API_BASE_URL + '/getProjectList',
        method: 'GET',
        data: {},
        success: (res) => {
          wx.hideLoading();
          this.setData(res.data);
        },
        fail: () => {
          wx.hideLoading();
        }
      })
    },
    /**
     * 更新view
     */
    setData: function(list) {
      if (list instanceof Array) {
        list.map(item => {
          item.updateTime = new Date(item.updated_at).Format('MM-dd');
          item.count = item.count || 0;
        });
        this.projectList = list;
      }
    }
  },
  computed: {

  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.getProjects();
    console.log('下拉刷新');
  },
  /**
   * 上拉加载更多
   */
  onReachBottom() {
    console.log('上拉加载更多');
  }
}
</script>

<style scoped>
.txt-cont {
  margin-bottom: 20px;
}
.actions {
  border-radius:0 0 7px 7px;
  border-left:none;
  border-top:1rpx solid #e9eaec;
}
.actions button {
  height: 42px;
  line-height: 42px;
  font-size: 12px;
  border: none;
  background: #fff;
}
.modal {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgba(0,0,0,.7);
  z-index:1000;
  display:flex;
  -webkit-box-align:center;
  align-items:center;
  -webkit-box-pack:center;
  justify-content:center;
  transition:all .2s ease-in-out;
}
.modal-window {
  width:270px;
  position:relative;
}
.modal-content {
  border-radius:7px;
  padding-top:15px;
  position:relative;
  background-color:#fff;
  border:0;
  background-clip:padding-box;
  text-align:center;
  height:100%;
  overflow:hidden;
}
.modal-header {
  padding:6px 15px 15px;
  margin:0;
  font-size:18px;
  line-height:1;
  color:#1c2438;
  text-align:center;
}
.modal-body {
  max-height:100px;
  margin-bottom:15px;
  font-size:14px;
  color:#80848f;
  height:100%;
  line-height:1.5;
  overflow:auto;
}
.modal-footer {
  
}
.modal-footer .btn {
  border: 0;
  border-radius: 0px;
  background: #fff;
  font-size: 14px;
  height: 44px;
  line-height: 44px;
}
.modal-footer .btn-ok {
  color:  #2d8cf0;
}
</style>

