import React from 'react';

import classes from './EnergyFootprintControls.css';
import EnergyFootprintControl from './EnergyFootprintControl/EnergyFootprintControl'

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
];


const energyFootprintControls = (props) =>(
    <div className ={classes.BuildControls} >

        <p>Current Price: <strong>{props.price}</strong></p>

        {controls.map(ctrl =>(
            <EnergyFootprintControl 
                key={ctrl.label} 
                label={ctrl.label}
                added={() => props.ingredientAdded(ctrl.type)}
                removed={() => props.ingredientRemoved(ctrl.type)}
                disabled={props.disabled[ctrl.type]} >
            </EnergyFootprintControl>
        ))}

        <button 
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.ordered}>ORDER NOW</button>
    </div>

);


export default energyFootprintControls;