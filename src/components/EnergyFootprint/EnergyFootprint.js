import React from 'react';

import classes from './EnergyFootprint.css'
import EnergyFootprintIngredient from './EnergyFootprintIngredient/EnergyFootprintIngredient';

const energyFootprint = (props) => {

    let transformedIngredients = Object.keys( props.ingredients )
        .map( igKey => {
            return [...Array( props.ingredients[igKey] )].map( ( _, i ) => {
                return <EnergyFootprintIngredient key={igKey + i} type={igKey} />;
            } );
        } )
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>;
    }    

    return (
        <div className = {classes.EnergyFootprint}>
            <EnergyFootprintIngredient type ="meat" />
            {transformedIngredients}
            <EnergyFootprintIngredient type ="bread-bottom" />
        </div>
    );
};

export default energyFootprint;

