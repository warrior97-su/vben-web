import type { RoleState } from '@vben/types';

import { requestClient } from '#/api/request';

// 获取角色列表
export async function getRoleListApi(data: {
  name: string;
  pageNum: number;
  pageSize: number;
}) {
  return requestClient.get('/role/list', { params: data });
}

// 获取单个角色
export async function getRoleApi(id: number) {
  return requestClient.get(`/role/${id}`);
}

// 新增角色
export async function createRoleApi(data: RoleState) {
  return requestClient.post('/role/create', data);
}

// 更新角色
export async function updateRoleApi(data: RoleState) {
  return requestClient.put(`/role/update`, data);
}

// 删除角色
export async function deleteRoleApi(id: number) {
  return requestClient.delete(`/role/${id}`);
}

// 获取角色的菜单权限
export async function getRoleMenusApi(id: number) {
  return requestClient.get(`/role/menus/${id}`);
}

// 更新角色的菜单权限
export async function updateRoleMenusApi(id: number, menuIds: number[]) {
  return requestClient.put(`/role/menus/${id}`, { menuIds });
}
