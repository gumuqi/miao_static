<template>
  <div>
    <div class="base-info">
      <i-row>
        <i-col span="18">
          <div class="name">
            {{ detail.name }}
          </div>
        </i-col>
        <i-col span="6">
          <div v-if="detail.status==0" class="status status0">招募中</div>
          <div v-if="detail.status==1" class="status status1">开发中</div>
          <div v-if="detail.status==2" class="status status2">已结束</div>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="24">
          <div class="price_time_count">
            金额 ¥ {{ detail.price }}    <span class="spliter">|</span> 
            发布时间 {{ detail.updateTime }} <span class="spliter">|</span>
            <span v-if="detail.isMine" v-on:click="toUsers" class="link">
              报名人数 {{ deliverList.length }}
            </span>
            <span v-else>
              报名人数 {{ deliverList.length }}
            </span>
          </div>
        </i-col>
      </i-row>
      <div class="hr"></div>
      <div v-if="detail.winner">
        <div class="box-title">中标者</div>
        <div class="partAside">
          <i-row class="name">
            <i-col span="4">
              <img class="avatarUrl" v-bind:src="bidder.avatarUrl" />
            </i-col>
            <i-col span="20">
              <div class="name"> {{ bidder.nick_name }}</div>
              <div class="other">擅长 {{ bidder.good_at }}</div>
              <div class="other">入驻时间 {{ bidder.joinTime }}</div>
            </i-col>
          </i-row>
        </div>
      </div>

      <div class="box-title">技术要求</div>
      <div class="box-text">
        {{ detail.technology }}
      </div>
        
      <div class="box-title">项目描述</div>
      <div class="box-text">
        {{ detail.description }}
      </div>

      <div class="box-title">需求方</div>
      <div class="partAside">
        <i-row class="name">
          <i-col span="4">
            <img class="avatarUrl" v-bind:src="tenderee.avatarUrl" />
          </i-col>
          <i-col span="20">
            <div class="name"> {{ tenderee.nick_name }}</div>
            <div class="other">发布项目 {{ tenderee.count }} 个</div>
            <div class="other">入驻时间 {{ tenderee.joinTime }}</div>
          </i-col>
        </i-row>
      </div>

      <div class="tools clearfix">
        <div v-if="detail.isMine" >
          <i-button type="primary" v-if="detail.status==0" v-on:click="toEditProject">编辑</i-button>
          <i-button type="success" v-if="detail.status==1" v-on:click="endProject">完成</i-button>
          <i-button v-if="detail.status==2">已结束</i-button>
        </div>
        <div v-else>
          <i-button type="success" v-if="detail.delivered">已投递</i-button>
          <i-button type="primary" v-else v-on:click="deliver" v-bind:loading="delivering">投递</i-button>
        </div>
      </div>
      <div class="hr"></div>
      <div class="comments">
        <div class="title">全部评论</div>
        <i-row v-for="(item, index) in comments" v-bind:key="index">
          <i-col span="2">
            <img class="avatarUrl" v-bind:src="item.avatarUrl" />
          </i-col>
          <i-col span="22">
            <div class="nick_name"> {{ item.nick_name }}</div>
            <div class="text">{{ item.comment_cont }}</div>
            <div class="time">{{ item.commentTime }}</div>
          </i-col>
        </i-row>
        <div class="msg" v-if="comments.length==0">
          暂无评论
        </div>
      </div>
    </div>
    <div v-bind:class="maskClass">
      <div v-bind:class="commentClass">
        <i-row class="head" v-if="comInputFocus" >
            <i-col class="cancel" span="4" v-on:click="cancelComment">
              <span>取消</span>
            </i-col>
            <i-col class="title" span="16">
              <span>评论</span>
            </i-col>
            <i-col v-if="commentTxt!==''" class="submit" span="4" v-on:click="submitComment">
              <span>确定</span>
            </i-col>
            <i-col v-else span="4">
              <span>确定</span>
            </i-col>
        </i-row>
        <div v-if="comInputFocus" class="hr"></div>
        <textarea
          fixed="true"
          auto-height="true"
          placeholder="发表评论..."
          class="f-left"
          cursor-spacing="106"
          v-model="commentTxt"
          v-on:focus="onComInputFocus"
          v-bind:change="commentTxtChange"
        />
        <i-badge v-if="!comInputFocus" v-bind:count="comments.length" overflow-count="100">
          <i-icon class="f-right comment-icon" type="message" size="24"/>
        </i-badge>
      </div>
    </div>
    <i-modal title="结束确认" v-bind:visible="showWinEnd" v-on:ok="endProjectSubmit" v-on:cancel="showWinEnd=!showWinEnd">
      <view class="confirm-msg">
        您确认项目已完工了吗？
      </view>
    </i-modal>
    <i-modal title="投递确认" v-bind:visible="showWinDeliver" v-on:ok="deliverProjectSubmit" v-on:cancel="showWinDeliver=!showWinDeliver">
      <view class="confirm-msg">
        您确认具备该项目所需技能点吗？
      </view>
    </i-modal>
    <i-modal title="提示" v-bind:visible="showWinUser" v-on:ok="toMineInfo" v-on:cancel="showWinUser=!showWinUser">
      <view class="confirm-msg">
        您还未完善个人信息，是否前往个人信息编辑？
      </view>
    </i-modal>
  </div>
