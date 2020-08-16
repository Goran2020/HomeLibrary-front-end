import React from 'react';
import { MainMenuItem, MainMenu } from '../MainMenu/MainMenu';

interface RoledMainMenuProperties {
    role: 'user' | "visitor";
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];
        
        switch (this.props.role) {
            case 'user':          items = this.getUserMenuItems(); break;            
            case 'visitor':       items = this.getVisitorMenuItems(); break;
        }


        return <MainMenu items={ items } />
    }

    private getUserMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Home", "/"), 
            new MainMenuItem("Contact", "/contact/"), 
            new MainMenuItem("Log Out", "/logout/"),
            new MainMenuItem("User Dashboard", "/dashboard/"),                       
        ];
    }

    private getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Home", "/"),  
            new MainMenuItem("Log in", "/login/"),
            new MainMenuItem("Contact", "/contact/"),
            new MainMenuItem("Register", "/register/"),
        ];
    }

}