// 封装分类数据相关代码
import { getCategoryAPI } from '@/apis/category';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { onBeforeRouteUpdate } from 'vue-router';


export function useCategory(){
  const categoryData = ref({})
  const route = useRoute()
  //id = 默认值，在没有参数传入时默认使用当前路由的id
  const getCategory = async (id = route.params.id) => {
    const res = await getCategoryAPI(id)
    categoryData.value = res.result
  }
  onMounted(() => getCategory())
  //路由守卫,监听路由参数变化
  onBeforeRouteUpdate((to) => {
    getCategory(to.params.id)
  })
  return {
    categoryData
  }
}
