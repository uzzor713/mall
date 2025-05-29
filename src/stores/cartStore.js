//封装购物车模块

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./userStore";
import { insertCartAPI,findNewCartListAPI,delCartAPI } from "@/apis/cart";

export const useCartStore = defineStore('cart',()=>{
  const userStore = useUserStore()
  const isLogin = computed(()=>userStore.userInfo.token)
  const cartList = ref([])

  //获取最新购物车列表action
  const updateNewList = async ()=>{
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }

  //加入购物车
  const addCart = async (goods)=>{
    if(isLogin.value){
      const {skuId,count} = goods
      await insertCartAPI({skuId,count})
      updateNewList()
    } else {
      //添加购物车
      const item = cartList.value.find((item)=>goods.skuId === item.skuId)
      if(item){
        item.count++
      } else{
        cartList.value.push(goods)
      }
    }
  }
  //删除购物车
  const delCart = async (skuId)=>{
    if(isLogin.value){
      await delCartAPI([skuId])
      updateNewList()
    } else {
      const idx = cartList.value.findIndex((item) => skuId === item.skuId)
      cartList.value.splice(idx,1)
    }
  }

  //清除购物车
  const clearCart = ()=>{
    cartList.value = []
  }

  //单选功能
  const singleCheck = (skuId,selected)=>{
    //通过skuId找到要修改的一项，然后改变selected
    const item = cartList.value.find((item)=>item.skuId === skuId)
    item.selected = selected
  }

  const allCount = computed(()=> cartList.value.reduce((a,c)=>a+c.count,0))
  const allPrice = computed(()=> cartList.value.reduce((a,c)=>a+c.count*c.price,0))

  //是否全选
  const isAll = computed(()=> cartList.value.every((item) => item.selected))

  //全选功能
  const allCheck = (selected)=>{
    cartList.value.forEach(item => item.selected = selected)
  }

  //已选择数量
const selectedCount = computed(()=> cartList.value.filter(item => item.selected).reduce((a,c)=>a+c.count,0))
  //已选择商品价钱合计
const selectedPrice = computed(()=> cartList.value.filter(item => item.selected).reduce((a,c)=>a+c.count*c.price,0))


  return {
    cartList,
    allCount,
    allPrice,
    isAll,
    selectedPrice,
    selectedCount,
    addCart,
    addCart,
    delCart,
    singleCheck,
    clearCart,
    allCheck,
    updateNewList
  }
},{
  persist:true,
})
