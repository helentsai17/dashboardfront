<template>
  <div class="app-container">
    <!--header-->
    <div class="filter-container">
      <!--title search-->
      <el-input
        v-model="listQuery.mrn"
        :placeholder="$t('table.mrn')"
        clearable
        class="filter-item"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <!--status select-->
      <el-select
        v-model="listQuery.status"
        :placeholder="$t('table.status')"
        clearable
        class="filter-item"
        style="width: 340px;"
        @change="handleFilter"
      >
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <!--consent type select-->
      <el-select
        v-model="listQuery.consent_type"
        :placeholder="$t('table.consent_type')"
        clearable
        class="filter-item"
        style="width: 150px;"
        @change="handleFilter"
      >
        <el-option :label="$t('table.paper_consent')" value="Paper"/>
        <el-option :label="$t('table.electronic_consent')" value="Electronic"/>
      </el-select>
      <!--sort select-->
      <el-select v-model="listQuery.sort" style="width: 230px; margin-right: 10px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <!--btns-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-show="project" v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="hasConsented = false; handleCreate();">
        {{ $t('table.addElectronic') }}
      </el-button>
      <el-button v-show="project" v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="hasConsented = true; handleCreate();">
        {{ $t('table.addPaper') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="getList">
        {{ $t('table.refresh') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="batchDownload">
        {{ $t('table.batch_download') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="triggerFileUpload">
        {{ $t('table.batch') }}
      </el-button>
      <input id="file-upload" ref="fileInput" type="file" accept=".csv" @change="batchUpload($event)">
    </div>

    <!--body-->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="500"
      @sort-change="sortChange"
    >
      <!--id-->
      <el-table-column :label="$t('table.mrn')" prop="id" sortable="custom" min-width="150px" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.mrn }}</span>
        </template>
      </el-table-column>
      <!--title-->
      <el-table-column :label="$t('table.name')" prop="name" sortable="custom" min-width="150px" fixed>
        <template slot-scope="scope">
          <span class="link-type" @click="hasConsented = true; handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!--consent-name-->
      <el-table-column :label="$t('table.consent_name')" prop="consent_name" sortable="custom" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="hasConsented = true; handleUpdate(scope.row)">{{ scope.row.consent_name }}</span>
        </template>
      </el-table-column>
      <!--status-->
      <el-table-column :label="$t('table.status')" class-name="status-col" min-width="270px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <!--consented-->
      <el-table-column :label="$t('table.consented')" prop="consented" sortable="custom" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.consented ? $t('table.yes') : $t('table.no') }}</span>
        </template>
      </el-table-column>
      <!--consent type-->
      <el-table-column :label="$t('table.consent_type')" prop="consentType" sortable="custom" min-width="150px">
        <template slot-scope="scope">
          <span>{{ getConsentType(scope.row.consent_type) }}</span>
        </template>
      </el-table-column>
      <!--consent date-->
      <el-table-column :label="$t('table.consent_date')" prop="consentDate" sortable="custom" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consent_date ? new Date(scope.row.consent_date).toLocaleString('en-US', { timeZone: 'America/New_York' }) : '' }}</span>
        </template>
      </el-table-column>
      <!--withdrawn-->
      <el-table-column :label="$t('table.withdrawn')" prop="withdrawn" sortable="custom" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawn ? $t('table.yes') : $t('table.no') }}</span>
        </template>
      </el-table-column>
      <!--withdraw date-->
      <el-table-column :label="$t('table.withdraw_date')" prop="withdrawDate" sortable="custom" width="180px" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.withdraw_date ? new Date(scope.row.withdraw_date).toLocaleString('en-US', { timeZone: 'America/New_York' }) : '' }}
          </span>
        </template>
      </el-table-column>
      <!--date-->
      <el-table-column :label="$t('table.created')" prop="created" sortable="custom" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) }}</span>
        </template>
      </el-table-column>
      <!--action-->
      <el-table-column :label="$t('table.actions')" align="center" width="400px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <!--edit-->
          <el-button size="small" @click="hasConsented = true; handleUpdate(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <!--send email-->
          <el-button
            v-show="!filterStatus(scope.row)"
            size="small"
            type="primary"
            @click="handleEmailInvite(scope.row)"
          >
            {{ $t('table.emailInvite') }}
          </el-button>
          <!--download-->
          <el-button
            v-show="filterStatus(scope.row)"
            size="small"
            @click="handleDownloadConsent(scope.row)"
          >
            {{ $t('table.downloadConsent') }}
          </el-button>
          <el-button
            v-show="filterStatus(scope.row)"
            size="small"
            @click="handleCheckAnswer(scope.row)"
          >
            {{ $t('table.checkAnswer') }}
          </el-button>
          <!--EPIC-->
          <el-button
            v-show="filterStatus(scope.row)"
            size="small"
            @click="handleEpic(scope.row)"
          >
            {{ $t('table.EPIC') }}
          </el-button>
          <!--ERAP-->
          <el-button
            v-show="filterStatus(scope.row)"
            size="small"
            @click="handleErap(scope.row)"
          >
            {{ $t('table.ERAP') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--footer-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <!--add dialog-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left: 50px;">
        <el-form-item :label="$t('table.mrn')" prop="mrn">
          <el-input v-model="temp.mrn" :disabled="mrnInputDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('table.first_name')" prop="first_name">
          <el-input v-model="temp.first_name" :disabled="mrnInputDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('table.last_name')" prop="last_name">
          <el-input v-model="temp.last_name" :disabled="mrnInputDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <div v-if="hasConsented" id="already-consented-container" class="already-consented">
          <p v-show="!consentValidate" style="color: red;">
            Please enter consent name and consent date.
          </p>
          <el-form-item :label="$t('table.consent_name')" prop="consent_name">
            <el-input v-model="temp.consent_name" :disabled="mrnInputDisabled"/>
          </el-form-item>
          <el-form-item :label="$t('table.consent_date')" prop="consent_date">
            <el-date-picker v-model="temp.consent_date" type="datetime" placeholder="Select date and time" :disabled="mrnInputDisabled"/>
          </el-form-item>
          <el-form-item :label="$t('table.withdraw_date')" prop="withdraw_date">
            <el-date-picker v-model="temp.withdraw_date" type="datetime" placeholder="Select date and time"/>
          </el-form-item>
          <el-form-item :label="$t('table.upload_pdf')" prop="upload_pdf">
            <input id="pdf-upload" ref="pdfFileInput" :disabled="mrnInputDisabled" type="file" accept=".pdf" @change="uploadPDF($event)">
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!--email dialog-->
    <el-dialog :title="$t('table.sendTo')" :visible.sync="emailFormVisible">
      <el-form ref="emailForm" :model="emailTemp" label-position="left" label-width="120px" style="width: 400px; margin-left: 50px;">
        <el-form-item
          :label="$t('table.email')"
          :rules="[{ type: 'email', required: true, message: 'email address is not valid', trigger: 'change' }]"
          prop="email"
        >
          <el-input v-model="emailTemp.email"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emailFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="createEmailInvite()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!--EPIC dialog-->
    <el-dialog :title="$t('table.EPIC')" :visible.sync="epicFormVisible">
      <el-form ref="epicForm" :model="epicTemp" label-position="left" label-width="120px" style="width: 400px; margin-left: 50px;">
        <el-form-item :label="$t('table.mrn')" prop="mrn">
          <el-input v-model="epicTemp.mrn" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.first_name')" :rules="[{ required: true, message: 'First name is required', trigger: 'change' }]" prop="first_name">
          <el-input v-model="epicTemp.first_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.last_name')" :rules="[{ required: true, message: 'Last name is required', trigger: 'change' }]" prop="last_name">
          <el-input v-model="epicTemp.last_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.dob')" :rules="[{ required: true, message: 'DOB is required', trigger: 'change' }]" prop="dob">
          <el-date-picker v-model="epicTemp.dob" type="date" placeholder="Select date"/>
        </el-form-item>
        <el-form-item :label="$t('table.gender')" :rules="[{ required: true, message: 'Gender is required', trigger: 'change' }]" prop="gender">
          <el-select v-model="epicTemp.gender" class="filter-item" placeholder="Please select">
            <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="epicFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="epicSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!--ERAP dialog-->
    <el-dialog :title="$t('table.ERAP')" :visible.sync="erapFormVisible">
      <el-form ref="erapForm" :model="erapTemp" label-position="left" label-width="120px" style="width: 400px; margin-left: 50px;">
        <el-form-item :label="$t('table.mrn')" prop="mrn">
          <el-input v-model="erapTemp.mrn" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.first_name')" :rules="[{ required: true, message: 'First name is required', trigger: 'change' }]" prop="first_name">
          <el-input v-model="erapTemp.first_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.last_name')" :rules="[{ required: true, message: 'Last name is required', trigger: 'change' }]" prop="last_name">
          <el-input v-model="erapTemp.last_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.dob')" :rules="[{ required: true, message: 'DOB is required', trigger: 'change' }]" prop="dob">
          <el-date-picker v-model="erapTemp.dob" type="date" placeholder="Select date"/>
        </el-form-item>
        <el-form-item :label="$t('table.gender')" :rules="[{ required: true, message: 'Gender is required', trigger: 'change' }]" prop="gender">
          <el-select v-model="erapTemp.gender" class="filter-item" placeholder="Please select">
            <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="erapFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="erapSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog id="answer-modal" :title="$t('table.checkAnswer')" :visible.sync="answerDialogVisible" width="80%">
      <div>
        <div v-show="noAnswerVisible">
          <p>There is no answers for required questions</p>
        </div>
        <div v-show="!noAnswerVisible" id="answer-content">
          <p>Project Title: <strong>{{ answers.project_title }}</strong></p>
          <p>Patient MRN: <strong>{{ answers.patient_mrn }}</strong></p>
          <ol>
            <li v-for="answer in answers.data" :key="answer.quiz_num">
              <div>{{ answer.quiz_content }}</div>
              <div><strong>{{ answer.option_content }}</strong></div>
            </li>
          </ol>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="answerDialogVisible = false">
          {{ $t('tagsView.close') }}
        </el-button>
        <el-button v-show="!noAnswerVisible" type="primary" @click="print()">
          {{ $t('table.print') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, postPatient, postPatientNoForm, putPatient, fetchRedcapUpdate, sendEmailInvite, fetchConsentForm, fetchConsentFormPaper, fetchAnswers, putEpic, putErap } from '@/api/patient'
import { saveAs } from 'file-saver'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'Started Interactive Review': 'primary',
        'Selected Consent Now': 'primary',
        'Read and Agreed to Terms and Conditions': 'primary',
        'Submitted Consent Information': 'primary',
        'Entered E-Questionnaire': 'primary',
        'Submitted E-Questionnaire': 'warning',
        'Not Eligible - Consented': 'info',
        'Eligible': 'success',
        'Eligible - No existing eRAP donor ID': 'success',
        'Eligible - Existing eRAP donor ID; not enrolled': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      total: 0,
      list: [],
      fullList: [],
      listLoading: true,
      consentValidate: true,
      listQuery: {
        page: 1,
        limit: 20,
        mrn: undefined,
        status: undefined,
        project: undefined,
        sort: '-updated',
        all: true
      },
      sortOptions: [
        { label: 'MRN Ascending', key: '+id' },
        { label: 'MRN Descending', key: '-id' },
        { label: 'Name Ascending', key: '+name' },
        { label: 'Name Descending', key: '-name' },
        { label: 'Consent Name Ascending', key: '+consent_name' },
        { label: 'Consent Name Descending', key: '-consent_name' },
        { label: 'Created Date Ascending', key: '+created' },
        { label: 'Created Date Descending', key: '-created' },
        { label: 'Updated Date Ascending', key: '+updated' },
        { label: 'Updated Date Descending', key: '-updated' },
        { label: 'Consent Ascending', key: '+consented' },
        { label: 'Consent Descending', key: '-consented' },
        { label: 'Consent Type Ascending', key: '+consentType' },
        { label: 'Consent Type Descending', key: '-consentType' },
        { label: 'Consent Date Ascending', key: '+consentDate' },
        { label: 'Consent Date Descending', key: '-consentDate' },
        { label: 'Withdrawn Ascending', key: '+withdrawn' },
        { label: 'Withdrawn Descending', key: '-withdrawn' },
        { label: 'Withdraw Date Ascending', key: '+withdrawDate' },
        { label: 'Withdraw Date Descending', key: '-withdrawDate' }
      ],
      statusOptions: ['Started Interactive Review', 'Selected Consent Now', 'Read and Agreed to Terms and Conditions', 'Submitted Consent Information', 'Entered E-Questionnaire', 'Submitted E-Questionnaire', 'Not Eligible - Consented', 'Eligible'],
      genderOptions: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }],
      downloadStatusOptions: ['Submitted Consent Information', 'Entered E-Questionnaire', 'Submitted E-Questionnaire', 'Not Eligible - Consented'],
      // dialog form
      dialogFormVisible: false,
      emailFormVisible: false,
      epicFormVisible: false,
      erapFormVisible: false,
      mrnInputDisabled: false,
      answerDialogVisible: false,
      noAnswerVisible: true,
      answers: {
        patient_mrn: '',
        project_title: '',
        data: []
      },
      // Differentiate between paper and electronic
      hasConsented: false,
      // value
      temp: {
        mrn: '',
        first_name: null,
        last_name: null,
        consent_name: null,
        email: null,
        status: 'Eligible',
        consent_date: null,
        withdraw_date: null,
        consent_type: '',
        project: '',
        file_upload: null
      },
      emailTemp: {
        mrn: '',
        email: '',
        project: ''
      },
      epicTemp: {
        first_name: null,
        last_name: null,
        dob: null,
        gender: null,
        project: null,
        mrn: null
      },
      erapTemp: {
        first_name: null,
        last_name: null,
        dob: null,
        gender: null,
        project: null,
        mrn: null
      },
      // title
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // validate
      rules: {
        mrn: [{ required: true, message: 'mrn is required', trigger: 'change' }],
        email: [{ type: 'email', required: false, message: 'email address is not valid', trigger: 'change' }],
        consent_name: [{ required: true, message: 'Consent name is required', trigger: 'change' }],
        consent_date: [{ required: true, message: 'Consent date is required', trigger: 'change' }]
      },
      // export
      downloadLoading: false
    }
  },
  computed: {
    project() {
      return this.$store.getters.project
    }
  },
  mounted() {
    if (this.$store.getters.project) {
      this.getList()
    }
    this.$store.watch(
      () => this.$store.getters.project,
      () => {
        this.$nextTick(() => {
          this.getList()
        })
      })
    setInterval(() => {
      this.$nextTick(() => {
        this.getList()
      })
    }, 60000)
    setInterval(() => {
      this.$nextTick(() => {
        fetchRedcapUpdate()
      })
    }, 60000)
  },
  methods: {
    // Function to upload PDF data to be sent to backend
    uploadPDF(event) {
      this.temp.file_upload = event.target.files[0]
    },
    // Function to download blank batch sheet
    batchDownload() {
      var csv = this.$papa.unparse([
        ['MRN (required)', 'First Name', 'Last Name', 'Email (required)']
      ])
      const csvData = new Blob([csv])
      var link = document.createElement('a')
      link.href = URL.createObjectURL(csvData, { type: 'text/plain' })
      link.download = 'batchfile.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // Function to route HTML input file for batch upload through the batch button
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    // Batch upload function
    async batchUpload(event) {
      // Check if a valid file has been selected, if not display an error
      if (!(event.target && event.target.files && event.target.files[0])) {
        this.$message({
          message: 'No file found',
          type: 'error'
        })
        return
      }
      try {
        // Parse the csv file
        const data = await this.parseCSV(event.target.files[0])
        // Perform function on each patient from csv
        for (const patient of data) {
          // If the patient has no mrn listed (blank) then skip
          if (patient['MRN (required)'] == null) {
            continue
          }
          // Check if email is valid
          if (validEmail(patient['Email (required)'])) {
            // Create valid patient data json to send to backend
            const patientData = {
              consent_type: '',
              email: patient['Email (required)'],
              first_name: patient['First Name'],
              last_name: patient['Last Name'],
              mrn: patient['MRN (required)'],
              project: this.$store.getters.project,
              status: 'Eligible'
            }
            // Post the patient to the backend
            await postPatientNoForm(patientData).then(() => {
              // Create valid patient data json to send to backend for email
              const patientEmailData = {
                completed: false,
                consent_id: null,
                consented: false,
                email: patient['Email (required)'],
                first_name: patient['First Name'],
                is_erap: false,
                last_name: patient['Last Name'],
                mrn: patient['MRN (required)'],
                name: patient['First Name'] + ' ' + patient['Last Name'],
                project: this.$store.getters.project,
                status: 'Eligible',
                withdraw_date: '',
                withdrawn: false
              }
              // Send email invite request to backend
              sendEmailInvite(patientEmailData)
                .then(() => {
                  // Success message for each patient
                  this.$notify({
                    title: 'Success',
                    message: 'Successfully Created Patient and Email Sent for MRN:' + patientData.mrn,
                    type: 'success',
                    duration: 2000
                  })
                })
            })
            // If email is not valid display error
          } else {
            this.$message({
              message: 'Invalid email for MRN: ' + patient['Email (required)'],
              type: 'error'
            })
          }
        }
        // If csv processing didn't work display error
      } catch (err) {
        this.$message({
          message: 'Could not process csv file!',
          type: 'error'
        })
      }

      // Regex function to check if email is valid
      function validEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
      }
    },
    // Function to parse a csv file using papaparse library
    parseCSV(file) {
      return new Promise((resolve, reject) => {
        this.$papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: function(results) {
            resolve(results.data)
          },
          error(err, file) {
            reject(err)
          }
        })
      })
    },
    getConsentType(t) {
      switch (t) {
        case 'Paper':
          return this.$t('table.paper_consent')
        case 'Electronic':
          return this.$t('table.electronic_consent')
      }
    },
    print() {
      const modal = document.getElementById('answer-content')
      const cloned = modal.cloneNode(true)
      let $printSection = document.getElementById('printSection')
      if (!$printSection) {
        $printSection = document.createElement('div')
        $printSection.id = 'printSection'
        document.body.appendChild($printSection)
      }
      $printSection.innerHTML = ''
      $printSection.appendChild(cloned)
      window.print()
    },
    getList() {
      this.listLoading = true
      this.listQuery.project = this.$store.getters.project
      fetchList(this.listQuery).then(response => {
        this.fullList = response.data.items
        this.list = response.data.items.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // filter
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // sort table
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    // filter for download consent
    filterStatus(row) {
      return row.consented
    },
    // clear dialog content
    resetTemp() {
      this.consentValidate = true
      this.temp = {
        mrn: '',
        first_name: null,
        last_name: null,
        email: null,
        status: 'Eligible',
        consent_type: '',
        project: '',
        file_upload: null
      }
    },
    resetEmailTemp() {
      this.emailTemp = {
        mrn: '',
        email: '',
        project: ''
      }
    },
    // Reset the EPIC form
    resetEPICTemp() {
      this.epicTemp = {
        first_name: null,
        last_name: null,
        dob: null,
        gender: null,
        project: null,
        mrn: null
      }
    },
    // Reset the ERAP form
    resetERAPTemp() {
      this.erapTemp = {
        first_name: null,
        last_name: null,
        dob: null,
        gender: null,
        project: null,
        mrn: null
      }
    },
    resetAnswers() {
      this.noAnswerVisible = true
      this.answers = {
        patient_mrn: '',
        project_title: '',
        data: []
      }
    },
    // epic dialog
    handleEpic(row) {
      this.resetEPICTemp()
      this.epicTemp.mrn = row.mrn
      this.epicTemp.first_name = row.first_name
      this.epicTemp.last_name = row.last_name
      this.epicFormVisible = true
      this.$nextTick(() => {
        this.$refs['epicForm'].clearValidate()
      })
    },
    // submit EPIC data for patient
    epicSubmit() {
      this.$refs['epicForm'].validate((valid) => {
        if (valid && this.epicTemp.gender) {
          this.epicTemp.project = this.$store.getters.project
          putEpic(this.epicTemp).then(() => {
            this.epicFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Successfully Updated EPIC status',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // erap dialog
    handleErap(row) {
      this.resetERAPTemp()
      this.erapTemp.mrn = row.mrn
      this.erapTemp.first_name = row.first_name
      this.erapTemp.last_name = row.last_name
      this.erapFormVisible = true
      this.$nextTick(() => {
        this.$refs['erapForm'].clearValidate()
      })
    },
    // submit ERAP data for patient
    erapSubmit() {
      this.$refs['erapForm'].validate((valid) => {
        if (valid && this.erapTemp.gender) {
          this.erapTemp.project = this.$store.getters.project
          putErap(this.erapTemp).then(() => {
            this.erapFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Successfully Updated ERAP status',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // open add dialog
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.mrnInputDisabled = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // open edit dialog
    handleUpdate(row) {
      this.consentValidate = true
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.mrnInputDisabled = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // open send email invite dialog
    handleEmailInvite(row) {
      this.resetEmailTemp()
      this.emailTemp = Object.assign({}, row) // copy obj
      this.emailFormVisible = true
      this.$nextTick(() => {
        this.$refs['emailForm'].clearValidate()
      })
    },
    // open check answer dialog
    handleCheckAnswer(row) {
      this.resetAnswers()
      fetchAnswers({
        project: row.project,
        mrn: row.mrn
      }).then((response) => {
        this.answers.patient_mrn = row.mrn
        this.answers.project_title = this.$store.getters.projectTitle
        this.noAnswerVisible = response.data.length === 0
        this.answers.data = response.data
      }).catch(() => {
        this.$message({
          message: 'Response not found',
          type: 'error'
        })
      })
      this.answerDialogVisible = true
    },
    // download consent form
    handleDownloadConsent(row) {
      // If paper check if pdf is on server and download
      if (row.consent_type === 'Paper') {
        fetchConsentFormPaper({
          project: row.project,
          mrn: row.mrn
        }).then((response) => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          saveAs(blob, `${row.mrn}.pdf`)
        }).catch(() => {
          this.$message({
            message: 'The requested consent was not found',
            type: 'error'
          })
        })
      // If not, call api to generate form from db and download
      } else {
        fetchConsentForm({
          project: row.project,
          mrn: row.mrn
        }).then((response) => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          saveAs(blob, `${row.mrn}.pdf`)
        }).catch(() => {
          this.$message({
            message: 'The requested consent was not found',
            type: 'error'
          })
        })
      }
    },
    // add new record
    createData() {
      this.consentValidate = (!this.temp.consent_name && !this.temp.consent_date) || (this.temp.consent_name && this.temp.consent_date)
      this.$refs['dataForm'].validate((valid) => {
        if (valid && this.consentValidate) {
          // Place all of our data into a FormData object
          var formData = new FormData()
          // If we have a consent name and date it must be a paper consent
          if (this.temp.consent_name && this.temp.consent_date) {
            this.temp.consent_type = 'Paper'
            // If it is a paper consent add in the consenting data to our formData object
            formData.append('consent_type', this.temp.consent_type)
            formData.append('consent_name', this.temp.consent_name)
            formData.append('consent_date', this.temp.consent_date)
            // If there is a withdraw date add it to the formData object
            if (this.temp.withdraw_date) {
              formData.append('withdraw_date', this.temp.withdraw_date)
            }
            // If there is a pdf upload attach it to our formData
            if (this.temp.file_upload) {
              formData.append('file_upload', this.temp.file_upload)
            }
          }
          // Add all data that would apply to both types of consents
          this.temp.project = this.$store.getters.project
          formData.append('mrn', this.temp.mrn)
          if (this.temp.first_name) {
            formData.append('first_name', this.temp.first_name)
          } else {
            formData.append('first_name', '')
          }
          if (this.temp.last_name) {
            formData.append('last_name', this.temp.last_name)
          } else {
            formData.append('last_name', '')
          }
          if (this.temp.email) {
            formData.append('email', this.temp.email)
          } else {
            formData.append('email', '')
          }
          formData.append('status', this.temp.status)
          formData.append('project', this.temp.project)
          postPatient(formData).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Successfully Created',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // update record
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.project = this.$store.getters.project
          putPatient(this.temp).then(() => {
            for (const v of this.list) {
              if (v.mrn === this.temp.mrn) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Successfully Updated',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // send email
    createEmailInvite() {
      this.$refs['emailForm'].validate((valid) => {
        this.emailTemp.project = this.$store.getters.project
        if (valid) {
          sendEmailInvite(this.emailTemp)
            .then(() => {
              this.emailFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Successfully Sent',
                type: 'success',
                duration: 2000
              })
            })
        }
      })
    },
    // export to excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['MRN', 'First name', 'Last name', 'Consent Name', 'Email', 'Status', 'Consented', 'Consent Type', 'Consented at', 'Withdrawn', 'Withdrew at', 'Created at', 'Updated at']
        const filterVal = ['mrn', 'first_name', 'last_name', 'consent_name', 'email', 'status', 'consented', 'consent_type', 'consent_date', 'withdrawn', 'withdraw_date', 'created_at', 'updated_at']
        const data = this.formatJson(filterVal, this.fullList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'patient-list'
        })
        this.downloadLoading = false
      })
    },
    // export to excel sub
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'created_at' || j === 'updated_at') {
          return new Date(v[j]).toLocaleString('en-US', { timeZone: 'America/New_York' })
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss">
#file-upload {
    display: block;
    visibility: hidden;
    width: 0;
    height: 0;
}
#answer-modal p {
  white-space: pre-wrap;
  font-weight: 400;
  font-style: normal;
  font-size: 21px;
  line-height: 1.58;
  margin-left: 30px;
  letter-spacing: -0.003em;
}

#answer-modal ol {
  margin-bottom: 30px;
  word-break: break-word;
}

#answer-modal li {
  --x-height-multiplier: 0.375;
  --baseline-multiplier: 0.17;

  font-weight: 400;
  font-style: normal;
  font-size: 21px;
  line-height: 1.58;
  letter-spacing: -0.003em;
  margin-bottom: 14px;
}

@media screen {
  #printSection {
    display: none;
  }
}

@media print {
  body * {
    visibility: hidden;
  }

  #printSection,
  #printSection * {
    visibility: visible;
  }

  #printSection {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
