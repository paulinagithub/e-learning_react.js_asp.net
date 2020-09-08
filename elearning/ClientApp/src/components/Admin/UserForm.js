import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../User/ProgressBar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';




export class UserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            articles: [],
            allArticles: [],
            allArticlesFroDept: [],
            loading: true,
            procent: 0,
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleUnDo = this.handleUnDo.bind(this);
        this.countProcent = this.countProcent.bind(this);

    }

    componentDidMount() {     
        this.getUserByIDFromDataBase();
        this.getArticleForUserFromDataBase();
        this.getAllArticlesFromDataBase();       
        localStorage.setItem('previewUserID', this.props.match.params.id);
        this.getArctilcesForDeptFromDataBase(localStorage.getItem('previewUserID'));

    }

    handleDelete(event) {        
        event.preventDefault();
        var clickArticleID = event.currentTarget.value      
        this.removeItemsFromDataBase(clickArticleID, this.state.user.userID);
    };

    handleAdd(event) {
        event.preventDefault();        
        var clickArticleID = event.currentTarget.value
        this.getInfoIfArticleIsAssigned(this.state.user.userID, clickArticleID)    
    };

    handleUnDo(event) {
        event.preventDefault();
        this.props.history.push('/user-index')
    }

    countProcent(articles) {
        var sumOfAllArticles = this.state.articles.length;
        var sumOfReadArticles = 0;
        {
            {
                articles.filter((item) => item.item2).map((item, index) => {
                    return sumOfReadArticles = sumOfReadArticles + 1;
                })
            }
        }

        var procentOfComplate = (sumOfReadArticles * 100) / sumOfAllArticles;
        this.state.procent = Math.round(procentOfComplate);
    }
    renderUserInfo(user) {
        return (
            <div>
                <br />
            <legend>Dane użytkownika</legend>  
                     
            <Form >
                <Form.Group as={Row}>
                    <Form.Label column sm={1}>
                        Imie:
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control plaintext readOnly defaultValue={user.firstName} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={1}>
                        Nazwisko:
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control plaintext readOnly defaultValue={user.lastName} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={1}>
                        Stanowisko:
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control plaintext readOnly defaultValue={user.position} />
                    </Col>
                </Form.Group>
                </Form>
            </div>
        );

    }

    renderArticleTable(articles) {
        this.countProcent(articles);
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Nazwa</th>
                        <th>Material zostal opanowany</th>
                        <th>Podgląd/Usuń</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{article.item1.title}</td>
                            <td>
                                {`${article.item2
                                ? 'Tak'
                                : 'Nie'}`
                                }
                            </td>
                            <td>                             
                                <Link
                                    to={{
                                        pathname: `/article-form-preview/${article.item1.idArticle}/user-form`,
                                    }}
                                >
                                    <button className="btn btn-outline-secondary">
                                        Podgląd
                                    </button>
                                </Link>
                                <button className="btn btn-outline-danger ml-4"
                                    value={article.item1.idArticle}
                                    onClick={this.handleDelete}>
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    renderAllArticlesTable(articles) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Nazwa</th>
                        <th>Podgląd/Dodaj</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{article.title}</td>
                            <td>
                                <Link
                                    to={{
                                        pathname: `/article-form-preview/${article.idArticle}/user-form`,
                                    }}
                                >
                                    <button className="btn btn-outline-secondary">
                                        Podgląd
                                    </button>
                                </Link>
                                <button className="btn btn-outline-warning ml-4"
                                    value={article.idArticle}
                                    onClick={this.handleAdd}

                                    >
                                    Dodaj
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    renderArticlesForDeptTable(articles) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Nazwa</th>
                        <th>Podgląd/Dodaj</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{article.title}</td>
                            <td>
                                <Link
                                    to={{
                                        pathname: `/article-form-preview/${article.idArticle}/user-form`,
                                    }}
                                >
                                    <button className="btn btn-outline-secondary">
                                        Podgląd
                                    </button>
                                </Link>
                                <button className="btn btn-outline-warning ml-4"
                                    value={article.idArticle}
                                    onClick={this.handleAdd}

                                >
                                    Dodaj
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    render() {
        debugger
        let userInfoContents = this.state.user == undefined
            ? <p><em>Loading...</em></p>
            : this.renderUserInfo(this.state.user);
        let articleForUser = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderArticleTable(this.state.articles);
        let articlesForDept = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderArticlesForDeptTable(this.state.allArticlesFroDept);
        let allArticle = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderAllArticlesTable(this.state.allArticles);

        return JSON.parse(localStorage.getItem('isAdmin')) ?
            (
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={this.handleUnDo}
                    >
                        Powrót do strony głównej
                    </button>
                    {userInfoContents}
                    <br />
                    <div>
                        <legend>
                            Materiał opanowany przez użytkownika:
                        </legend>
                        
                        <div
                            className="App"
                        >
                            <ProgressBar
                                bgcolor="#6a1b9a"
                                completed={this.state.procent}
                            />
                        </div>
                    </div>
                    <br />
                    <legend>
                        Artykuły przypisane dla użytkownika
                    </legend>

                    <br />
                    {articleForUser}
                    <br />
                    <legend>
                        Proponowane dla działu
                    </legend>
                    {articlesForDept}
                    <legend>
                        Wszystkie artykuły
                     </legend>
                    {allArticle}
                </div>
            ) :
            null;
    }

    async getUserByIDFromDataBase() {
        debugger
        let id = this.props.match.params.id;
        if (id !== undefined) {
            const response = await fetch("/user/userID/" + id);
            const data = await response.json();   
            this.setState(
                {
                    user: data,
                    loading: false
                });
        }
        else
        {
            this.setState(
                {
                    loading: false
                });
        }
    }
    async removeItemsFromDataBase(articleID, userID) {
        debugger
        const response = await fetch('userArticle/' + articleID + "/" + userID,
            {
                method: 'DELETE',
            })
            .then(res => res.text())
            .then(res => console.log(res));
        this.getArticleForUserFromDataBase()
    }

    async getArticleForUserFromDataBase() {
        let id = this.props.match.params.id;
        if (id !== undefined) {
            const response = await fetch("/userArticle/" + id);  
            const data = await response.json();            
            this.setState(
                {
                    articles: data,
                    loading: false
                });
        }
        else {
            this.setState(
                {
                    loading: false
                });
        }
    }

    async getAllArticlesFromDataBase() {
        const response = await fetch("/userArticle");
        const data = await response.json();
        this.setState(
            {
                allArticles: data
            });       
    }

    async getArctilcesForDeptFromDataBase(userID) {
        debugger
        const response = await fetch("/userArticle/dept/" + userID);

        try {
            const data = await response.json();
            this.setState(
                {
                    allArticlesFroDept: data
                });
        }
        catch (e)
        {
        }     
    }
    async getInfoIfArticleIsAssigned(userID, articleID) {
        const response = await fetch("/userArticle/" + userID + "/" + articleID);
        const data = await response.json();
        await this.addArticleToUser(articleID, userID, data)
    }
    async addArticleToUser(articleID, userID, data) {
        debugger
        if (data)
        {
            alert("Artykul zostal juz przypisany temu uzytkownikowi");
        }
        else
        {
            var form = new FormData();
            form.append('a', 1);
            fetch("/userArticle/" + articleID + "/" + userID, { method: "POST", body: form })
                .then(c => this.getArticleForUserFromDataBase());
        }    
    }
}




