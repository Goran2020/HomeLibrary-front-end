import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <Container>
      <FontAwesomeIcon icon={ faHome } />      
      Home
    </Container>
  );
}

export default App;
