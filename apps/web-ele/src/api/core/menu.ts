import type {
  Menu,
  MenuCreate,
  MenuUpdate,
  RouteRecordStringComponent,
} from '@vben/types';

import { springBootRequestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return springBootRequestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

/**
 * 获取菜单列表
 */
export function getMenuListApi() {
  return springBootRequestClient.get<Menu[]>('/menu/list');
}

/**
 * 创建菜单
 */
export function createMenuApi(menu: MenuCreate) {
  return springBootRequestClient.post('/menu/create', menu);
}

/**
 * 更新菜单
 */
export function updateMenuApi(menu: MenuUpdate) {
  return springBootRequestClient.post('/menu/update', menu);
}

/**
 * 删除菜单
 */
export function deleteMenuApi(id: number) {
  return springBootRequestClient.delete(`/menu/delete/${id}`);
}
