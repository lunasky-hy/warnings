import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import './style/form.css';

export default class WarnTextForm extends Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    dispCandidate(ft) {
        if(!ft) return;
        const names = ["name", "divisionName", "distlictName", "prefName"];
        
        if(Object.keys(ft).length > 2){
            var list = names.map((elem) => {
                return <option value={ft[elem]} />
            })
            return list;
        }else{
            return <option value={ft["prefName"]} />
        }
    }
 
    render(){
        const candidate = this.dispCandidate(this.props.feature);
        return (
            <section>
                <form onSubmit={() => 1} autoComplete="off">
                    <TextField required label="地域" list="areas" className="form-elements" />
                    <datalist id="areas">{candidate}</datalist>
                    <p></p>
                    <TextField required placeholder="Placeholder" multiline label="要因" variant="outlined" className="form-elements" />
                </form>
            </section>
        );
    }
}

// ToDo
// 地名の選択の補助機能
