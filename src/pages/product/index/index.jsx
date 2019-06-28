import React, { Component } from 'react';
import { Card, Button, Icon, Table, Select, Input } from 'antd';
import MyButton from '../../../components/my-button';
import { reqProducts } from '../../../api';
import './index.less'

const {Option} = Select;

export default class Index extends Component {

  state = {
    products: [],
    total:0,
    loading:true
  };

  async componentDidMount() {
    this.getProducts(1,3)
  };

  //封装页面展示请求
  getProducts = async (pageNum,pageSize) =>{
    this.setState({
      loading:true
    });
    const result = await reqProducts(pageNum, pageSize);
    if (result) {
      this.setState({
        products: result.list,
        total:result.total
      })
    }
    this.setState({
      loading:false
    });
  }


  showAddProduct = () => {
    this.props.history.push('/product/saveupdate');
  };


 render() {

  const{ products ,total,loading} = this.state;

   const columns =[
     {
       title:'商品名称',
       dataIndex:'name'
     },
     {
       title:'商品描述',
       dataIndex:'desc'
     },
     {
       title:'价格',
       dataIndex:'price'
     },
     {
       className: 'product-status',
       title: '状态',
       dataIndex: 'status',
       render: (status) => {
         return status === 1
           ? <div><Button type="primary">上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
           : <div><Button type="primary">下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
       }
     },
     {
       className: 'product-status',
       title: '操作',
       render: (product) => {
         return <div>
           <MyButton>详情</MyButton>
           <MyButton>修改</MyButton>
         </div>
       }
     },
   ]

    return   <Card
        title={
          <div>
            <Select defaultValue={0}>
              <Option key={0} value={0}>根据商品名称</Option>
              <Option key={1} value={1}>根据商品描述</Option>
            </Select>
            <Input placeholder='关键字' className="search-input"/>
            <Button type='primary'>搜索</Button>
          </div>
        }
        extra={<Button type="primary" onClick={this.showAddProduct}><Icon type="plus"/>添加产品</Button>}
       >
        <Table
          columns={columns}
          dataSource={products}
          bordered
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            defaultPageSize: 3,
            total,
            onChange:this.getProducts,//后台分页请求
            onShowSizeChange:this.getProducts,// 一页要显示多少数据
            loading
          }}
          rowKey='_id'
        >
        </Table>
      </Card>
 }
}