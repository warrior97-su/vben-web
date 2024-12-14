<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import type { BookForm } from '#/api/core/book';

import { reactive, ref } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';

import { bookApi } from '#/api/core/book';

const searchForm = reactive({
  name: '',
  author: '',
});

const tableData = ref<BookForm[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const dialogVisible = ref(false);
const dialogType = ref('add');
const formRef = ref<FormInstance>();

const form = reactive<BookForm>({
  id: 0,
  name: '',
  author: '',
  publisher: '',
  isbn: '',
  price: 0,
  status: '1',
  borrownum: 0,
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  publisher: [{ required: true, message: '请输入出版社', trigger: 'blur' }],
  isbn: [
    { required: true, message: '请输入ISBN', trigger: 'blur' },
    {
      pattern: /^[0-9-]{10,17}$/,
      message: '请输入正确的ISBN',
      trigger: 'blur',
    },
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存必须大于等于0', trigger: 'blur' },
  ],
});

// 添加loading状态
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    const data = await bookApi.getBookList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      search2: searchForm.name,
    });
    tableData.value = data.records;
    total.value = data.total;
  } catch {
    ElMessage.error('获取图书列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const handleAdd = () => {
  dialogType.value = 'add';
  dialogVisible.value = true;
  form.id = 0;
  form.name = '';
  form.author = '';
  form.publisher = '';
  form.isbn = '';
  form.price = 0;
  form.status = '1';
  form.borrownum = 0;
};

const handleEdit = (row: any) => {
  dialogType.value = 'edit';
  dialogVisible.value = true;
  Object.assign(form, row);
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该图书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await bookApi.deleteBook(row.id);
      ElMessage.success('删除成功');
      loadData();
    } catch {
      ElMessage.error('删除失败');
    }
  });
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await bookApi.addBook(form);
          ElMessage.success('新增成功');
        } else {
          await bookApi.updateBook(form);
          ElMessage.success('编辑成功');
        }
        dialogVisible.value = false;
        loadData();
      } catch {
        ElMessage.error(dialogType.value === 'add' ? '新增失败' : '编辑失败');
      }
    }
  });
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  loadData();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  loadData();
};

// 添加重置函数
const handleReset = () => {
  searchForm.name = '';
  searchForm.author = '';
  currentPage.value = 1;
  loadData();
};

// 初始加载
loadData();
</script>

<template>
  <div class="p-4">
    <ElCard class="mb-4">
      <div class="flex items-center justify-between">
        <ElForm :inline="true" :model="searchForm" class="flex-1">
          <ElFormItem label="书名">
            <ElInput v-model="searchForm.name" placeholder="请输入书名" />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="handleSearch">搜索</ElButton>
            <ElButton @click="handleReset">重置</ElButton>
          </ElFormItem>
        </ElForm>
        <ElButton type="primary" @click="handleAdd">新增图书</ElButton>
      </div>
    </ElCard>

    <ElCard>
      <ElTable :data="tableData" border style="width: 100%" v-loading="loading">
        <ElTableColumn label="书名" prop="name" />
        <ElTableColumn label="作者" prop="author" />
        <ElTableColumn label="出版社" prop="publisher" />
        <ElTableColumn label="ISBN" prop="isbn" />
        <ElTableColumn label="价格" prop="price" />
        <ElTableColumn label="状态" prop="status">
          <template #default="scope">
            <ElTag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{ scope.row.status === '1' ? '可借' : '借出' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" label="操作" width="180">
          <template #default="scope">
            <ElButton link type="primary" @click="handleEdit(scope.row)">
              编辑
            </ElButton>
            <ElButton link type="danger" @click="handleDelete(scope.row)">
              删除
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="mt-4 flex justify-end">
        <ElPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
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
        class="mt-4"
        label-width="80px"
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
        <ElFormItem label="状态" prop="status">
          <ElSelect v-model="form.status">
            <ElOption label="可借" value="1" />
            <ElOption label="借出" value="0" />
          </ElSelect>
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
