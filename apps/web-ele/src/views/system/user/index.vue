<script setup lang="ts">
import type { UserState } from '@vben/types';
import type { FormInstance } from 'element-plus';

import { onMounted, reactive, ref } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';

import {
  createUserApi,
  deleteUserApi,
  getUserListApi,
  updateUserApi,
} from '#/api/core/user';

import UserRoleDialog from './components/UserRoleDialog.vue';

interface QueryParams {
  search: string;
  pageNum: number;
  pageSize: number;
}

const queryParams = reactive<QueryParams>({
  search: '',
  pageNum: 1,
  pageSize: 10,
});

const total = ref(0);
const userList = ref<UserState[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('新增用户');
const formRef = ref<FormInstance>();
let editId = 0;

const formData = reactive<UserState>({
  username: '',
  password: '',
  nickName: '',
  email: '',
  phone: '',
  id: 0,
  role: 0,
});

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  email: [
    {
      pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
};

const roleDialogVisible = ref(false);
const currentUserId = ref<number>(0);

const handleQuery = async () => {
  try {
    const res = await getUserListApi({
      search: queryParams.search,
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
    });
    userList.value = res.records;
    total.value = res.total;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error('获取用户列表失败');
  }
};

const resetQuery = () => {
  queryParams.search = '';
  queryParams.pageNum = 1;
  handleQuery();
};

const handleAdd = () => {
  editId = 0;
  dialogVisible.value = true;
  dialogTitle.value = '新增用户';
  formData.username = '';
  formData.password = '';
  formData.nickName = '';
  formData.email = '';
  formData.phone = '';
};

const handleEdit = (row: UserState) => {
  editId = row.id!;
  dialogVisible.value = true;
  dialogTitle.value = '编辑用户';
  formData.username = row.username;
  formData.nickName = row.nickName || '';
  formData.email = row.email || '';
  formData.phone = row.phone || '';
};

const handleDelete = async (row: UserState) => {
  try {
    await ElMessageBox.confirm('确认要删除该用户吗？', '提示', {
      type: 'warning',
    });
    await deleteUserApi(row.id!);
    ElMessage.success('删除成功');
    handleQuery();
  } catch (error) {
    console.error('删除用户失败:', error);
    ElMessage.error('删除用户失败');
  }
};

const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  handleQuery();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  handleQuery();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    if (editId) {
      await updateUserApi({ ...formData, id: editId });
      ElMessage.success('修改成功');
    } else {
      await createUserApi(formData);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    handleQuery();
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('提交失败');
  }
};

const handleBindRole = (row: UserState) => {
  currentUserId.value = row.id!;
  roleDialogVisible.value = true;
};

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="p-4">
    <ElCard class="mb-4">
      <ElForm :inline="true" :model="queryParams" class="flex flex-wrap gap-4">
        <ElFormItem label="用户名">
          <ElInput v-model="queryParams.search" placeholder="请输入用户名" />
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" @click="handleQuery">查询</ElButton>
          <ElButton @click="resetQuery">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span>用户列表</span>
          <ElButton type="primary" @click="handleAdd">新增用户</ElButton>
        </div>
      </template>

      <ElTable :data="userList" border style="width: 100%">
        <ElTableColumn label="账号" prop="username" />
        <ElTableColumn label="昵称" prop="nickName" />
        <ElTableColumn label="手机号" prop="phone" />
        <ElTableColumn label="操作" width="200">
          <template #default="{ row }">
            <ElButton link type="primary" @click="handleBindRole(row)">
              绑定角色
            </ElButton>
            <ElButton link type="primary" @click="handleEdit(row)">
              编辑
            </ElButton>
            <ElButton link type="danger" @click="handleDelete(row)">
              删除
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="mt-4 flex justify-end">
        <ElPagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ElCard>

    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <ElFormItem label="账号" prop="username">
          <ElInput v-model="formData.username" placeholder="请输入用户名" />
        </ElFormItem>
        <ElFormItem v-if="!editId" label="密码" prop="password">
          <ElInput
            v-model="formData.password"
            placeholder="请输入密码"
            show-password
            type="password"
          />
        </ElFormItem>
        <ElFormItem label="昵称" prop="nickName">
          <ElInput v-model="formData.nickName" placeholder="请输入昵称" />
        </ElFormItem>
        <ElFormItem label="手机号" prop="phone">
          <ElInput v-model="formData.phone" placeholder="请输入手机号" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleSubmit">确定</ElButton>
        </span>
      </template>
    </ElDialog>

    <UserRoleDialog
      v-model:visible="roleDialogVisible"
      :user-id="currentUserId"
    />
  </div>
</template>
