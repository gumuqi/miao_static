<template>
  <div>
    <div class="user-cnt">
      <view class="userinfo-avatar">
        <open-data  type="userAvatarUrl"></open-data>
      </view>
      <open-data type="userNickName"></open-data>
    </div>
    <div class="commen-tool">
      <i-row>
        <i-col span="6">
          <navigator url='../pubProject/main' class="common-item">
            <div class="icon publish">
              <i-icon type="brush" size="24"/>
            </div>
            <div>发布需求</div>
          </navigator>
        </i-col>
        <i-col span="6">
          <navigator url='../mineProjects/main' class="common-item">
            <div class="icon mineproject">
              <i-icon type="activity" size="24"/>
            </div>
            <div>我的需求</div>
          </navigator>
        </i-col>
        <i-col span="6">
          <navigator url='../mineDelivery/main' class="common-item">
            <div class="icon minedelivery">
              <i-icon type="publishgoods_fill" size="24"/>
            </div>
            <div>我的投递</div>
          </navigator>
        </i-col>
        <i-col span="6">
          <navigator url='../mineInfo/main' class="common-item">
            <div class="icon mineinfo">
              <i-icon type="addressbook" size="24"/>
            </div>
            <div>个人信息</div>
          </navigator>
        </i-col>
      </i-row>
    </div>
    <tab-bar current="mine"></tab-bar>
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

  },
  beforeCreate() {

  },
  methods: {

  },
}
</script>

<style scoped>
.user-cnt {
  position: relative;  
  display: flex;  
  flex-direction: column;  
  align-items: center;  
  height: 150px;
  font-size: 14px;
  color: #fff;  
  background-image: linear-gradient(0deg, #80848f 0%, #495060 48%, #1c2438 100%);
}
.userinfo-avatar {  
  overflow:hidden;  
  display: block;  
  width: 80px;  
  height: 80px;  
  margin: 10px;  
  border-radius: 50%;  
  border: 2px solid #fff;  
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);  
}
.commen-tool {
  margin-top: 20px;
  padding: 0px 16px;
  text-align: center;
}
.common-item {
  display: inline-block;
  font-size: 12px;
  text-align: center;
}
.common-item > .icon {
  height: 48px;
  width: 48px;
  margin-bottom: 8px;
  line-height: 42px;
  border-radius: 16px;
  color: #fff;
}
.publish {
  background: #9dd1ce;
}
.mineproject {
  background: #8ebdd8;
}
.minedelivery {
  background: #8ea9d7;
}
.mineinfo {
  background: #eac87b;
}

</style>

