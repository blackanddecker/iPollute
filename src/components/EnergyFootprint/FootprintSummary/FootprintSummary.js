import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button'


class FootprintSummary extends Component {
    
    componentWillUpdate() {
        console.log('[OrderSummary] WillUpdate');
    }

    render () {
        const ingredientSummary = Object.keys( this.props.ingredients )
            .map( igKey => {
                return (
                    <li key={igKey}>
                        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {this.props.ingredients[igKey]}
                    </li> );
            } );

        return(
            <Aux>
            <h3> Footprint Summary </h3>
            <p> You just did : </p>
            <ul>
                {ingredientSummary}
            </ul>
            <p> Total Price: {this.props.price.toFixed(2)}</p>
            Continue with checkout;
            <Button btnType = "Danger" clicked ={this.props.purchaseCancelled} >CANCEL </Button>
            <Button btnType = "Success" clicked = {this.props.purchaseContinued} >CONTINUE </Button>
        </Aux>
        );
    }
    
}
    
export default FootprintSummary;