import React, { Component } from 'react';
import { Table,Card,Icon} from 'antd';
import MyButton from '../../components/my-button'
import './index.less';
import {reqCategories} from '../../api'

export default class Category extends Component {

  state ={
      categories:[]
  }

  async componentDidMount() {
    const result = await reqCategories("0")
    if(result) {
      this.setState({
        categories:result
      })
    }
  }

  render() {
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        className:'category_operation',
        render: text => {
          return <div>
          <MyButton href="javascript:;">修改名称</MyButton>
          <MyButton href="javascript:;">查看其子品类</MyButton>
        </div>}
      },
    ];

    // const data = this.state.categories;

   return <div>
       <Card type="inner" title="一级分类列表" extra={<a href="#"><Icon type="plus" />添加品类</a>}>
         <Table
           columns={columns}
           dataSource={this.state.categories}
           bordered
           pagination={{
             showSizeChanger:true,
             pageSizeOptions:['3','6','9','12'],
             defaultPageSize:3,
             showQuickJumper:true
           }}
         />
       </Card>
   </div>
  }
}