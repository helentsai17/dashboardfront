<!--suppress CheckEmptyScriptTag -->
<template>
  <div class="app-container">
    <!--patient mrn-->
    <el-row>
      <el-col :span="12">
        <div style="height: 100px;">
          <el-form :model="patient" @submit.native.prevent>
            <el-form-item prop="text">
              <md-input
                v-model="patient.mrn"
                :icon="icon"
                :placeholder="$t('table.mrn')"
                name="mrn"
                @change="inputChange"
                @keyup.enter.native="checkEligibility"
              >
                {{ $t('table.mrn') }}
              </md-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!--alert-->
    <el-row v-show="alert.visible" style="margin-bottom: 30px;">
      <el-alert
        :closable="false"
        :title="alert.title"
        :type="alert.type"
        :description="alert.description"
        show-icon
      />
    </el-row>

    <!--additional alerts-->
    <el-row v-show="addAlert.visible" style="margin-bottom: 30px;">
      <el-alert
        v-for="a in addAlert.titles"
        :key="a"
        :title="a"
        type="warning"
        style="margin-bottom: 10px !important;"
      />
    </el-row>

    <!--start btn-->
    <el-row style="margin-bottom: 30px;">
      <div class="component-item">
        <el-button v-waves type="primary" @click="checkEligibility">
          {{ $t('patient.check') }}
        </el-button>
        <el-button v-show="addBtnVisible" v-waves type="primary" @click="addMrn">
          {{ $t('patient.add') }}
        </el-button>
      </div>
    </el-row>

    <el-row>
      <div>
        <el-table v-loading="tableLoading" :data="table" style="width: 50%;">
          <el-table-column :label="$t('patient.key')" min-width="100px">
            <template slot-scope="scope">
              {{ scope.row.key }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('patient.value')" min-width="100px">
            <template slot-scope="scope">
              {{ scope.row.value }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
  </div>
</template>

<script>
/**
 Auth: Lei.j1ang
 Created: 2018/1/19-14:54
 */
import { fetchEligibility, postPatient } from '@/api/patient'
import MdInput from '@/components/MDinput'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'EligibilityCheck',
  components: {
    MdInput
  },
  directives: {
    waves
  },
  data() {
    return {
      patient: {
        mrn: ''
      },
      alert: {
        visible: false,
        title: '',
        type: '',
        description: ''
      },
      addAlert: {
        visible: false,
        titles: []
      },
      addBtnVisible: false,
      icon: 'question',
      table: [],
      tableLoading: false,
      data: {}
    }
  },
  mounted() {
    this.$store.watch(
      () => this.$store.getters.project,
      () => {
        this.resetAlert()
      })
  },
  methods: {
    checkEligibility() {
      if (!this.patient.mrn) {
        this.alert.title = 'Invalid'
        this.alert.description = 'MRN is required field'
        this.alert.type = 'error'
        this.alert.visible = true
        return
      }
      if (!this.$store.getters.project) {
        this.alert.title = 'Invalid'
        this.alert.description = 'Please choose a project'
        this.alert.type = 'error'
        this.alert.visible = true
        return
      }
      this.icon = 'loading'
      this.tableLoading = true
      fetchEligibility(this.patient.mrn, this.$store.getters.project).then(response => {
        // alerts
        const data = response.data
        this.alert.title = data.message.substring(0, data.message.indexOf('-') - 1)
        this.alert.description = data.message.substring(data.message.indexOf('-') + 2)
        this.alert.type = data.alertType
        this.icon = data.alertType
        this.alert.visible = true
        this.addBtnVisible = !data.message.includes('Not Eligible')

        if (data.details) {
          // additional alerts
          if (data.addMessages.length > 0) {
            this.addAlert.visible = true
            this.addAlert.titles = data.addMessages
          }

          // table
          this.table = [
            { key: 'mrn', value: data.mrn ? data.mrn : this.patient.mrn },
            { key: 'donor id', value: data.donorId },
            { key: 'first name', value: data.firstName },
            { key: 'last name', value: data.lastName },
            {
              key: 'date of birth',
              value: data.dob ? new Date(data.dob).toLocaleDateString('en-US', { timeZone: 'America/New_York' }) : null
            },
            { key: 'consented', value: data.consented ? 'Yes' : 'No' },
            { key: 'redraw', value: data.redraw },
            { key: 'withdraw', value: data.withdraw },
            {
              key: 'initial consent date',
              value: data.consentDate ? new Date(data.consentDate).toLocaleDateString('en-US', { timeZone: 'America/New_York' }) : null
            }
          ]
        }

        // save to data
        this.data = {
          mrn: data.mrn ? data.mrn : this.patient.mrn,
          donor_id: data.donorId,
          first_name: data.firstName,
          last_name: data.lastName,
          status: data.message
        }

        this.tableLoading = false
      })
    },
    addMrn() {
      this.data.project = this.$store.getters.project
      postPatient(this.data).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetAlert() {
      this.alert.visible = false
      this.alert.title = ''
      this.alert.type = ''
      this.alert.description = ''
      this.addAlert.visible = false
      this.addAlert.titles = []
      this.table = []
      this.data = {}
      this.addBtnVisible = false
    },
    inputChange() {
      this.icon = 'question'
      this.resetAlert()
    }
  }
}
</script>
