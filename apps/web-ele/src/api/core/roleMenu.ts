import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取角色菜单列表
 */
export function getRoleMenusApi(roleId: number) {
  return requestClient.get<RouteRecordStringComponent[]>(
    `/api/role-menu/role/${roleId}`,
  );
}

/**
 * 分配角色菜单权限
 */
export function assignMenusApi(roleId: number, menuIds: number[]) {
  return requestClient.post(`/api/role-menu/assign/${roleId}`, menuIds);
}

// 获取角色菜单ID
export function getRoleMenuIdsApi(roleId: number) {
  return requestClient.get<number[]>(`/api/role-menu/role/menuIds/${roleId}`);
}
