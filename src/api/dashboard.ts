import axios from 'axios';

export interface ContentDataRecord {
  x: string
  y: number
}
interface TableData {

}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number
  clickNumber: string
  title: string
  increases: number
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}
