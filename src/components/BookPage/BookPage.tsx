import React from 'react';
import ApiBookDto from '../../dtos/ApiBookDto';
import api, { ApiResponse } from '../../api/api';
import { Link } from 'react-router-dom';
import { Container, Card, Nav, Row, Col, ListGroup } from 'react-bootstrap';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faBackward } from '@fortawesome/free-solid-svg-icons';
import { ApiConfig } from '../../config/api.config';


interface BookPageProperties {
    match: {
        params: {
            bookId: number,
        }
    }
}
interface BookPageState {
    //isUserLoggedIn: boolean;
    message: string;
    book?: ApiBookDto;
}

export default class BookPage extends React.Component<BookPageProperties> {
    state: BookPageState;
    
    constructor(props: Readonly<BookPageProperties>) {
        super(props);

        this.state = {
            //isUserLoggedIn: true,
            message: '',
            book: undefined

        }
    }

    componentDidMount() {  
        
        this.getBookData();
        
    }

    componentDidUpdate(oldProperties: BookPageProperties) {
        if (oldProperties.match.params.bookId === this.props.match.params.bookId) {
            return;
        }     
        
        this.getBookData();
        
    }

    render() {
        /*
        if (this.state.isUserLoggedIn === false) {        
            return (
                <Redirect to="/login" />
            );
        }  */
        return (
            <Container>
                <RoledMainMenu role='visitor' />
                <Card>
                    <Card.Body>
                        <Nav className="mb-3">
                            <Nav.Item>
                                <Link to={"/category/" + this.state.book?.category?.categoryId } className="btn btn-sm btn-info">
                                      <FontAwesomeIcon icon={ faBackward } /> Go Back to Books</Link>
                            </Nav.Item>
                        </Nav>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faBookOpen } /> Title:  { this.state.book?.title }
                        </Card.Title>
                        
                            { this.printOptionalMessage() }

                        <Row className="mt-5">
                            <Col xs="12" md="4" lg="5">
                                <Card>
                                    <Card.Body>                                        
                                        <ListGroup className="mb-3">
                                            <ListGroup.Item><strong>Original title:</strong> { this.state.book?.originalTitle }</ListGroup.Item>
                                            <ListGroup.Item><strong>Publication year:</strong> { this.state.book?.publicationYear }</ListGroup.Item>
                                            <ListGroup.Item><strong>Pages: </strong>{ this.state.book?.pages }</ListGroup.Item>
                                            <ListGroup.Item><strong>ISBN: </strong>{ this.state.book?.isbn }</ListGroup.Item>
                                            <ListGroup.Item><strong>Language: </strong>{ this.state.book?.language }</ListGroup.Item>
                                            <ListGroup.Item><strong>Catalog number: </strong>{ this.state.book?.catalogNumber }</ListGroup.Item>
                                            <ListGroup.Item><strong>Language: </strong>{ this.state.book?.language }</ListGroup.Item>
                                            <ListGroup.Item><strong>Category: </strong>{ this.state.book?.category?.name }</ListGroup.Item>
                                            <ListGroup.Item><strong>Publisher: </strong>{ this.state.book?.publisher?.name }</ListGroup.Item>
                                            <ListGroup.Item><strong>Location: </strong>{ this.state.book?.location?.room + " - " + this.state.book?.location?.shelf }</ListGroup.Item>
                                        </ListGroup>  
                                        <Card.Text><strong>Authors</strong></Card.Text>
                                        <ListGroup>  { /* AUTHORS */}     
                                            { this.state.book?.authors?.map(author => (<ListGroup.Item> {author?.forename + " " + author?.surname}</ListGroup.Item>)
                                                
                                            ) }
                                        </ListGroup>     
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs="12" md="4" lg="3">                                
                                <Card className="mb-4">
                                    <Card.Title className="text-center mt-4">Cover Front</Card.Title>
                                    <Card.Body>
                                        {<img alt="" src={ ApiConfig.PHOTO_PATH + 'small/' + this.state.book?.photos[0].imagePath } className="w-100"/> }                                      
                                    </Card.Body>
                                    
                                </Card>
                                
                                <Card>
                                    <Card.Title className="text-center mt-4">Cover back</Card.Title>
                                    <Card.Body>                                        
                                        {<img alt="" src={ ApiConfig.PHOTO_PATH + 'thumb/2020822-8652156860-blank.jpg' } className="w-100"/> } 
                                    <Card.Text className="text-center">no cover to show.</Card.Text>
                                    </Card.Body>                                    
                                </Card>
                            </Col>                           
                        </Row>                 
                        
                    </Card.Body>
                </Card>
            </Container>
        )
    }    
    
    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }

        return (
            <Card.Text>
                { this.state.message }
            </Card.Text>
        );
    }

    private getBookData() {
        api('visitor/book/' + this.props.match.params.bookId, 'get', {})
        .then((res: ApiResponse) => {
            /*
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }*/
            
            if (res.status === 'error') {
                return this.setMessage("This book doesn't exist.");
                
            } 

            const data: ApiBookDto = res.data;
            console.log(data);
            this.setBookData(data);
        })
    }

    private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setBookData(book: ApiBookDto) {
        this.setState(Object.assign(this.state, {
            book: book,
        }));
    }

}

