<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import { reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';

import {
  createLendRecord,
  getLendRecordList,
  searchBooks,
  searchUsers,
} from '#/api/library/lend-record';

interface BookOption {
  id: string;
  name: string;
  isbn: string;
}

interface UserOption {
  id: string;
  name: string;
}

interface TableRecord {
  id: string;
  bookName: string;
  username: string;
  lendDate: string;
  returnDate: string;
  actualReturnDate: null | string;
  status: 'borrowed' | 'returned';
}

const searchForm = reactive({
  search1: '',
  status: '',
});

const tableData = ref<TableRecord[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const loadData = async () => {
  try {
    const { records, total: totalCount } = await getLendRecordList({
      search2: searchForm.search1,
      status: searchForm.status,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    });
    tableData.value = records;
    total.value = totalCount;
  } catch {
    ElMessage.error('获取数据失败');
  }
};

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();

const form = reactive({
  bookname: '',
  isbn: '',
  readerId: 0,
  lendTime: '',
  returnTime: '',
  status: 'borrowed',
  borrownum: 1,
});

const rules = reactive<FormRules>({
  isbn: [{ required: true, message: '请选择图书', trigger: 'change' }],
  readerId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  lendTime: [{ required: true, message: '请选择借阅日期', trigger: 'change' }],
  returnTime: [
    { required: true, message: '请选择应还日期', trigger: 'change' },
  ],
});

const bookLoading = ref(false);
const userLoading = ref(false);
const bookOptions = ref<BookOption[]>([]);
const userOptions = ref<UserOption[]>([]);

const handleSearch = () => {
  // TODO: 实现搜索功能
  loadData();
};

const handleAdd = () => {
  dialogVisible.value = true;
  form.bookname = '';
  form.isbn = '';
  form.readerId = 0;
  form.lendTime = '';
  form.returnTime = '';
  form.status = 'borrowed';
  form.borrownum = 1;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await createLendRecord(form);
        ElMessage.success('借阅成功');
        dialogVisible.value = false;
        loadData();
      } catch {
        ElMessage.error('借阅失败');
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

const handleBookSearch = async (query: string) => {
  if (query) {
    bookLoading.value = true;
    try {
      const { data } = await searchBooks(query);
      bookOptions.value = data.records;
    } catch {
      ElMessage.error('搜索图书失败');
    } finally {
      bookLoading.value = false;
    }
  } else {
    bookOptions.value = [];
  }
};

const handleUserSearch = async (query: string) => {
  if (query) {
    userLoading.value = true;
    try {
      const { data } = await searchUsers(query);
      userOptions.value = data;
    } catch {
      ElMessage.error('搜索用户失败');
    } finally {
      userLoading.value = false;
    }
  } else {
    userOptions.value = [];
  }
};

// 添加重置函数
const handleReset = () => {
  searchForm.search1 = '';
  searchForm.status = '';
  loadData();
};

// 初始加载
loadData();
</script>

<template>
  <div class="p-4">
    <el-card class="mb-4">
      <div class="flex items-center justify-between">
        <el-form :inline="true" :model="searchForm" class="flex-1">
          <el-form-item label="书名">
            <el-input v-model="searchForm.search1" placeholder="请输入书名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleAdd">新增借阅</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="书名" prop="bookname" />
        <el-table-column label="借阅人" prop="readerId" />
        <el-table-column label="借阅日期" prop="lendTime" />
        <el-table-column label="应还日期" prop="returnTime" />
        <el-table-column label="借阅数量" prop="borrownum" />
        <el-table-column label="状态" prop="status" />
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增借阅" width="500px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="mt-4"
        label-width="80px"
      >
        <el-form-item label="图书" prop="isbn">
          <el-select
            v-model="form.isbn"
            :loading="bookLoading"
            :remote-method="handleBookSearch"
            filterable
            placeholder="请输入书名搜索"
            remote
            @change="
              (val) => {
                const book = bookOptions.find(
                  (b: BookOption) => b.isbn === val,
                );
                if (book) {
                  form.bookname = book.name;
                }
              }
            "
          >
            <el-option
              v-for="item in bookOptions"
              :key="item.isbn"
              :label="item.name"
              :value="item.isbn"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="readerId">
          <el-select
            v-model="form.readerId"
            :loading="userLoading"
            :remote-method="handleUserSearch"
            filterable
            placeholder="请输入用户名搜索"
            remote
          >
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="借阅日期" prop="lendTime">
          <el-date-picker
            v-model="form.lendTime"
            placeholder="选择借阅日期"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="应还日期" prop="returnTime">
          <el-date-picker
            v-model="form.returnTime"
            placeholder="选择应还日期"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
