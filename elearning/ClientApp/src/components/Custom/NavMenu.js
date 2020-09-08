import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);

        this.state = {
            collapsed: true,
        };
    }

    toggleNavbar () {
        this.setState(
            {
                collapsed: !this.state.collapsed
            });
    }

    handleLogoutClick() {
        debugger
        this.props.handleLogout();
    }

    handleLoginClick()
    {        
        this.props.history.push("/login");
    }
    renderAdminNavBar() {
        
        return (
            <Container>
                <NavbarBrand
                    tag={Link}
                    to="/"
                >
                    elearning-admin
                </NavbarBrand>
                <NavbarToggler
                    onClick={this.toggleNavbar}
                    className="mr-2"
                />
                <Collapse
                    className="d-sm-inline-flex flex-sm-row-reverse"
                    isOpen={!this.state.collapsed}
                    navbar
                >
                    <ul
                        className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className="text-dark"
                                to="/user-index"
                            >
                                Uzytkownicy systemu
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className="text-dark"
                                to="/article-index"
                            >
                                Przegladaj Artykuly
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <button
                                className="btn btn-primary"
                                onClick={() => this.handleLogoutClick()}
                            >
                                Wyloguj
                            </button>
                        </NavItem>
                    </ul>
                </Collapse>
            </Container>
        )
    }

    renderUserNavBar() {
        return (
            <Container>
                <NavbarBrand
                    tag={Link}
                    to="/"
                >
                    elearning
                </NavbarBrand>
                <NavbarToggler
                    onClick={this.toggleNavbar}
                    className="mr-2"
                />
                <Collapse
                    className="d-sm-inline-flex flex-sm-row-reverse"
                    isOpen={!this.state.collapsed}
                    navbar
                >
                    <ul
                        className="navbar-nav flex-grow"
                        
                    >
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className="text-dark"
                                to="/user-article-index"
                                style={
                                    {
                                        'margin-top': '6px'
                                    }
                                }
                               
                            >
                                Lista Artykulow
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className="text-dark"
                                to="/"
                            >
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.handleLogoutClick()}
                                >
                                    Wyloguj
                                </button>
                            </NavLink>
                        </NavItem>
                    </ul>
                </Collapse>
            </Container>
        );       
    }
    renderLogInNavBar() {
        return (
            <Container>
                <NavbarBrand
                    tag={Link}
                    to="/"
                >
                    elearning
                </NavbarBrand>
                <NavbarToggler
                    onClick={this.toggleNavbar}
                    className="mr-2"
                />
                <Collapse
                    className="d-sm-inline-flex flex-sm-row-reverse"
                    isOpen={!this.state.collapsed}
                    navbar
                >
                    <ul
                        className="navbar-nav flex-grow"
                    >
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className="text-dark"
                                to="/login"
                            >
                                Zaloguj
                            </NavLink>
                        </NavItem>
                    </ul>
                </Collapse>
            </Container>
        );
    }

    render() {
        
        let navBar = this.renderLogInNavBar();
        if (localStorage.length === 0)
        {
            navBar = this.renderLogInNavBar();
        }
        else
        {
            if (JSON.parse(localStorage.getItem('isAdmin')))
            {
                navBar = this.renderAdminNavBar();              
            }
            else
            {
                navBar = this.renderUserNavBar();
            }
        }

    return (
        <header>
            <Navbar
                className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
                light
            >
                {navBar}
        </Navbar>
      </header>
    );
  }
}
