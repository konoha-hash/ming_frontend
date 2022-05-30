<template>
  <section id="nav-bar">
    <section class="sys-name">
      <span class="logo"><img :src="sysLogo" alt="" /></span>
      <span class="title"></span>
    </section>
    <section class="sys-menu">
      <el-menu
        menu-trigger="hover"
        router
        unique-opened
        :default-active="activeIndex"
        @select="handleSelect"
        mode="horizontal"
      >
        <nav-item v-for="item in routes || []" :key="item.path" :menuData="item" />
      </el-menu>
    </section>
    <section class="sys-info">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link"> <i class="iconfont iconren"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="user">用户管理</el-dropdown-item>
          <el-dropdown-item command="password" divided>修改密码</el-dropdown-item>
          <el-dropdown-item command="signOut" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="username">{{ name }}</span>
      <!-- <i class="iconfont icontuichu" @click="handleRedirectHome" /> -->
    </section>
    <!-- 用户管理 -->
    <el-dialog :visible.sync="dialog" width="6.5rem">
      <UserMangeDialog @closeDialog="closeDialog"></UserMangeDialog>
    </el-dialog>
    <el-dialog width="5rem" title="修改密码" :visible.sync="changePassVisible" :destroy-on-close="true">
      <ChangePassword @innerDialog="innerDialog" @handleRedirectHome="handleRedirectHome"></ChangePassword>
    </el-dialog>
  </section>
</template>

<script>
import Vue from 'vue';
import {
  Menu, Submenu, MenuItem, Dropdown, DropdownItem, DropdownMenu
} from 'element-ui';


Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);

export default {
  name: 'NavBar',
  data () {
    return {
    };
  },
  components: {
  },

  watch: {

  },

  mounted () {
  },

  methods: {

  }
};
</script>

<style lang="scss">
@mixin eleMenuActive($size: 0.05rem, $color: #5fffff) {
  border-bottom: $size solid $color;
  border-bottom-color: $color !important;
  background: linear-gradient(0deg, #6dcdffc4 0%, rgba(109, 191, 255, 0) 90%);
  transition: none;
}

#nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.6rem;
  padding: 0 0.15rem;
  color: #fff;
  background: linear-gradient(90deg, #448cf1 0%, #316ce5 100%);

  .sys-name {
    display: flex;
    align-items: center;
    font-size: 0.3rem;
    font-weight: bold;

    span {
      vertical-align: middle;

      &.logo {
        display: inline-block;
        width: 0.4rem;
        height: 0.44rem;
        margin-right: 0.1rem;
        // background-image: url('../../static/images/icon_logo.png');
        // background-size: contain;
      }
    }
  }

  .sys-menu {
    ul {
      display: flex;
    }
    .el-menu {
      border: none;
      background: transparent;

      .el-menu-item {
        height: 0.6rem;
        line-height: 0.6rem;
        color: #fff;
        font-size: 0.17rem;

        &:not(.is-disabled):hover {
          @include eleMenuActive();
        }

        &.is-active {
          @include eleMenuActive();
        }
      }

      .el-submenu {
        &.is-active {
          .el-submenu__title {
            @include eleMenuActive();
          }
        }

        .el-submenu__title {
          height: 0.6rem;
          line-height: 0.6rem;
          color: #fff;
          font-size: 0.18rem;

          .el-icon-arrow-down {
            color: #fff;
            margin-right: -0.2rem;
            line-height: 0.2rem;
          }
        }

        &:not(.is-active) {
          .el-submenu__title {
            &:hover {
              @include eleMenuActive();
            }
          }
        }
      }
    }
  }

  .sys-info {
    display: flex;
    align-items: center;
    font-size: 0.18rem;

    .username {
      margin-left: 0.1rem;
      margin-right: 0.15rem;
    }

    .iconfont {
      &.iconren,
      &.icontuichu {
        font-size: 0.28rem;
        color: #fff;
      }
    }
  }
}

// 修改element导航子项高亮样式
.el-menu--horizontal .el-menu .el-menu-item.is-active,
.el-menu--horizontal .el-menu .el-submenu.is-active > .el-submenu__title {
  color: #fff;
  background: linear-gradient(90deg, #448cf1 0%, #316ce5 100%);
}
</style>
