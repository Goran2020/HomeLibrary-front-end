import React from 'react';
import { Container, Card, Row, Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faBackward } from '@fortawesome/free-solid-svg-icons';

import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse } from '../../api/api';
import PhotoType from '../../types/PhotoType';
import { ApiConfig } from '../../config/api.config';
import { Link } from 'react-router-dom';


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
     
}

class DashboardPhoto extends React.Component<DashboardPhotoProperties> {
    state: DashboardPhotoState;
    constructor(props: Readonly<DashboardPhotoProperties>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,
        photos: [],               
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
                    </Card.Body>
                </Card>
            </Container>
        )
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
                        
                    </Card.Footer>
                </Card>
            </Col>
        )
    }
    
}

export default DashboardPhoto;
