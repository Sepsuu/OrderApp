// Component of our application which shows the orderlist.

import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { fetchOrders, deleteOrder } from '../actions';
import '../styles/OrderList.css';

// Quite basic OrderList component which
// maps all the orders to jsx. There is also
// conditional rendering for Eat button.
// Component uses lifecycle methods.
// This component also creates an fetchOrders action.
class OrderList extends Component {

    componentDidMount() {
        this.props.fetchOrders();
        this.triggerFetch();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    triggerFetch() {
        this.timer = setInterval(
            () => this.props.fetchOrders(),
            8000
          );
    }

    renderList() {
        return this.props.orders.map(order => {
            return (
                    <div key={order._id}>
                        <li className="list-group-item list-group-item-primary">
                            <h4>Order ID: {order.orderId}</h4>
                            <p>Sandwich ID: {order.sandwichId}</p>
                            <p>Status: {order.status}</p>
                            {order.status === "ready" ?
                                <button 
                                    className="btn btn-outline-success" 
                                    onClick={() => {this.props.deleteOrder(order.orderId, this.props.orders)}}>
                                        Eat
                                </button>
                                : "" 
                            }
                            
                        </li>
                    </div>
            );
        })
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '20px', width: '500px'}}>
                <h2 style={{ marginBottom: '20px'}}>Orderlist</h2>
                {this.renderList()}
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return { 
        orders: state.orders,
        auth: state.auth
    };
}

export default connect(mapStateToProps, { fetchOrders, deleteOrder })(OrderList);