import React, { Component } from 'react';
import { Form,Select,Input} from 'antd';
import PropTypes from 'prop-types';
const { Item, } = Form;
const { Option } = Select;

 class AddCategoryForm extends Component {
   static propTypes = {
     categories: PropTypes.array.isRequired
   };

   //分类名称输入自定义验证规则
   validator = (rule, value, callback) => {
     if (!value) return callback('请输入分类名称~');
     const result = this.props.categories.find((category) => category.name === value);
     if (result) {
       callback('输入的分类名称已存在，请重新输入');
     } else {
       callback();
     }
   };

   render() {
    const { getFieldDecorator } = this.props.form;
    return<Form>
      <Item label="所属分类">
        {
          getFieldDecorator(
            'parentId', {
              initialValue: '0'
            }
          )(
            <Select style={{ width: '100%' }} onChange={this.handleChange}>
              <Option value="0" key="0">一级分类</Option>
              {
                this.props.categories.map((category) => {
                  return <Option value={category._id} key={category._id}>{category.name}</Option>
                })
              }
            </Select>
          )
        }
      </Item>
      <Item label="分类名称">
        {
          getFieldDecorator(
            'categoryName',
            {
              rules: [{validator: this.validator}]
            }
          )(
            <Input placeholder="请输入分类名称"/>
          )
        }
      </Item>
    </Form>;
  }
}

export default Form.create()(AddCategoryForm);