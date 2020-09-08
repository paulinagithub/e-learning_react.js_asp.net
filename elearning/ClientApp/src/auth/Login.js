import React, { Component } from "react";
import { Card, Input, Error } from "./AuthForm";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isError: false       
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {       
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }

    handleSubmit(event) {
        debugger
        const { email, password } = this.state;
        const requestOptions =
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([email, password])
        };

        fetch("/user", requestOptions)
            .then(response => response.json())
            .then(response =>
            {            
                this.props.handleLogin(response);
                if (JSON.parse(localStorage.getItem("isAdmin")))
                {
                    this.props.history.push("/article-index");
                }
                else
                {
                    this.props.history.push("/user-article-index");
                }              
            })
            .catch(error =>
            {               
                this.setState({
                    isError: true
                });
            });
        event.preventDefault();
    }
 
    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={3}>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Haslo
                    </Form.Label>
                        <Col sm={3}>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Haslo"
                                value={this.state.password}
                                onChange={this.handleChange}
                                required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Zaloguj sie</Button>
                        </Col>
                    </Form.Group>
                </Form>
                
            </div>
        );
    }
}
