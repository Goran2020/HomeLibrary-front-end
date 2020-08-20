import React from 'react';
import { Container, Card, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import { Redirect, Link } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api, { ApiResponse } from '../../api/api';



interface UserDashboardState {
  isUserLoggedIn: boolean;
  
}

class UserDashboard extends React.Component {
    state: UserDashboardState;
    constructor(props: Readonly<{}>) {
      super(props);

      this.state = {
        isUserLoggedIn: true,        
      }
    }

    componentWillMount() {
        this.getUserData();
	}
	
	componentWillUpdate() {
		this.getUserData();
	}

	private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
    }

    private getUserData() {
        api('/api/user/', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
				this.setLoggedInState(false);
				return;
			}

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
                          <FontAwesomeIcon icon={ faHome } /> User Dashboard
                      </Card.Title>
                            <ul>
                                <li><Link to="/dashboard/category/">Categories</Link></li>
                                <li><Link to="/dashboard/book">Book</Link></li>
                                <li><Link to="/dashboard/publisher">Publisher</Link></li>
                                <li><Link to="/dashboard/location">Location</Link></li>
                                <li><Link to="/dashboard/author">Author</Link></li>
                            </ul>                
                  </Card.Body>
              </Card>
          </Container>
      )
    } 

    private singleCategory(category: CategoryType) {
      return (
        <Col lg="3" md="4" sm="6" xs="12">
          <Card className="mb-3">
            <Card.Body>
              <Card.Title as="p">{ category.name }</Card.Title>
                <Link to={ `/category/${ category.categoryId }` } className="btn btn-primary btn-block btn-sm">
                  Open category
                </Link>     
                   
            </Card.Body>
          </Card>
        </Col>
      );
    }
  
}

export default UserDashboard;
