import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse } from '../../api/api';
import BookType from '../../types/BookType';
import { Redirect, Link } from 'react-router-dom';
import { ApiConfig } from '../../config/api.config';

interface CategoryPageProperties {
    match: {
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState {
    isUserLoggedIn?: boolean;
    category?: CategoryType;
    books?: BookType[];
    message?: string;
}

interface BookDto {
    bookId: number;
    title: string;
    originalTitle: string;
    publicationYear: number;
    pages: number;
    isbn: string;
    language: string;
    catalogNumber: string;
    photos: {
        cover: string;
        imagePath: string;
    }[];
    
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
            books: []

        };
    };   

    render() {
        if (this.state.isUserLoggedIn === false) {        
            return (
                <Redirect to="/login" />
            );
        }
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt } /> { this.state.category?.name }
                        </Card.Title>
                        <Card.Text>
                            { this.printOptionalMessage() }

                            { this.showBooks() }
                        </Card.Text>
                        
                    </Card.Body>
                </Card>
            </Container>
        );

        
    }

    private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
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

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }
        
        this.getCategoryData();
    }

    private setBooks(books: BookType[]) {
        this.setState(Object.assign(this.state, {
            books: books,
        }));
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category,
        }));
    }

    private singleBook(book: BookType) {
        return (
            <Col xs="12" sm="6" md="6" lg="4">
                <Card className="mt-3">
                    <Card.Header>
                        <img alt={ book.title } src= { ApiConfig.PHOTO_PATH + 'small/' +  book.imageFront} 
                        className="w-100" />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p">
                            <strong>
                                { book.title }
                            </strong>
                        </Card.Title>
                                   
                        <Link to={`/book/${book.bookId}/`}
                            className="btn btn-sm btn-primary btn-block">
                            Click to open
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    private showBooks() {
        if (this.state.books?.length === 0) {
            return(
                <div>
                    There are no books to show.
                </div>
            );
        }

        return (
            <Row>
                { this.state.books?.map(this.singleBook) }
            </Row>
        );
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
				return this.setLoggedInState(false);				
            }
            
            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };

            this.setCategoryData(categoryData);
        });

        api('api/book/search/', 'post', {
            categoryId: Number(this.props.match.params.cId),            
            keywords: "",
            title: "",            
            authors:[],
            publicationYear: 0,
            orderBy: 'title',
            orderDirection: 'ASC', 
            page: 0,
            itemsPerPage: 10
        })
        .then((res: ApiResponse) => {
            
            if (res.status === 'login') {
                return this.setLoggedInState(false);
            }

            if (res.status === 'error') {
                return this.setMessage('Request Error');
            }

            if (res.data.statusCode === 0) {
                this.setBooks([]);
                this.setMessage('');
                return;
            }
                const books: BookType[] = res.data.map((book: BookDto) => {

                    const object: BookType = {
                        bookId: book.bookId,
                        title: book.title,
                        originalTitle: book.originalTitle,
                        publicationYear: book.publicationYear,
                        pages: book.pages,
                        isbn: book.isbn,
                        language: book.language,
                        catalogNumber: book.catalogNumber,
                        imageBack: '',
                        imageFront: ''                   
                        
                    }                   
                    
                    if (book.photos && book.photos.length > 0) {
                        for (let i = 0; i < book.photos.length; i++)
                            if (book.photos[i].cover === 'front') {
                                object.imageFront = book.photos[i].imagePath;
                            } else {
                                object.imageBack = book.photos[i].imagePath;
                            }                           
                    }

                    return object;
                })
                
                this.setBooks(books);    

            
            //console.log(books);
            


            /*
            const books: BookType[] = 
            res.data.map((book: BookDto) => {
                
                const object: BookType = {
                    bookId: book.bookId,
                    title: book.title,
                    originalTitle: book.originalTitle,
                    publicationYear: book.publicationYear,
                    pages: book.pages,
                    isbn: book.isbn,
                    language: book.language,
                    catalogNumber: book.catalogNumber,
                    imageUrlFront: String(book.photos[0]),
                    imageUrlBack: String(book.photos[1]),                    
                }    
                
                return object;
                
            }

            this.setBooks(books);*/
        })
    }
}