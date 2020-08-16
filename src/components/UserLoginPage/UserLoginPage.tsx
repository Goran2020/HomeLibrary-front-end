import React from 'react';
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../api/api';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';


interface UserLoginPageState {
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class UserLoginPage extends React.Component {
    state: UserLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    }
    private handleFormInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let stateFieldName = '';

        if (event.target.id === 'username') {
            stateFieldName = 'username';
        } else if (event.target.id === 'password') {
            stateFieldName = 'password';
        }

        if (stateFieldName === '') {
            return;
        }

        const newState = Object.assign(this.state, {
            [ stateFieldName ]: event.target.value,
        });

        this.setState(newState);
    }
    /*
    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newState = Object.assign(this.state, {
            [ event.target.id ]: event.target.value
        });

        this.setState(newState);
    } */
    
    private setErrorMessage(message: string) {
        this.setState(Object.assign(this.state, {
            errorMessage: message,
        }));
    }

    private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isLoggedIn: state,
        }));
    }

    private doLogin() {
        api(
            '/auth/login', 
            'post', 
            {
                username: this.state.username,
                password: this.state.password
            }
        ).then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setErrorMessage('Something went wrong...');
                return;
            }
            console.log(res.status);
            console.log(res.data);
            if (res.data.statusCode !== undefined) {
                switch (res.data.statusCode) {
                    case -8006: this.setErrorMessage('You have entered an invalid username!'); break;
                    case -8005: this.setErrorMessage('You have entered an invalid password!'); break;
                }
                return;
            }

                saveToken(res.data.token);
                saveRefreshToken(res.data.refreshToken);

                // preusmeriti na /#/   home page

                this.setLoggedInState(true);
            


        });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            console.log("Uspešan login");
            return (
                <Redirect to="/" />
            );
        }
        return (
            <Container>
                <RoledMainMenu role="visitor" />
                <Col md={ { span: 6, offset: 3 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faSignInAlt } /> User Login
                            </Card.Title>

                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control type="text" id="username"
                                                  value={ this.state.username }
                                                  onChange={ (event) => this.handleFormInputChange(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                    <Form.Control type="password" id="password"
                                                  value={ this.state.password }
                                                  onChange={ (event) => this.handleFormInputChange(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" block
                                            onClick={ () => this.doLogin() }>
                                        <FontAwesomeIcon icon={ faSignInAlt } /> Log in
                                    </Button>
                                </Form.Group>
                            </Form>

                            <Alert variant="danger"
                                   className={ this.state.errorMessage ? '' : 'd-none' }>
                                { this.state.errorMessage }
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        )
    }
}