import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  token: string;
}

export type { UserInfo };

export interface UserState {
  id?: number;
  username: string;
  password?: string;
  nickName?: string;
  email?: string;
  phone?: string;
  status?: number;
  createTime?: string;
  updateTime?: string;
  role: number
}
