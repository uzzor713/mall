import httpInstance from '@/utils/http.js'


//获取banner

export function getBannerAPI () {
  return httpInstance({
    url: '/home/banner'
  })
}
