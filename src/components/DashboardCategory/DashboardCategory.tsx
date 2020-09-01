import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse } from '../../api/api';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';



interface DashboardCategoryState {
    isUserLoggedIn: boolean;
    categories: CategoryType[];
    
    addModal: {
        visible: boolean;
        name: string; 
        message: string;     
    };

    editModal: {
        categoryId?: number | null;
        visible: boolean;
        name: string;
        message: string;
    }
  
}

class DashboardCategory extends React.Component {
    state: DashboardCategoryState;
    constructor(props: Readonly<{}>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,
        categories: [],
        
        addModal: {
            visible: false,
            name: '',
            message: '',
        } , 
        
        editModal: {
            categoryId: null,
            visible: false,
            name: '',
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


    componentWillMount() {
        this.getCetgories();
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

    private putCategoriesInState(data?: ApiCategoryDto[]) {
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

    private getCetgories() {
        api('api/category', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.putCategoriesInState(res.data);
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
                                <FontAwesomeIcon icon={ faListAlt } /> Categories
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
                                        <th className="text-center">Name</th>
                                        <th></th>                            
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.categories.map(category => (
                                        <tr>
                                            <td className="text-center">{ category.categoryId }</td>
                                            <td className="text-center">{ category.name }</td>
                                            <td className="text-center">
                                                <Button 
                                                    variant="info" 
                                                    size="sm"
                                                    onClick={ () => this.showEditModal(category) }>
                                                    <FontAwesomeIcon icon={ faEdit } /> Edit 
                                                </Button>
                                            </td>
                                        </tr>
                                    ), this ) }
                                </tbody>
                            </Table>      
                    </Card.Body>
                </Card>
                
                <Modal centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisible(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add new category
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" 
                                          type="text" 
                                          value={ this.state.addModal.name } 
                                          onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doAddCategory() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new Category 
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
                            Edit category
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" 
                                          type="text" 
                                          value={ this.state.editModal.name } 
                                          onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doEditCategory() }>
                                <FontAwesomeIcon icon={ faEdit } /> Edit Category 
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
    
    private doAddCategory() {
        api('api/category', 'post', {
            name: this.state.addModal.name
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                this.setAddModalStringFieldState('message','Please wait...or try to refresh');
                return;
            }

            this.setAddModalVisible(false);
            this.getCetgories();    
            
        });
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private showEditModal(category: CategoryType) {
        this.setEditModalStringFieldState('name', String(category.name));
        this.setEditModalVisible(true);
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('categoryId', category.categoryId ? category.categoryId?.toString() : 'null');
    }

    private showAddModal() {
        this.setAddModalStringFieldState('name', '');        
        this.setAddModalStringFieldState('message', '');
        this.setAddModalVisible(true);
    } 
    
    private doEditCategory() {
        api('api/category/' + this.state.editModal.categoryId, 'patch', {
            name: this.state.editModal.name
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                this.setAddModalStringFieldState('message', 'Please wait...or try to refresh');
                return;
            }

            this.setEditModalVisible(false);
            this.getCetgories();    
            
        });
    }
  
}

export default DashboardCategory;
