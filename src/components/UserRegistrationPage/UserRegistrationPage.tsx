import React from 'react';
import { Container, Col, Card, Form, Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faBookReader } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';



interface UserRegistartionPageState {
    
    username?: string;
    password?: string;
    errorMessage?: string;
    isRegistrationComplete: boolean;
}

export class UserRegistrationPage extends React.Component {
    state: UserRegistartionPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
        }
    }
    
    render() {

        return (
            <Container>
                <RoledMainMenu role="visitor" />
                <Col md={ { span: 8, offset: 2} }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faUserPlus } /> User Registration
                            </Card.Title>
                            {
                                (this.state.isRegistrationComplete === false) ?
                                        this.renderForm() :                                
                                        this.renderRegistrationCompleteMessage() 

                                
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        )

        
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

    private renderForm() {
        return (
            <>
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
                                onClick={ () => this.doRegister() }>
                            <FontAwesomeIcon icon={ faUserPlus } /> Register
                        </Button>
                    </Form.Group>
                </Form>

                <Alert variant="danger"
                        className={ this.state.errorMessage ? '' : 'd-none' }>
                    { this.state.errorMessage }
                </Alert>
            </>
        );
        
    }

    private setRegistrationCompleteState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isRegistrationComplete: state,
        }));
    }

    private setErrorMessage(message: string) {
        this.setState(Object.assign(this.state, {
            errorMessage: message,
        }));
    }

    private doRegister() {
        const data = {
            username: this.state.username,
            password: this.state.password          
        };

        api('/auth/register', 'post', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setErrorMessage('There was an error. Please try again.');
                return;
            }

            if (res.data.statusCode !== undefined) {
                switch (res.data.statusCode) {
                    case -8003: this.setErrorMessage(res.data.message); break;
                }
                return;
            }

            this.setErrorMessage('');
            this.setRegistrationCompleteState(true);
        });
    }

    private renderRegistrationCompleteMessage() { // poruka nakon uspešno obavljene registracije
        return (
            <div>
                <p>
                    Your registration was successful!
                </p>
                <p>
                    You can <Link to="/login">log in <FontAwesomeIcon icon={ faBookReader } /> </Link> to go to the login page
                </p>
            </div>           
        )
    }
    
}