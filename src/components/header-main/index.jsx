
import React, { Component } from 'react';
import MyButton from '../my-button';
import './index.less'
import {getItem, removeItem} from '../../utils/storage-tools'
import reqweather from '../../api'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import dayjs from 'dayjs'
import menuList from '../../config/menu-config'


 class HeaderMain extends Component {

  state = {
    sysTime:Date.now(),
    weather:"晴",
    weatherImg: "http://api.map.baidu.com/images/weather/day/qing.png"
  }

  //点击退出
   logout = () => {
     Modal.confirm({
       title: '您确认要退出登录吗？',
       okText: '确认',
       cancelText: '取消',
       onOk: () => {
         // 清空本地数据
         removeItem();
         // 退出登录
         this.props.history.replace('/login');
       }
     })
   };

   componentWillMount() {
    //登录成功后显示用户名的
     this.username =  getItem().username;
     //标题切换
     this.title = this.getTitle(this.props);
  }

  //页面渲染完成后获取天气
 async componentDidMount() {
    const {promise,cancel} = reqweather();
    this.cancel = cancel;
    const result = await promise;

    if(result){
      this.setState(result)
    }

   this.timeID = setInterval(()=>{
      this.setState({
        sysTime:Date.now()
      })
    },1000)
  }

  componentWillUnmount() {
     clearInterval(this.timeID);
     this.cancel();
  }

   //在这个周期函数中，nextProps是最新的值，而不是this.props
   //因为只有这个函数在组件切换更新的时候没有被触发，title的改变我们只需要做一次，因此放这里
  componentWillReceiveProps(nextProps, nextContext) {
    this.title = this.getTitle(nextProps)
  }
    //标题切换
   getTitle = (nextProps) => {
    let {pathname} = nextProps.location;

    // 处理商品页标题不自动显示的问题
     const pathnameReg = /^\/product\//;
     if(pathnameReg.test(pathname)){
       pathname = pathname.slice(0,8)
     }

     for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i]
      if(menu.children) {
        for (let j = 0; j < menu.children.length; j++) {
          const item = menu.children[j]
          //匹配标题
          if(item.key === pathname){
            return item.title;
          }
        }
      }else {
        if(menu.key === pathname){
          return menu.title;
        }
      }
    }
  };

   render() {
     const {sysTime,weather,weatherImg} = this.state;
    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={weatherImg} alt=""/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(HeaderMain)