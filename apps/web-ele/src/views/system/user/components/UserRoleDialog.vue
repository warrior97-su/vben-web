<script setup lang="ts">
import type { RoleState } from '@vben/types';

import { ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getRoleListApi } from '#/api/core/role';
import { assignRolesToUserApi, getUserRolesApi } from '#/api/core/roleUser';

const props = defineProps<{
  userId: number;
  visible: boolean;
}>();

const emit = defineEmits(['update:visible']);

const roleList = ref<RoleState[]>([]);
const selectedRoleIds = ref<number[]>([]);
const loading = ref(false);

const visible = useVModel(props, 'visible', emit);

// 加载角色数据
const loadData = async () => {
  loading.value = true;
  try {
    // 获取所有角色列表
    const roleRes = await getRoleListApi({
      name: '',
      pageNum: 1,
      pageSize: 100,
    });
    roleList.value = roleRes.records;

    // 获取用户当前的角色
    const userRoles = await getUserRolesApi(props.userId);
    selectedRoleIds.value = userRoles.map((role: RoleState) => role.id!);
  } catch (error) {
    console.error('加载角色数据失败:', error);
    ElMessage.error('加载角色数据失败');
  } finally {
    loading.value = false;
  }
};

// 监听对话框显示状态,显示时加载数据
watch(
  () => visible.value,
  (val) => {
    if (val) {
      loadData();
    }
  },
  { immediate: true },
);

// 保存角色分配
const handleSubmit = async () => {
  try {
    await assignRolesToUserApi(props.userId, selectedRoleIds.value);
    ElMessage.success('角色分配成功');
    emit('update:visible', false);
  } catch (error) {
    console.error('角色分配失败:', error);
    ElMessage.error('角色分配失败');
  }
};

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false);
};
</script>

<template>
  <ElDialog
    v-model="visible"
    :close-on-click-modal="false"
    title="绑定角色"
    width="500px"
    @close="handleClose"
  >
    <div v-loading="loading">
      <ElCheckboxGroup v-model="selectedRoleIds">
        <ElCheckbox
          v-for="role in roleList"
          :key="role.id"
          :label="role.id"
          class="mb-2"
        >
          {{ role.name }}
        </ElCheckbox>
      </ElCheckboxGroup>
    </div>

    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton type="primary" @click="handleSubmit">确定</ElButton>
    </template>
  </ElDialog>
</template>
