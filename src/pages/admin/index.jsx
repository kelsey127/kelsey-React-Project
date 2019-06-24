import React, { Component } from 'react';
import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';
import { Layout} from 'antd';
import {getItem} from '../../utils/storage-tools'
import {reqValidateUserInfo} from '../../api'
const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
  //控制左边收缩的，flase不收缩
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  //用户登录成功后，点击刷新页面，或者输入其他组件的地址导致页面刷新后保持登录状态而不用去重新登录
  async componentWillMount() {
    //user有值进入第一个判断，没有值则直接转到登录界面
    const user = getItem();
    //用户登录成功后发送请求判断_id是否真的存在
    if(user && user._id){
      const result = await reqValidateUserInfo(user._id);
     //如果有结果，找到了，就直接return 不用执行下面转到登录界面的代码
      if(result) return ;
    }
    this.props.history.replace("/login");
  }

  render() {
    const {collapsed} = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, minHeight: 100 }}>
            <HeaderMain />
          </Header>
          <Content style={{ margin: '25px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              欢迎使用硅谷后台管理系统
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}