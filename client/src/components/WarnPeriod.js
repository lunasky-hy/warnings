import React, { Component } from 'react';
import './style/period.css';
import {get, WeatherXmlQueryOption, xmlSearch} from './Get.js';
import { str2date } from './Datetime';

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

    CreateDays(){
        // var date_colums = <div className="item head"></div>
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

    CreatePeriod(type){
        if (!(type.property)) return;
        if (type.status === "解除") {
            return (<div className="grid" key={type.name}>
                <div className={"item head"}> {type.name} </div>
                <div className={"item end"} style={{"gridColumn" : "2/11"}}>解除</div>
            </div>);
        }
        if (type.status === "発表警報・注意報はなし"){
            return (<div className="grid" key="none">
                <div className={"item head"}> 発表無し </div>
            </div>);
        }
        const colorClass = ["", "advisory", "warning", "emergency"];
        var mapping = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var start, end;

        if(!(!type.property[0].emergencyPeriod)) {
            const period = type.property[0].emergencyPeriod;
            start = !period.startTime ? 0 : this.time2mappingIndex(period.startTime);
            end = !period.endTime ? 8 : this.time2mappingIndex(period.endTime);
            if(!(!period.zoneTime)) {
                start = end = this.time2mappingIndex(period.zoneTime);
            }

            for(var i = start; i <= end; i += 1){
                mapping[i] = mapping[i] > 3 ? mapping[i] : 3;
            }
        }

        if(!(!type.property[0].warningPeriod)) {
            const period = type.property[0].warningPeriod;
            start = !period.startTime ? 0 : this.time2mappingIndex(period.startTime);
            end = !period.endTime ? 8 : this.time2mappingIndex(period.endTime);
            if(!(!period.zoneTime)) {
                start = end = this.time2mappingIndex(period.zoneTime);
            }

            for(var i = start; i <= end; i += 1){
                mapping[i] = mapping[i] > 2 ? mapping[i] : 2;
            }
        }

        if(!(!type.property[0].advisoryPeriod)) {
            const period = type.property[0].advisoryPeriod;
            start = !period.startTime ? 0 : this.time2mappingIndex(period.startTime);
            end = !period.endTime ? 8 : this.time2mappingIndex(period.endTime);
            if(!(!period.zoneTime)) {
                start = end = this.time2mappingIndex(period.zoneTime);
            }

            for(i = start; i <= end; i += 1){
                mapping[i] = mapping[i] > 1 ? mapping[i] : 1;
            }
        }

        // マッピングをもとにタグ生成
        var head = <div className={"item head " + this.whichTypeWarning(type.name)}> {type.name} </div>;
        var colums = mapping.map((id, index) => {
            if(index === mapping.length - 1)
                return <div className={"item end " + colorClass[id]} key={type.name + index} value={id}></div>;
            return <div className={"item " + colorClass[id]} key={type.name + index} value={id}></div>;
        });

        return (
            <div className="grid" key={type.name}>
                    {head}
                    {colums}
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
        await get(list.data[0].link + ".json").then(res => res.json()).then(content => {
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

        // can get data
        var days = this.CreateDays();
        var times = this.CreateTimes();
        const target = this.state.warning[3].item[0];
        var types = target.kind.map(k => this.CreatePeriod(k));
        return (
            <div className="outline" style={{"marginTop": "1rem"}}>
                <div className="arealabel">{target.area.name} (code: {target.area.code})</div>
                {days}
                {times}
                {types}
            </div>
        );
    }
}

// var data = {
//         "kind": [
//             {
//                 "Name":"大雨注意報",
//                 "Code":"10",
//                 "Status":"継続",
//                 "Attention":{
//                     "Note":"土砂災害注意"
//                 },
//                 "WarningNotice":{
//                     "StartTime":{
//                         "Date":"１６日",
//                         "Term":"朝"
//                     },
//                     "Note":"大雨警報（土砂災害）に切り替える可能性が高い"
//                 },
//                 "Property":{
//                     "Type":"土砂災害",
//                     "WarningPeriod":{
//                         "StartTime":{
//                             "Date":"１６日",
//                             "Term":"朝"
//                         },
//                         "EndTime":{
//                             "Date":"１６日",
//                             "Term":"昼前"
//                         }
//                     },
//                     "AdvisoryPeriod":{
//                         "EndTime":{
//                             "Date":"１６日",
//                             "Term":"昼過ぎ"
//                         }
//                     }
//                 }
//             },
//             {
//                 "Name":"洪水注意報",
//                 "Code":"18",
//                 "Status":"継続",
//                 "Property":{
//                     "Type":"洪水",
//                     "AdvisoryPeriod":{
//                         "EndTime":{
//                             "Date":"１６日",
//                             "Term":"昼前"
//                         }
//                     }
//                 }
//             },
//             {
//                 "Name":"雷注意報",
//                 "Code":"14",
//                 "Status":"継続",
//                 "Addition":{
//                     "Note":"突風"
//                 },
//                 "Property":{
//                     "Type":"雷",
//                     "AdvisoryPeriod":{
//                         "EndTime":{
//                             "Date":"１６日",
//                             "Term":"昼過ぎ"
//                         }
//                     }
//                 }
//             },
//             {
//                 "Name":"強風注意報",
//                 "Code":"15",
//                 "Status":"継続",
//                 "Property":{
//                     "Type":"風",
//                     "AdvisoryPeriod":{
//                         "ZoneTime":{
//                             "Date":"１５日",
//                             "Term":"夜のはじめ頃"
//                         }
//                     },
//                     "WindDirectionPart":{
//                         "Base":{
//                             "WindDirection":{
//                                 "value":"南",
//                                 "description":"南の風",
//                                 "type":"風向",
//                                 "unit":"８方位漢字"
//                             }
//                         }
//                     },
//                     "WindSpeedPart":{
//                         "Base":{
//                             "Local":{
//                                 "AreaName":"外海",
//                                 "WindSpeed":{
//                                     "value":"10",
//                                     "description":"１０メートル",
//                                     "type":"最大風速",
//                                     "unit":"m/s"
//                                 }
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 "Name":"波浪注意報",
//                 "Code":"16",
//                 "Status":"継続",
//                 "Property":{
//                     "Type":"波",
//                     "AdvisoryPeriod":{
//                         "ZoneTime":{
//                             "Date":"１５日",
//                             "Term":"夜のはじめ頃"
//                         }
//                     },
//                     "WaveHeightPart":{
//                         "Base":{
//                             "Local":{
//                                 "AreaName":"外海",
//                                 "WaveHeight":{
//                                     "value":"2.5",
//                                     "description":"２．５メートル",
//                                     "type":"波高",
//                                     "unit":"m"
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         ],
//         "Area":{
//             "Name":"佐世保市（宇久地域を除く）",
//             "Code":"4220201"
//         },
//         "ChangeStatus":"警報・注意報種別に変化無、量的予想事項等に変化有"
//     };
// var data2 = {
//     "Kind":[{
//     "Name":"大雨注意報",
//     "Code":"10",
//     "Status":"発表",
//     "Attention":{
//     "Note":"土砂災害注意"
//     },
//     "Property":{
//     "Type":"土砂災害",
//     "AdvisoryPeriod":{
//     "EndTime":{
//     "Date":"１５日",
//     "Term":"夜遅く"
//     }
//     }
//     }
//     },
//     {
//     "Name":"雷注意報",
//     "Code":"14",
//     "Status":"継続",
//     "Addition":{
//     "Note":"突風"
//     },
//     "Property":{
//     "Type":"雷",
//     "AdvisoryPeriod":{
//     "EndTime":{
//     "Date":"１６日",
//     "Term":"昼前"
//     }
//     }
//     }
//     },
//     {
//         "Name":"強風注意報",
//         "Code":"15",
//         "Status":"継続",
//         "Property":{
//             "Type":"風",
//             "AdvisoryPeriod":{
//                 "EndTime":{
//                     "Date":"１６日",
//                     "Term":"未明"
//                 }
//             },
//             "PeakTime":{
//                 "Date":"１５日",
//                 "Term":"夜のはじめ頃"
//             },
//             "WindDirectionPart":{
//                 "Base":{
//                     "WindDirection":{
//                         "value":"南",
//                         "description":"南の風",
//                         "type":"風向",
//                         "unit":"８方位漢字"
//                     }
//                 }
//             },
//             "WindSpeedPart":{
//                 "Base":{
//                     "Local":[
//                         {
//                             "AreaName":"玄界灘",
//                             "WindSpeed":{
//                                 "value":"14",
//                                 "description":"１４メートル",
//                                 "type":"最大風速",
//                                 "unit":"m/s"
//                             }
//                         },
//                         {
//                             "AreaName":"沖ノ島周辺",
//                                 "WindSpeed":{
//                                     "value":"14",
//                                     "description":"１４メートル",
//                                     "type":"最大風速",
//                                     "unit":"m/s"
//                             }
//                         }
//                     ]
//                 }
//             }
//         }
//     }],
//     "Area":{
//         "Name":"福岡市",
//         "Code":"4013000"
//     },
//     "ChangeStatus":"警報・注意報種別に変化有"
// }