//发送登录请求
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from "antd";

export const reqLogin = (username,password) => ajax('/login',{username,password},'POST');

export const reqValidateUserInfo = (id) =>ajax('/validate/user',{id},'POST');

//发送天气请求

export default function reqweather() {
  let cancel  = null;
  const promise = new Promise((resolve, reject) => {
   cancel = jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',{},(err,data)=>{
      if(!err){
        const{dayPictureUrl,weather} = data.results[0].weather_data[0];
        resolve({
          weatherImg:dayPictureUrl,
          weather
        })
      }else {
        message.error('天气信息更新失败，请刷新重试')
        resolve()
      }
    });
  });
  return {
    promise,
    cancel
  }
}

//分类请求
export const reqCategories = (parentId) =>ajax('/manage/category/list',{parentId});

//添加分类
export const reqAddCategory = (parentId,categoryName) =>ajax('/manage/category/add',{parentId,categoryName},'POST');

//更改名称
export const reqUpdateCategoryName = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');

export const reqProducts = (pageNum,pageSize) =>ajax('/manage/product/list',{pageNum,pageSize});