import React, { Component } from 'react';
import * as FileSaver from 'file-saver';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



export class UserArticleForm extends Component {
    static displayName = UserArticleForm.name;

    constructor(props) {
        super(props);
        this.state = {
            title: undefined,
            desc: undefined,
            loading: true,
            isRead: false,
            path: undefined,
            filePath: "https://localhost:44324/article/file/" + this.props.match.params.id,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReadButton = this.handleReadButton.bind(this);
        this.handleDownload = this.handleDownload.bind(this);

    }

    componentDidMount() {       
        this.getArticleForDataBase();
        this.getInfoIsRead()
    }

    handleSubmit(event) {       
        event.preventDefault();   
        this.props.history.push('/user-article-index')
    }
    handleReadButton(event) {
        event.preventDefault();
        this.updateValueArticleRead(event)
    }
    handleDownload(event) {
        debugger
        if (this.state.path !== "") {
            this.getFile();

        }
        else {
            alert("Ten materiał nie posiada pliku do ściągnięcia")
        }
    }
    async getFile() {
        let id = this.props.match.params.id;

        fetch("/article/file/" + id, {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'blob',
        })
            .then(function (res) {
                return res.blob();
            })
            .then(function (blob) {

                FileSaver.saveAs(blob, 'artykul_' + id);
            });
    }

    renderArticleForm() {
        return (
            <form
                onSubmit={this.handleReadButton}
            >
                <label>
                    Tytuł:
                        <br />
                    <p>{this.state.title}</p>
                </label>
                <br />          
                <label>
                    Opis:
                        <br />
                    <p> {this.state.desc} </p>
                </label>
                <br />
                <button
                    className="btn btn-warning"
                    style={this.state.isRead ? { display: 'none' } : {}}
                >
                    Przeczytane
                </button> 

       
            </form>
        );
    }

    render() {
        debugger
        let contents = this.state.loading
            ? <p><em>Loading1...</em></p>
            : this.renderArticleForm();
        return (
            <div>
                <button
                    className="btn btn-primary"
                    onClick={this.handleSubmit}
                >
                    Cofnij
                </button>
                {contents}  
                <button
                    className="btn btn-primary"
                    onClick={this.handleDownload}
                >
                    ściagnij plik
                </button>
                <div>
                    <Document
                        file={this.state.filePath}
                        error=""
                    >
                        <Page pageNumber={1} />
                    </Document>
                </div>
            </div>
        );
    }
    async getArticleForDataBase() {
        debugger
        let id = this.props.match.params.id;
        if (id !== undefined) {
            const response = await fetch("/article/" + id);
            const data = await response.json();
            this.setState(
                {
                    title: data.title,
                    desc: data.name,
                    loading: false,
                    path: data.articlePath

                });
        }
    }
    async updateValueArticleRead(event) {
        debugger
        var d = new FormData(event.target);
        fetch("/userArticle/" + this.props.match.params.id + "/" + localStorage.getItem('userID'), { method: "PUT", body: d })
            .then(c => this.props.history.push('/user-article-index'));
    }
    async getInfoIsRead() {
        debugger
        let id = this.props.match.params.id;
        if (id !== undefined) {
            const response = await fetch("/article/" + id + "/" + localStorage.getItem('userID'));
            const data = await response.json();
            this.setState(
                {
                    isRead: data
                });
        }
    }
}
