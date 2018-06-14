import { reqSeller, reqGoods, reqRatings} from '../api/index'
import {
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_SELLER,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RES_OK
} from './mutationsType'
export default {
  // 获取商家信息
  getSeller({commit}, cb) {
    reqSeller().then(response => {
      const result = response.data
      if (result.code === RES_OK) {
        const seller = result.data
        commit(RECEIVE_SELLER, { seller }) //相当于dav中的put
        cb && cb()
      }
    })
  },
  getGoods({ commit }, cb) {
    reqGoods().then(response => {
      const result = response.data
      if (result.code === RES_OK) {
        const goods = result.data
        commit(RECEIVE_GOODS, { goods })
        cb && cb()
      }
    })
  },
  getRatings({ commit }, cb) {
    reqRatings().then(response => {
      const result = response.data
      if (result.code === RES_OK) {
        const ratings = result.data
        commit(RECEIVE_RATINGS, { ratings })
        cb && cb()
      }
    })
  },
  updateFoodCount({ commit }, { food, isAdd }) {
    if (isAdd) { // 加1
      commit(INCREMENT_FOOD_COUNT, { food })
    } else { // 减1
      commit(DECREMENT_FOOD_COUNT, { food })
    }
  },
  clearCart({commit}, foodList) {
    commit(CLEAR_CART, {foodList})
  }
}
