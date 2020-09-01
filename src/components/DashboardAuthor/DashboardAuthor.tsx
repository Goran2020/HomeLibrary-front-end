import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse } from '../../api/api';
import AuthorType from '../../types/AuthorType';
import ApiAuthorDto from '../../dtos/ApiAuthorDto';



interface DashboardLocationState {
    isUserLoggedIn: boolean;
    authors: AuthorType[];
    
    addModal: {
        visible: boolean;
        forename: string;
        surname: string;
        message: string;     
    };

    editModal: {        
        visible: boolean;
        forename: string;
        surname: string;
        message: string;
        authorId: number | null;
    }
  
}

class DashboardAuthor extends React.Component {
    state: DashboardLocationState;
    constructor(props: Readonly<{}>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,
        authors: [],
        
        addModal: {
            visible: false,
            forename: '',
            surname: '',
            message: '',
        } , 
        
        editModal: {
            authorId: null,
            visible: false,
            forename: '',
            surname: '',
            message: '',
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


    componentDidMount() {
        this.getAuthors();
	}
	

	private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
    }

    private setCategories(categories: CategoryType[]) {
		this.setState(Object.assign(this.state, {
		  categories: categories,
		}));
	}

    private putAuthorsInState(data?: ApiAuthorDto[]) {
		if (!data || data.length === 0) {
			this.setLocations([]);
			return;
        }    
        
		
		const authors: AuthorType[] | undefined = data?.map(author => {
			return {
				authorId: author.authorId,
                forename: author.forename,
                surname: author.surname,				
			};
		});
	

		this.setLocations(authors);
	
    }

    private setLocations(authors: AuthorType[]) {
		this.setState(Object.assign(this.state, {
            authors: authors,
		}));
    }

    private getAuthors() {  
        api('/api/author', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.putAuthorsInState(res.data);
        });
        
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
                                <FontAwesomeIcon icon={ faListAlt } /> Authors
                            </Card.Title>
                            <Table hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th colSpan={ 3 }></th>
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
                                        <th className="text-center">Forename</th>
                                        <th className="text-center">Surname</th>
                                        <th></th>                            
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.authors.map(author => (
                                        <tr>
                                            <td className="text-center">{ author.authorId }</td>
                                            <td className="text-center">{ author.forename }</td>
                                            <td className="text-center">{ author.surname }</td>
                                            <td className="text-center">
                                                <Button 
                                                    variant="info" 
                                                    size="sm"
                                                    onClick={ () => this.showEditModal(author) }>
                                                    <FontAwesomeIcon icon={ faEdit } /> Edit 
                                                </Button>
                                            </td>
                                        </tr>
                                    ), this ) }
                                </tbody>
                            </Table>      
                    </Card.Body>
                </Card>
                
                { /* => A D D   L O C A T I O N  */ }
                <Modal centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisible(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add new Author
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="forename">Forename</Form.Label>
                            <Form.Control id="forename" 
                                          type="text" 
                                          value={ this.state.addModal.forename } 
                                          onChange={ (e) => this.setAddModalStringFieldState('forename', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="surname">Surname</Form.Label>
                            <Form.Control id="surname" 
                                          type="text" 
                                          value={ this.state.addModal.surname } 
                                          onChange={ (e) => this.setAddModalStringFieldState('surname', e.target.value) } >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doAddAuthor() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new Author
                            </Button>
                        </Form.Group>
                        { this.state.addModal.message ? 
                            ( <Alert variant="danger" value={ this.state.addModal.message } /> ) : ''
                        }
                    </Modal.Body>
                </Modal>


                { /*  =>  E D I T I N G    L O C A T I O N  */ }
                <Modal centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisible(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Author
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="forename">Forename</Form.Label>
                            <Form.Control id="forename" 
                                          type="text" 
                                          value={ this.state.editModal.forename } 
                                          onChange={ (e) => this.setEditModalStringFieldState('forename', e.target.value) } >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="surname">Surname</Form.Label>
                            <Form.Control id="surname" 
                                          type="text" 
                                          value={ this.state.editModal.surname } 
                                          onChange={ (e) => this.setEditModalStringFieldState('surname', e.target.value) } >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doEditAuthor() }>
                                <FontAwesomeIcon icon={ faEdit } /> Edit Author 
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
    
    private doAddAuthor() {
        api('api/author', 'post', {
            forename: this.state.addModal.forename,
            surname: this.state.addModal.surname
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            this.setAddModalVisible(false);
            this.getAuthors();    
            
        });
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private showEditModal(author: AuthorType) {
        this.setEditModalStringFieldState('forename', String(author.forename));
        this.setEditModalStringFieldState('surname', String(author.surname));
        this.setEditModalVisible(true);
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('authorId', author.authorId ? author.authorId?.toString() : 'null');
    }

    private showAddModal() {
        this.setAddModalStringFieldState('forename', '');
        this.setAddModalStringFieldState('surname', '');        
        this.setAddModalStringFieldState('message', '');

        this.setAddModalVisible(true);
    } 
    
    private doEditAuthor() {
        api('api/author/' + this.state.editModal.authorId, 'patch', {
            forename: this.state.editModal.forename,
            surname: this.state.editModal.surname
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            this.setEditModalVisible(false);
            this.getAuthors();    
            
        });
    }
  
}

export default DashboardAuthor;
