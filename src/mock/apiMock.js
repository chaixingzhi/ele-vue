import Mock from 'mockjs'
import data from './data.json'

// 映射几个接口
Mock.mock('/api/goods', {
  code: 0,
  data: data.goods
})
Mock.mock('/api/ratings', {
  code: 0,
  data: data.ratings
})
Mock.mock('/api/seller', {
  code: 0,
  data: data.seller
})
