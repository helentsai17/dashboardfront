<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :offset="3">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Welcome</span>
          </div>
          <div class="user-profile">
            <div class="box-center">
              <img :src="user.avatar" height="100px" width="100px" class="thumb">
            </div>
            <div class="box-center">
              <div class="user-name text-center">
                {{ user.name }}
              </div>
            </div>
            <div class="box-center">
              <el-form ref="nameForm" status-icon :model="user">
                <el-form-item prop="newName" label="New Name">
                  <el-input v-model="user.newName"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitNameForm()">
                    Change Name
                  </el-button>
                  <el-button @click="resetForm('nameForm')">
                    Reset
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8" :offset="0">
        <el-card>
          <el-form ref="userForm" status-icon :model="user" :rules="rules">
            <el-form-item prop="oldPass" label="Old Password">
              <el-input v-model.trim="user.oldPass" type="password"/>
            </el-form-item>
            <el-form-item prop="newPass" label="New Password">
              <el-input v-model.trim="user.newPass" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item prop="checkNewPass" label="Verify New Password">
              <el-input v-model.trim="user.checkNewPass" type="password" autocomplete="off"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userForm')">
                Change Password
              </el-button>
              <el-button @click="resetForm('userForm')">
                Reset
              </el-button>
            </el-form-item>
          </el-form>
          <el-divider/>
          <img v-show="signatureVisible" :src="signatureData" width="300" height="80" style="margin-bottom: 10px;">
          <el-button type="primary" @click="signatureDialogVisible = true">
            Add/Change signature
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!--Signature Dialog-->
    <el-dialog
      title="Use your mouse or finger to draw your signature below"
      :before-close="handleClose"
      :visible.sync="signatureDialogVisible"
      :close-on-click-modal="false"
    >
      <VueSignaturePad
        ref="signaturePad"
        width="750px"
        height="200px"
        :options="{ throttle: 12, minWidth: 2, maxWidth: 4 }"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearSignature()">Clear</el-button>
        <el-button type="primary" @click="submitSignature()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePassword, fetchSignature, changeSignature, changeName } from '@/api/user'

export default {
  name: 'Setting',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your current password'))
      } else {
        this.$refs.userForm.validateField('newPass')
      }
      callback()
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your new password'))
      } else {
        if (this.user.checkNewPass !== '') {
          this.$refs.userForm.validateField('checkNewPass')
        }
        callback()
      }
    }
    const validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your new password again'))
      } else if (value !== this.user.newPass) {
        callback(new Error('The new passwords are different, please check'))
      } else {
        callback()
      }
    }
    return {
      user: {},
      rules: {
        oldPass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        checkNewPass: [
          { validator: validatePass3, trigger: 'blur' }
        ]
      },
      signatureData: '',
      signatureVisible: false,
      signatureDialogVisible: false
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
    this.getSignature()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        avatar: this.avatar,
        oldPass: '',
        newPass: '',
        checkNewPass: ''
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePassword(this.user.oldPass, this.user.newPass)
            .then(response => {
              this.$message({
                message: 'Password has been updated successfully',
                type: 'success',
                duration: 5 * 1000
              })
              this.resetForm('userForm')
            })
            .catch(e => {
              switch (e.response.status) {
                case 401:
                  this.$message.error('Incorrect password')
                  break
                case 404:
                  this.$message.error('User not found')
                  break
                case 500:
                  this.$message.error('Internal error')
                  break
              }
            })
        } else {
          return false
        }
      })
    },
    submitNameForm() {
      if (this.user.newName) {
        changeName(this.user.newName)
          .then(() => {
            this.user.name = this.user.newName
            this.$message({
              message: 'Name has been updated successfully',
              type: 'success',
              duration: 5 * 1000
            })
            this.resetForm('nameForm')
          })
          .catch(e => {
            switch (e.response.status) {
              case 404:
                this.$message.error('User not found')
                break
              case 500:
                this.$message.error('Internal error')
                break
            }
          })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          this.$refs.signaturePad.clearSignature()
          done()
        })
        .catch(_ => {
        })
    },
    getSignature() {
      fetchSignature().then((response) => {
        if (response.data) {
          this.signatureData = response.data
          this.signatureVisible = true
        }
      })
    },
    clearSignature() {
      this.$refs.signaturePad.clearSignature()
    },
    submitSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      if (isEmpty) {
        this.$notify({
          title: 'Error',
          message: 'You cannot leave the signature empty',
          type: 'error',
          duration: 2000
        })
        return
      }
      changeSignature({ data }).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Successfully updated',
          type: 'success',
          duration: 2000
        })
        this.$refs.signaturePad.clearSignature()
        this.signatureDialogVisible = false
        this.getSignature()
      })
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
