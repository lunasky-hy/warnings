import React, { Component } from 'react';
import './style/period.css';

export default class WarnPeriod extends Component {
    constructor(props){
        super(props);
        this.state = {
            start: {        // 情報の発表タイミング
                date: 15,
                term: 6     // 0:00-0, 3:00-1, 6:00:2, 9:3, 12:4, 15:5, 18:6, 21:7
            },
            end: {          // startから8ターム、24時間後まで
                date: 16,
                term: 5
            }
        }
    }

    CreateTimes(){
        // var date_colums = <div className="item head"></div>
        var time_colums = [<div className="datetime head" key="time">時刻</div>];

        // var date = this.state.start.date;
        var term = this.state.start.term;

        for(var i = 0; i < 8; i += 1){
            if(term > 7){
                term = 0;
                // date += 1;
            }
            if(i === 7)
                time_colums.push(<div className="datetime end" key={i}>{term * 3} - </div>);
            else
                time_colums.push(<div className="datetime middle" key={i}>{term * 3} - </div>);
            term += 1;
        }
        return time_colums;
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
        const terms = {"未明":0, "明け方":1, "朝":2, "昼前":3, "昼過ぎ":4, "夕方":5, "夜の始め頃":6, "夜遅く":7};
        return !terms[str] ? 0 : terms[str];
    }

    convertDatetimeFormat(obj){
        return {
            date: this.extractNumber(this.zenkaku2hankaku(obj.Date)),
            term: this.term2number(obj.Term)
        };
    }

    CreatePeriod(type){
        if (!(type.Property)) return;
        const colorClass = ["", "advisory", "warning", "emergency"];
        var mapping = [0, 0, 0, 0, 0, 0, 0, 0];
        var start, end;

        if(!(!type.Property.WarningPeriod)) {
            const period = type.Property.WarningPeriod;
            start = !period.StartTime ? 0 : this.time2mappingIndex(period.StartTime);
            end = !period.EndTime ? 7 : this.time2mappingIndex(period.EndTime);
            if(!(!period.ZoneTime)) {
                start = end = this.time2mappingIndex(period.ZoneTime);
            }

            for(var i = start; i <= end; i += 1){
                mapping[i] = mapping[i] > 2 ? mapping[i] : 2;
            }
        }

        if(!(!type.Property.AdvisoryPeriod)) {
            const period = type.Property.AdvisoryPeriod;
            start = !period.StartTime ? 0 : this.time2mappingIndex(period.StartTime);
            end = !period.EndTime ? 7 : this.time2mappingIndex(period.EndTime);
            if(!(!period.ZoneTime)) {
                start = end = this.time2mappingIndex(period.ZoneTime);
            }

            for(i = start; i <= end; i += 1){
                mapping[i] = mapping[i] > 1 ? mapping[i] : 1;
            }
        }

        // マッピングをもとにタグ生成
        var head = <div className={"item head " + this.whichTypeWarning(type.Name)}> {type["Name"]} </div>;
        var colums = mapping.map((id, index) => {
            if(index === mapping.length - 1)
                return <div className={"item end" + colorClass[id]} key={type.Name + index} value={id}></div>;
            return <div className={"item " + colorClass[id]} key={type.Name + index} value={id}></div>;
        });

        return (
            <div className="grid" key={type.Name}>
                    {head}
                    {colums}
            </div>
        );
    }

    render(){
        var times = !data.Kind.length ? <div>発令無し</div> : this.CreateTimes()
        var types = data.Kind.map(k => this.CreatePeriod(k));
        return (
            <div className="outline">
                <div className="grid">
                    {times}
                </div>
                {types}
            </div>
        );
    }
}

