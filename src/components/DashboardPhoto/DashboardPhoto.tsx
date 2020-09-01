import React from 'react';
import { Container, Card, Row, Col, Nav, Form, Button, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faBackward, faPlus, faSave, faMinus } from '@fortawesome/free-solid-svg-icons';

import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse, apiFile } from '../../api/api';
import PhotoType from '../../types/PhotoType';
import { ApiConfig } from '../../config/api.config';
import { Link, Redirect } from 'react-router-dom';
import ApiPhotoDto from '../../dtos/ApiPhotoDto';


interface DashboardPhotoProperties {
    match: {
        params: {
            bookId: number,
        }
    }
}


interface DashboardPhotoState {
    isUserLoggedIn: boolean;
    photos: PhotoType[];
    addModal: {
        visible: boolean;
        photo: ApiPhotoDto;
        errorMessage: string;
    }
}

class DashboardPhoto extends React.Component<DashboardPhotoProperties> {
    state: DashboardPhotoState;
    constructor(props: Readonly<DashboardPhotoProperties>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,
        photos: [], 
        addModal: {
            visible: false,
            photo: {
                cover: 'back'
            },
            errorMessage: '',
        }              
      }
    }
    

    componentDidMount() {
        this.getPhotos();
	}
    
    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.bookId === oldProps.match.params.bookId) {
            return;
        }

        this.getPhotos();
    }

	private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
    } 
    

    private getPhotos() {  
        api('/api/book/' + this.props.match.params.bookId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

            this.setState(Object.assign(this.state, {
                photos: res.data.photos,
            }))   
        });
        
    } 
    
    render () {
        if (this.state.isUserLoggedIn === false) {
            return ( <Redirect to="/login" />);
        }
        return (
            <Container>
                <RoledMainMenu role="user" />

                <Card>
                    <Card.Body>                        
                        <Card.Title>
                            <FontAwesomeIcon icon={ faImages } /> Photos
                        </Card.Title>
                        <Nav className="mb-3">
                            <Nav.Item>
                                <Link to="/dashboard/book/" className="btn btn-sm btn-info">
                                      <FontAwesomeIcon icon={ faBackward } /> Go Back to Books</Link>
                            </Nav.Item>
                        </Nav>
                        <Row>
                            { this.state.photos.map(this.printSinglePhoto, this) }
                        </Row>

                        <Form.Group className="mt-5">
                            <Button variant="primary" 
                                    size="sm"
                                    onClick={ () => this.showAddModal() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add photo
                            </Button>
                        </Form.Group>
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
                            Add new Photo
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>  {/* PHOTO   */ }
                        { console.log(this.state.addModal.photo.cover) }
                            <Form.Label htmlFor="cover">Book cover</Form.Label>
                                <Form.Control id="cover" 
                                            as="select" 
                                            value={ this.state.addModal.photo.cover } 
                                            onChange={ (e) => this.setAddModalStringFieldState('cover', e.target.value) } >
                                            
                                                <option value="back">
                                                    back
                                                </option>
                                                <option value="front">
                                                    front
                                                </option>                                        
                                </Form.Control>
                        </Form.Group>
                        <Form.Group>  {/* PHOTO   */ }
                                <Form.Label htmlFor="photo">Photo</Form.Label>
                                <Form.File id="photo">

                                </Form.File>
                        </Form.Group>

                        
                        <Form.Group>
                            <Button variant="primary" onClick= { () => this.doUploadPhoto() }>
                                <FontAwesomeIcon icon={ faSave } /> Upload photo 
                            </Button>
                        </Form.Group>
                        <Alert variant="danger"
                                   className={ this.state.addModal.errorMessage ? '' : 'd-none' }>
                                { this.state.addModal.errorMessage }
                            </Alert>
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }

    private async doUploadPhoto() {
        const filePhoto: any = document.getElementById('photo');
        if (filePhoto.files.length === 0) {
            this.setState(Object.assign(this.state,
                Object.assign(this.state.addModal, {
                    errorMessage: 'Please select a photo to upload.',
                }),
            ));
            
            return;
        }

        const file = filePhoto.files[0];
            
        await this.uploadBookPhoto(this.props.match.params.bookId, file, this.state.addModal.photo.cover);

        this.getPhotos();
    }

    private async uploadBookPhoto(bookId: number, file: File, cover: string) { // --------add-----------
        
        
        return await apiFile('api/book/' + bookId + '/uploadPhoto/' + cover, 'photo', file);  //--------add-----------
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal.photo, {
                [ fieldName ]: newValue,
            }),
        ));
    }

    private showAddModal() {
        this.setAddModalVisible(true);
    }

    private setAddModalVisible(state: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: state,
            }),
        ));
    }

    private printSinglePhoto(photo: PhotoType) {
        return(
            <Col xs="12" sm="6" md="4" lg="3">
                <Card>
                    <Card.Body>
                        <img alt={ "Photo  " + photo.photoId }
                             src={ ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath }
                             className="w-100" />
                    </Card.Body>
                    <Card.Footer>
                        <Button variant="danger" block onClick={ () => this.deletePhoto(photo.photoId) } >
                            <FontAwesomeIcon icon={ faMinus } /> Delete photo
                        </Button>
                    </Card.Footer>
                </Card>
            </Col>
        )
    }

    private deletePhoto(photoId: number) {
        if (!window.confirm('Are you shure you want to delete this photo?')) {
            return;
        }
        api('api/book/' + this.props.match.params.bookId + '/deletePhoto/' + photoId + '/', 'delete', {} )
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLoggedInState(false);
                return;
            }

            this.getPhotos();
        })
    }
    
}

export default DashboardPhoto;
