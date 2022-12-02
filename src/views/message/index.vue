<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.updated_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="MRN">
        <template slot-scope="scope">
          <span>{{ scope.row.mrn }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Patient Name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Content">
        <template slot-scope="scope">
          <router-link :to="'/message/edit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.content }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="150px">
        <template slot-scope="scope">
          <router-link :to="'/message/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              View/Reply
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
  </div>
</template>

<script>
import { fetchList } from '@/api/message'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MessageList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        resolved: 'success',
        pending: 'warning',
        unread: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$store.watch(
      () => this.$store.getters.project,
      () => {
        this.$nextTick(() => {
          this.getList()
        })
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.project = this.$store.getters.project
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
