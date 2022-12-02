<template>
  <msg-detail :is-edit="true"/>
</template>

<script>
import MsgDetail from './components/msgDetail'

export default {
  name: 'EditForm',
  components: { MsgDetail }
}
</script>

