import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

export class UserLogintPage extends React.Component {
    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faSignInAlt } />
                        </Card.Title>
                        <Card.Text>
                            ...forma za unos podataka...
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}