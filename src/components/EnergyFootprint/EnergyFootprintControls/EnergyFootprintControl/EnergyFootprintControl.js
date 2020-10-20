import React from 'react';

import classes from './EnergyFootprintControl.css'

const energyFootprintControl = (props) =>(
    <div className={classes.BuildButton} >
        <div className={classes.Label}>{props.label}</div>
        
        <button className={classes.Less} 
            onClick = {props.removed} 
            disabled = {props.disabled}> 
            LESS 
        </button>
        
        <button className={classes.More}
            onClick = {props.added}> 
            MORE 
        </button>
    </div>

);


export default energyFootprintControl;