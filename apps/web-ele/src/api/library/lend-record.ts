import { requestClient } from '../request';

export interface LendRecordQuery {
  status?: string;
  pageNum?: number;
  pageSize?: number;
  search2?: string;
}

export interface LendRecordForm {
  bookname: string;
  isbn: string;
  readerId: number;
  lendTime: string;
  returnTime: string;
  status: string;
  borrownum: number;
}

// 分页查询借阅记录
export function getLendRecordList(params: LendRecordQuery) {
  return requestClient.get('/LendRecord', { params });
}

// 新增借阅记录
export function createLendRecord(data: LendRecordForm) {
  return requestClient.post('/LendRecord', data);
}

// 归还图书
export function returnBook(isbn: string) {
  return requestClient.put(`/LendRecord/${isbn}`, {
    status: 'returned',
  });
}

// 搜索图书
export function searchBooks(keyword: string) {
  return requestClient.get('/book', {
    params: {
      search1: keyword,
      pageNum: 1,
      pageSize: 10,
    },
  });
}

// 搜索用户
export function searchUsers(keyword: string) {
  return requestClient.get('/user', {
    params: {
      search: keyword,
      pageNum: 1,
      pageSize: 10,
    },
  });
}
