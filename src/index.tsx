import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import HomePage from './components/HomePage/HomePage';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { ContactPage } from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';
import UserDashboard from './components/UserDashboard/UserDashboard';
import DashboardCategory from './components/DashboardCategory/DashboardCategory';
import DashboardBook from './components/DashboardBook/DashboardBook';
import DashboardLocation from './components/DashboardLocation/DashboardLocation';
import DashboardPublisher from './components/DashboardPublisher/DashboardPublisher';
import DashboardAuthor from './components/DashboardAuthor/DashboardAuthor';
import DashboardPhoto from './components/DashboardPhoto/DashboardPhoto';
import BookPage from './components/BookPage/BookPage';
import { LogoutPage } from './components/LogoutPage/LogoutPage';





/*
const menuItems = [
  new MainMenuItem("Home", "/"),  
  new MainMenuItem("Log in", "/login/"),
  new MainMenuItem("Contact", "/contact/"),
  new MainMenuItem("Register", "/register/"),  
]
  
*/


ReactDOM.render(
  <React.StrictMode>
    { /* <MainMenu items={ menuItems }></MainMenu> */ }
    <HashRouter>
      <Switch>
        <Route exact path="/" component={ HomePage} />
        <Route path="/contact" component={ ContactPage } />
        <Route path="/login" component={ UserLoginPage } />
        <Route path="/logout" component={ LogoutPage } />
        <Route path="/register" component={ UserRegistrationPage } />
        <Route path="/category/:cId" component={ CategoryPage } />
        <Route path="/book/:bookId" component={ BookPage } />
        <Route exact path="/dashboard/" component={ UserDashboard } />
        <Route path="/dashboard/category" component={ DashboardCategory } />
        <Route path="/dashboard/book/" component={ DashboardBook } />
        <Route path="/dashboard/location/" component={ DashboardLocation } />
        <Route path="/dashboard/publisher/" component={ DashboardPublisher } />
        <Route path="/dashboard/author/" component={ DashboardAuthor } /> 
        <Route path="/dashboard/photo/:bookId" component={ DashboardPhoto } /> 
      </Switch>    
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
