<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left">
          <div class="logo-wrapper" @click="toggleShow">
            <div class="logo" :class="{highlight: totalCount > 0}">
              <i class="icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{seller.deliveryPrice}}</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click="payMoney">{{payText}}</div>
        </div>
      </div>
      <div class="ball-container">
        <transition v-for="(ball, index) in balls"
                    :key="index"
                    @before-enter="beforeDrop"
                    @enter="drop"
                    @after-enter="afterDrop"
                    :css="false">
          <div class="ball" v-show="ball.isShow">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="slide">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <!-- <span class="empty" @click="empty">清空</span> -->
            <mt-button style="float: right" type="primary" @click.native="empty">清空</mt-button>
          </div>
          <div class="list-content" ref="shopList">
            <ul>
              <li class="food" v-for="(food, index) in foodList" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price"><span>￥{{food.price}}</span></div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
    </transition>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import PubSub from 'pubsub-js'
import {MessageBox, Toast} from 'mint-ui'
import {mapState, mapGetters} from 'vuex'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
export default {
  data() {
    return {
      isShow: false,
      payClass: 'not-enough',
      balls: [
        {isShow: false},
        {isShow: false},
        {isShow: false},
        {isShow: false},
        {isShow: false},
        {isShow: false}
      ],
      droppingBalls: []
    }
  },
  mounted() {
    // 订阅消息(startBallDrop)
    PubSub.subscribe('startBallDrop', (msg, startEl) => {
      console.log('msg: ', msg   , '####: ',startEl)
      // 找到一个隐藏的小球（对应的ball对象）
      const ball = this.balls.find(ball => { // find方法返回第一个ball.isShow = false 的小球
        return !ball.isShow
      })
      // 显示小球
      if(ball) {
        ball.isShow = true
        ball.startEl = startEl
        this.droppingBalls.push(ball)
      } else {
        console.log('没有小球了')
      }
    })
  },
  computed: {
    ...mapState(['seller']),
    ...mapGetters(['foodList', 'totalCount', 'totalPrice']),
    payText() {
      const {totalPrice, seller:{minPrice}} = this
      if (totalPrice === 0) {
        this.payClass = 'not-enough'
        return `￥${minPrice}元起送`
      } else if (totalPrice < minPrice){
        this.payClass = 'not-enough'
        return `还差￥${minPrice - totalPrice}元起送`

      } else {
        this.payClass = 'enough'
        return '去结算'
      }
    },
    listShow() {
      const {isShow, totalCount} = this
      if (totalCount === 0) {
        this.isShow = false
        return false
      }
      if (isShow) {
        this.$nextTick(() => {
          // 创建scroll单例对象
          if(!this.scroll) {
            this.scroll = new BScroll(this.$refs.shopList, {
              click: true
            })
          } else {
            this.scroll.refresh() // 通知scroll对象更新，形成滑动
          }
        })
      }
      return isShow
    },
  },
  methods: {
    beforeDrop: function(el) {
      const ball = this.droppingBalls.shift() //从数组中删除第一个并返回它
      const startEl = ball.startEl
      console.log('el: ', el);
      //计算偏移量
      let offsetY = 0
      let offsetX = 0
      let elLeft = 32
      const elBottom = 22
      const {left, top} = startEl.getBoundingClientRect()
      offsetX = left - elLeft
      offsetY = -(window.innerHeight - elBottom - top)

      // 指定样式
      el.style.transform = `translateY(${offsetY}px) `
      el.children[0].style.transform = `translateX(${offsetX}px)`
      console.log('children: ', el.children[0])
      el.ball = ball
    },

    // 在开始时，确定动画结束时的样式状态
    drop: function(el) {

      // 强制重排重绘
      const temp = el.clientHeight
      // 必须异步执行
      this.$nextTick(() => {
        // 指定样式
        el.style.transform = `translateY(0)`
        el.children[0].style.transform = `translate(0)`
      })
    },
    // 在动画结束后调用，做一些收尾工作（隐藏小球）
    afterDrop: function(el) {
      // 样式中指定的隐藏过渡时间没用了，手动指定延迟隐藏
      setTimeout(() => {
        el.ball.isShow = false
      }, 400);
    },
    toggleShow: function() {
      this.isShow = !this.isShow
    },
    empty: function() {
      MessageBox.confirm('确定删除吗?').then(action => {
          this.$store.dispatch('clearCart', this.foodList)
          Toast({
            message: '清除成功',
            position: 'middle',
            duration: 2000
          });
        });
    },
    payMoney: function() {
      if(this.payText === '去结算') {
        MessageBox.alert('支付成功')
      } else {
        MessageBox.alert('商品总价格未达到最小配送费')
      }
    },
  },
  components: {
    cartcontrol
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background-color #141d27
      font-size 0
      color rgba(255,255,255,0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin: 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background-color #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background-color #2b343c
            &.highlight
              background-color rgb(0,160,220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #ffffff
          .num
            position absolute
            top 0px
            right 0px
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            text-align center
            font-size 9px
            font-weight 700
            color #fff
            background-color rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px sold rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color #ffffff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position absolute
      left 0px
      top 0px
      z-index -1
      width 100%
      transform translateY(-100%)
      &.slide-enter-active, &.slide-leave-active
        transition transform .5s
      &.slide-enter, &.slide-leave-to
        transform translateY(0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background-color #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background-color #ffffff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            right 0px
            bottom 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)

</style>

