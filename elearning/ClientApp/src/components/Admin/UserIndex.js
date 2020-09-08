import React, { Component } from 'react';
import { Link } from 'react-router-dom';



export class UserIndex extends Component {
    static displayName = UserIndex.name;

    constructor(props) {
        super(props);      
        this.state = {
            users: [],
            loading: true,
            departament: []

        };
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        this.getItemsFromDataBase();
        this.getDeptsFromDataBase();
    }
    handleChange(event) {
        debugger
        if (event.target.value == 0) {
            this.getItemsFromDataBase()
        }
        else
        {
            this.getItemsFromDataBaseByDeptID(event.target.value)
            this.setState(
                {
                    dept: event.target.value
                });
        }      
    }

    renderUserTable(users) {
        return (       
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Stanowisko</th>
                        <th>Podgląd</th>
                    </tr>
                </thead>
                <tbody>   
                    {users.map((user, index)=>                       
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.position}</td>
                            <td>                              
                                <Link
                                    to={{
                                        pathname: `/user-form/${user.userID}`,
                                    }}
                                >
                                    <button className="btn btn-outline-secondary">
                                        Podgląd 
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    renderSelect(departamens) {
        return (
            <select
                name="deptSelect"
                id="idDeptSelect"
                onChange={this.handleChange}
                className="browser-default custom-select"
            >
                <option
                    id={0}
                    value={0}>
                    Wszystkie
                </option>
                {departamens.map((dept, index) =>
                    <option
                        id={index}
                        value={dept.deptID}>
                        {dept.name}
                    </option>
                )}
            </select>
        );
    }

    render() {
        debugger
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUserTable(this.state.users);
        let selecContents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderSelect(this.state.departament);

        return JSON.parse(localStorage.getItem('isAdmin')) ?
            (
                <div>
                    <legend>
                        Sortuj po dziale:
                    </legend>
                    {selecContents}
                    <legend>
                        Użytkownicy
                    </legend>
                       
                    {contents}
                </div>
            ) : null;
    }

    async getItemsFromDataBase() {        
        const response = await fetch('user');
        const data = await response.json();
        this.setState(
            {
                users: data,
                loading: false
            });
    }
    async getItemsFromDataBaseByDeptID(deptID) {       
        const response = await fetch("/user/" + deptID);
        const data = await response.json();
        this.setState(
            {
                users: data,
                loading: false
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
