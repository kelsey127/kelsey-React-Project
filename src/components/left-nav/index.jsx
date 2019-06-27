import React, { Component } from 'react';
import {Icon,Menu} from "antd";
import logo from '../../assets/images/logo.png'
import './index.less'
import PropTypes from 'prop-types';
import { Link,withRouter} from 'react-router-dom';
import menuList from '../../config/menu-config'
const { SubMenu,Item } = Menu;


class LeftNav extends Component {
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
    let {pathname} = this.props.location;

    //处理商品那里不会自动展开和选中
    const pathnameReg = /^\/product\//;
    if(pathnameReg.test(pathname)){
      pathname = pathname.slice(0,8)
    }

    let isHome = true ;
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
            children.map((item)=> {
              if(item.key === pathname){
                this.selectedKey = menu.key;
                isHome = false;
              }
             return this.createMenu(item);
            })
          }
        </SubMenu>
      }else {
          if(menu.key === pathname) isHome = false;
        return this.createMenu(menu)
      }
    })

    this.SelectedKey = isHome? '/home':pathname ;

  }

  render() {
    const { collapsed } = this.props;
    return (
      <div>
        <div className="left-nav-logo">
          <img src={logo} alt=""/>
          <h1 style={{display:collapsed?'none':'block'}}>硅谷后台</h1>
        </div>
        <Menu theme="dark" defaultSelectedKeys={[this.SelectedKey]} defaultOpenKeys={[this.selectedKey]} mode="inline">
          {
            this.menus
          }
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav);