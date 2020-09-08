import React, { Component } from "react";
import { Route } from "react-router-dom";

import Home from "./Home";
import { ArticleIndex } from './components/Admin/Article/ArticleIndex';
import { ArticleForm } from './components/Admin/Article/ArticleForm';
import { Layout } from './components/Custom/Layout';
import { UserIndex } from './components/Admin/UserIndex';
import Login from "./auth/Login";
import { NewArticlePreview } from './components/Custom/NewArticlePreview';
import { UserIndexArticle } from './components/User/UserIndexArticle';
import { UserArticleForm } from './components/User/UserArticleForm';
import { UserForm } from './components/Admin/UserForm';


export default class App extends Component {
    constructor() {
        super();

        this.state = {
            isAdmin: false,
            user: {}
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    componentDidMount() {
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        debugger
        this.setState(
            {
                isAdmin: localStorage.getItem('isAdmin'),
                user: localStorage.getItem('userEmail')
            });       
    }

    handleLogout() {
        debugger
        localStorage.clear();
        this.setState(
            {
                isAdmin: false,
                user: {}
            });
    }

    handleLogin(data) {        
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userID', data.userID);
        localStorage.setItem('isAdmin', data.isAdmin);

        this.setState(
            {
                isAdmin: data.isAdmin,
                user: data.email
            });
    }

    render() {
        return (
            <Layout
                handleLogout={this.handleLogout}
            >
               
                <Route
                    exact path='/'
                    component={Home}
                />
                <Route
                    path='/article-index'
                    component={ArticleIndex}
                />
                <Route
                    path='/article-new/:id'
                    component={ArticleForm}
                />
                <Route
                    path='/user-index'
                    component={UserIndex} />
                <Route
                    path='/user-article-index'
                    component={UserIndexArticle}
                />
                <Route
                    path='/article-form-preview-user/:id'
                    component={UserArticleForm}
                />
                <Route
                    path='/article-form-preview/:id/:homePage'
                    component={NewArticlePreview}
                />
                <Route
                    path='/user-form/:id'
                    component={UserForm}
                />
                <Route
                    path='/login'
                    render={props => (
                        <Login
                            {...props}
                            handleLogin={this.handleLogin}
                        />
                    )} />
            </Layout>
        );
    }
}