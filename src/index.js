import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
//重命名为Router
import { BrowserRouter as Router} from 'react-router-dom';

ReactDom.render(<Router><App/></Router>,document.getElementById('root'));

