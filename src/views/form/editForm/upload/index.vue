<template>
  <div class="app-container">
    <tree-table :default-expand-all="true" :data="data" :columns="columns" border>
      <template slot="scope" slot-scope="{scope}">
        <el-tag>level: {{ scope.row._level }}</el-tag>
        <el-tag>expand: {{ scope.row._expand }}</el-tag>
        <el-tag>select: {{ scope.row._select }}</el-tag>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button type="primary" size="" @click="click(scope)">
          Click
        </el-button>
      </template>
    </tree-table>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'

export default {
  name: 'TreeTableUploadEdit',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          label: 'ID',
          key: 'id',
          expand: true
        },
        {
          label: 'Event',
          key: 'event',
          width: 200,
          align: 'left'
        },
        {
          label: 'Scope',
          key: 'scope'
        },
        {
          label: 'Operation',
          key: 'operation'
        }
      ],
      data: [
        {
          id: 0,
          event: 'Event-0',
          timeLine: 50
        },
        {
          id: 1,
          event: 'Event-1',
          timeLine: 100,
          children: [
            {
              id: 2,
              event: 'Event-2',
              timeLine: 10

            },
            {
              id: 3,
              event: 'Event-3',
              timeLine: 90,
              children: [
                {
                  id: 4,
                  event: 'Event-4',
                  timeLine: 5

                },
                {
                  id: 5,
                  event: 'Event-5',
                  timeLine: 10

                },
                {
                  id: 6,
                  event: 'Event-6',
                  timeLine: 75,

                  children: [
                    {
                      id: 7,
                      event: 'Event-7',
                      timeLine: 50,

                      children: [
                        {
                          id: 71,
                          event: 'Event-7-1',
                          timeLine: 25

                        },
                        {
                          id: 72,
                          event: 'Event-7-2',
                          timeLine: 5

                        },
                        {
                          id: 73,
                          event: 'Event-7-3',
                          timeLine: 20
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: 'Event-8',
                      timeLine: 25
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    click(scope) {
      const row = scope.row
      const message = Object.keys(row)
        .map(i => {
          return `<p>${i}: ${row[i]}</p>`
        })
        .join('')

      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: message,
        type: 'success'
      })
    }
  }
}
</script>
