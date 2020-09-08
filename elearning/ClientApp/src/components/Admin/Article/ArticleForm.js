import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export class ArticleForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            departament: [],
            title: undefined,
            desc: undefined,
            dept: [],
            loading: true,
            value: [],
            selectedFile: null,
            selectedTime: "weeks",
            timeEx: 1

        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUnDo = this.handleUnDo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.handleUnDoToHomePage = this.handleUnDoToHomePage.bind(this);
        this.handleSingleCheck = this.handleSingleCheck.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);


    }

    componentDidMount() {
        debugger
        this.getDeptsFromDataBase();
        this.getItemForEdit();

    }
    onChangeHandler = event =>
    {       
        this.setState(
            {
                selectedFile: event.target.files[0],
                loaded: 0
            }
        )
    }
    handleChange(event)
    {
        var options = event.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++)
        {
            if (options[i].selected)
            {
                value.push(options[i].value);
            }
        }
        this.setState(
            {
                dept: value
            }
        );
    }
    handleSubmit(event) {
        
        event.preventDefault();
        let id = this.props.match.params.id;
        var data = new FormData(event.target);

        if (id !== undefined && id !== "-1")
        {
            fetch("/article/" + this.props.match.params.id + "/" + localStorage.getItem('userEmail'), { method: "PUT", body: data })
                .then(c => this.props.history.push('/article-index'));
        }
        else {
            fetch("/article/" + localStorage.getItem('userEmail'), { method: "POST", body: data })
                .then(c => this.props.history.push('/article-index'));
        }  
    }
    handleUnDo(event)
    {
        event.preventDefault();
        alert("Czy na pewno chcesz wyjść?"+
            "Zmiany nie zostaną zapisane.")
        this.props.history.push('/article-index');
    }

    handleUnDoToHomePage(event)
    {
        event.preventDefault();       
        this.props.history.push('/');
    }
    handleInputChange(event)
    {
        this.setState(
            {
                title: event.target.value
            });       
    }   
    handleTextAreaChange(event) {      
        this.setState(
            {
                desc: event.target.value
            }
        );
    }
    handleSingleCheck(event) {
        debugger
        this.setState(
            {
                
                selectedTime: event.target.value
            }
        );
    };
    onChangeNumber(event) {
        debugger
        event.preventDefault(); 
        
        this.setState(
            {

                timeEx: event.target.value
            }
        );
    };

    renderArticleForm(departamens) {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>Tytuł:</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        defaultValue={this.state.title}
                        onChange={this.handleInputChange}
                        required="required" />
                </Form.Group>       
                <Form.Group>
                    <Form.Label> Wybierz dział dla artykułu:</Form.Label>
                    <Form.Control
                        as="select" multiple
                        name="select"
                        id="idSelect"
                        value={this.state.dept}
                        onChange={this.handleChange}
                        required="required">
                        {departamens.map((dept, index) =>
                            <option
                                key={index}
                                value={dept.deptID}>
                                {dept.name}
                            </option>
                        )}
                    </Form.Control>
                </Form.Group> 
                <Form.Group>
                <Form.Label>Określ jednostke czasu na opanowanie materiału:</Form.Label>
                <div onChange={this.handleSingleCheck.bind(this)}>
                    <Form.Check
                        inline label="Tygodnie"
                        type="radio"
                        defaultChecked
                        value="weeks"
                        checked={this.state.selectedTime === "weeks"}
                        name="time" />
                    <Form.Check
                        inline label="Miesiace"
                        type="radio"
                        value="months"
                        checked={this.state.selectedTime === "months"}
                        name="time"  />
                    </div>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Określ ile czasu (w tyg/miesiacach) na opnawanie tego materiału:</Form.Label>
                    <Form.Control
                        name="numberOfWeeks"
                        type="number"
                        min="1"
                        defaultValue={this.state.timeEx} onChange={this.onChangeNumber}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Opis</Form.Label>
                    <Form.Control as="textarea" name="desc" rows="15"               
                        value={this.state.desc}
                        onChange={this.handleTextAreaChange}
                        required="required" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Dodaj plik</Form.Label>  
                    <Form.File
                        id="custom-file"
                        label="Wybierz plik"
                        name="file"
                        onChange={this.onChangeHandler} 
                        custom
                    />
                </Form.Group>
                <Form.Group>
                    <Button type="submit" >Zapisz</Button>         
                </Form.Group>
            </Form>
           );
    }

    render() {
        debugger

        let contents = this.state.loading
            ? <p><em>Loading1...</em></p>
            : this.renderArticleForm(this.state.departament);

        return JSON.parse(localStorage.getItem('isAdmin')) ?
            (
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={this.handleUnDo}
                    >
                        Cofnij
                    </button>
                    {contents}
                </div>
            ) :
            (
                <div>
                    <p>Ta strona nie jest dostepna dla ciebie</p>
                    <button
                        className="btn btn-primary"
                        onClick={this.handleUnDoToHomePage}
                    >
                        Powrot
                    </button>
                </div>
            );
    }
    async getItemForEdit() {      
        let id = this.props.match.params.id;
        if (id !== undefined && id !== "-1")
        {
            const response = await fetch("/article/" + id);
            const data = await response.json();
            
            this.setState(
                {
                    title: data.title,
                    desc: data.name,
                    timeEx: data.numberOfWeeks,
                    selectedTime: data.weekMonth,
                    loading: false
                });            
            this.getSelectDeptsFromDataBase(id);
        }
        else
        {
            this.setState(
                {
                    loading: false
                });
        }
    }
    async getSelectDeptsFromDataBase(id) {
        const response = await fetch("/departament/" + id);
        const data = await response.json();       
        this.setState(
            {
                dept: data
            });
    }
    async getDeptsFromDataBase() {
        const response = await fetch('/departament');
        const data = await response.json();
        this.setState(
            {
                departament: data
            });
    }
}


 

