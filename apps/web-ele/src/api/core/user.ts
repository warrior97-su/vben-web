import type { UserState, UserInfo } from '@vben/types';
import { springBootRequestClient } from '#/api/request';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}


// 获取用户列表
export async function getUserListApi(params: { 
  search?: string;
  pageNum: number;
  pageSize: number;
}) {
  return springBootRequestClient.get('/user', { params });
}

// 获取单个用户
export async function getUserApi(id: number) {
  return springBootRequestClient.get(`/user/${id}`);
}

// 新增用户
export async function createUserApi(data: UserState) {
  return springBootRequestClient.post('/user', data);
}

// 更新用户
export async function updateUserApi(data: UserState) {
  return springBootRequestClient.put('/user', data);
}

// 删除用户
export async function deleteUserApi(id: number) {
  return springBootRequestClient.delete(`/user/${id}`);
}
