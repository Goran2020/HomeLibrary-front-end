import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';


export class ContactPage extends React.Component {
    render() {
        return (
            <Container>
                <RoledMainMenu role="visitor" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faPhone } />
                        </Card.Title>
                        <Card.Text>
                            ...podaci...
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}