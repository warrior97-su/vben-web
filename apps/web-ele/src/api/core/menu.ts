import type {
  Menu,
  MenuCreate,
  MenuUpdate,
  RouteRecordStringComponent,
} from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

/**
 * 获取菜单列表
 */
export function getMenuListApi() {
  return requestClient.get<Menu[]>('/menu/list');
}

/**
 * 创建菜单
 */
export function createMenuApi(menu: MenuCreate) {
  return requestClient.post('/menu/create', menu);
}

/**
 * 更新菜单
 */
export function updateMenuApi(menu: MenuUpdate) {
  return requestClient.post('/menu/update', menu);
}

/**
 * 删除菜单
 */
export function deleteMenuApi(id: number) {
  return requestClient.delete(`/menu/delete/${id}`);
}
