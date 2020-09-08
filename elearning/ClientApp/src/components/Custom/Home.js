import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            loginErrors: "",
            isAdmin: false,
            userID : 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        debugger
        event.preventDefault();
        var d = new FormData(event.target);
        this.checkIfLoginIsSuccess(d);
    }

    render() {
        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />

                    <button
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }

    async checkIfLoginIsSuccess(d) {
        
        const response = await fetch('user/email/' + this.state.email);
        const data = await response.json();

        if (data) {
            try {
                var response1 = await fetch("/user", { method: "POST", body: d });
                const data1 = await response1.json();

                if (data1.isAdmin)
                {
                    this.props.history.push('/article-index/' + data1.userID);
                }
                else
                {
                    this.props.history.push('/user-article-index');
                }

            } catch (e) {

                alert("Logowanie nie powid³o siê");
            }
        }
        else {

            alert("Nie instnieje taki uzytkownik!");    
        }
    }
}
