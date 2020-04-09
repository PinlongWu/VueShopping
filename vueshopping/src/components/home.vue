<template>
    <el-container class="home_caontainer">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/Homelogo.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="goOut">退出</el-button>
        </el-header>
        <!-- 主题区域 -->
        <el-container>
            <!-- 侧边栏区域 -->
            <el-aside :width="isCollapse? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    :unique-opened="true"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index=" '/' + subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)"
                        >
                            <!-- 二级菜单模板区域 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右边主体区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单的数据
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-ren",
        "103": "iconfont icon-quanxian",
        "101": "iconfont icon-shangpinguanli",
        "102": "iconfont icon-dingdanguanli",
        "145": "iconfont icon-shujutongji"
      },
      //   是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    //   退出登陆
    goOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get(
        "https://www.liulongbin.top:8888/api/private/v1/menus"
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath
    }
  }
};
</script>
<style lang="less" scoped>
.home_caontainer {
  height: 100%;
  .el-header {
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    padding-left: 0;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background: #333744;
    .toggle-button {
      background: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background: #eaedf1;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>


