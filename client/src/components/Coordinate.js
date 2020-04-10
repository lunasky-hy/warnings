import React from 'react';
import './style/coodinate.css';

export default function Coodinate(props){
    var feature = props.feature;
    if (!feature) return <div></div>;

    if (Object.keys(feature).length > 2){
        return (
            <div className="coodinate">
                {feature.prefName} > {feature.distlictName} > {feature.divisionName} > {feature.name}
            </div>
        );
    } 
    else {
        return (
            <div className="coodinate">
                {feature.prefName}
            </div>
        );
    }
}