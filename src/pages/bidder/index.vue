<template>
  <div class="body-cnt">
    <div class="item" v-for="(user, index) in list">
      <div>
        <i-row class="name">
          <i-col span="4">
            <img class="avatarUrl" v-bind:src="user.avatarUrl" />
          </i-col>
          <i-col span="20">
            <div class="base-info clearfix">
              <span class="f-left">{{ user.nick_name }}</span>
              <button v-if="!hasWinner" class="f-right xuanbiao" v-on:click="selectUser(user)">选标</button>
              <span v-else-if="user.isWinner" class="f-right winner">中标者</span>
            </div>
            <div>擅长{{ user.good_at }}</div>
            <div>{{ user.description }}</div>
            <div class="other">作品展示 {{ user.works_info }}</div>
            <div class="contact-info">联系方式 {{ user.contact_info }}</div>
          </i-col>
        </i-row>
      </div>
      <div class="hr"></div>
    </div>
    <div v-if="list.length==0" class="msg">
      暂无投递者
    </div>
    <i-modal title="中标确认" v-bind:visible="showWin" v-on:ok="submit" v-on:cancel="cancel">
      <view class="confirm-msg">
        请确认已联系过此人，且此人满足项目的技术要求？
      </view>
    </i-modal>
  </div>
</template>

<script>
import cookies from 'weapp-cookie';
import util from '../../utils/index';

export default {
  components: {

  },
  data() {
    return {
      showWin: false,
      list: [],
      curUser: null,
      hasWinner: false // 是否有中标者
    }
  },
  onShow() {
    this.getDelivered();
  },
  methods: {
    /**
     * 获取投递者列表
     */
    getDelivered: function() {
      let id = util.getUrlParam('project_id');
      wx.request({
        url: process.env.API_BASE_URL + '/getDelivered',
        method: 'GET',
        data: {
          id: id
        },
        success: (res) => {
          this.setDelivered(res.data);
        },
        fail: () => {

        }
      })
    },
    setDelivered(data) {
      let winner;
      let winnerIndex;
      for(let i=0; i<data.length; i++) {
        let item = data[i];
        item.gender = item.gender==1 ? '男' : '女';
        item.joinTime = new Date(item.created_at).Format('yyyy-MM-dd');
        if (item.isWinner) {
          winner = item;
          winnerIndex = i;
        }
      }
      if (winner) {
        this.hasWinner = true;
        winner = data.splice(winnerIndex, 1);
        this.list = winner.concat(data);
      } else {
        this.list = data;
      }
      
    },
    /**
     * 选取开发合作者
     */
    selectUser(user) {
      this.curUser = user;
      this.showWin = true;
    },
    /**
     * 确认选中
     */
    submit() {
      let id = util.getUrlParam('project_id');
      wx.request({
        url: process.env.API_BASE_URL + '/selectBidder',
        method: 'POST',
        data: {
          project_id: id,
          user_id: this.curUser.user_id
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          this.curUser = null;
          wx.switchTab({
            url: '../homepage/main'
          });
        },
        fail: () => {
          
        }
      })
    },
    /**
     * 取消选中
     */
    cancel() {
      this.curUser = null;
      this.showWin = false;
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
.body-cnt {
  padding: 16px;
}
img.avatarUrl {
  display:inline-block;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  position:relative;
  margin-left:auto;
  margin-right:auto;
  overflow:hidden;
  background-size:cover;
  vertical-align:middle;
}
.item {
  padding: 10px 0px;
  font-size: 14px;
  line-height: 1.8em;
}
.base-info {
  font-size: 16px;
  margin-bottom: 8px;
}
.contact-info {
  font-size: 12px;
  color: #8796a8;
}
.confirm-msg {
  padding: 0 16px;
}
.winner {
  font-size: 18px;
  color: #19be6b;
}
.xuanbiao {
  font-size: 12px;
  background: #2d8cf0;
  color: #fff;
}
</style>

