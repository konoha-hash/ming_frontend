<!--
 * @Author: 周梦茹
 * @Date: 2021-06-29 16:11:11
 * @LastEditors: 周梦茹
 * @LastEditTime: 2021-11-16 17:22:31
 * @Description:修改密码
 * @FilePath: \bussiness\src\components\NavBar\changePassword.vue
-->
<template>
  <div class="changePass">
    <el-form ref="form" :model="form" label-width="1.5rem" :rules="rules" label-position="right">
      <el-form-item label="原始密码:" prop="password">
        <el-input v-model="form.password" type="password"></el-input
      ></el-form-item>
      <el-form-item label="新密码:" prop="newPassword">
        <el-input v-model="form.newPassword" type="password"></el-input
      ></el-form-item>
      <el-form-item label="再次确认:" prop="confirmPass">
        <el-input v-model="form.confirmPass" type="password"></el-input
      ></el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="save">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
const { username } = userInfo;

export default {
  name: 'BussinessChangepassword',

  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/;
        // const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,}$/;

        if (this.form.newPassword !== '') {
          const passReg = reg.test(this.form.newPassword);
          const length = this.form.newPassword.length;

          if (length < 8 || !passReg) {
            callback(new Error(' 密码要求: 满足字母和数字, 且长度大于8位.'));
          } else {
            callback();
          }
        }
        callback();
      }
    };

    const validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      form: {
        password: '',
        newPassword: '',
        confirmPass: '',
        addType: '',
        username
      },
      rules: {
        password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        confirmPass: [
          {
            validator: validateConfirmPass,
            trigger: 'blur'
          }
        ]
      }
    };
  },

  mounted () {},

  methods: {
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios.post(`${process.env.VUE_APP_BASE_API_DATA}/loginLocal/updatePwd_`, this.form).then(({ data }) => {
            const { code, msg } = data;

            if (code === 252) {
              this.$message.success(msg);
              this.$emit('innerDialog', false);
              localStorage.clear();
              this.$emit('handleRedirectHome');
            } else {
              this.$message.error(msg);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.changePass {
  /deep/ .el-form-item {
    margin-bottom: 0.4rem;
  }
  .footer {
    display: flex;
    justify-content: center;
  }
}
</style>
