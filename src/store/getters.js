export default {
  // 购物车中的food列表
  foodList(state) { // 参数为state
    const foods = []
    state.goods.map(good => {
      good.foods.map(food => {
        if (food.count) {
          foods.push(food)
        }
      })
    })
    return foods //必须teturn 出去
  },
  totalCount(state, getters) { // 购物车中商品的数量
    return getters.foodList.reduce((preTotal, food) => {
      return preTotal + food.count
    }, 0)
  },
  totalPrice(state, getters) {
    return getters.foodList.reduce((prePrice, food) => {
      return prePrice + food.count*food.price
    }, 0)
  }
}
