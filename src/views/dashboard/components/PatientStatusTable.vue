<template>
  <div>
    <el-table v-loading="listLoading" :data="list" style="width: 100%; padding-top: 15px;">
      <el-table-column label="Patient MRN" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.mrn | patientMrnFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Status" min-width="270px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Updated at" width="200px" align="center" class-name="hidden-xs-only">
        <template slot-scope="scope">
          {{ new Date(scope.row.updated_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) }}
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
import { fetchList } from '@/api/patient'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import 'element-ui/lib/theme-chalk/display.css'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'Started Interactive Review': 'primary',
        'Selected Consent Now': 'primary',
        'Read and Agreed to Terms and Conditions': 'primary',
        'Submitted Consent Information': 'primary',
        'Entered E-Questionnaire': 'primary',
        'Submitted E-Questionnaire': 'warning',
        'Not Eligible - Consented': 'info'
      }
      return statusMap[status]
    },
    patientMrnFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
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
    fetchData() {
      this.listLoading = true
      this.listQuery.project = this.$store.getters.project
      fetchList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
