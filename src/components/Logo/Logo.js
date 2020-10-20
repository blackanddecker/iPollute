import React from 'react';

import energyFootprintLogo from '../../assets/images/burger-logo.png'
import classes from './Logo.css'

const logo =(props) =>(
    <div className={classes.Logo} style={{height: props.height}}>
        <img src= {energyFootprintLogo} alt="MyEnergyFootprintLogo"></img>
    </div>
);


export default logo; 