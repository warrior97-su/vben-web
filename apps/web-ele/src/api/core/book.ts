import { requestClient } from '#/api/request';

export interface BookForm {
  id?: number;
  name: string;
  author: string;
  publisher: string;
  isbn: string;
  price: number;
  status: string;
  borrownum?: number;
  createTime?: string;
}

export interface BookQuery {
  pageNum?: number;
  pageSize?: number;
  search1?: string;
  search2?: string;
  search3?: string;
}

export const bookApi = {
  // 获取图书列表
  getBookList(params: BookQuery) {
    return requestClient.get<{
      current: number;
      records: BookForm[];
      size: number;
      total: number;
    }>('/book', { params });
  },

  // 添加图书
  addBook(data: Omit<BookForm, 'borrownum' | 'createTime' | 'id'>) {
    return requestClient.post('/book', data);
  },

  // 更新图书
  updateBook(data: BookForm) {
    return requestClient.put('/book', data);
  },

  // 删除图书
  deleteBook(id: number) {
    return requestClient.delete(`/book/${id}`);
  },
};
