<template>
  <div>
    <div v-if="Object.keys(projectList).length > 5">
      <el-autocomplete
        v-model="curProject"
        class="inline-input"
        :fetch-suggestions="querySearch"
        placeholder="Choose project"
        @select="handleConfirmSearch"
      />
    </div>
    <div v-else>
      <el-dropdown
        trigger="click"
        class="international"
        @command="handleSetProject"
      >
        <div>
          <el-button>{{ projectTitle }} <i class="el-icon-document el-icon-right"/></el-button>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="project===''" command="">
            All
          </el-dropdown-item>
          <el-dropdown-item v-for="p in Object.keys(projectList)" :key="p" :disabled="project===p" :command="p">
            {{ projectList[p] }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/project'

export default {
  data() {
    return {
      curProject: '',
      projectList: {}
    }
  },
  computed: {
    project() {
      return this.$store.getters.project
    },
    projectTitle() {
      return this.$store.getters.project ? this.projectList[this.$store.getters.project] : 'Choose Project'
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    createFilter(query) {
      return (projects) => {
        return (projects.value.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      }
    },
    querySearch(queryString, cb) {
      const projects = Object.keys(this.projectList).map(pid => ({ id: pid, value: this.projectList[pid] }))
      const results = queryString ? projects.filter(this.createFilter(queryString)) : projects
      // call callback function to return suggestions
      cb(results)
    },
    getProjectList() {
      fetchList().then(response => {
        this.projectList = response.data
        if (!this.$store.getters.project) {
          const pid = Object.keys(this.projectList)[0]
          this.handleSetProject(pid)
          this.curProject = this.projectList[pid]
        }
      })
    },
    handleConfirmSearch(project) {
      this.handleSetProject(project.id)
    },
    handleSetProject(pid) {
      this.$store.dispatch('setProject', pid)
      this.$store.dispatch('setProjectTitle', this.projectList[pid])
      this.$message({
        message: 'Successfully Switched Project',
        type: 'success',
        duration: 1.5 * 1000
      })
    }
  }
}
</script>

<style>
.el-autocomplete {
  width: 400px;
}

.el-autocomplete-suggestion {
  width: 400px;
}

.el-message.el-message--success{
  left: 250px !important;
}

</style>
