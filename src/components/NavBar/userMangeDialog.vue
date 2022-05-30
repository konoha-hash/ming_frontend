<!--
 * @Author: 周梦茹
 * @Date: 2021-06-29 15:12:29
 * @LastEditors: 周梦茹
 * @LastEditTime: 2021-07-15 14:02:37
 * @Description:用户管理
 * @FilePath: \src\components\NavBar\userMangeDialog.vue
-->
<template>
  <div class="userMange">
    <div class="dialog-title">用户管理</div>
    <el-form ref="form" :model="form" label-width="1.5rem">
      <el-form-item label="姓名："> <el-input v-model="form.name" disabled></el-input></el-form-item>
      <el-form-item label="岗位："> <el-input v-model="form.position"></el-input></el-form-item>
      <el-form-item label="所在地区："> <el-input v-model="form.area"></el-input></el-form-item>
      <el-form-item label="所在单位："> <el-input v-model="form.area"></el-input></el-form-item>
      <el-form-item label="联系方式："> <el-input v-model="form.tel"></el-input></el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>

    <!-- <div v-if="status === 'password'">
      <div class="dialog-title">密码管理</div>
      <el-form ref="passForm" :model="passForm" label-width="1.5rem">
        <el-form-item label="手机号："> <el-input v-model="passForm.tel"></el-input></el-form-item>
        <el-form-item label="新密码："> <el-input v-model="passForm.newPass" show-password></el-input></el-form-item>
        <el-form-item label="再次确认："> <el-input v-model="passForm.confirm" show-password></el-input></el-form-item>
        <el-form-item label="短信验证码：">
          <el-input v-model="passForm.code"></el-input><el-button type="primary" size="mini ">发送验证码</el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="updatePass">保存</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'BussinessUsermangedialog',

  data () {
    return {
      form: {
        name: '戴瑛',
        position: '河长办办事员',
        tel: '18370525536'
      }
    };
  },

  mounted () {},

  methods: {
    cancel () {
      this.$emit('closeDialog');
    },
    save () {
      this.$emit('closeDialog');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/style/theme.scss';

.userMange {
  .el-input {
    width: 3rem;
  }
  .footer {
    display: flex;
    justify-content: center;
  }
}
</style>
