import React, { Component } from 'react';
import './style/period.css';
import {get, WeatherXmlQueryOption, xmlSearch} from './tools/Get.js';
import { str2date, date2str_withformat } from './tools/Datetime';

export default class WarnPeriod extends Component {
    constructor(props){
        super(props);
        this.state = {
            start: {        // 情報の発表タイミング
                date: 11,
                term: 6     // 0:00-0, 3:00-1, 6:00:2, 9:3, 12:4, 15:5, 18:6, 21:7
            },              // startから8ターム、24時間後まで
            warning: null,     //data,
            code: null,
            error: false
        }
        this.callflag = false;
        this.cache = {};
    }

    // 開始日時の取得を行う関数の作成
    getStartTime(date_str){
        var time = str2date(date_str);
        return ({
            date: time.getDate(),
            term: Math.floor(time.getHours() / 3),
        });
    }

    whichTypeWarning(w){
        if(w.lastIndexOf("特別警報") !== -1){
            return "emergency";
        }else if(w.lastIndexOf("警報") !== -1){
            return "warning";
        }else if(w.lastIndexOf("注意報") !== -1){
            return "advisory";
        }
        return "";
    }

    time2mappingIndex(n_time) {
        var time = this.convertDatetimeFormat(n_time);
        if (this.state.start.date === time.date) {
            var mapIndex = time.term - this.state.start.term;
            return mapIndex >= 0 ? mapIndex : 0;
        } else {
            mapIndex = 8 - this.state.start.term + time.term;
            return mapIndex >= 0 ? mapIndex : 0;
        }
    }
    
    zenkaku2hankaku(str) {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }

    extractNumber(str){
        var num = str.replace(/[^0-9]/g, '');
        return parseInt(num);
    }

    term2number(str) {
        const terms = {"未明":0, "明け方":1, "朝":2, "昼前":3, "昼過ぎ":4, "夕方":5, "夜のはじめ頃":6, "夜遅く":7};
        return !terms[str] ? 0 : terms[str];
    }

    convertDatetimeFormat(obj){
        return {
            date: this.extractNumber(this.zenkaku2hankaku(obj.date)),
            term: this.term2number(obj.term)
        };
    }

    mappingPeriod(elem, mapping, num, property){
        var start, end;
        if(!(!property[elem])) {
            const period = property[elem];
            start = !period.startTime ? 0 : this.time2mappingIndex(period.startTime);
            end = !period.endTime ? 8 : this.time2mappingIndex(period.endTime);
            if(!(!period.zoneTime)) {
                start = end = this.time2mappingIndex(period.zoneTime);
            }

            for(var i = start; i <= end; i += 1){
                mapping[i] = mapping[i] > num ? mapping[i] : num;
            }
        }
        return mapping;
    }

    CreateDays(){
        var day_colum = [<div className="datetime head" key="day">日付</div>];
        var day = this.state.start.date;
        var term = this.state.start.term;
        var columNum = 2;

        for(var i = 0; i < 9; i += 1){
            term += 1;
            if(term <= 8){
                continue;
            }
            day_colum.push(<div className="datetime middle" style={{"gridColumn": columNum +"/"+ (i+2)}} key={day}>{day}日</div>);
            term = 0;
            day += 1;
            columNum = i + 2;
        }
        day_colum.push(<div className="datetime middle end" style={{"gridColumn": columNum +"/"+ 11}} key={day}>{day}日</div>);
        return <div className="grid">{day_colum}</div>
    }

    CreateTimes(){
        var time_colums = [<div className="datetime head" key="time">時間</div>];
        var term = this.state.start.term;

        for(var i = 0; i < 9; i += 1){
            if(term > 7){
                term = 0;
            }
            if(i === 8)
                time_colums.push(<div className="datetime end" key={i}>{term * 3} - {(term + 1) * 3}</div>);
            else
                time_colums.push(<div className="datetime middle" key={i}>{term * 3} - {(term + 1) * 3}</div>);
            term += 1;
        }
        return <div className="grid">{time_colums}</div>;
    }

