<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <p>通用商业权限管理系统</p>
      </div>
      <el-button type="info" @click="quit">退出</el-button></el-header>
    <el-container>
      <el-aside :width="isToggle?'64px':'200px'">
        <el-menu
          background-color="#475164"
          text-color="#fff"
          active-text-color="#B4EEFB"
          :unique-opened="true"
          :collapse="isToggle"
          :collapse-transition = 'false'
          :router="true"
          default-active="users"
        >
          <div class="toggleMenu" @click="toggleMenu">|||</div>
          <el-submenu :index="item.permissionId+''" v-for="item in menuList" :key="item.permissionId" v-show="item.flag === 1">
            <template slot="title">
              <i  class="one-font"></i>
              <span>{{item.permissionNote}}</span>
            </template>
            <el-menu-item :index="inItem.permissionName" v-for="inItem in item.children" :key="inItem.permissionId" v-show="inItem.flag === 1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{inItem.permissionNote}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getUserMenuList ,logout} from '../api/index'
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-groupctrl',
        103: 'iconfont icon-voiceshopping',
        101: 'iconfont icon-Privacy',
        102: 'iconfont icon-instruction',
        145: 'iconfont icon-tipsmoney'
      },
      isToggle: false
    }
  },
  name: 'Home',
  async created () {
    let userName = window.sessionStorage.getItem('userName');
    const data = await getUserMenuList({userName})
    console.log(data);
    if (data.status !== 200) return this.$message.error(data.meta.msg)
    this.menuList = data.data[0];
  },
  methods: {
    async quit () {
      await logout({
        name:window.sessionStorage.getItem('userName'),
        sessionId:window.sessionStorage.getItem('sessionId')
      });
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleMenu () {
      this.isToggle = !this.isToggle
    }
  }
}
</script>

<style scoped lang="scss">
  .el-container{
    height: 100%;
    color:#fff;
    .el-header{
      background-color: #2b333e;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      div{
        display: flex;
        img{
          height: 50px;
          width: 50px;
        }
      }
    }
    .el-aside{
      background-color: #475164;
      .el-menu{
        border-right: none;
        .toggleMenu{
          height: 24px;
          text-align: center;
          line-height: 24px;
          cursor: pointer;
        }
      }
      .one-font{
        margin-right: 10px;
        font-size: 20px;
        color: #fff;
      }
      .iconfont{
        margin-right: 10px;
        color: #fff;
        font-size: 20px;
      }
    }
    .el-main{
      background-color: #eaedf1;
    }
  }

</style>
