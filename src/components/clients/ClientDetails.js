import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Spinner from '../layout/Spinner';


class ClientDetails extends Component {
    state = {
        showBalanceUpdate: false,
        balanceUpdateAmount: ''
    }
    onChange = e => this.setState({[e.target.name]: e.target.value});

    balanceSubmit = e => {
        e.preventDefault();
        const { client, firestore, history } = this.props;
        const { balanceUpdateAmount } = this.state;

        const clientUpdate = {
            balance: parseFloat(balanceUpdateAmount)
        }
        firestore.update({collection: 'clients', doc: client.id}, clientUpdate)
        .then(history.push('/'));
        //console.log(this.state.balanceUpdateAmount);
    }
    //To Delete a Client
    onDeleteClick = () => {
        const {client, firestore, history} = this.props;
        firestore.delete({collection: 'clients', doc: client.id})
        .then(history.push('/'));
        //console.log("deleted")
    }
    render() {
        const { client } = this.props;
        const { showBalanceUpdate, balanceUpdateAmount } = this.state;
        let balanceForm = '';
        if(showBalanceUpdate){
            balanceForm = (
                <form onSubmit={this.balanceSubmit}>
                <div className='input-group'>
                <input
                type='text'
                className='form-control'
                name='balanceUpdateAmount'
                value={balanceUpdateAmount}
                placeholder='Add New Balance'
                onChange={this.onChange}
                >
                </input>
                <div className='input-group-append'>
                <input type='submit' value='Update' className='btn btn-outline-dark' />
                </div>
                </div>
                </form>
            )
        }else{
            balanceForm=null;
        }


        if(client){
            return (
                <div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <Link to='/' className='btn btn-link'>
                                <i className='fas fa-arrow-circle-left' /> Back to Dashboard
                             </Link>
                        </div>
                        <div className='col-md-6'>
                         <div className='btn-group float-right'>
                             <Link to={`/client/edit/${client.id}`} className='btn btn-dark'
                             >
                             Edit</Link>
                             <button
                             onClick={this.onDeleteClick}
                              className='btn btn-danger'>
                                 Delete
                                 </button>

                         </div>

                        </div>
                    </div>
                    <hr />
                    <div className='card'>
                        <h3 className='card-header'>
                        {client.firstName} {client.lastName}
                        </h3>
                    <div className='card-body'>
                            <div className='row'>
                                <div className='col-md-8 col-sm-6'>
                                    <h4>
                                    Client Id {' '}
                                    <span className='text-secondary'>{client.id}</span>
                                    </h4>
                                </div>
                                <div className='col-md-4 col-sm-6'>
                                    <h3 className='pull-right'>
                                        Balance: {' '} 
                                        <span
                                         className={classnames({
                                             'text-danger': client.balance > 0,
                                             'text-success': client.balance === 0
                                         })} 
                                        >
                                        ${parseFloat(client.balance).toFixed(2)}</span>{' '}
                                        <small>
                                            <a href='#!' onClick={() => 
                                                this.setState({showBalanceUpdate: !this.state.showBalanceUpdate})}>
                                                <i className='fas fa-pencil-alt'></i>
                                                </a>
                                        </small>
                                    </h3>
                                    {balanceForm}
                                </div>
                            </div>
                            <hr/>
                            <ul className='list-group'>
                                <li className='list-group-item'>Client Email: {client.email}</li>
                                <li className='list-group-item'>Client Phone: {client.phone}</li>
                            </ul>
                    </div>
                    </div>
                </div>
            )
        }
        else {
            return <Spinner />
        }
       
    }
}

ClientDetails.propTypes = {
    firestore: PropTypes.object.isRequired
}

export default compose(
    firestoreConnect(props => [
        { collection: 'clients', storeAs: 'client', doc: props.match.params.id }
    ]),
    connect(({ firestore: {ordered} }, props) => ({
        client: ordered.client && ordered.client[0]
    }))
)(ClientDetails);
