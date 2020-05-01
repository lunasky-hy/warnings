import React from 'react';
import './style/label.css';

export default function WarningLabel(props){
    if(!props.warnings)
        return(<div></div>);

    if(props.warnings.warnings.length === 0){
        return (<div className="label-area"><p className="label default">発表無し</p></div>);
    }
    else{
        var labels = props.warnings.warnings.map(w => {
            if(w.lastIndexOf("特別警報") !== -1){
                return <p className="label emergency">{w}</p>;
            }else if(w.lastIndexOf("警報") !== -1){
                return <p className="label warning">{w}</p>;
            }else if(w.lastIndexOf("注意報") !== -1){
                return <p className="label advisory">{w}</p>;
            }
            return null;
        });
        return <div className="label-area">{labels}</div>;
    }
}