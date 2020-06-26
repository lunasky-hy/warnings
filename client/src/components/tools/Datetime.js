export function date2str(date) {
    var year_str = date.getFullYear();
    //月だけ+1すること
    var month_str = 1 + date.getMonth();
    var day_str = date.getDate();
    var hour_str = date.getHours();
    var minute_str = date.getMinutes();
    var second_str = date.getSeconds();
    
    
    var format_str = 'YYYY-MM-DD hh:mm:ss';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    format_str = format_str.replace(/hh/g, hour_str);
    format_str = format_str.replace(/mm/g, minute_str);
    format_str = format_str.replace(/ss/g, second_str);
    
    return format_str;
};

export function date2str_withformat(date, format) {
 
    var year_str = date.getFullYear();
    //月だけ+1すること
    var month_str = 1 + date.getMonth();
    if(month_str < 10) month_str = "0" + month_str;
    var day_str = date.getDate();
    if(day_str < 10) day_str = "0" + day_str;
    var hour_str = date.getHours();
    if(hour_str < 10) hour_str = "0" + hour_str;
    var minute_str = date.getMinutes();
    if(minute_str < 10) minute_str = "0" + minute_str;
    var second_str = date.getSeconds();
    if(second_str < 10) second_str = "0" + second_str;
    
    var format_str = format;
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    format_str = format_str.replace(/hh/g, hour_str);
    format_str = format_str.replace(/mm/g, minute_str);
    format_str = format_str.replace(/ss/g, second_str);
    
    return format_str;
};

export function str2date(datestr){
    var date = new Date(Date.parse(datestr));
    return new Date(date);
}