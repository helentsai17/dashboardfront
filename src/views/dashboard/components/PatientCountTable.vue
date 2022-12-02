<template>
  <div>
    <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
      {{ $t('table.export') }}
    </el-button>
    <el-table v-loading="listLoading" :data="list" style="width: 100%; padding-top: 15px;">
      <el-table-column label="Project Title" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.project_title }}
        </template>
      </el-table-column>
      <el-table-column label="Total Patients" min-width="30px">
        <template slot-scope="scope">
          {{ scope.row.patient_count }}
        </template>
      </el-table-column>
      <el-table-column label="Consented Patients" min-width="30px">
        <template slot-scope="scope">
          {{ scope.row.consented_count }}
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="margin-top: 0;"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { fetchCounts as fetchPatientCounts } from '@/api/patient'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import 'element-ui/lib/theme-chalk/display.css'
import waves from '@/directive/waves' // Waves directive

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      downloadLoading: false,
      listLoading: true,
      total: 0,
      list: []
    }
  },
  mounted() {
    if (this.$store.getters.project) {
      this.fetchData()
    }
    this.$store.watch(
      () => this.$store.getters.project,
      () => {
        this.$nextTick(() => {
          this.fetchData()
        })
      })
  },
  methods: {
    // export to excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Project Title', 'Total Patients', 'Consented Patients']
        const filterVal = ['project_title', 'patient_count', 'consented_count']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'patient-count-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    fetchData() {
      this.listLoading = true
      fetchPatientCounts().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
