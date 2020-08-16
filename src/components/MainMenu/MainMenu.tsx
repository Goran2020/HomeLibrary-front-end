import React from 'react';
import { Nav } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';

export class MainMenuItem {
    text: string = '';
    link: string = '#';

    constructor(txt: string, lnk: string) {
        this.text = txt;
        this.link = lnk;
    }
}


interface MainMenuProperties {
    items: MainMenuItem[];
}

interface MainMenuState {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties> {
    state: MainMenuState;
    constructor(props: Readonly<MainMenuProperties>) {
        super(props);

        this.state = {
            items: props.items,
        };
    }

    setItems(items: MainMenuItem[]) {
        this.setState({
            items: items,
        })
    }

    render() {
        return (           
            <Nav variant="tabs">
                <HashRouter>
                { 
                    this.state.items.map(this.makeNavLink) 
                }
                </HashRouter>                
            </Nav>           
        );
    }

    private makeNavLink(item: MainMenuItem) {
        return (
            <Link to={ item.link } className="nav-link">
                {  item.text }
            </Link>            
        );
    }    
}