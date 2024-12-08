import type { RouteRecordStringComponent } from '@vben/types';

import { springBootRequestClient } from '#/api/request';

/**
 * 获取角色菜单列表
 */
export function getRoleMenusApi(roleId: number) {
  return springBootRequestClient.get<RouteRecordStringComponent[]>(
    `/api/role-menu/role/${roleId}`,
  );
}

/**
 * 分配角色菜单权限
 */
export function assignMenusApi(roleId: number, menuIds: number[]) {
  return springBootRequestClient.post(
    `/api/role-menu/assign/${roleId}`,
    menuIds,
  );
}

// 获取角色菜单ID
export function getRoleMenuIdsApi(roleId: number) {
  return springBootRequestClient.get<number[]>(
    `/api/role-menu/menuIds/${roleId}`,
  );
}
