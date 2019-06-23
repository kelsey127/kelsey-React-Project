import React, { Component } from 'react';
import {Icon,Menu} from "antd";
import logo from '../../assets/images/logo.png'
import './index.less'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import menuList from '../../config/menu-config'
const { SubMenu,Item } = Menu;


export default class Login extends Component {
  //接收这个值是为了控制‘硅谷后台’ h1标签里面的文字是否隐藏
  static propTypes = {
    collapsed:PropTypes.bool.isRequired
  }

  createMenu = (menu) => {
    return <Item key={menu.key}>
      <Link to={menu.key}>
        <Icon type={menu.icon} />
        <span>{menu.title}</span>
      </Link>
    </Item>
  };

    //动态创建菜单
  componentWillMount() {

    this.menus = menuList.map((menu)=>{
      const children = menu.children;
      //判断是否是二级菜单
      if(children){
        return <SubMenu
          key={menu.key}
          title={
              <span>
                <Icon type={menu.icon} />
                <span>{menu.title}</span>
              </span>
          }
        >
          {
            children.map((item)=> this.createMenu(item))
          }
        </SubMenu>
      }else {
        return this.createMenu(menu)
      }
    })
  }

  render() {
    const { collapsed } = this.props;
    return (
      <div>
        <div className="left-nav-logo">
          <img src={logo} alt=""/>
          <h1 style={{display:collapsed?'none':'block'}}>硅谷后台</h1>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {
            this.menus
          }
        </Menu>
      </div>
    )
  }
}