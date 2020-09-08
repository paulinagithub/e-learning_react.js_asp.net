import React, { Component } from 'react';
import * as FileSaver from 'file-saver';

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export class NewArticlePreview extends Component {


    constructor(props) {
        super(props);
        this.state = {
            title: undefined,
            desc: undefined,
            loading: true,
            path: undefined,
            filePath: "https://localhost:44324/article/file/" + this.props.match.params.id,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }



    showOpenFileDlg = () => {
        this.inputOpenFileRef.current.click()
    }
    componentDidMount() {
        this.getArticleForDataBase();
    }
    handleSubmit(event) {
        
        event.preventDefault();
        let homePage = this.props.match.params.homePage;
        let userID = localStorage.getItem('previewUserID');

        if (userID !== null)
        {
            this.props.history.push(`/${homePage}/${userID}`)
        }
        else
        {
            this.props.history.push(`/${homePage}`)
        }
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

    renderArticleForm() {
        return (
            <form>
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
            </form>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading1...</em></p>
            : this.renderArticleForm();

        return (
            <div>
                <button
                    className="btn btn-primary"
                    onClick={this.handleSubmit}
                >
                    Cofnij do strony głównej
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
        
}


 

