import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers/';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './style/form.css';
import { Collapse, Paper } from '@material-ui/core';

export default class WarnTextForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            "area": "",
            "focus": "",
            "predict": "",
            "period": new Date(),
        };
    }

    dispCandidate(ft) {
        if(!ft) return;
        const names = ["name", "divisionName", "distlictName", "prefName"];
        
        if(Object.keys(ft).length > 2){
            var list = names.map((elem) => {
                return <a className="candidates" onClick={() => this._setArea(ft[elem])}>{ft[elem]} </a>
            });
            return list;
        }else{
            return <a className="candidates" onClick={() => this._setArea(ft["prefName"])}>{ft["prefName"]} </a>
        }
    }

    _setArea(ft) {
        if(ft !== this.state.area)
            this.setState({"area": ft});
    }

    _setValue(key, v) {
        // if(v !== this.state.factor)
            this.setState({[key]: v});
    }

    _handleChangeArea(event) {
        this._setArea(event.target.value);
    }

    _handleChangeFactor(event) {
        this._setValue("factor", event.target.value);
    }

    _handleChangePredict(event) {
        this._setValue("predict", event.target.value);
    }

    _handleChangePeriod(event, v){
        this._setValue("period", new Date(Date.parse(v)));
    }

    _setFocus(event) {
        if (this.state.focus !== event.target.id)
            this.setState({"focus": event.target.id});
    }

    _addPrediction(str) {
        console.log(str);
        if(this.state.predict.length < 1){
            this._setValue("predict", str);
        }
        else{
            this._setValue("predict", this.state.predict + "\n" + str);
        }
    }
 
    render(){
        const candidate = this.dispCandidate(this.props.feature);
        return (
            <section>
                <form onSubmit={() => 1} autoComplete="off">
                    <TextField id="area" 
                        required label="地域" 
                        value={this.state.area} 
                        className="form-elements" 
                        variant="outlined" 
                        onChange={this._handleChangeArea.bind(this)}  
                        onFocus={this._setFocus.bind(this)} 
                    />
                    <p className="candidate">候補： {candidate}</p>
                    <div className="elements">
                        <TextField id="factor" 
                            required multiline label="要因" 
                            variant="outlined" 
                            helperText="気象情報より情報収集" 
                            className="form-elements" 
                            onChange={this._handleChangeFactor.bind(this)} 
                            onFocus={this._setFocus.bind(this)} 
                        />
                        <Collapse in={this.state.focus === "factor"} className="form-collapse">
                            <Paper elevation={4} className="form-panel">
                                <ul>
                                    <li>上空に強い寒気を伴った低気圧</li>
                                    <li>前線を伴った別の低気圧</li>
                                    <li>低気圧や前線に向かって暖かく湿った空気が流れ込む</li>
                                </ul>
                            </Paper>
                        </Collapse>
                    </div>
                    <div className="elements">
                        <TextField id="predict" 
                            required multiline 
                            placeholder="OO日OOまで OOミリの激しい雨" 
                            label="推移" 
                            variant="outlined" 
                            helperText="予報につながるため注意が必要" 
                            className="form-elements"  
                            onFocus={this._setFocus.bind(this)} 
                            value={this.state.predict}
                        />
                        <Collapse in={this.state.focus === "predict"} className="form-collapse">
                            <Paper elevation={4} className="form-panel">
                                <PredictInputSupporter add={this._addPrediction.bind(this)} />
                            </Paper>
                        </Collapse>
                    </div>
                    <div className="elements">
                        <TextField id="warning" 
                            required multiline 
                            placeholder="OOによる~~" 
                            label="防災上の注意事項" 
                            variant="outlined" 
                            helperText="下にテンプレート" 
                            className="form-elements"  
                            onFocus={this._setFocus.bind(this)} 
                            value=""
                        />
                    </div>
                    <div className="elements">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker 
                                label="有効期間"
                                variant="inline"
                                format="yyyy/MM/dd"
                                margin="normal"
                                value={this.state.period}
                                onChange={this._handleChangePeriod.bind(this)}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </form>
                <button onClick={() => console.log(this.state)}>console.log</button>
            </section>
        );
    }
}

function PredictInputSupporter(props) {
    const [selectedDate, setDate] = React.useState(new Date());
    const [selectedSpanTime, setSpanTime] = React.useState("");
    const [selectedType, setType] = React.useState();
    const [amount, setAmout] = React.useState();

    const span = ["未明", "明け方","朝","昼前","正午","午前中","昼頃","昼過ぎ","夕方","日中","夜の始め頃","夜遅く","午後"];
    const types = [
        {"element": "雨", "unit":"mm", "id":1, "Alabel":"雨量"},
        {"element": "風", "unit":"m/s", "id":2, "Alabel":"風の強さ"},
        {"element": "高波", "unit":"m", "id":3, "Alabel":"波の高さ"},
        {"element": "高潮", "unit":"m", "id":4, "Alabel":"潮の高さ"},
        {"element": "雪", "unit":"cm", "id":5, "Alabel":"積雪量"},
    ]

    const handleDateChange = (event, date) => {
        setDate(date);
    }

    const handleClick = () => {
        console.log(amount)
        if (!selectedType) return;
        if (!amount) return;
        if (!selectedSpanTime) setSpanTime("");
        props.add("［" + selectedType.element + "］  " + date2string(selectedDate) + selectedSpanTime + " までに予想される" + selectedType.Alabel + "  " + amount + " " + selectedType.unit );
    }

    return (
        <div>
            <span className="inline-block">
                <Autocomplete
                    options={types}
                    getOptionLabel={(opt) => opt.element}
                    style={{ width: 150 }}
                    renderInput={(params) => <TextField {...params} label="種類" variant="outlined" inputProps={{...params.inputProps}} value={selectedType}  />}
                    onChange={(e,v) => setType(v)}
                />
            </span>
            <br />
            <span className="inline-block">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker 
                        variant="inline"
                        format="yyyy/MM/dd"
                        margin="normal"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </MuiPickersUtilsProvider>
            </span>
            <span className="inline-block">
                <Autocomplete 
                    options={span}
                    style={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} label="時間帯" variant="outlined" inputProps={{...params.inputProps}} value={selectedSpanTime} />}
                    onChange={(e,v) => setSpanTime(v)}
                />
            </span>
            <span className="inline-block"><p style={{"transform": "translateY(75%)"}}>まで／にかけて</p></span>
            <br />
            <span className="inline-block">
                <TextField
                    type="number"
                    label="予想量"
                    placeholder="50"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => {setAmout(e.target.value)}}
                />
            </span>
            <span className="inline-block">
                <TextField
                    disabled
                    label="単位"
                    variant="outlined"
                    value={!selectedType ? "": selectedType.unit}
                />
            </span>
            <span className="inline-block">
                <Button variant="contained" onClick={handleClick}>
                    追加
                </Button>
            </span>
        </div>
    )
}

function date2string(date){
    var m = date.getMonth() + 1;
    var d = date.getDate();

    var format_str='DD日';
    format_str=format_str.replace(/MM/g, m);
    format_str=format_str.replace(/DD/g, d);

    return format_str;
}

// ToDo
// 地名の選択の補助機能
// ExpansionPanel
// 
// 