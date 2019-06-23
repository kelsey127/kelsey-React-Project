//发送登录请求
import ajax from './ajax'

export const reqLogin = (username,password) => ajax('/login',{username,password},'POST');

