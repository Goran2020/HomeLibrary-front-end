import React from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse } from '../../api/api';
import BookType from '../../types/BookType';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import BookPreview from '../BookPreview/BookPreview';
import ApiAuthorDto from '../../dtos/ApiAuthorDto';
import AuthorType from '../../types/AuthorType';


interface CategoryPageProperties {
    match: {
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState {
    //isUserLoggedIn?: boolean;
    category?: CategoryType;
    books?: BookType[];
    title?: string;
    authors?: {
        authorId: number;
        forename: string;
        surname: string;
    }[];    
    authorId?: number;
    message?: string;
    filters: {
        keywords: string;
        title: string;
        publicationYear: number | null;
        authorId: number;        
        order: "title asc" | "title desc" | "authors acs";
    };
}

interface BookDto {
    bookId: number;
    title: string;
    originalTitle: string;
    publicationYear: number;
    isVisible: number;    
    pages: number;
    isbn: string;
    language: string;
    catalogNumber: string;
    photos: {
        bookId: number;
        cover: string;
        imagePath: string;
    }[];
    
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = {
            //isUserLoggedIn: true,
            message: '',
            books: [],
            authors: [],                  
            filters: {
                keywords: '',
                title: '',
                publicationYear: null,
                authorId: 19,                
                order: 'title asc',
            }

        };
    };   

    render() {
    /*    if (this.state.isUserLoggedIn === false) {        
            return (
                <Redirect to="/login" />
            );
        } */
        return (
            <Container>
                <RoledMainMenu role='visitor' />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt } /> { this.state.category?.name }
                        </Card.Title>
                        
                            { this.printOptionalMessage() }
                        <Row>
                            <Col xs="12" md="4" lg="3">
                                { this.printFilters() }
                            </Col>
                            <Col xs="12" md="8" lg="9">
                            { this.showBooks() }
                            </Col>
                        </Row>                       
                    </Card.Body>
                </Card>
            </Container>
        );

        
    }

