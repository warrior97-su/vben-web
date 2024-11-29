<script setup lang="ts">
import type { Menu, MenuCreate, MenuUpdate } from '@vben/types';
import type { FormInstance } from 'element-plus';

import { onMounted, reactive, ref } from 'vue';

import {
  ElButton,
  ElCard,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElTreeSelect,
} from 'element-plus';

import {
  createMenuApi,
  deleteMenuApi,
  getMenuListApi,
  updateMenuApi,
} from '#/api/core/menu';

const menuList = ref<Menu[]>([]);
const menuOptions = ref<Menu[]>([]);
const menuFormRef = ref<FormInstance>();

const dialog = reactive({
  title: '',
  visible: false,
});

const menuForm = reactive<{ id?: number } & MenuCreate>({
  name: '',
  path: '',
  component: '',
  icon: '',
  pid: 0,
  sort: 0,
});

const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
  pid: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
  sort: [{ required: true, message: '请输入显示排序', trigger: 'blur' }],
};

const getList = async () => {
  try {
    const res = await getMenuListApi();
    menuList.value = res;
    menuOptions.value = res;
  } catch (error) {
    console.error('获取菜单列表失败:', error);
  }
};

const resetForm = () => {
  menuForm.id = undefined;
  menuForm.name = '';
  menuForm.path = '';
  menuForm.component = '';
  menuForm.icon = '';
  menuForm.pid = 0;
  menuForm.sort = 0;
};

const handleAdd = () => {
  resetForm();
  dialog.title = '添加菜单';
  dialog.visible = true;
};

const handleEdit = (row: Menu) => {
  resetForm();
  dialog.title = '修改菜单';
  dialog.visible = true;
  Object.assign(menuForm, row);
};

const handleDelete = async (row: Menu) => {
  try {
    await ElMessageBox.confirm('是否确认删除该菜单?', '警告', {
      type: 'warning',
    });
    await deleteMenuApi(row.id!);
    ElMessage.success('删除成功');
    getList();
  } catch (error) {
    console.error('删除菜单失败:', error);
  }
};

const submitForm = async () => {
  if (!menuFormRef.value) return;

  await menuFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (menuForm.id) {
          const updateData: MenuUpdate = {
            id: menuForm.id,
            name: menuForm.name,
            path: menuForm.path,
            component: menuForm.component,
            icon: menuForm.icon,
            sort: menuForm.sort,
          };
          await updateMenuApi(updateData);
          ElMessage.success('修改成功');
        } else {
          const createData: MenuCreate = {
            name: menuForm.name,
            path: menuForm.path,
            component: menuForm.component,
            icon: menuForm.icon,
            pid: menuForm.pid,
            sort: menuForm.sort,
          };
          await createMenuApi(createData);
          ElMessage.success('新增成功');
        }
        dialog.visible = false;
        getList();
      } catch (error) {
        console.error('保存菜单失败:', error);
      }
    }
  });
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="p-4">
    <ElCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span>菜单列表</span>
          <ElButton type="primary" @click="handleAdd">新增菜单</ElButton>
        </div>
      </template>

      <ElTable :data="menuList" border row-key="id" style="width: 100%">
        <ElTableColumn label="菜单名称" prop="name" />
        <ElTableColumn label="图标" prop="icon">
          <template #default="{ row }">
            <ElIcon v-if="row.icon">
              <component :is="row.icon" />
            </ElIcon>
          </template>
        </ElTableColumn>
        <ElTableColumn label="排序" prop="sort" width="80" />
        <ElTableColumn label="路由地址" prop="path" />
        <ElTableColumn label="组件路径" prop="component" />
        <ElTableColumn label="操作" width="180">
          <template #default="{ row }">
            <ElButton link type="primary" @click="handleEdit(row)">
              编辑
            </ElButton>
            <ElButton link type="danger" @click="handleDelete(row)">
              删除
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <!-- 菜单添加/编辑对话框 -->
    <ElDialog
      v-model="dialog.visible"
      :title="dialog.title"
      append-to-body
      width="500px"
    >
      <ElForm
        ref="menuFormRef"
        :model="menuForm"
        :rules="rules"
        label-width="100px"
      >
        <ElFormItem label="上级菜单" prop="pid">
          <ElTreeSelect
            v-model="menuForm.pid"
            :data="menuOptions"
            :props="{ label: 'name', value: 'id' }"
            clearable
            placeholder="选择上级菜单"
          />
        </ElFormItem>
        <ElFormItem label="菜单名称" prop="name">
          <ElInput v-model="menuForm.name" placeholder="请输入菜单名称" />
        </ElFormItem>
        <ElFormItem label="路由地址" prop="path">
          <ElInput v-model="menuForm.path" placeholder="请输入路由地址" />
        </ElFormItem>
        <ElFormItem label="组件路径" prop="component">
          <ElInput v-model="menuForm.component" placeholder="请输入组件路径" />
        </ElFormItem>
        <ElFormItem label="菜单图标" prop="icon">
          <ElInput v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </ElFormItem>
        <ElFormItem label="显示排序" prop="sort">
          <ElInputNumber v-model="menuForm.sort" :min="0" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialog.visible = false">取 消</ElButton>
          <ElButton type="primary" @click="submitForm">确 定</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
