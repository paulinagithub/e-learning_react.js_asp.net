import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from "./ProgressBar";
import Moment from 'react-moment';
import moment from 'moment';

export class UserIndexArticle extends Component {
    static displayName = UserIndexArticle.name;

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            userID: localStorage.getItem('userID'),
            loading: true,
            procent: 0,
            inTime: true
        };
        this.countProcent = this.countProcent.bind(this);
        this.checkIfUserIsLate = this.checkIfUserIsLate.bind(this);

    }

    componentDidMount() {
        this.getArticlesFromDataBase();
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

    checkIfUserIsLate(date, isRead) {
        debugger
        var now = moment().format('2020/08/30');
        var now1 = moment().format('YYYY/MM/DD');

        var d = moment(date).format('YYYY/MM/DD');

        debugger
        if (now > d) {
            if (isRead) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }      
    }
    renderArticleTable(articles) {     
        this.countProcent(articles);
        return (
            <table
                className='table table-striped'
                aria-labelledby="tabelLabel"
            >
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Nazwa</th>
                        <th>Data dodania</th>
                        <th>Ostateczny termin przeczytania</th>
                        <th>Czy przeczytane</th>
                        <th>Podgląd</th>

                    </tr>
                </thead>
                <tbody>
                    {articles.map((article, index) =>
                        <tr
                            key={index}
                        >
                            <td>
                                {index + 1}
                            </td>
                            <td>
                                {article.item1.title}
                            </td>
                            <td>
                                <Moment
                                    format="YYYY/MM/DD"
                                >
                                    {article.item1.dateCreation}
                                </Moment>
                            </td>
                            <td>
                                <p
                                    style={this.checkIfUserIsLate(article.item3, article.item2)
                                        ? { color: 'black' }
                                        : { color: 'red' }}
                                >
                                    <Moment
                                        format="YYYY/MM/DD"
                                    >
                                        {article.item3}                                     
                                    </Moment>
                                    {`${this.checkIfUserIsLate(article.item3, article.item2)
                                        ? ''
                                        : ' Spoznienie!!!!'}`
                                    }
                                </p>
                            </td>
                            <td>
                                {`${article.item2
                                    ? 'Tak'
                                    : 'Nie'}`
                                }
                            </td>
                            <Link
                                to={{
                                    pathname:
                                        `/article-form-preview-user/${article.item1.idArticle}/user-article-index`,
                                }}
                            >
                                <button className="btn btn-lg btn-outline-secondary ml-4">
                                    Podgląd
                                    </button>
                            </Link>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

  
    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderArticleTable(this.state.articles);

        return (
            <div>
                <legend>
                    Twój status opanowanego materiału:
                </legend>
                    <div
                        className="App"
                    >
                        <ProgressBar
                            bgcolor="#6a1b9a"
                            completed={this.state.procent}
                        />
                    </div>
                <legend>
                    Materiały do opanowania:
                </legend>
  
                {contents}                
            </div>
        );
    }

    async getArticlesFromDataBase() {
        const response = await fetch("/userArticle/" + this.state.userID);
        const data = await response.json();
        this.setState(
            {
                articles: data,
                loading: false
            });
    }
}
