import { requestClient } from '#/api/request';

/**
 * 获取角色下的用户列表
 * @param roleId 角色ID
 * @param params 查询参数
 */
export async function getRoleUsersApi(
  roleId: number,
  params: {
    pageNum: number;
    pageSize: number;
    username?: string;
  },
) {
  return requestClient.get(`/api/role-user/role/${roleId}`, {
    params,
  });
}

/**
 * 为角色分配用户
 * @param roleId 角色ID
 * @param userIds 用户ID数组
 */
export async function assignUsersToRoleApi(roleId: number, userIds: number[]) {
  return requestClient.post(`/api/role-user/assign/${roleId}`, {
    userIds,
  });
}

/**
 * 移除角色下的用户
 * @param roleId 角色ID
 * @param userIds 用户ID数组
 */
export async function removeUsersFromRoleApi(
  roleId: number,
  userIds: number[],
) {
  return requestClient.delete(`/api/role-user/remove/${roleId}`, {
    data: { userIds },
  });
}

/**
 * 获取用户的所有角色
 * @param userId 用户ID
 */
export async function getUserRolesApi(userId: number) {
  return requestClient.get(`/api/role-user/user/${userId}`);
}

/**
 * 为用户分配角色
 * @param userId 用户ID
 * @param roleIds 角色ID数组
 */
export async function assignRolesToUserApi(userId: number, roleIds: number[]) {
  return requestClient.post(`/api/role-user/assign/${userId}`, roleIds);
}
