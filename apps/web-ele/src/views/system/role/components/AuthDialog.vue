<script setup lang="ts">
import type { Menu } from '@vben/types';

import { ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getMenuListApi } from '#/api/core/menu';
import { assignMenusApi, getRoleMenuIdsApi } from '#/api/core/roleMenu';

const props = defineProps<{
  roleId: number;
  visible: boolean;
}>();

const emit = defineEmits(['update:visible']);

const treeRef = ref<any>(null);

const visible = useVModel(props, 'visible', emit);

const menuIds = ref<number[]>([]);
const menuList = ref<Menu[]>([]);
const loading = ref(false);

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false);
};

// 获取菜单树和角色已有权限
const getMenuTree = async () => {
  loading.value = true;
  try {
    // 获取所有菜单
    const menuRes = await getMenuListApi();
    menuList.value = menuRes;

    // 获取角色已有的菜单权限
    const roleMenus = await getRoleMenuIdsApi(props.roleId);
    menuIds.value = roleMenus;
  } catch (error) {
    console.error('获取菜单失败:', error);
    ElMessage.error('获取菜单失败');
  } finally {
    loading.value = false;
  }
};

// 保存权限
const handleSave = async () => {
  try {
    const checkedKeys = treeRef.value.getCheckedKeys();
    await assignMenusApi(props.roleId, checkedKeys);
    ElMessage.success('分配权限成功');
    handleClose();
  } catch (error) {
    console.error('分配权限失败:', error);
    ElMessage.error('分配权限失败');
  }
};

// 监听显示状态变化
watch(
  () => visible.value,
  (val) => {
    if (val && props.roleId) {
      getMenuTree();
    }
  },
);
</script>

<template>
  <ElDialog
    v-model="visible"
    :close-on-click-modal="false"
    title="分配权限"
    width="500px"
    @close="handleClose"
  >
    <ElTree
      ref="treeRef"
      :data="menuList"
      :default-checked-keys="menuIds"
      :props="{
        label: 'title',
        children: 'children',
      }"
      node-key="id"
      show-checkbox
      v-loading="loading"
    >
      <template #default="{ node }">
        <span>{{ $t(node.label) }}</span>
      </template>
    </ElTree>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="handleClose">取 消</ElButton>
        <ElButton type="primary" @click="handleSave">确 定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>
