import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
    static displayName = Layout.name;

    constructor(props) {
        super(props);
    }

    render() {
      return (
          <div>
              <NavMenu
                  handleLogout={this.props.handleLogout}
              />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
