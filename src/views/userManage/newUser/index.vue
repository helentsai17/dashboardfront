<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8" :offset="0">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Create a New User</span>
          </div>
          <el-form ref="userForm" status-icon :model="user" :rules="rules">
            <el-form-item prop="newName" label="Name">
              <el-input v-model="user.newName"/>
            </el-form-item>
            <el-form-item prop="username" label="Username">
              <el-input v-model="user.username"/>
            </el-form-item>
            <el-form-item prop="pass" label="Password">
              <el-input v-model.trim="user.pass" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item prop="checkPass" label="Verify Password">
              <el-input v-model.trim="user.checkPass" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userForm')">
                Create User
              </el-button>
              <el-button @click="resetForm('userForm')">
                Reset
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { newUser } from '@/api/user'

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your new password'))
      } else {
        if (this.user.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your new password again'))
      } else if (value !== this.user.pass) {
        callback(new Error('The new passwords are different, please check'))
      } else {
        callback()
      }
    }
    return {
      user: {},
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        avatar: this.avatar,
        username: '',
        newName: '',
        pass: '',
        checkPass: ''
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.user.project = this.$store.getters.project
          newUser(this.user.newName, this.user.username, this.user.pass, this.user.project, this.user.avatar)
            .then(response => {
              this.$message({
                message: 'User has been created successfully',
                type: 'success',
                duration: 5 * 1000
              })
              this.resetForm('userForm')
            })
            .catch(e => {
              switch (e.response.status) {
                case 500:
                  this.$message.error('User already exists!')
                  break
              }
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.pan-thumb {
  width: 100%;
  height: 100%;
  background-size: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  transform-origin: 95% 40%;
  transition: all 0.3s ease-in-out;
}
</style>
