<template>
  <div class="dashboard-editor-container">
    <!--cards-->
    <el-row :gutter="20">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}">
        <panel-group @handleSetLineChartData="handleSetLineChartData"/>
      </el-col>
    </el-row>
    <el-row style="background:#fff; padding:16px 16px 0; margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <!--patient status chart-->
    <el-row>
      <el-col :span="24" style="padding-right:8px; margin-bottom:30px;">
        <patient-status-table/>
      </el-col>
    </el-row>

    <!--patient count chart-->
    <el-row>
      <el-col :span="24" style="padding-right:8px; margin-bottom:30px;">
        <patient-count-table/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PatientStatusTable from './components/PatientStatusTable'
import PatientCountTable from './components/PatientCountTable'
import { fetchList as fetchPatientList } from '@/api/patient'
import { fetchList as fetchMsgList } from '@/api/message'

const lineChartData = {
  patients: {
    createdData: [],
    completedData: []
  },
  messages: {
    createdData: [],
    completedData: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PatientStatusTable,
    PatientCountTable
  },
  data() {
    return {
      lineChartData: {}
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
    getNearestMonday() {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (date.getDay() + 6) % 7)
      return date
    },
    dateFilter(list) {
      const monday = new Date(this.getNearestMonday())
      const resultList = {
        createdData: [],
        completedData: []
      }
      for (let i = 0; i < 7; i += 1) {
        let curDate = new Date(monday)
        curDate = new Date(curDate.setDate(curDate.getDate() + i))
        let nextDate = new Date(curDate)
        nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1))
        resultList.createdData.push(list.filter((item) => {
          return new Date(item.created_at) > curDate && new Date(item.created_at) < nextDate
        }).length)
        resultList.completedData.push(list.filter((item) => {
          if (item.completed) {
            return new Date(item.updated_at) > curDate && new Date(item.updated_at) < nextDate
          } else {
            return false
          }
        }).length)
      }
      return resultList
    },
    async fetchData() {
      await fetchPatientList({ project: this.$store.getters.project }).then(response => {
        const monday = new Date(this.getNearestMonday())
        const patientList = response.data.items.filter(item => new Date(item.created_at) > monday)
        lineChartData.patients = this.dateFilter(patientList)
      })
      await fetchMsgList({ project: this.$store.getters.project }).then(response => {
        const monday = new Date(this.getNearestMonday())
        const msgList = response.data.items.filter(item => new Date(item.created_at) > monday)
        lineChartData.messages = this.dateFilter(msgList)
      })
      this.lineChartData = lineChartData.patients
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
