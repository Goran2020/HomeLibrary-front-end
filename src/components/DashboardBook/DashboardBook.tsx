import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import BookType from '../../types/BookType';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse, apiFile } from '../../api/api';
import ApiBookDto from '../../dtos/ApiBookDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import PublisherType from '../../types/PublisherType';
import ApiPublisherDto from '../../dtos/ApiPublisherDto';
import LocationType from '../../types/LocationType';
import ApiLocationDto from '../../dtos/ApiLocationDto';
import ApiAuthorDto from '../../dtos/ApiAuthorDto';
import AuthorType from '../../types/AuthorType';






interface DashboardBookState {
    isUserLoggedIn: boolean;
    books: BookType[];
    categories: CategoryType[];
    publishers: PublisherType[];
    locations: LocationType[];
    authors: AuthorType[]; 

    addModal: { 
        visible: boolean;
        name: string; 
        message: string;


        title: string;
        originalTitle: string;
        publicationYear: number;
        pages: number;
        isbn: string;
        isVisible: number;
        language: string;
        catalogNumber: string;
        categoryId:  number;
        publisherId: number;
        locationId: number;
        
        
        authors: {
            use: number;            
            authorId: number;
            forename: string;
            surname: string;
        }[];          
    };

    editModal: {
        bookId?: number | null;
        visible: boolean;
        name: string;
        message: string;


        title: string;
        originalTitle: string;
        publicationYear: number;
        pages: number;
        isbn: string;
        isVisible: number;
        language: string;
        catalogNumber: string;
        categoryId:  number;
        publisherId: number;
        locationId: number;


        authors: {           
            authorId: number;
            forename: string;
            surname: string;
            use: number;
        }[];
        location: {
            locationId: number;
            room: string;
        };
    }
  
}

