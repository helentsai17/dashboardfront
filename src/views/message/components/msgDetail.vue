<template>
  <div class="components-container">
    <div class="info-container">
      <el-row>
        <el-col :span="10">
          <el-card>
            <div style="padding: 14px;">
              {{ msg.content }}
            </div>
            <div style="padding: 14px;">
              <span style="font-size: 14px;">{{ msg.name }}</span>
              <div class="clearfix">
                <time class="time">{{ new Date(msg.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) }}</time>
                <el-button type="text" class="button">
                  {{ msg.email }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-card v-for="item in reply" :key="item.id">
            <div style="padding: 14px;">
              {{ item.content }}
            </div>
            <div style="padding: 14px;">
              <span style="font-size: 14px;">{{ item.username }}</span>
              <div class="clearfix">
                <time class="time">{{ new Date(item.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) }}</time>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="editor-container">
      <markdown-editor
        ref="markdownEditor"
        v-model="content"
        :options="{hideModeSwitch:true,previewStyle:'tab'}"
        :language="language"
        height="300px"
      />
    </div>
    <div>
      <el-button type="primary" @click="submitReply">
        {{ $t('table.send') }}
      </el-button>
      <el-button type="danger" @click="discardReply">
        {{ $t('table.discard') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchMsg, fetchReplyList, putReply } from '@/api/message'
import { Message } from 'element-ui'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'MarkdownMessage',
  components: { MarkdownEditor },
  data() {
    return {
      msgId: '',
      msg: {
        name: '',
        email: '',
        content: '',
        status: '',
        created_at: null,
        updated_at: null
      },
      content: '',
      reply: [],
      languageTypeList: {
        'en': 'en_US',
        'zh': 'zh_CN',
        'es': 'es_ES'
      }
    }
  },
  computed: {
    language() {
      return this.languageTypeList[this.$store.getters.language]
    }
  },
  created() {
    this.msgId = this.$route.params.id
    this.getMsg()
    this.getMsgReplies()
  },
  methods: {
    getMsg() {
      fetchMsg(this.msgId).then(response => {
        this.msg = response.data
      })
    },
    getMsgReplies() {
      fetchReplyList(this.msgId).then(response => {
        this.reply = response.data
      })
    },
    submitReply() {
      const data = {
        msgId: this.msgId,
        content: this.content
      }
      putReply(data).then(() => {
        Message({
          message: 'Successfully replied.',
          type: 'success',
          duration: 2000
        })
        this.$router.push('/message')
      }).catch((e) => {
        console.log(e)
        Message({
          message: 'Something went wrong, please contact technical support.',
          type: 'error',
          duration: 5000
        })
      })
    },
    discardReply() {
      this.$confirm('You will lose Unsaved progress. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$router.push('/message')
      })
    }
  }
}
</script>

<style scoped>
.info-container {
  margin-bottom: 30px;
}

.editor-container {
  margin-bottom: 30px;
}

.time {
  font-size: 13px;
  color: #999;
}

.button {
  padding: 0;
  float: right;
}

.clearfix::before,
.clearfix::after {
  display: table;
  content: "";
}

.clearfix::after {
  clear: both;
}
</style>
