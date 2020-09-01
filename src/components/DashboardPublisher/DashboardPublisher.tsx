import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse } from '../../api/api';
import PublisherType from '../../types/PublisherType';
import ApiPublisherDto from '../../dtos/ApiPublisherDto';



interface DashboardLocationState {
    isUserLoggedIn: boolean;
    publishers: PublisherType[];
    
    addModal: {
        visible: boolean;
        name: string;
        city: string;
        state: string;
        foundedIn: number;
        message: string;     
    };

    editModal: {    
        message: string;    
        visible: boolean;
        name: string;
        city: string;
        state: string;
        foundedIn: number;
        publisherId: number | null;
    }
  
}

class DashboardPublisher extends React.Component {
    state: DashboardLocationState;
    constructor(props: Readonly<{}>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,
        publishers: [],
        
        addModal: {
            visible: false,
            name: '',
            city: '',
            state: '',
            foundedIn: 1,
            message: '',
        } , 
        
        editModal: {
            publisherId: null,
            visible: false,
            name: '',
            city: '',
            state: '',
            foundedIn: 1,
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
        this.getPublishers();
	}
	

	private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
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
                city: publisher.city,
                state: publisher.state,
                foundedIn: publisher.foundedIn,				
			};
		});
	

		this.setPublishers(publishers);
	
    }

    private setPublishers(publishers: PublisherType[]) {
		this.setState(Object.assign(this.state, {
            publishers: publishers,
		}));
    }

    private getPublishers() {  
        api('/api/publisher', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.putPublishersInState(res.data);
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
                                <FontAwesomeIcon icon={ faListAlt } /> Publishers
                            </Card.Title>
                            <Table hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th colSpan={ 5 }></th>
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
                                        <th className="text-center">Room</th>
                                        <th className="text-center">Shelf</th>
                                        <th></th>                            
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.publishers.map(publisher => (
                                        <tr>
                                            <td className="text-center">{ publisher.publisherId }</td>
                                            <td className="text-center">{ publisher.name }</td>
                                            <td className="text-center">{ publisher.city }</td>
                                            <td className="text-center">{ publisher.state }</td>
                                            <td className="text-center">{ publisher.foundedIn }</td>
                                            <td className="text-center">
                                                <Button 
                                                    variant="info" 
                                                    size="sm"
                                                    onClick={ () => this.showEditModal(publisher) }>
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
                            Add new publisher
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
                            <Form.Label htmlFor="city">City</Form.Label>
                            <Form.Control id="city" 
                                          type="text" 
                                          value={ this.state.addModal.city } 
                                          onChange={ (e) => this.setAddModalStringFieldState('city', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="state">State</Form.Label>
                            <Form.Control id="state" 
                                          type="text" 
                                          value={ this.state.addModal.state } 
                                          onChange={ (e) => this.setAddModalStringFieldState('state', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="foundedIn">Founded In</Form.Label>
                            <Form.Control id="foundedIn" 
                                          type="text" 
                                          value={ this.state.addModal.foundedIn } 
                                          onChange={ (e) => this.setAddModalStringFieldState('foundedIn', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doAddPublisher() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new Publisher
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
                            Edit Publisher
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
                            <Form.Label htmlFor="city">City</Form.Label>
                            <Form.Control id="city" 
                                          type="text" 
                                          value={ this.state.editModal.city } 
                                          onChange={ (e) => this.setEditModalStringFieldState('city', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="state">State</Form.Label>
                            <Form.Control id="state" 
                                          type="text" 
                                          value={ this.state.editModal.state } 
                                          onChange={ (e) => this.setEditModalStringFieldState('state', e.target.value) } >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="foundedIn">Founded In</Form.Label>
                            <Form.Control id="foundedIn" 
                                          type="text" 
                                          value={ this.state.editModal.foundedIn } 
                                          onChange={ (e) => this.setEditModalStringFieldState('foundedIn', e.target.value) } >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doEditPublisher() }>
                                <FontAwesomeIcon icon={ faEdit } /> Edit Location 
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
    
    private doAddPublisher() {
        api('api/publisher', 'post', {
            name: this.state.addModal.name,
            city: this.state.addModal.city,
            state: this.state.addModal.state,
            foundedIn: this.state.addModal.foundedIn,
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            this.setAddModalVisible(false);
            this.getPublishers();    
            
        });
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setAddModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            }),            
        ));
    }   

    private showEditModal(publisher: PublisherType) {
        this.setEditModalStringFieldState('name', String(publisher.name));
        this.setEditModalStringFieldState('city', String(publisher.city));
        this.setEditModalStringFieldState('state', String(publisher.state));
        this.setEditModalNumberFieldState('foundedIn', String(publisher.foundedIn));        
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('publisherId', publisher.publisherId ? publisher.publisherId?.toString() : 'null');

        this.setEditModalVisible(true);
    }

    private showAddModal() {
        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('city', '');        
        this.setAddModalStringFieldState('state', '');
        this.setAddModalNumberFieldState('foundedIn', '1');

        this.setAddModalVisible(true);
    } 
    
    private doEditPublisher() {
        api('api/publisher/' + this.state.editModal.publisherId, 'patch', {
            name: this.state.editModal.name,
            city: this.state.editModal.city,
            state: this.state.editModal.state,
            foundedIn: this.state.editModal.foundedIn,
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            this.setEditModalVisible(false);
            this.getPublishers();    
            
        });
    }
  
}

export default DashboardPublisher;
