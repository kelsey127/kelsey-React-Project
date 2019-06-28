
import React, { Component } from 'react';
import { Button,Table,Card,Icon,Modal,message} from 'antd';
import MyButton from '../../components/my-button'
import './index.less';
import {reqCategories,reqAddCategory,reqUpdateCategoryName} from '../../api';
import AddCategoryForm from './add-category-form';
import UpdateCategoryNameForm from './update-category-name';

export default class Category extends Component {

  state ={
    categories:[],//一级菜单
    subCategories:[],//二级菜单
    isShowSubcategories:false,
    isShowAddCategory: false,
    isShowUpdateCategoryName:false,
    loading:true
  }

  //初始化category，让它为一个对象
  category = {};

  //请求数据动态展示品类内容
   componentDidMount() {
    this.fetchCategories('0')
  }

  //封装请求分类数据
  fetchCategories = async (parentId) =>{
    this.setState({
      loading:true
    })

    const result = await reqCategories(parentId)
    if(result) {
      if(parentId ==="0"){
        this.setState({
          categories:result
        })
      }else {
        this.setState({
          subCategories:result,
          isShowSubcategories:true
        });
      }
    }

    this.setState({
      loading:false
    });
  }

  //添加分类
  addCategory = () => {
    const { form } = this.addCategoryForm.props;

    form.validateFields(async (err, values) => {
      if (!err) {
        // 校验通过
        console.log(values);
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName);

        if (result) {
          // 添加分类成功~
          console.log(result);
          message.success('添加分类成功~', 2);
          // 清空表单数据
          form.resetFields(['parentId', 'categoryName']);

          const options = {
            isShowAddCategory: false
          };

          const{ isShowSubcategories } = this.state;

          if (result.parentId === '0') {
            options.categories = [...this.state.categories, result];
          }else if(isShowSubcategories && result.parentId === this.parentCategory._id){
            //进入这个判断后肯定是二级分类的数据，二级分类的数据和一级分类的_id相等，如果相等才能展示
            options.subCategories = [...this.state.subCategories, result];
          }
          // 统一更新
          this.setState(options);
        }
      }
    })
  };

  //切换显示
  toggleDisplay = (stateName, stateValue) => {
    return () => {
      this.setState({
        [stateName]: stateValue
      })
    }
  };


  hideUpdateCategoryName = () => {
    // 清空表单项的值，这个是为了让初始化的值不变
    this.updateCategoryNameForm.props.form.resetFields(['categoryName']);
    // 点击取消隐藏对话框
    this.setState({
      isShowUpdateCategoryName: false
    })
  };

  saveCategory = (category) => {
    return () => {
      // 保存要更新的分类数据
      this.category = category;
      // console.log(this);
      this.setState({
        isShowUpdateCategoryName: true
      })
    }
  };

  //点击确认修改
  updateCategoryName = () => {
    const { form } = this.updateCategoryNameForm.props;
    // 校验表单，收集数据
    form.validateFields(async   (err, values) => {
      if (!err) {
        const { categoryName } = values;
        const categoryId = this.category._id;
        // 发送请求
        const result = await reqUpdateCategoryName(categoryId, categoryName);

        if (result) {
          const { parentId } = this.category;
          let categoryData = this.state.categories;
          let setName = 'categories';
          if(parentId !== '0') {
            //二级分类
            categoryData = this.state.subCategories;
            setName = 'subCategories'
          }

          // 保留原数据，生成新数组
          const categories = categoryData.map((category) => {
            let { _id, name, parentId } = category;
            // 找到对应id的category，修改分类名称
            if (_id === categoryId) {
              name = categoryName;
              return {
                _id,
                name,
                parentId
              }
            }
            // 没有修改的数据直接返回
            return category
          });

          // 清空表单项的值 隐藏对话框
          form.resetFields(['categoryName']);

          message.success('更新分类名称成功~', 2);

          this.setState({
            isShowUpdateCategoryName: false,
            [setName]:categories
          })
        }
      }
    })
  };

  //点击查看子品类
   showSubCategory = (category) =>{
    return async ()=> {
      this.parentCategory = category;   //不要放错位置，这个点击后返回的函数里面的，这样才能拿到那个值
      this.fetchCategories(category._id);
    }
  }

  //点击二级分类中的一级分类返回
  goBack = () => {
     this.setState({
       isShowSubcategories:false
     })
  }


  render() {
    const {categories, subCategories,isShowAddCategory,isShowUpdateCategoryName,isShowSubcategories,loading} = this.state;
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        // dataIndex: 'operation',
        className:'category_operation',
        render: category => {
          return <div>
            <MyButton onClick={this.saveCategory(category)}>修改名称</MyButton>
            {
              isShowSubcategories?null: <MyButton onClick ={this.showSubCategory(category)}>查看其子品类</MyButton>
            }
          </div>}
      },
    ];

    // const data = this.state.categories;

    return <div>
      <Card type="inner" title={isShowSubcategories?<div><MyButton onClick={this.goBack}>一级分类列表</MyButton><Icon type='arrow-right'/>&nbsp;&nbsp;<span>{ this.parentCategory.name}</span></div>:'一级分类列表'}
            extra={<Button type='primary' onClick={this.toggleDisplay('isShowAddCategory', true)}><Icon type="plus" />添加品类</Button>}>
        <Table
          columns={columns}
          dataSource={isShowSubcategories?subCategories:categories}
          bordered
          pagination={{
            showSizeChanger:true,
            pageSizeOptions:['3','6','9','12'],
            defaultPageSize:3,
            showQuickJumper:true
          }}
          rowKey='_id'
          loading={loading}
        />
        <Modal
          title="添加分类"
          visible={isShowAddCategory}
          onOk={this.addCategory}
          onCancel={this.toggleDisplay('isShowAddCategory', false)}
          okText="确认"
          cancelText="取消"
        >
          <AddCategoryForm categories={categories} wrappedComponentRef={(form)=>this.addCategoryForm=form}/>
        </Modal>

        <Modal
          title="修改分类名称"
          visible={isShowUpdateCategoryName}
          onOk={this.updateCategoryName}
          onCancel={this.hideUpdateCategoryName}
          okText="确认"
          cancelText="取消"
          width={250}
        >
          <UpdateCategoryNameForm categoryName={this.category.name} wrappedComponentRef={(form) => this.updateCategoryNameForm = form}/>
        </Modal>
      </Card>
    </div>
  }
}