var data = {
        "Kind": [
            {
                "Name":"大雨注意報",
                "Code":"10",
                "Status":"継続",
                "Attention":{
                    "Note":"土砂災害注意"
                },
                "WarningNotice":{
                    "StartTime":{
                        "Date":"１６日",
                        "Term":"朝"
                    },
                    "Note":"大雨警報（土砂災害）に切り替える可能性が高い"
                },
                "Property":{
                    "Type":"土砂災害",
                    "WarningPeriod":{
                        "StartTime":{
                            "Date":"１６日",
                            "Term":"朝"
                        },
                        "EndTime":{
                            "Date":"１６日",
                            "Term":"昼前"
                        }
                    },
                    "AdvisoryPeriod":{
                        "EndTime":{
                            "Date":"１６日",
                            "Term":"昼過ぎ"
                        }
                    }
                }
            },
            {
                "Name":"洪水注意報",
                "Code":"18",
                "Status":"継続",
                "Property":{
                    "Type":"洪水",
                    "AdvisoryPeriod":{
                        "EndTime":{
                            "Date":"１６日",
                            "Term":"昼前"
                        }
                    }
                }
            },
            {
                "Name":"雷注意報",
                "Code":"14",
                "Status":"継続",
                "Addition":{
                    "Note":"突風"
                },
                "Property":{
                    "Type":"雷",
                    "AdvisoryPeriod":{
                        "EndTime":{
                            "Date":"１６日",
                            "Term":"昼過ぎ"
                        }
                    }
                }
            },
            {
                "Name":"強風注意報",
                "Code":"15",
                "Status":"継続",
                "Property":{
                    "Type":"風",
                    "AdvisoryPeriod":{
                        "ZoneTime":{
                            "Date":"１５日",
                            "Term":"夜のはじめ頃"
                        }
                    },
                    "WindDirectionPart":{
                        "Base":{
                            "WindDirection":{
                                "value":"南",
                                "description":"南の風",
                                "type":"風向",
                                "unit":"８方位漢字"
                            }
                        }
                    },
                    "WindSpeedPart":{
                        "Base":{
                            "Local":{
                                "AreaName":"外海",
                                "WindSpeed":{
                                    "value":"10",
                                    "description":"１０メートル",
                                    "type":"最大風速",
                                    "unit":"m/s"
                                }
                            }
                        }
                    }
                }
            },
            {
                "Name":"波浪注意報",
                "Code":"16",
                "Status":"継続",
                "Property":{
                    "Type":"波",
                    "AdvisoryPeriod":{
                        "ZoneTime":{
                            "Date":"１５日",
                            "Term":"夜のはじめ頃"
                        }
                    },
                    "WaveHeightPart":{
                        "Base":{
                            "Local":{
                                "AreaName":"外海",
                                "WaveHeight":{
                                    "value":"2.5",
                                    "description":"２．５メートル",
                                    "type":"波高",
                                    "unit":"m"
                                }
                            }
                        }
                    }
                }
            }
        ],
        "Area":{
            "Name":"佐世保市（宇久地域を除く）",
            "Code":"4220201"
        },
        "ChangeStatus":"警報・注意報種別に変化無、量的予想事項等に変化有"
    };
var data2 = {
    "Kind":[{
    "Name":"大雨注意報",
    "Code":"10",
    "Status":"発表",
    "Attention":{
    "Note":"土砂災害注意"
    },
    "Property":{
    "Type":"土砂災害",
    "AdvisoryPeriod":{
    "EndTime":{
    "Date":"１５日",
    "Term":"夜遅く"
    }
    }
    }
    },
    {
    "Name":"雷注意報",
    "Code":"14",
    "Status":"継続",
    "Addition":{
    "Note":"突風"
    },
    "Property":{
    "Type":"雷",
    "AdvisoryPeriod":{
    "EndTime":{
    "Date":"１６日",
    "Term":"昼前"
    }
    }
    }
    },
    {
        "Name":"強風注意報",
        "Code":"15",
        "Status":"継続",
        "Property":{
            "Type":"風",
            "AdvisoryPeriod":{
                "EndTime":{
                    "Date":"１６日",
                    "Term":"未明"
                }
            },
            "PeakTime":{
                "Date":"１５日",
                "Term":"夜のはじめ頃"
            },
            "WindDirectionPart":{
                "Base":{
                    "WindDirection":{
                        "value":"南",
                        "description":"南の風",
                        "type":"風向",
                        "unit":"８方位漢字"
                    }
                }
            },
            "WindSpeedPart":{
                "Base":{
                    "Local":[
                        {
                            "AreaName":"玄界灘",
                            "WindSpeed":{
                                "value":"14",
                                "description":"１４メートル",
                                "type":"最大風速",
                                "unit":"m/s"
                            }
                        },
                        {
                            "AreaName":"沖ノ島周辺",
                                "WindSpeed":{
                                    "value":"14",
                                    "description":"１４メートル",
                                    "type":"最大風速",
                                    "unit":"m/s"
                            }
                        }
                    ]
                }
            }
        }
    }],
    "Area":{
        "Name":"福岡市",
        "Code":"4013000"
    },
    "ChangeStatus":"警報・注意報種別に変化有"
}