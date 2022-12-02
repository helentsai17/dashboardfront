<!--suppress CheckEmptyScriptTag -->
<template>
  <div class="app-container">
    <!--start btn-->
    <el-row v-if="!formVisible">
      <div class="component-item">
        <el-button v-waves type="primary" @click="formVisible=true">
          {{ `${$t('form.add')} ${$t('form.new')} ${$t('form.project')}` }}
        </el-button>
      </div>
    </el-row>

    <!--project form-->
    <el-row v-if="formVisible">
      <el-form ref="projectForm" label-position="left" :model="project" :inline-message="true" @submit.native.prevent>
        <!--project title-->
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="0" prop="title" :rules="rules.requiredRule">
              <md-input v-model="project.title" :placeholder="$t('form.pleaseEnter')">
                {{ `${$t('form.project')}` }}
              </md-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <div style="padding-top: 35px;">
              <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" icon="el-icon-finished" @click="submitForm('projectForm')">
                {{ $t('form.submit') }}
              </el-button>
              <el-button type="danger" icon="el-icon-refresh-right" @click="resetProject">
                {{ $t('form.reset') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
        <!--education-->
        <el-divider content-position="left">
          {{ $t('form.education') }}
        </el-divider>
        <el-row>
          <!--sections container-->
          <el-col :span="24">
            <el-row v-for="(section, sIndex) in project.sections" :key="section.key">
              <!--section title-->
              <el-row>
                <el-col :span="20">
                  <el-form-item
                    :label="`${$t('form.section')} ${section.num} ${$t('form.title')}`"
                    :prop="`sections.${sIndex}.title`"
                    :rules="rules.requiredRule"
                    label-width="120px"
                  >
                    <el-input v-model="section.title"/>
                  </el-form-item>
                </el-col>
                <el-col :span="3" :offset="1">
                  <i class="el-icon-upload" @click="handleUploadMedia()"/>
                  <i class="el-icon-delete" @click="removeSection(project, section)"/>
                </el-col>
              </el-row>
              <!--tips container-->
              <el-row v-for="(tip, tIndex) in section.tips" :key="tip.key">
                <el-col :span="24" style="padding-left: 120px;">
                  <!--tip content-->
                  <el-row>
                    <el-col :span="20">
                      <el-form-item
                        :label="`${$t('form.tip')} ${tip.num} ${$t('form.content')}`"
                        :prop="`sections.${sIndex}.tips.${tIndex}.content`"
                        :rules="rules.requiredRule"
                        label-width="120px"
                      >
                        <el-input
                          v-model="tip.content"
                          type="textarea"
                          :autosize="{ minRows: 1, maxRows: 4}"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3" :offset="1">
                      <i class="el-icon-upload" @click="handleUploadMedia()"/>
                      <i class="el-icon-delete" @click="removeTip(section, tip)"/>
                    </el-col>
                  </el-row>
                  <!--quizzes container-->
                  <el-row v-for="(quiz, qIndex) in tip.quizzes" :key="quiz.key">
                    <el-col :span="24" style="padding-left: 120px;">
                      <!--quiz content-->
                      <el-row>
                        <el-col :span="20">
                          <el-form-item
                            :label="`${$t('form.quiz')} ${quiz.num} ${$t('form.body')}`"
                            :prop="`sections.${sIndex}.tips.${tIndex}.quizzes.${qIndex}.content`"
                            :rules="rules.requiredRule"
                            label-width="120px"
                          >
                            <el-input v-model="quiz.content"/>
                          </el-form-item>
                          <el-form-item
                            :prop="`sections.${sIndex}.tips.${tIndex}.quizzes.${qIndex}.valid`"
                            :rules="rules.quizCorrectRule"
                            label-width="120px"
                          >
                            <el-switch v-model="quiz.valid" style="display: none;"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="3" :offset="1">
                          <i class="el-icon-upload" @click="handleUploadMedia()"/>
                          <i class="el-icon-delete" @click="removeQuiz(tip, quiz)"/>
                        </el-col>
                      </el-row>
                      <!--options container-->
                      <el-row v-for="(option, oIndex) in quiz.options" :key="option.key">
                        <el-col :span="24" style="padding-left: 120px;">
                          <!--option-->
                          <el-row>
                            <!--option content-->
                            <el-col :span="16">
                              <el-form-item
                                :label="`${$t('form.option')} ${$t('form.body')}`"
                                :prop="`sections.${sIndex}.tips.${tIndex}.quizzes.${qIndex}.options.${oIndex}.content`"
                                :rules="rules.requiredRule"
                                label-width="120px"
                              >
                                <el-input v-model="option.content"/>
                              </el-form-item>
                            </el-col>
                            <!--option correctness-->
                            <el-col :span="3" :offset="1">
                              <el-switch
                                v-model="option.correctness"
                                active-color="#13ce66"
                                :active-text="$t('form.correct')"
                                style="margin-top: 10px;"
                                @change="onOptionChange(quiz, option)"
                              />
                            </el-col>
                            <el-col :span="3" :offset="1">
                              <i class="el-icon-delete" @click="removeOption(quiz, option)"/>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                      <!--btns-->
                      <el-row class="btn-grp">
                        <el-col style="padding-left: 120px;">
                          <el-button @click="addOption(quiz)">
                            {{ `${$t('form.new')} ${$t('form.option')}` }}
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <!--btns-->
                  <el-row class="btn-grp">
                    <el-col style="padding-left: 120px;">
                      <el-button @click="addQuiz(tip)">
                        {{ `${$t('form.new')} ${$t('form.quiz')}` }}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!--btns-->
              <el-row class="btn-grp">
                <el-col style="padding-left: 120px;">
                  <el-button @click="addTip(section)">
                    {{ `${$t('form.new')} ${$t('form.tip')}` }}
                  </el-button>
                </el-col>
              </el-row>
            </el-row>
            <!--btns-->
            <el-row class="btn-grp">
              <el-col>
                <el-button @click="addSection(project)">
                  {{ `${$t('form.new')} ${$t('form.section')}` }}
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--consent-->
        <el-divider content-position="left">
          {{ $t('form.consent') }}
        </el-divider>
        <el-row>
          <!--protocols container-->
          <el-col :span="24">
            <el-row v-for="(protocol, pIndex) in project.protocols" :key="protocol.key">
              <!--protocol title-->
              <el-row>
                <el-col :span="20">
                  <el-form-item
                    :label="`${$t('form.protocol')} ${protocol.num} ${$t('form.title')}`"
                    :prop="`protocols.${pIndex}.title`"
                    :rules="rules.requiredRule"
                    label-width="160px"
                  >
                    <el-input v-model="protocol.title"/>
                  </el-form-item>
                </el-col>
                <el-col :span="3" :offset="1">
                  <i class="el-icon-upload" @click="handleUploadMedia()"/>
                  <i class="el-icon-delete" @click="removeProtocol(project, protocol)"/>
                </el-col>
              </el-row>
              <!--protocol short content-->
              <el-row>
                <el-col :span="20">
                  <el-form-item
                    :label="`${$t('form.protocol')} ${protocol.num} ${$t('form.content')}`"
                    :prop="`protocols.${pIndex}.shortContent`"
                    :rules="rules.requiredRule"
                    label-width="160px"
                  >
                    <el-input
                      v-model="protocol.shortContent"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 5}"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="padding-left: 10px;">
                  <el-checkbox v-model="protocol.hasLong">
                    {{ $t('form.hasLong') }}
                  </el-checkbox>
                </el-col>
              </el-row>
              <!--protocol long content-->
              <el-row v-if="protocol.hasLong">
                <el-col :span="20">
                  <el-form-item
                    :label="`${$t('form.protocol')} ${protocol.num} ${$t('form.full')} ${$t('form.content')}`"
                    :prop="`protocols.${pIndex}.longContent`"
                    :rules="rules.requiredRule"
                    label-width="160px"
                  >
                    <el-input
                      v-model="protocol.longContent"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 5}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!--quizzes container-->
              <el-row v-for="(quiz, qIndex) in protocol.quizzes" :key="quiz.key">
                <el-col :span="24" style="padding-left: 160px;">
                  <!--quiz content-->
                  <el-row>
                    <el-col :span="16">
                      <el-form-item
                        :label="`${$t('form.quiz')} ${quiz.num} ${$t('form.body')}`"
                        :prop="`protocols.${pIndex}.quizzes.${qIndex}.content`"
                        :rules="rules.requiredRule"
                        label-width="245px"
                      >
                        <el-input v-model="quiz.content"/>
                      </el-form-item>
                      <el-form-item
                        :prop="`protocols.${pIndex}.quizzes.${qIndex}.valid`"
                        :rules="rules.quizCorrectRule"
                        label-width="120px"
                      >
                        <el-switch v-model="quiz.valid" style="display: none;"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1" :offset="1">
                      <el-form-item
                        v-if="quiz.required"
                        :label="`${$t('form.protocolQuiz')}`"
                        :prop="`protocols.${pIndex}.quizzes.${qIndex}.type`"
                        label-width="175px"
                      />
                      <el-form-item
                        v-if="!quiz.required"
                        :label="`${$t('form.comprehensionQuiz')}`"
                        :prop="`protocols.${pIndex}.quizzes.${qIndex}.type`"
                        label-width="175px"
                      />
                      <el-switch
                        v-model="quiz.required"
                        :active-text="$t('form.required')"
                        style="margin-top: 10px;"
                        @change="onQuizChange(protocol, quiz)"
                      />
                    </el-col>
                    <el-col :span="2" :offset="2">
                      <i class="el-icon-upload" @click="handleUploadMedia()"/>
                      <i class="el-icon-delete" @click="removeQuiz(protocol, quiz)"/>
                    </el-col>
                  </el-row>
                  <!--options container-->
                  <el-row v-for="(option, oIndex) in quiz.options" :key="option.key">
                    <el-col :span="24" style="padding-left: 120px;">
                      <!--option-->
                      <el-row>
                        <!--option content-->
                        <el-col :span="16">
                          <el-form-item
                            :label="`${$t('form.option')} ${$t('form.body')}`"
                            :prop="`protocols.${pIndex}.quizzes.${qIndex}.options.${oIndex}.content`"
                            :rules="rules.requiredRule"
                            label-width="120px"
                          >
                            <el-input v-model="option.content"/>
                          </el-form-item>
                        </el-col>
                        <!--option correctness-->
                        <el-col :span="4" :offset="1">
                          <el-switch
                            v-model="option.correctness"
                            :disabled="quiz.required"
                            active-color="#13ce66"
                            :active-text="$t('form.correct')"
                            style="margin-top: 10px;"
                            @change="onOptionChange(quiz, option)"
                          />
                        </el-col>
                        <el-col :span="1" :offset="1">
                          <i class="el-icon-delete" @click="removeOption(quiz, option)"/>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <!--btns-->
                  <el-row class="btn-grp">
                    <el-col style="padding-left: 120px;">
                      <el-button @click="addOption(quiz)">
                        {{ `${$t('form.new')} ${$t('form.option')}` }}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!--btns-->
              <el-row class="btn-grp">
                <el-col style="padding-left: 160px;">
                  <el-button @click="addQuiz(protocol)">
                    {{ `${$t('form.new')} ${$t('form.quiz')}` }}
                  </el-button>
                </el-col>
              </el-row>
            </el-row>
            <!--btns-->
            <el-row class="btn-grp">
              <el-col>
                <el-button @click="addProtocol(project)">
                  {{ `${$t('form.new')} ${$t('form.protocol')}` }}
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <!--TODO upload media through frontend-->
    <!--media upload dialog-->
    <el-dialog
      :title="$t('form.mediaUpload')"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div style="width: 360px; margin: auto;">
        <el-upload
          drag
          :limit="1"
          :accept="validMediaTypes.map(t => `.${t}`).join(',')"
          action="http://localhost:3002/api/media/upload"
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">
            {{ $t('form.dragToUpload') }}<em>{{ $t('form.clickToUpload') }}</em>
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { putProject } from '@/api/project'
import MdInput from '@/components/MDinput'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'FormWebCreate',
  components: {
    MdInput
  },
  directives: {
    waves
  },
  data() {
    const validators = {
      quizValidator: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('form.noCorrectAnswer').toString()))
        } else {
          callback()
        }
      }
    }
    return {
      fullscreenLoading: false,
      submitted: false,
      rules: {
        requiredRule: { required: true, message: this.$t('form.requiredField'), trigger: 'blur' },
        quizCorrectRule: { validator: validators.quizValidator, trigger: 'change' }
      },
      project: {
        title: '',
        medium: null,
        protocols: [],
        sections: []
      },
      formVisible: false,
      dialogVisible: false,
      validMediaTypes: ['gif', 'jpg', 'jpeg', 'png', 'mp4', 'mpeg', 'avi', 'wmv', 'mov', 'pdf']
    }
  },
  methods: {
    // reorder nums
    resetNums(list) {
      let i = 1
      list.forEach((li) => {
        li.num = i
        i++
      })
    },
    resetProject() {
      this.project = {
        title: '',
        medium: null,
        protocols: [],
        sections: []
      }
      this.submitted = false
    },
    addSection(project) {
      project.sections.push({
        title: '',
        num: project.sections.length + 1,
        tips: [],
        medium: null
      })
    },
    removeSection(project, section) {
      project.sections.splice(section.num - 1, 1)
      this.resetNums(project.sections)
    },
    addTip(section) {
      section.tips.push({
        content: '',
        num: section.tips.length + 1,
        quizzes: [],
        medium: null
      })
    },
    removeTip(section, tip) {
      section.tips.splice(tip.num - 1, 1)
      this.resetNums(section.tips)
    },
    addProtocol(project) {
      project.protocols.push({
        title: '',
        shortContent: '',
        longContent: '',
        hasLong: false,
        num: project.protocols.length + 1,
        quizzes: [],
        required: false,
        medium: null
      })
    },
    removeProtocol(project, protocol) {
      project.protocols.splice(protocol.num - 1, 1)
      this.resetNums(project.protocols)
    },
    addQuiz(parent) {
      parent.quizzes.push({
        content: '',
        num: parent.quizzes.length + 1,
        options: [],
        valid: false,
        required: false,
        medium: null
      })
    },
    removeQuiz(parent, quiz) {
      parent.quizzes.splice(quiz.num - 1, 1)
      this.resetNums(parent.quizzes)
    },
    onQuizChange(protocol, quiz) {
      if (quiz.required) {
        if (quiz.options.length > 0) {
          quiz.valid = true
          quiz.options.forEach((o) => {
            o.correctness = true
          })
        }
        protocol.required = true
      } else {
        quiz.valid = false
        if (quiz.options.length > 0) {
          quiz.options.forEach((o) => {
            o.correctness = false
          })
        }
        protocol.required = false
        for (const q of protocol.quizzes) {
          if (q.required) {
            protocol.required = true
            break
          }
        }
      }
    },
    addOption(quiz) {
      quiz.options.push({
        content: '',
        num: quiz.options.length + 1,
        correctness: quiz.required
      })
      if (quiz.required) {
        quiz.valid = true
      }
    },
    removeOption(quiz, option) {
      quiz.options.splice(option.num - 1, 1)
      this.resetNums(quiz.options)
      if (quiz.options.length === 0) {
        quiz.valid = false
      }
    },
    onOptionChange(quiz, option) {
      if (option.correctness) {
        quiz.valid = true
      } else {
        quiz.valid = false
        for (const o of quiz.options) {
          if (o.correctness) {
            quiz.valid = true
            break
          }
        }
      }
    },
    handleUploadMedia() {
      this.$notify({
        title: 'Warning',
        message: 'This feature is still under development',
        type: 'warning'
      })
    },
    submitForm(form) {
      if (confirm('Are you sure you want to submit?')) {
        if (this.submitted) {
          this.$notify({
            title: 'Warning',
            message: 'Please do not submit repeatly!',
            type: 'warning'
          })
          return
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true
            putProject(this.project).then(response => {
              this.submitted = true
              this.$notify({
                title: 'Success',
                message: 'The study has been created',
                type: 'success',
                duration: 0
              })
            }).catch(() => {
              this.$notify.error({
                title: 'Timeout',
                message: 'Please try again later',
                duration: 0
              })
            }).finally(() => {
              this.fullscreenLoading = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>

<style>
.el-icon-upload {
  cursor: pointer;
  color: #909399;
  padding-top: 5px;
  margin-right: 10px;
  font-size: 1.5rem;
}

.el-icon-delete {
  cursor: pointer;
  color: #f56c6c;
  padding-top: 5px;
  margin-left: 10px;
  font-size: 1.5rem;
}

.el-form-item {
  margin-bottom: 5px;
}

.btn-grp {
  margin-bottom: 5px;
}
</style>