    CreatePeriod(type){
        if (!(type.property)) return;
        if (type.status === "解除") {
            return (<div className="grid" key={type.name}>
                {/* <div className={"item head"}> {type.name} </div>
                <div className={"item end"} style={{"gridColumn" : "2/11"}}>解除</div> */}
            </div>);
        }
        if (type.status === "発表警報・注意報はなし"){
            return (<div className="grid" key="none">
                <div className={"item head"}> 発表無し </div>
            </div>);
        }

        var tag = type.property.map((property, index) => {
            const colorClass = ["", "advisory", "warning", "emergency"];
            var mapping = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    
            if(this.whichTypeWarning(type.name) === "emergency" && type.condition.indexOf(property.type) >= 0 ){
                mapping = this.mappingPeriod("warningPeriod", mapping, 3, property);
            }
            else{
                mapping = this.mappingPeriod("warningPeriod", mapping, 2, property);
            }
            mapping = this.mappingPeriod("advisoryPeriod", mapping, 1, property);
            
            var detail = property.type;
            // マッピングをもとにタグ生成
            var head = <div className={"item head " + this.whichTypeWarning(type.name)}> {type.name} ({detail})</div>;
            var colums = mapping.map((id, index) => {
                if(index === mapping.length - 1)
                    return <div className={"item end " + colorClass[id]} key={type.name + index} value={id}></div>;
                return <div className={"item " + colorClass[id]} key={type.name + index} value={id}></div>;
            });

            return <div className="grid" key={type.name + index}>{head}{colums}</div>;
        })

        return (
            <div key={type.name}>
                {tag}
            </div>
        );
    }

    shouldComponentUpdate(nextP, nextS){
        return !(this.state.warning === nextS.warning &&
            this.props.code === nextP.code);
    }

    async downloadData(code){
        if(code in this.cache){
            this.setState({
                error: false,
                head: this.cache[code].head,
                start: this.getStartTime(this.cache[code].control.dateTime),
                warning: this.cache[code].body.warning, 
                code: code,
            });
            return;
        }

        this.callflag = true

        // Generate Search Query
        var opt = new WeatherXmlQueryOption();
        var start = new Date();
        start.setDate(start.getDate() - 2)
        opt.setValues({
            title: "気象特別警報・警報・注意報",
            areacode: code,
        });
        opt.setDatetime(start, new Date());

        // Search JMA-XML
        var list = await xmlSearch(opt).then(res => res.json());

        if(list.data.length === 0){
            this.callflag = false;
            return;
        };

        // show JMA-XML
        var request = list.data[0].link + ".json";
        await get(request.substring(5, request.length)).then(res => res.json()).then(content => {
            console.log(content);
            console.log(this.getStartTime(content.report.control.dateTime))
            this.cache[code] = content.report;
            this.setState({
                error: false,
                head: content.report.head,
                start: this.getStartTime(content.report.control.dateTime),
                warning: content.report.body.warning, 
                code: code,
            });
        }).catch(err => {
            console.log(err);
            this.setState({error: true, warning: {}, code: this.props.code.prefCode});
        }).finally(() => {
            this.callflag = false;
        });
    }

    renderFigure() {
        var days = this.CreateDays();
        var times = this.CreateTimes();
        var target = this.state.warning[3].item[0];
        if(!!this.props.code.code){
            for(var index = 0; index < this.state.warning[3].item.length; index += 1){
                if(this.props.code.code === this.state.warning[3].item[index].area.code){
                    target = this.state.warning[3].item[index];
                    break;
                }
            }
        }
        var types = target.kind.map(k => this.CreatePeriod(k));

        const reportTime = str2date(this.state.head.targetDateTime);
        return (
            <div className="period-area">
                <div className="warning-text">
                    <h4 className="head">{this.state.head.title}</h4>
                    <p className="body">{this.state.head.headline.text}</p>
                    <p className="reporttime">発表時刻：{date2str_withformat(reportTime, "YYYY/MM/DD hh:mm")}</p>
                </div>
                <div className="outline">
                    <div className="arealabel">{target.area.name} (code: {target.area.code})</div>
                    {days}
                    {times}
                    {types}
                </div>
            </div>
        );
    }

    render(){
        // 地域が選択されていないとき
        if(!this.props.code){
            console.log("area none");
            return <div>地域を選択</div>;
        }

        var code = this.props.code.prefCode;
        //　気象警報情報の取得
        if(!this.callflag && code !== this.state.code){
            this.downloadData(code);
        }

        // waiting for get data
        if(!this.state.warning){    
            return <div>Wait a moment.....</div>;
        }
        else if(this.state.error){
            return <div style={{"marginTop": "1rem"}}>No Data or Network Error</div>;
        }
        else{
            return this.renderFigure(code)
        }
    }
}
