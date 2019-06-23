import React, { Component } from 'react';
import { Form, Icon, Input, Button,message } from 'antd';
import logo from './logo.png';
import './index.less';
const axios = require('axios');

const Item = Form.Item;
class Login extends Component {

 //获取表单的值并发送请求
  login = (e) => {
    e.preventDefault();
    this.props.form.validateFields((error,values)=>{
      if(!error){
        //error代表表单验证结果
        const {username,password} = values;
        console.log(values);
        //发送请求
        axios.post("http://localhost:5000/login",{username,password})
          .then((res)=>{
            console.log(res)
              if(res.status === 0) {
                this.props.history.replace('/');
              }else {
                //可能用户发送的账号或者密码错误，导致请求失败，也会返回错误的信息，所以要提示
                message.error(res.data.msg,2)
                //登录失败后清空密码
                this.props.form.resetFields([password])
              }
          })
          .catch((err)=>{
            message.error('网络状态异常，请刷新重试',2)
          })
      }else {
        console.log('表单校验失败:',error);
      }
    })

  }

  //自定义校验规则
  validator = (rule,value,callback) => {
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


  render() {
    //获取from的方法
    const {getFieldDecorator} = this.props.form;

    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form onSubmit={this.login} className="login-form">

          <Item>
            {
              getFieldDecorator(
                'username',{
                  rules:[
                    {
                      validator:this.validator
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
                      validator: this.validator
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
}


export default Form.create()(Login);