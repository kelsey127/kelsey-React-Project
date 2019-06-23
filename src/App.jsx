import React, {Component} from 'react';
import { Route,Switch } from 'react-router-dom'
import Login from './pages/login';
import Admin from './pages/admin';
import './assets/less/index.less';

class App extends Component {
  render() {
    return <Switch>
     <Route path="/login" component={Login}/>
      <Route path ="/" component={Admin}/>
    </Switch>
  }
}
export default App;