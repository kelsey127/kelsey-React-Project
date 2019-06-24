import React  from 'react';
import { Form, Icon, Input, Button } from 'antd';
import logo from '../../assets/images/logo.png';
import './index.less';
import { reqLogin } from '../../api';
import {setItem} from '../../utils/storage-tools'

const Item = Form.Item;
function Login(props) {

 //获取表单的值并发送请求
  const login = (e) => {
    e.preventDefault();
    props.form.validateFields(async (error,values)=>{
      if(!error){
        //error代表表单验证结果
        const {username,password} = values;
        //发送请求
        const result = await reqLogin(username,password)
          if(result){
            setItem(result)
            props.history.replace('/');
          }else{
            props.form.resetFields([password])
          }
      }else {
        console.log('表单校验失败:',error);
      }
    })

  }

  //自定义校验规则
  const validator = (rule,value,callback) => {
    const name = rule.fullField === 'username'?'用户名':'密码';

    if(!value){
      callback(`必须输入用户名${name}`)
    }else if(value.length<4){
      callback(`${name}必须大于4位`)
    }else if(value.length>15){
      callback(`${name}必须小于15位`)
    }else if(!/^[a-zA-Z_0-9]+$/.test(value)){
      callback(`${name}包含字母，数字，下划线`)
    }else {
      //不传参代表校验通过
      callback();
    }
  }

  //获取from的方法
    const {getFieldDecorator} = props.form;

    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form onSubmit={login} className="login-form">

          <Item>
            {
              getFieldDecorator(
                'username',{
                  rules:[
                    {
                      validator:validator
                    }
                  ]
                }
              )(
                <Input className="login-input" prefix={<Icon type="user" />} placeholder="用户名"/>
              )
            }
          </Item>

          <Item>
            {
              getFieldDecorator(
                'password',
                {
                  rules: [
                    {
                      validator:validator
                    }
                  ]
                }
              )(
                <Input className="login-input" prefix={<Icon type="lock" />} placeholder="密码" type="password"/>
              )
            }
          </Item>

          <Item>
            <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
          </Item>
        </Form>
      </section>
    </div>;
}
export default Form.create()(Login);