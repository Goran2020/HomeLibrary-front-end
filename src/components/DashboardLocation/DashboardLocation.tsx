import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse } from '../../api/api';
import ApiLocationDto from '../../dtos/ApiLocationDto';
import LocationType from '../../types/LocationType';



interface DashboardLocationState {
    isUserLoggedIn: boolean;
    locations: LocationType[];
    
    addModal: {
        visible: boolean;
        room: string; 
        shelf: string;
        message: string;     
    };

    editModal: {        
        visible: boolean;
        room: string; 
        shelf: string;
        message: string;
        locationId: number | null;
    }
  
}

class DashboardLocation extends React.Component {
    state: DashboardLocationState;
    constructor(props: Readonly<{}>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,
        locations: [],
        
        addModal: {
            visible: false,
            room: '',
            shelf: '',
            message: '',
        } , 
        
        editModal: {
            locationId: null,
            visible: false,
            room: '',
            shelf: '',
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
        this.getLocations();
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

    private getLocations() {  
        api('/api/location', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.putLocationsInState(res.data);
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
                                <FontAwesomeIcon icon={ faListAlt } /> Locations
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
                                        <th className="text-center">Room</th>
                                        <th className="text-center">Shelf</th>
                                        <th></th>                            
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.locations.map(location => (
                                        <tr>
                                            <td className="text-center">{ location.locationId }</td>
                                            <td className="text-center">{ location.room }</td>
                                            <td className="text-center">{ location.shelf }</td>
                                            <td className="text-center">
                                                <Button 
                                                    variant="info" 
                                                    size="sm"
                                                    onClick={ () => this.showEditModal(location) }>
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
                            Add new location
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="room">Room</Form.Label>
                            <Form.Control id="room" 
                                          type="text" 
                                          value={ this.state.addModal.room } 
                                          onChange={ (e) => this.setAddModalStringFieldState('room', e.target.value) } >
                            </Form.Control>.
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="shelf">Shelf</Form.Label>
                            <Form.Control id="shelf" 
                                          type="text" 
                                          value={ this.state.addModal.shelf } 
                                          onChange={ (e) => this.setAddModalStringFieldState('shelf', e.target.value) } >
                            </Form.Control>.
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doAddLocation() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new Location
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
                            Edit Location
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="room">Room</Form.Label>
                            <Form.Control id="room" 
                                          type="text" 
                                          value={ this.state.editModal.room } 
                                          onChange={ (e) => this.setEditModalStringFieldState('room', e.target.value) } >
                            </Form.Control>.
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="shelf">Shelf</Form.Label>
                            <Form.Control id="shelf" 
                                          type="text" 
                                          value={ this.state.editModal.shelf } 
                                          onChange={ (e) => this.setEditModalStringFieldState('shelf', e.target.value) } >
                            </Form.Control>.
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doEditLocation() }>
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
    
    private doAddLocation() {
        api('api/location', 'post', {
            room: this.state.addModal.room,
            shelf: this.state.addModal.shelf
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            this.setAddModalVisible(false);
            this.getLocations();    
            
        });
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private showEditModal(location: LocationType) {
        this.setEditModalStringFieldState('room', String(location.room));
        this.setEditModalStringFieldState('shelf', String(location.shelf));
        this.setEditModalVisible(true);
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('locationId', location.locationId ? location.locationId?.toString() : 'null');
    }

    private showAddModal() {
        this.setAddModalStringFieldState('room', '');
        this.setAddModalStringFieldState('shelf', '');        
        this.setAddModalStringFieldState('message', '');

        this.setAddModalVisible(true);
    } 
    
    private doEditLocation() {
        api('api/location/' + this.state.editModal.locationId, 'patch', {
            room: this.state.editModal.room,
            shelf: this.state.editModal.shelf,
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLoggedInState(false);				
            }

            if (res.status === 'error') {
                return this.setMessage('Please wait...or try to refresh');
            }

            this.setEditModalVisible(false);
            this.getLocations();    
            
        });
    }
  
}

export default DashboardLocation;
