<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9" :offset="0">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Add User to a Project</span>
          </div>
          <el-form ref="addUserForm" status-icon :model="userAdd">
            <el-form-item prop="username" label="Username">
              <el-autocomplete
                v-model="userAdd.username"
                class="inline-input"
                :fetch-suggestions="querySearchUser"
                placeholder="Choose a User"
                @select="handleConfirmSearchAdmin"
              />
            </el-form-item>
            <el-form-item prop="project" label="Project">
              <el-autocomplete
                v-model="userAdd.project"
                class="inline-input"
                :fetch-suggestions="querySearchAdminProject"
                placeholder="Choose a Project"
                @select="handleConfirmAdd"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addUserSubmit()">
                Add User
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="9" :offset="0">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Remove User from a Project</span>
          </div>
          <el-form ref="removeUserForm" status-icon :model="userRemove">
            <el-form-item prop="username" label="Username">
              <el-autocomplete
                v-model="userRemove.username"
                class="inline-input"
                :fetch-suggestions="querySearchUser"
                placeholder="Choose a User"
                @select="handleConfirmSearch"
              />
            </el-form-item>
            <el-form-item prop="project" label="Project">
              <el-autocomplete
                v-model="userRemove.project"
                class="inline-input"
                :fetch-suggestions="querySearchProject"
                placeholder="Choose a Project"
                @select="handleConfirmRemove"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="removeUserSubmit()">
                Remove User
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
import { getUsers, getAdminProjects, getCurrentProjects, addUser, removeUser } from '@/api/user'

export default {
  data() {
    return {
      userAdd: {},
      userRemove: {},
      usersList: {},
      currentProjectsList: {},
      adminProjectsList: {}
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
    this.getUserAdd()
    this.getUserRemove()
    this.getUsersList()
  },
  methods: {
    getProjectsList(user) {
      getCurrentProjects({ username: user }).then(response => {
        this.currentProjectsList = response.data
      })
    },
    getAdminProjectsList() {
      getAdminProjects().then(response => {
        this.adminProjectsList = response.data
      })
    },
    getUsersList() {
      getUsers().then(response => {
        this.usersList = response.data
      })
    },
    createFilterUser(query) {
      return (users) => {
        return (users.value.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      }
    },
    createFilterProject(query) {
      return (projects) => {
        return (projects.value.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      }
    },
    createFilterAdminProject(query) {
      return (adminProjects) => {
        return (adminProjects.value.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      }
    },
    handleConfirmAdd(p) {
      this.userAdd.project_id = p.project_id
    },
    handleConfirmRemove(p) {
      this.userRemove.project_id = p.project_id
    },
    handleConfirmSearch(user) {
      this.userRemove.project = ''
      this.getProjectsList(user.value)
    },
    handleConfirmSearchAdmin() {
      this.userAdd.project = ''
      this.getAdminProjectsList()
    },
    querySearchUser(queryString, cb) {
      const users = Object.keys(this.usersList).map(pid => ({ id: pid, value: this.usersList[pid] }))
      const results = queryString ? users.filter(this.createFilterUser(queryString)) : users
      // call callback function to return suggestions
      cb(results)
    },
    querySearchProject(queryString, cb) {
      const projects = Object.keys(this.currentProjectsList).map(pid => ({ id: pid, value: this.currentProjectsList[pid].title, project_id: this.currentProjectsList[pid].id }))
      const results = queryString ? projects.filter(this.createFilterProject(queryString)) : projects
      // call callback function to return suggestions
      cb(results)
    },
    querySearchAdminProject(queryString, cb) {
      const adminProjects = Object.keys(this.adminProjectsList).map(pid => ({ id: pid, value: this.adminProjectsList[pid].title, project_id: this.adminProjectsList[pid].id }))
      const results = queryString ? adminProjects.filter(this.createFilterAdminProject(queryString)) : adminProjects
      // call callback function to return suggestions
      cb(results)
    },
    getUserAdd() {
      this.userAdd = {
        username: '',
        project: '',
        project_id: null
      }
    },
    getUserRemove() {
      this.userRemove = {
        username: '',
        project: '',
        project_id: null
      }
    },
    addUserSubmit() {
      if (!(this.usersList.includes(this.userAdd.username))) {
        this.$message.error('Invalid user')
        return
      }
      if (!(this.adminProjectsList.map((x) => x.title).includes(this.userAdd.project))) {
        this.$message.error('Invalid project selection')
        return
      }
      addUser(this.userAdd.username, this.userAdd.project_id)
        .then(response => {
          this.$message({
            message: 'User has been added to project',
            type: 'success',
            duration: 5 * 1000
          })
        })
        .catch(e => {
          switch (e.response.status) {
            case 500:
              this.$message.error('User could not be added to project (is user already in this project?)!')
              break
          }
        })
    },
    removeUserSubmit() {
      if (!(this.usersList.includes(this.userRemove.username))) {
        this.$message.error('Invalid user')
        return
      }
      if (!(this.currentProjectsList.map((x) => x.title).includes(this.userRemove.project))) {
        this.$message.error('Invalid project selection')
        return
      }
      removeUser(this.userRemove.username, this.userRemove.project_id)
        .then(response => {
          this.$message({
            message: 'User has been removed from project',
            type: 'success',
            duration: 5 * 1000
          })
        })
        .catch(e => {
          switch (e.response.status) {
            case 500:
              this.$message.error('User could not be removed from project!')
              break
          }
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
