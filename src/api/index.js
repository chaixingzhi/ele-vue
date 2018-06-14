import axios from 'axios'

export const reqSeller = () => { // 获取商家信息
  return axios.get('/api/seller')
}
export const reqGoods = () => { // 获取商品信息
  return axios.get('/api/goods')
}
export const reqRatings = () => { // 获取评价信息
  return axios.get('/api/ratings')
}
