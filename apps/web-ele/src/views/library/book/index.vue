<template>
  <div class="p-4">
    <ElCard class="mb-4">
      <div class="flex justify-between items-center">
        <ElForm :inline="true" :model="searchForm" class="flex-1">
          <ElFormItem label="书名">
            <ElInput v-model="searchForm.name" placeholder="请输入书名" />
          </ElFormItem>
          <ElFormItem label="作者">
            <ElInput v-model="searchForm.author" placeholder="请输入作者" />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="handleSearch">搜索</ElButton>
          </ElFormItem>
        </ElForm>
        <ElButton type="primary" @click="handleAdd">新增图书</ElButton>
      </div>
    </ElCard>

    <ElCard>
      <ElTable :data="tableData" border style="width: 100%">
        <ElTableColumn prop="id" label="ID" width="80" />
        <ElTableColumn prop="name" label="书名" />
        <ElTableColumn prop="author" label="作者" />
        <ElTableColumn prop="publisher" label="出版社" />
        <ElTableColumn prop="isbn" label="ISBN" />
        <ElTableColumn prop="price" label="价格" />
        <ElTableColumn prop="stock" label="库存" />
        <!-- <ElTableColumn prop="status" label="状态">
          <template #default="scope">
            <ElTag :type="scope.row.status === '可借' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </ElTag>
          </template>
        </ElTableColumn> -->
        <!-- <ElTableColumn fixed="right" label="操作" width="180">
          <template #default="scope">
            <ElButton type="primary" link @click="handleEdit(scope.row)">编辑</ElButton>
            <ElButton type="danger" link @click="handleDelete(scope.row)">删除</ElButton>
          </template>
        </ElTableColumn> -->
      </ElTable>

      <div class="flex justify-center mt-4">
        <ElPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </ElCard>

    <ElDialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增图书' : '编辑图书'"
      width="500px"
    >
      <ElForm
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="mt-4"
      >
        <ElFormItem label="书名" prop="name">
          <ElInput v-model="form.name" />
        </ElFormItem>
        <ElFormItem label="作者" prop="author">
          <ElInput v-model="form.author" />
        </ElFormItem>
        <ElFormItem label="出版社" prop="publisher">
          <ElInput v-model="form.publisher" />
        </ElFormItem>
        <ElFormItem label="ISBN" prop="isbn">
          <ElInput v-model="form.isbn" />
        </ElFormItem>
        <ElFormItem label="价格" prop="price">
          <ElInputNumber v-model="form.price" :precision="2" :step="0.1" />
        </ElFormItem>
        <ElFormItem label="库存" prop="stock">
          <ElInputNumber v-model="form.stock" :min="0" :step="1" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleSubmit">确定</ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({
  name: '',
  author: '',
})

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref<FormInstance>()

const form = reactive({
  id: '',
  name: '',
  author: '',
  publisher: '',
  isbn: '',
  price: 0,
  stock: 0,
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入书名', trigger: 'blur' },
  ],
  author: [
    { required: true, message: '请输入作者', trigger: 'blur' },
  ],
  publisher: [
    { required: true, message: '请输入出版社', trigger: 'blur' },
  ],
  isbn: [
    { required: true, message: '请输入ISBN', trigger: 'blur' },
    { pattern: /^[0-9-]{10,17}$/, message: '请输入正确的ISBN', trigger: 'blur' },
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存必须大于等于0', trigger: 'blur' },
  ],
})

const handleSearch = () => {
  // TODO: 实现搜索功能
  loadData()
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  form.id = ''
  form.name = ''
  form.author = ''
  form.publisher = ''
  form.isbn = ''
  form.price = 0
  form.stock = 0
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该图书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // TODO: 实现删除功能
    ElMessage.success('删除成功')
    loadData()
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // TODO: 实现提交功能
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadData()
}

const loadData = () => {
  // TODO: 实现数据加载功能
  // // 模拟数据
  // tableData.value = [
  //   {
  //     id: '1',
  //     name: '深入理解计算机系统',
  //     author: 'Randal E. Bryant',
  //     publisher: '机械工业出版社',
  //     isbn: '9787111544937',
  //     price: 139,
  //     stock: 10,
  //     status: '可借',
  //   },
  //   // 更多数据...
  // ]
  // total.value = 100
}

// 初始加载
loadData()
</script>
