import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';



interface HomePageState {
  //isUserLoggedIn: boolean;
  categories?: CategoryType[];
}



class HomePage extends React.Component {
    state: HomePageState;
    constructor(props: Readonly<{}>) {
      super(props);

      this.state = {
        //isUserLoggedIn: true,
        categories: [],
      }
    }

    componentWillMount() {
        this.getCategories();
	}
	/*
	componentWillUpdate() {
		this.getCategories();
	}
  */
    private getCategories() {
		api('visitor/category/', 'get', {})    // K O R I S N I K
		.then((res: ApiResponse) => {
			//console.log(res);

			if (res.status === 'error' || res.status === 'login') {
				//this.setLoggedInState(false);
				return;
			}

			this.putCategoriesInState(res.data);
		})
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
	private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
    }


    render() {
/*		if (this.state.isUserLoggedIn === false) {        
			return (
				<Redirect to="/login" />
        );
    }  */
      return (
          <Container>
            <RoledMainMenu role="visitor" /> 
              <Card>
                  <Card.Body>
                      <Card.Title>
                          <FontAwesomeIcon icon={ faListAlt } /> Top level categories
                      </Card.Title>
	  				          <Row>  {/* prikaz categorije*/}
                        { this.state.categories?.map(this.singleCategory) }
                      </Row>                     
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

export default HomePage;
