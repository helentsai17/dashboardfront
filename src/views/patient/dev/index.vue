<!--suppress CheckEmptyScriptTag -->
<template>
  <div class="app-container">
    <!--patient mrn-->
    <el-row>
      <el-col :span="12">
        <div style="height:100px;">
          <el-form :model="patient" @submit.native.prevent>
            <el-form-item prop="text">
              <md-input
                v-model="patient.mrn"
                :placeholder="$t('table.mrn')"
                name="mrn"
                @change="inputChange"
                @keyup.enter.native="withdrawMrn"
              >
                {{ $t('table.mrn') }}
              </md-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!--start btn-->
    <el-row style="margin-bottom: 30px;">
      <div class="component-item">
        <el-button v-waves type="primary" @click="withdrawMrn">
          Withdraw this patient
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
import { withdrawPatient } from '@/api/patient'
import MdInput from '@/components/MDinput'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'DevMenu',
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
      table: [],
      tableLoading: false
    }
  },
  mounted() {
    this.$store.watch(
      () => this.$store.getters.project,
      () => {
        this.inputChange()
      })
  },
  methods: {
    withdrawMrn() {
      if (!this.patient.mrn) {
        this.table = [{ key: 'error', value: 'MRN is required field' }]
        return
      }
      if (!this.$store.getters.project) {
        this.table = [{ key: 'error', value: 'Please choose a project' }]
        return
      }
      this.tableLoading = true
      withdrawPatient(this.patient.mrn, this.$store.getters.project).then(response => {
        // alerts
        const data = response.data

        if (data.details) {
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

        this.tableLoading = false
      })
    },
    inputChange() {
      this.table = []
    }
  }
}
</script>
