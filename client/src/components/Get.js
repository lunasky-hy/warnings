import {date2str} from './Datetime.js';


export async function get(url){
    return await fetch(url).then(data => {
        return data;
    }).catch(err => {
        console.log(err);
        return {err: "error"};
    });
}

export async function getWarningArea(layer){
    return await fetch(
        "https://s3-ap-northeast-1.amazonaws.com/vector-tile/warning/"+layer+".json.gz"
    ).then(data => {
        return data;
    }).catch(err => {
        console.log(err);
    });
}

export async function xmlSearch(option){
    const base = "http://api.aitc.jp/jmardb-api/search?";
    const url = base + option.query();
    return await fetch(url).then(data => {
        return data;
    }).catch(err => {
        console.log(err);
        return false;
    });
}


export class WeatherXmlQueryOption{
    constructor(){
        this.options = {
            status : "",
            infotype: "",
            title: "",
            areaname: "",
            areacode: "",
            limit: 3,
            offset: 0,
            order: "new",
        };

        this.timeOpt = {
            datetime: [],
            validdatetime: [],
        }
    }

    setValue(elem, val) {
        this.options[elem] = val;
    }

    setValues(v) {
        Object.keys(v).forEach(key => {
            this.options[key] = v[key];
        });
    }

    setDatetime(start, end){
        const start_str = date2str(start);
        const end_str = date2str(end);
        this.timeOpt["datetime"] = [start_str, end_str];
    }

    setValidDatetime(start, end){
        this.timeOpt["validdatetime"] = [start, end];
    }

    readValue(elem) {
        return this.options[elem];
    }

    query() {
        var querytext = "";
        Object.keys(this.options).forEach(key => {
            if(this.options[key]){
                querytext += key + "=" + this.options[key] + "&";
            }
        });
        
        if(this.timeOpt["datetime"].length === 2){
            querytext += "datetime=" + this.timeOpt.datetime[0] 
                            + "&datetime=" + this.timeOpt.datetime[1] + "&";
        }
        return querytext;
    }
}