    private setNewFilter(newFilter: any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }))
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {        
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private filterTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            title: event.target.value,
        }));
    }
    private filterYearChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            publicationYear: Number(event.target.value),
        }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }));
    }

    private filterSurnameChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            surname: event.target.value,
        }));
    }    
    
    
    private filterForenameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            forename: event.target.value,
        }));
    }

    private filterApplay() {        
        this.getCategoryData();
        
    }
    private setAddModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.filters, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            }),            
        ));
    }  

    private printFilters() {
        return (
            <>
               <Form.Group>                    { /* KEYWORDS */ }
                   <Form.Label htmlFor="keywords">Keywords</Form.Label> <FontAwesomeIcon icon={ faSearch } />
                   <Form.Control type="text" 
                                 id="keywords" 
                                 value={ this.state.filters?.keywords } 
                                 onChange={ (e) => this.filterKeywordsChanged(e as any) }/>
               </Form.Group>
               <Form.Group>
                   <Row>
                       <Col xs="12" sm="12">  { /* TITLE */ }
                            <Form.Label htmlFor="title">Title</Form.Label> <FontAwesomeIcon icon={ faSearch } />
                           <Form.Control type="text" 
                                         id="title" 
                                         value={ this.state.filters?.title } 
                                         onChange={ (e) => this.filterTitleChange(e as any) } />
                       </Col>
                       <Col xs="12" sm="12">  { /* YEAR */ }
                            <Form.Label htmlFor="year">Publication year</Form.Label> <FontAwesomeIcon icon={ faSearch } />
                           <Form.Control type="text" 
                                         id="year" 
                                         value={ this.state.filters?.publicationYear === null ? '' :  this.state.filters?.publicationYear} 
                                         onChange={ (e) => this.filterYearChange(e as any) } />
                       </Col>
                       <Col>
                            <Form.Group>  {/* AUTHOR   */ }  
                                    <Form.Label htmlFor="author">Author</Form.Label> <FontAwesomeIcon icon={ faSearch } />
                                    <Form.Control id="author" 
                                                as="select" 
                                                value={ this.state.filters.authorId.toString() } 
                                                onChange={ (e) => this.setAddModalNumberFieldState('authorId', e.target.value) } >
                                                { this.state.authors?.map(author => (                                                    
                                                    <option value={ author.authorId?.toString() }>
                                                        { author.forename + " " + author.surname }
                                                    </option>
                                                ) ) }
                                    </Form.Control>
                                </Form.Group>
                       </Col>
                       
                       {/* 
                        <Col xs="12" sm="12">
                            <Form.Label htmlFor="forename">Forename</Form.Label> <FontAwesomeIcon icon={ faSearch } />
                           <Form.Control type="text" 
                                         id="forename" 
                                         value={ this.state.filters?.forename } 
                                         onChange={ (e) => this.filterForenameChange(e as any) } />
                       </Col>
                       <Col xs="12" sm="12">
                            <Form.Label htmlFor="surname">Surname</Form.Label> <FontAwesomeIcon icon={ faSearch } />
                           <Form.Control type="text" 
                                         id="surname" 
                                         value={ this.state.filters?.surname } 
                                         onChange={ (e) => this.filterSurnameChange(e as any) } />
                       </Col>
                       */}
                       
                   </Row>
               </Form.Group>
               <Form.Group>
                   <Form.Control as="select" id="sordOrder"
                                 value={ this.state.filters?.order }
                                 onChange={ (e) => this.filterOrderChanged(e as any) }>
                       <option value="title asc">Sort by Title - asc</option>
                       <option value="title desc">Sort by Title - desc</option>
                       <option value="year asc">Sort by Publication year - asc</option>
                       <option value="year desc">Sort by Publication year - desc</option>
                   </Form.Control>
               </Form.Group>
               <Form.Group>
                   <Button variant="primary" block onClick={() => this.filterApplay() }>
                       Start search
                   </Button>
               </Form.Group>
            </>
        )
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
        this.getAuthors();
        this.getCategoryData();
        
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }     
        this.getAuthors();
        this.getCategoryData();
        
    }

    private setAuthors(authors: AuthorType[]) {
		this.setState(Object.assign(this.state, {
            authors: authors,
		}));
    }

    private setAuthorsInState(data: ApiAuthorDto[]) {
        if (!data || data.length === 0) {
			this.setAuthors([]);
			return;
        } 
        
        const authors: AuthorType[] | undefined = data?.map(author => {
			return {
				authorId: author.authorId,
                forename: author.forename,
                surname: author.surname,				
			};
		});
	
        
		this.setAuthors(authors);
    }

    private getAuthors() {
        api('visitor/authors','get', {})
        .then((res: ApiResponse) => {
            
            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }
            
            const authors: ApiAuthorDto[] = res.data;                
            this.setAuthorsInState(authors);            
        });   
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

    private setAuhtorIdState(id: number) {
        const newState = Object.assign(this.state.filters, {
            authorId: id,
        });
 
        this.setState(newState);
    }

    private singleBook(book: BookType) {
        
        return (
            <BookPreview book={book} />
        );
    }
    /*
    private singleBook(book: BookType) {
        return (
            <Col xs="12" sm="6" md="6" lg="4">
                <Card className="mt-3">
                    
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
    }  */

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
    
    // pretraga po autoru - dopremanje authorId-a i setovanje u stanje komponente /
    /*
    private getAuthorId() {
        
            api('visitor/findOne','post', {
                forename: this.state.filters.forename,
                surname: this.state.filters.surname,
            })
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    return this.setLoggedInState(false);				
                }
                
                if (res.status === 'error') {
                    return this.setMessage('Please wait...or try to refresh');
                }
                
                const authorId: number = res.data.authorId;                
                this.setAuhtorIdState(authorId);            
            });   
        
            
    }  */


    
    private getCategoryData() {
        
        api('visitor/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            /*
            if (res.status === 'login') {
				return this.setLoggedInState(false);				
            }*/
            
            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };
            
            
            this.setCategoryData(categoryData);
        });

        const orderParts = this.state.filters.order.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

         
        //this.getAuthorId(); // ovo treba da setuje authorId kada se izvrši pretraga
        
        
        api('visitor/search/', 'post', {

            
            categoryId: Number(this.props.match.params.cId),            
            keywords: this.state.filters?.keywords,
            title: this.state.filters?.title,            
            authorId: this.state.filters?.authorId,
            publicationYear: this.state.filters.publicationYear,
            orderBy: orderBy,
            orderDirection: orderDirection, 
            page: 0,
            itemsPerPage: 10
        })
        .then((res: ApiResponse) => {
            /*
            if (res.status === 'login') {
                return this.setLoggedInState(false);
            }*/

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
                        isVisible: book.isVisible,
                        isbn: book.isbn,
                        language: book.language,
                        catalogNumber: book.catalogNumber,
                        imageUrl: '',                        
                        photos: book.photos                 
                        
                    }       
                    
                    if (book.photos !== undefined && book.photos?.length > 0) {
                        for (let photo of book.photos) {
                            if (photo.cover === 'front') {
                                object.imageUrl = photo.imagePath;
                            }
                        }
                    }               
                    
                    
                    return object;
                })
                
                this.setBooks(books);           

        })
    }
}