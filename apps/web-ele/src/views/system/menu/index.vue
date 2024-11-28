<template>
  <div class="p-4">
    <ElCard class="mb-4">
      <ElForm :inline="true" :model="queryParams" class="flex flex-wrap gap-4">
        <ElFormItem label="菜单名称">
          <ElInput v-model="queryParams.menuName" placeholder="请输入菜单名称" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="queryParams.status" placeholder="请选择状态">
            <ElOption label="显示" value="1" />
            <ElOption label="隐藏" value="0" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleQuery">查询</ElButton>
          <ElButton @click="resetQuery">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard>
      <template #header>
        <div class="flex justify-between items-center">
          <span>菜单列表</span>
          <ElButton type="primary" @click="handleAdd">新增菜单</ElButton>
        </div>
      </template>

      <ElTable
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        style="width: 100%"
      >
        <ElTableColumn prop="menuName" label="菜单名称" />
        <!-- <ElTableColumn prop="icon" label="图标">
          <template #default="{ row }">
            <ElIcon v-if="row.icon">
              <component :is="row.icon" />
            </ElIcon>
          </template>
        </ElTableColumn> -->
        <ElTableColumn prop="orderNum" label="排序" width="80" />
        <ElTableColumn prop="perms" label="权限标识" />
        <ElTableColumn prop="path" label="路由地址" />
        <ElTableColumn prop="component" label="组件路径" />
        <!-- <ElTableColumn prop="menuType" label="菜单类型" width="100">
          <template #default="{ row }">
            <ElTag v-if="row.menuType === 'M'">目录</ElTag>
            <ElTag v-else-if="row.menuType === 'C'" type="success">菜单</ElTag>
            <ElTag v-else-if="row.menuType === 'F'" type="info">按钮</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="状态" width="80">
          <template #default="{ row }">
            <ElTag :type="row.status === '1' ? 'success' : 'danger'">
              {{ row.status === '1' ? '显示' : '隐藏' }}
            </ElTag>
          </template>
        </ElTableColumn> -->
        <ElTableColumn label="操作" width="180">
          <!-- <template #default="{ row }">
            <ElButton type="primary" link @click="handleAdd(row)">新增</ElButton>
            <ElButton type="primary" link @click="handleEdit(row)">编辑</ElButton>
            <ElButton type="danger" link @click="handleDelete(row)">删除</ElButton>
          </template> -->
        </ElTableColumn>
      </ElTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface QueryParams {
  menuName: string;
  status: string;
}

const queryParams = reactive<QueryParams>({
  menuName: '',
  status: '',
});

const menuList = ref([]);

const handleQuery = () => {
  // TODO: 实现查询逻辑
};

const resetQuery = () => {
  queryParams.menuName = '';
  queryParams.status = '';
  handleQuery();
};

const handleAdd = (row?: any) => {
  // TODO: 实现新增菜单逻辑
  // 如果传入row，则表示在该节点下新增子菜单
};

const handleEdit = (row: any) => {
  // TODO: 实现编辑菜单逻辑
};

const handleDelete = (row: any) => {
  // TODO: 实现删除菜单逻辑
};
</script>
