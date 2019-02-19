<template>
    <div>
      <div class="item" v-for="(pro, index) in list">
        <div class="body-cnt">
          <i-row>
            <i-col span="18">
              <div class="name autocut">
                {{ pro.name }}
              </div>
            </i-col>
            <i-col span="6">
              <div class="price">
                ¥ {{ pro.price }}
              </div>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="24">
              <div class="technology">
                技术要求 : {{ pro.technology }}
              </div>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="18">
              <div class="duration">
                {{ pro.updateTime }}    <span class="spliter">|</span> 
                {{ pro.count }} 人投递
                <span v-if="pro.status==0" class="status status0">招募中</span>
                <span v-if="pro.status==1" class="status status1">开发中</span>
                <span v-if="pro.status==2" class="status status2">已结束</span>
              </div>
            </i-col>
            <i-col span="6">
              <div class="toDetail" v-on:click="toDetail(pro)">
                详情
              </div>
            </i-col>
          </i-row>
          
        </div>
      </div>
      <div v-if="list.length==0" class="msg">
        暂无需求
      </div>
    </div>
</template>

<script>

export default {
  props: ["list"],
  data() {
    return {

    }
  },
  methods: {
    toDetail: function(pro) {
      wx.navigateTo({
        url: '../../pages/proDetail/main?project_id=' + pro.id
      })
    }
  }
}
</script>

<style scoped>
img {
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
  display: flex;
  margin:0 16px;
  margin-bottom: 10px;
  padding: 6px 0px 16px 0px;
  font-size: 14px;
  overflow: hidden;
  position: relative;
  background:#fff;
  border-bottom: 1rpx solid #dddee1;

}
.icon-cnt {
  position: relative;
}
.body-cnt {
  
  flex-grow: 1;
  width:calc(100% - 44px);
  padding-left: 10px;
}

.body {
  height: 30px;
}
.name {
  padding: 2px 0px;
  color: #525b66;
}
.price {
  text-align: right;
  color: #f75288;
}
.technology {
  padding: 16px 0px;
}
.duration {
  font-size: 12px;
  color: #8796a8;
}
.status {
  margin-left: 12px;
  padding: 2px 4px;
  font-size: 12px;
}
.status0 {
  border: 1px solid #61c279;
  color: #61c279;
}
.status1 {
  border: 1px solid #5cadff;
  color: #5cadff;
}
.status2 {
  border: 1px solid #bbbec4;
  color: #bbbec4;
}
.toDetail {
  text-align: right;
  font-size: 12px;
  color: #8796a8;
}
.spliter {
  margin: 0 6px;
}

</style>