</template>

<script>
import cookies from 'weapp-cookie';
import globalStore from '../../stores/global-store';
import util from '../../utils/index';
export default {
  data () {
    return {
      delivering: false, // 投递中
      isMine: false,  // 是否是我的项目，如果是，那么具有编辑功能
      delivered: false, // 是否已投递该项目
      detail: {},
      bidder: {},   // 投标人、中标者
      tenderee: {}, // 招标人、需求方
      deliverList: [],
      comments: [],
      showWinEnd: false,  // 是否确认结束项目
      showWinDeliver: false, // 是否确认投递项目
      showWinUser: false,  // 是否前往个人信息编辑
      comInputFocus: false, // 评论输入框是否获取到焦点
      commentClass: 'comment-input',
      maskClass: '',
      commentTxt: ''
    }
  },
  onShow() {
    this.getProjectDetail();
    this.getDelivered();
  },
  onUnload() {
    this.cancelComment();
  },
  methods: {
    /**
     * 获取项目详情
     */
    getProjectDetail: function() {
      let id = util.getUrlParam('project_id');
      let userInfo = wx.getStorageSync('userInfo') || {};
      wx.request({
        url: process.env.API_BASE_URL + '/getProjectDetail',
        method: 'GET',
        data: {
          id: id,
          user_id: userInfo.openid
        },
        success: (res) => {
          this.setProject(res.data);
          this.getTendereeDetail();
          this.getBidderDetail();
          this.getComments();
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取招标人详情
     */
    getTendereeDetail: function() {
      wx.request({
        url: process.env.API_BASE_URL + '/getUserInfo',
        method: 'GET',
        data: {
          user_id: this.detail.user_id
        },
        success: (res) => {
          this.setTenderee(res.data);
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取中标人信息
     */
    getBidderDetail: function() {
      const winner = this.detail.winner;
      if (!winner) return; // 如无中标者，无需发起请求
      wx.request({
        url: process.env.API_BASE_URL + '/getUserInfo',
        method: 'GET',
        data: {
          user_id: winner
        },
        success: (res) => {
          this.setBidder(res.data);
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取项目的投递情况
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
    /**
     * 获取项目的评论列表
     */
    getComments: function() {
      wx.request({
        url: process.env.API_BASE_URL + '/getComments',
        method: 'GET',
        data: {
          project_id: this.detail.id
        },
        success: (res) => {
          this.setComments(res.data);
        },
        fail: () => {

        }
      })
    },
    setProject(data) {
      data.updateTime = new Date(data.updated_at).Format('MM-dd');
      data.count = data.count || 0;
      switch(data.status) {
        case 0:
          data.statusTxt = '招募中';
          break;
        case 1:
          data.statusTxt = '开发中';
          break;
        case 2:
          data.statusTxt = '已结束';
          break;
        default:
          data.statusTxt = '招募中';
      }
      this.detail = data;
    },
    setDelivered(data) {
      this.deliverList = data;
    },
    setTenderee(data) {
      data.joinTime = new Date(data.created_at).Format('yyyy-MM-dd');
      this.tenderee = data;
    },
    setBidder(data) {
      data.joinTime = new Date(data.created_at).Format('yyyy-MM-dd');
      this.bidder = data;
    },
    setComments(data) {
      data.commentTime = new Date(data.created_at).Format('yyyy-MM-dd');
      this.comments = data;
    },
    /**
     * 编辑项目信息
     */
    toEditProject() {
      let id = util.getUrlParam('project_id');
      wx.navigateTo({
        url: '../pubProject/main?project_id=' + id
      });
    },
    /**
     * 结束项目
     */
    endProject() {
      this.showWinEnd = true;
    },
    endProjectSubmit() {
      let id = util.getUrlParam('project_id');
      wx.request({
        url: process.env.API_BASE_URL + '/endProject',
        method: 'POST',
        data: {
          project_id: id
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          this.showWinEnd = false;
          wx.switchTab({
            url: '../homepage/main'
          });
        },
        fail: () => {

        }
      })
    },
    endProjectCancel() {
      this.showWinEnd = false;
    },
    /**
     * 投递当前项目
     * 第一步判断当前用户是否完善了个人信息，如果没有，弹出对话框，引导他前往个人信息编辑页
     * 第二步，弹出确认对话框，让他确认是否具备当前项目所需要的技术要求
     */
    deliver() {
      let userInfo = wx.getStorageSync('userInfo') || {};
      wx.request({
        url: process.env.API_BASE_URL + '/getUserInfo',
        method: 'GET',
        data: {
          user_id: userInfo.openid
        },
        success: (res) => {
          let detail = res.data;
          if (!detail.good_at || !detail.contact_info || !detail.description) {
            // 如果没有编辑个人信息，弹窗引导用户去编辑个人信息
            this.showWinUser = true;
          } else {
            // 弹窗让用户确认是否投递
            this.showWinDeliver = true;
          }
        },
        fail: () => {

        }
      })
    },
    /**
     * 前往个人信息编辑
     */
    toMineInfo() {
      this.showWinUser = false;
      wx.navigateTo({
        url: '../mineInfo/main'
      })
    },
    /**
     * 执行投递
     */
    deliverProjectSubmit() {
      this.showWinDeliver = false;
      this.delivering = true;
      var userInfo = wx.getStorageSync('userInfo') || {}; 
      wx.request({
        url: process.env.API_BASE_URL + '/deliver',
        method: 'POST',
        data: {
          project_id: this.detail.id,
          user_id: userInfo.openid
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          this.detail.delivered = true;
          this.delivering = false;
        },
        fail: () => {
          this.delivering = false;
        }
      })
    },
    /**
     * 查看投递该项目的开发者列表
     */
    toUsers() {
      wx.navigateTo({
        url: '../bidder/main?project_id=' + this.detail.id
      })
    },
    /**
     * 评论输入框获取焦点时
     */
    onComInputFocus() {
      this.comInputFocus = true;
      this.commentClass = 'comment-input inputing';
      this.maskClass = 'mask';
      console.log('评论输入框获取焦点时，弹出评论面板');
    },
    /**
     * 监听评论文案变动
     */
    commentTxtChange() {
      this.commentTxt = this.commentTxt.ltrim().rtrim();
    },
    /**
     * 取消评论
     */
    cancelComment() {
      this.commentTxt = '';
      this.commentClass = 'comment-input';
      this.maskClass = '';
      setTimeout(() => {
        this.comInputFocus = false;
      }, 300);
    },
    /**
     * 提交评论
     */
    submitComment() {
      let id = util.getUrlParam('project_id');
      let userInfo = wx.getStorageSync('userInfo') || {}; 
      wx.request({
        url: process.env.API_BASE_URL + '/comment',
        method: 'POST',
        data: {
          project_id: id,
          user_id: userInfo.openid,
          comment_cont: this.commentTxt
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          this.cancelComment();
          // 将刚才评论的放在所有评论最前面
          this.comments = [res.data].concat(this.comments);
        },
        fail: () => {
          this.delivering = false;
        }
      })
    }
  },
  computed: {

  }
}
</script>
<style scoped>
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
.base-info {
  padding: 16px;
}
.base-info .name {
  font-size: 16px;
}
.base-info .status {
  font-size: 14px;
  text-align: right;
}
.base-info .status0 {
  color: #61c279;
}
.base-info .status1 {
  color: #5cadff;
}
.base-info .status2 {
  color: #bbbec4;
}
.price_time_count {
  margin-top: 16px;
  font-size: 12px;
  color: #8796a8;
}
.spliter {
  margin: 0 6px;
}
.box-title {
  margin: 24px 0 16px 0;
  font-size: 14px;
}
.box-text {
  font-size: 14px;
  color: #666;
}
.tools{
  margin-top: 40px;
}

.partAside {
  padding: 12px;
  border: 1px solid #dddee1;
  box-shadow: 0 0 5px rgba(200, 200, 200, 0.5);
}
.partAside .name {
  font-size: 14px;
  line-height: 32px;
  color: #61c279;
}
.partAside .other {
  font-size: 12px;
  color: #8796a8;
}
.comments {
  margin-bottom: 74px;
}
.comments .title {
  margin-bottom: 32px;
  font-size: 14px;
}
.comments .avatarUrl {
  width: 20px;
  height: 20px;
  margin-top: -14px;
}
.comments .nick_name {
  font-size: 10px;
  color: #888;
}
.comments .text {
  font-size: 14px;
  padding: 12px 0;
  margin-bottom: 10px;
}
.comments .time {
  font-size: 10px;
  color: #888;
}
.link {
  display: inline;
  color: #61c279;
}
.msg {
  font-size: 12px;
  text-align: center;
  color: #888;
}
.mask {
  position:fixed;
  left:0;
  right:0;
  top: 0;
  bottom:0;
  background:rgba(0, 0, 0, 0.5);
}
.comment-input {
  position: fixed;
  left:0;
  right:0;
  bottom:0;
  padding: 4px 0px;
  background:#fff;
  box-shadow: -2px 0px 5px rgba(200, 200, 200, 0.5);
}
.comment-input .head {
  margin-bottom: 10px;
  text-align: center;
  line-height: 3em;
  font-size: 12px;
  border-bottom: 1px solid #eee;
  color: #666;
}
.comment-input .title {
  font-size: 16px;
  color: #333;
}
.comment-input .submit {
  color: #5cadff;
}
.comment-input textarea {
  width: 76%;
  height: 16px;
  margin-top: 2px;
  margin-left: 4%;
  padding: 2px 16px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  box-sizing:border-box;
  background: #efefef;
  transition: all 0.3s ease-in-out;
}
.inputing textarea {
  width: 96%;
  height: 120px!important;
  margin-left: 0;
  background: #fff;
}
.comment-input .comment-icon {
  margin-left: 20px;
}
.confirm-msg {
  padding: 0 16px;
}
.hr {

  margin:16rpx 0;
  border-bottom:2rpx solid #eee;

}
</style>
