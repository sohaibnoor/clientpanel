import React, { Component } from 'react';
import { Link } from 'react-router-dom';

 class Sidebar extends Component {
    render() {
        return (
            <Link to='/client/add' className='btn btn-success btn-block'>
            <i className='fas fa-plus'/> New
            </Link>
        )
    }
}

export default Sidebar;
