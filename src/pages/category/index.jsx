import React, { Component } from 'react';
import { Button,Table,Card,Icon,Modal} from 'antd';
import MyButton from '../../components/my-button'
import './index.less';
import {reqCategories,reqAddCategory} from '../../api';
import AddCategoryForm from './add-category-form';

export default class Category extends Component {

  state ={
      categories:[],
      isShowAddCategory: false
  }
  //请求数据动态展示品类内容
  async componentDidMount() {
    const result = await reqCategories("0")
    if(result) {
      this.setState({
        categories:result
      })
    }
  }

  //添加品类
  showAddCategory = () => {
    this.setState({
      isShowAddCategory: true
    })
  };

  //隐藏添加品类
  hideAddCategory = () => {
    this.setState({
      isShowAddCategory: false
    })
  }

  render() {
    const {categories, isShowAddCategory} = this.state;
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
       <Card type="inner" title="一级分类列表" extra={<Button type='primary' onClick={this.showAddCategory}><Icon type="plus" />添加品类</Button>}>
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
         <Modal
           title="添加分类"
           visible={isShowAddCategory}
           onOk={this.addCategory}
           onCancel={this.hideAddCategory}
           okText="确认"
           cancelText="取消"
         >
          <AddCategoryForm categories={categories} wrappedComponentRef={(form)=>this.addCategoryForm=form}/>
         </Modal>

       </Card>
   </div>
  }
}
