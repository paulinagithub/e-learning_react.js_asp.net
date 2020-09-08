import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

export class ArticleIndex extends Component {
    static displayName = ArticleIndex.name;

    constructor(props) {
        super(props);      
        this.state = {
            forecasts: [],
            loading: true
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount()
    {
        this.getItemsFromDataBase();      
    }

    handleDelete(event)
    {      
        event.preventDefault();
        var clickArticleID = event.currentTarget.value
        this.removeItemsFromDataBase(clickArticleID);
    };

    renderArticleTable(articles) {
        return ( 
            <div>           
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Nazwa</th>
                        <th>Data dodania</th>
                        <th>Użytkownik</th>
                        <th>Usuń/Edytuj/Podgląd</th>
                    </tr>
                </thead>
                <tbody>   
                    {articles.map((article, index)=>                       
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{article.title}</td>
                            <td><Moment format="YYYY/MM/DD">{article.dateCreation}</Moment></td>
                            <td>{article.userCreator}</td>
                            <td>
                                <Link
                                    to={{
                                        pathname: `/article-new/${article.idArticle}`,
                                    }}
                                >
                                    <button className="btn btn-outline-warning">
                                        Edytuj
                                    </button>
                                </Link>  
                         
                                <button className="btn btn-outline-danger ml-4"
                                    value={article.idArticle}
                                    onClick={this.handleDelete}>
                                    Usuń
                                </button>
                                <Link
                                    to={{
                                        pathname:
                                            `/article-form-preview/${article.idArticle}/article-index`,
                                    }}
                                >
                                    <button className="btn btn-outline-secondary ml-4">
                                        Podgląd 
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
                
                </div>
        );
    }

    render() {
        
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderArticleTable(this.state.forecasts);
                    
        return JSON.parse(localStorage.getItem('isAdmin')) ?
            (
                <div>  
                    <Link
                        to={{
                            pathname: `/article-new/-1`,
                        }}
                    >
                        <button className="btn btn-outline-primary" >Stwórz nowy</button>
                    </Link> 
                    <br />
                    <legend>
                        Lista materiałów
                    </legend>
                    {contents}               
                </div>
            )
            : null;
    }

    async getItemsFromDataBase() {
        const response = await fetch('article/mineGet');
        const data = await response.json();
        this.setState(
            {
                forecasts: data,
                loading: false
            });
    }
 
    async removeItemsFromDataBase(articleID) {     
        const response = await fetch('article/' + articleID,
            {
                method: 'DELETE',
            })
            .then(res => res.text())
            .then(res => console.log(res));
        this.getItemsFromDataBase()
    }
}
