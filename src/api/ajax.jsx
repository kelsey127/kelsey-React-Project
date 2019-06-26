import {message} from "antd";
import axios from 'axios';

export default function ajax(url,data={},method='get') {
  //处理get 请求的参数
  let reqParams = data;
  //把请求全部转换为小写
  method = method.toLowerCase()

  if(method==='get'){
    reqParams = {
      params:data
    }
  }

  return axios[method](url,reqParams)
    .then((res)=>{
      //返回来的是一个对象
      const { data } = res;
      if(data.status === 0) {
        return data.data || {};
      }else {
        message.error(data.msg,2)
      }
    })
    .catch((err)=>{
      message.error('网络状态异常，请刷新重试',2)
    })
}