class DashboardBook extends React.Component {
    state: DashboardBookState;
    constructor(props: Readonly<{}>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,
        books: [],
        categories: [],
        publishers: [],
        locations: [],
        authors: [],
        
        addModal: {          

            visible: false,                       
            name: '', 
            message: '',
            
            title: '',
            originalTitle: '',
            publicationYear: 1,
            pages: 1,
            isbn: '',
            isVisible:1,
            language: '',
            catalogNumber: '',
            categoryId:  1,
            publisherId: 1,
            locationId: 1,
            
            authors:[],           
        } , 
        
        editModal: {
            bookId: null,
            visible: false,
            name: '',
            message: '',
            title: '',
            originalTitle: '',
            publicationYear: 1,
            pages: 1,
            isbn: '',
            isVisible:1,
            language: '',
            catalogNumber: '',
            categoryId:  1,
            publisherId: 1,
            locationId: 1,            
            location: {
                locationId: 1,
                room: '',
            },
            authors:[],    
        }
      }
    }

    private setAddModalVisible(state: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: state,
            }),
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            }),
        ));
    }
    
    private setEditModalVisible(state: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: state,
            }),
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            }),
        ));
    }    

    private setEditModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            }),
        ));
    }

    /* => LOCATION  START   */

    private getLocations() {  // dopermi izdavače - API
        api('/api/location', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.putLocationsInState(res.data);
        });
        
    }
    
    private putLocationsInState(data?: ApiLocationDto[]) {
		if (!data || data.length === 0) {
			this.setLocations([]);
			return;
        }    
        
		
		const locations: LocationType[] | undefined = data?.map(location => {
			return {
				locationId: location.locationId,
                room: location.room,
                shelf: location.shelf,				
			};
		});
	

		this.setLocations(locations);
	
    }

    private setLocations(locations: LocationType[]) {
		this.setState(Object.assign(this.state, {
            locations: locations,
		}));
    }

    /* LOCATION END */


    /* => PUBLISHER START */
    private getPublishers() {  // dopermi izdavače - API
        api('/api/publisher', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.putPublishersInState(res.data);
        });
        
    }

    private putPublishersInState(data?: ApiPublisherDto[]) {
		if (!data || data.length === 0) {
			this.setPublishers([]);
			return;
		}
		
		const publishers: PublisherType[] | undefined = data?.map(publisher => {
			return {
				publisherId: publisher.publisherId,
				name: publisher.name,				
			};
		});
	

		this.setPublishers(publishers);
	
    }

    private setPublishers(publishers: PublisherType[]) {
		this.setState(Object.assign(this.state, {
            publishers: publishers,
		}));
    }
    
    /* PUBSLISHER END */ 


    /* => CATEGORY START */
    private getCetgories() {  // dopremi kategorije - API
        api('/api/category', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.putCategoriesInState(res.data);
        });
        
    }

    private putCategoriesInState(data?: ApiCategoryDto[]) {  // promeni stanje kategorija
		if (!data || data.length === 0) {
			this.setCategories([]);
			return;
		}
		
		const categories: CategoryType[] | undefined = data?.map(category => {
			return {
				categoryId: category.categoryId,
				name: category.name,				
			};
		});
	

		this.setCategories(categories);
	
    }
    
    private setCategories(categories: CategoryType[]) {
		this.setState(Object.assign(this.state, {
		  categories: categories,
		}));
    }

    /* CATEGORY END */

    componentDidMount() {
        this.getAuthors();
        this.getLocations();
        this.getPublishers();
        this.getCetgories();
        this.getBooks();
	}


    private setAddModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            }),            
        ));
    }    
	

	private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
    }

    private setBooks(books: BookType[]) {
		this.setState(Object.assign(this.state, {
		  books: books,
		}));
	}

    private putBooksInState(data?: ApiBookDto[]) {
		if (!data || data.length === 0) {
			this.setBooks([]);
			return;
		}
		
		const books: BookType[] | undefined = data?.map(book => {
			return {
				bookId: book.bookId,                
                title: book.title,
                originalTitle: book.originalTitle,
                publicationYear: book.publicationYear,
                pages: book.pages,
                isbn: book.isbn,
                isVisible: book.isVisible,
                language: book.language,    
                catalogNumber: book.catalogNumber,
                publisherId: book.publisherId,    
                imageFront: book.imageFront,
                imageBack: book.imageBack,
                authors: book.authors,
                photos: book.photos,
                category: book.category,
                location: book.location,
                publisher: book.publisher,
                
			};
		});
	

		this.setBooks(books);
	
	}

    private getBooks() {
        api('/api/book', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}
            console.log(res.data);
            this.putBooksInState(res.data);
        });
        
    } 

    private getAuthors() {
        api('api/author', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}
            console.log(res.data);
            this.putAuthorsInState(res.data);
        });
        
    } 

    private putAuthorsInState(data?: ApiAuthorDto[]) {
        if (!data || data.length === 0) {
			this.setAuthors([]);
			return;
		}
		
		const authors: AuthorType[] | undefined = data?.map(author => {
            return {
                authorId: author.authorId,
                surname: author.surname,
                forename: author.forename,
            }
        })
        console.log("autori pre stavljanaj u stanje", authors)
        this.setAuthors(authors);
    }  


    private setAuthors(authors: AuthorType[]) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                authors: authors,
            }),
        ));
    }
    

    render() {
		if (this.state.isUserLoggedIn === false) {        
			return (
				<Redirect to="/login" />
        );
    }
        return (
            <Container>
                <RoledMainMenu role="user" /> 
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faListAlt } /> books
                            </Card.Title>
                            <Table hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th colSpan={ 2 }></th>
                                        <th className="text-center">
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={ () => this.showAddModal() }>
                                                <FontAwesomeIcon icon= { faPlus} /> Add
                                            </Button>
                                        </th>
                                    </tr>                                
                                    <tr>
                                        <th className="text-center">ID</th>
                                        <th className="text-center">Title</th>
                                        <th>Category</th>
                                        <th>Author(s)</th>
                                        <th>Publication Year</th>
                                        <th>Publisher</th>
                                        <th>Pages</th>
                                        <th>ISBN</th>
                                        <th>Status</th>
                                        <th>Language</th>
                                        <th>Catalog Number</th>
                                        <th>Location</th>
                                        <th></th>                            
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.books.map(book => (
                                        <tr>
                                            <td className="text-center">{ book.bookId }</td>
                                            <td className="text-center">{ book.title }</td>
                                            <td>{ book.category?.name }</td> 
                                            <td>{ book.authors?.length }</td>                                          
                                            <td>{ book.publicationYear }</td>
                                            <td>{ book.publisher?.name }</td>
                                            <td>{ book.pages }</td>
                                            <td> {book.isbn} </td>
                                            <td>{ book.isVisible === 0 ? 'hiden' : 'visible' }</td>                                 
                                            <td> { book.language } </td>
                                            <td> { book.catalogNumber } </td>
                                            <td> { book.location?.room + " - " + book.location?.shelf } </td>
                                            <td className="text-center">
                                                <Button 
                                                    variant="info" 
                                                    size="sm"
                                                    onClick={ () => this.showEditModal(book) }>
                                                    <FontAwesomeIcon icon={ faEdit } /> Edit 
                                                </Button>
                                            </td>
                                        </tr>
                                    ), this ) }
                                </tbody>
                            </Table>      
                    </Card.Body>
                </Card>
                
                <Modal centered show={ this.state.addModal.visible } 
                                onHide={ () => this.setAddModalVisible(false) }
                                onEntered={ () => { 
                                    if (document.getElementById('photo')) {
                                        const filePhoto: any = document.getElementById('photo');
                                        filePhoto.value = ''; 
                                    }
                                } }>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add new Book
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>  {/* TITLE   */ }
                            <Form.Label htmlFor="title">Title</Form.Label>
                            <Form.Control id="title" 
                                          type="text" 
                                          value={ this.state.addModal.title } 
                                          onChange={ (e) => this.setAddModalStringFieldState('title', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* ORIGINAL TITLE   */ }
                            <Form.Label htmlFor="originalTitle">Original Title</Form.Label>
                            <Form.Control id="originalTitle" 
                                          type="text" 
                                          value={ this.state.addModal.originalTitle } 
                                          onChange={ (e) => this.setAddModalStringFieldState('originalTitle', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <div>                            
							{ this.state.authors.map(this.printAddModalAuthorInput ,this) }   { /* spisak autora */ }
						</div>
                        <Form.Group>  {/* YEAR   */ }
                            <Form.Label htmlFor="publicationYear">Publication Year</Form.Label>
                            <Form.Control id="publicationYear" 
                                          type="text" 
                                          value={ this.state.addModal.publicationYear } 
                                          onChange={ (e) => this.setAddModalNumberFieldState('publicationYear', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* PAGES   */ }
                            <Form.Label htmlFor="pages">Pages</Form.Label>
                            <Form.Control id="pages" 
                                          type="text" 
                                          value={ this.state.addModal.pages } 
                                          onChange={ (e) => this.setAddModalNumberFieldState('pages', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* ISBN   */ }
                            <Form.Label htmlFor="isbn">ISBN</Form.Label>
                            <Form.Control id="isbn" 
                                          type="text" 
                                          value={ this.state.addModal.isbn } 
                                          onChange={ (e) => this.setAddModalStringFieldState('isbn', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* STATUS   */ }
                            <Form.Label htmlFor="isVisible">Status</Form.Label>
                            <Form.Control id="isVisible" 
                                          as="select" 
                                          value={ this.state.addModal.isVisible } 
                                          onChange={ (e) => this.setAddModalNumberFieldState('isVisible', e.target.value) } >
                                              <option value="0">Hidden</option>
                                              <option value="1">Visible</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* LANGUAGE   */ }
                            <Form.Label htmlFor="language">Language</Form.Label>
                            <Form.Control id="language" 
                                          type="text" 
                                          value={ this.state.addModal.language } 
                                          onChange={ (e) => this.setAddModalStringFieldState('language', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group>  {/* CATEGORY   */ }
                            <Form.Label htmlFor="category">Category</Form.Label>
                            <Form.Control id="category" 
                                          as="select" 
                                          value={ this.state.addModal.categoryId.toString() } 
                                          onChange={ (e) => this.setAddModalNumberFieldState('categoryId', e.target.value) } >
                                        { this.state.categories.map(category => (
                                            <option value={ category.categoryId?.toString() }>
                                                { category.name }
                                            </option>
                                        ) ) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* PUBLISHER   */ }
                            <Form.Label htmlFor="publisher">Publisher</Form.Label>
                            <Form.Control id="publisher" 
                                          as="select" 
                                          value={ this.state.addModal.publisherId.toString() } 
                                          onChange={ (e) => this.setAddModalNumberFieldState('publisherId', e.target.value) } >
                                        { this.state.publishers.map(publisher => (
                                            <option value={ publisher.publisherId?.toString() }>
                                                { publisher.name }
                                            </option>
                                        ) ) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* LOCATION   */ }
                            <Form.Label htmlFor="location-room, location-shelf">Location</Form.Label>
                            <Form.Control id="location-room" 
                                          as="select" 
                                          value={ this.state.addModal.locationId.toString() } 
                                          
                                          onChange={ (e) => this.setAddModalNumberFieldState('locationId', e.target.value) } >
                                        { this.state.locations.map(location => (
                                            <option value={ location.locationId?.toString() }>
                                                { location.room }
                                            </option>
                                        ) ) }
                            </Form.Control>
                            <Form.Control id="location-shelf" 
                                          as="select" 
                                          value={ this.state.addModal.locationId.toString() } 
                                          onChange={ (e) => this.setAddModalNumberFieldState('locationId', e.target.value) } >
                                        { this.state.locations.map(location => (
                                            <option value={ location.locationId?.toString() }>
                                                { location.shelf }
                                            </option>
                                        ) ) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* PHOTO   */ }
                            <Form.Label htmlFor="photo">Photo</Form.Label>
                            <Form.File id="photo">

                            </Form.File>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doAddBook() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new Book 
                            </Button>
                        </Form.Group>
                        { this.state.addModal.message ? 
                            ( <Alert variant="danger" value={ this.state.addModal.message } /> ) : ''
                        }
                    </Modal.Body>
                </Modal>

                <Modal centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisible(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Book
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" 
                                          type="text" 
                                          value={ this.state.editModal.name } 
                                          onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } >
                            </Form.Control>.
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doEditBook() }>
                                <FontAwesomeIcon icon={ faEdit } /> Edit Book 
                            </Button>
                        </Form.Group>
                        { this.state.editModal.message ? 
                            ( <Alert variant="danger" value={ this.state.addModal.message } /> ) : ''
                        }
                    </Modal.Body>
                </Modal>
                
            </Container>

            
        );
    }

    private setAddModalAuthorUse(authorId: number, use: boolean) {  // prođi kroz autore i mapiraj čekirane
        const addAuthor: { authorId: number, forename: string, surname: string, use: number}[] = [...this.state.addModal.authors];
        for (const author of addAuthor) {
            if (author.authorId === authorId) {
                author.use = use ? 1 : 0;
                break;
            }
        }
        console.log("addAuthor", addAuthor);
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                authors: addAuthor,
            }),
        ));
        
    }

    

    private printAddModalAuthorInput(author: any) {  // printa fragmet koji se odnosi na checkbox polje u modalu dodavanja knjige
        return(
            <Form.Group>
                
            <Row>
                <Col xs="2" sm="1" className="text-center">
                <input type="checkbox" value="1" checked={ author.use === 1}
                    onChange= { (e) => this.setAddModalAuthorUse(author.authorId, e.target.checked) } />
                </Col>
                <Col xs="10" sm="4">
                    { author.forename + " " + author.surname }
                </Col>
                
            </Row>
            
            
            
        </Form.Group>
        );
    }
    
    private doAddBook() {
        const filePhoto: any = document.getElementById('photo');
        if (filePhoto.files.length === 0) {
            this.setAddModalStringFieldState('message', 'Please select a photo to upload.');
            return;
        }

        api('api/book/createBook', 'post', {
            categoryId: this.state.addModal.categoryId,
            title: this.state.addModal.title,
            originalTitle: this.state.addModal.originalTitle,
            publicationYear: this.state.addModal.publicationYear,
            pages: this.state.addModal.pages,
            isbn: this.state.addModal.isbn,
            language: this.state.addModal.language,
            publisherId: this.state.addModal.publisherId,
            locationId: this.state.addModal.locationId,
            authors: this.state.addModal.authors
                    .filter(author => author.use === 1)
                    .map(author => ({
                        authorId: author.authorId,                        
                    }))
        })
        .then(async (res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            const bookId: number = res.data.bookId;

            const file = filePhoto.files[0];
            
            await this.uploadBookPhoto(bookId, file);
            /*
            const res2 = await this.uploadBookPhoto(bookId, file);
            if (res.status !== 'ok') {
                this.setAddModalStringFieldState('message', 'Could not upload this file.');
                return;
            }
            */
            this.setAddModalVisible(false);
            this.getBooks();    
            
        });
    }

    private async uploadBookPhoto(bookId: number, file: File) {
        return await apiFile('api/book/' + bookId + '/uploadPhoto/', 'photo', file);
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private showEditModal(book: BookType) {
        this.setEditModalStringFieldState('name', String(book.title));
        this.setEditModalVisible(true);
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('bookId', book.bookId ? book.bookId?.toString() : 'null');
    }

    private showAddModal() {
        this.setAddModalStringFieldState('title', '');
        this.setAddModalStringFieldState('originalTitle', '');
        this.setAddModalStringFieldState('publicationYear', '');
        this.setAddModalStringFieldState('pages', '');
        this.setAddModalStringFieldState('isbn', '');
        this.setAddModalStringFieldState('language', '');
        this.setAddModalStringFieldState('locationId', '1');
        this.setAddModalStringFieldState('message', '');       

        this.setAddModalVisible(true);
        
    } 
    
    private doEditBook() {
        api('api/book/' + this.state.editModal.bookId, 'patch', {
            name: this.state.editModal.name
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            this.setEditModalVisible(false);
            this.getBooks();    
            
        });
    } 
}

export default DashboardBook;
