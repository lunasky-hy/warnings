(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{101:function(e,t,a){e.exports=a(191)},106:function(e,t,a){},178:function(e,t,a){},180:function(e,t,a){},181:function(e,t,a){},182:function(e,t,a){},183:function(e,t,a){},191:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(97),s=a.n(i),o=(a(106),a(15)),c=a(16),l=a(23),u=a(22),m=a(40),d=a(98),h=a.n(d),f=(a(178),a(61)),p=a.n(f),v=a(10),g=a.n(v),y=a(24);function k(e){var t=e.getFullYear(),a=1+e.getMonth(),n=e.getDate(),r=e.getHours(),i=e.getMinutes(),s=e.getSeconds(),o="YYYY-MM-DD hh:mm:ss";return o=(o=(o=(o=(o=(o=o.replace(/YYYY/g,t)).replace(/MM/g,a)).replace(/DD/g,n)).replace(/hh/g,r)).replace(/mm/g,i)).replace(/ss/g,s)}function b(e){var t=new Date(Date.parse(e));return new Date(t)}function w(e){return E.apply(this,arguments)}function E(){return(E=Object(y.a)(g.a.mark((function e(t){return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t).then((function(e){return e})).catch((function(e){return console.log(e),{err:"error"}}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function N(e){return O.apply(this,arguments)}function O(){return(O=Object(y.a)(g.a.mark((function e(t){return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://s3-ap-northeast-1.amazonaws.com/vector-tile/warning/"+t+".json.gz").then((function(e){return e})).catch((function(e){console.log(e)}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function j(e){return D.apply(this,arguments)}function D(){return(D=Object(y.a)(g.a.mark((function e(t){var a;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"//api.aitc.jp/jmardb-api/search?",a="//api.aitc.jp/jmardb-api/search?"+t.query(),e.next=4,fetch(a).then((function(e){return e})).catch((function(e){return console.log(e),!1}));case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var x=function(){function e(){Object(o.a)(this,e),this.options={status:"",infotype:"",title:"",areaname:"",areacode:"",limit:3,offset:0,order:"new"},this.timeOpt={datetime:[],validdatetime:[]}}return Object(c.a)(e,[{key:"setValue",value:function(e,t){this.options[e]=t}},{key:"setValues",value:function(e){var t=this;Object.keys(e).forEach((function(a){t.options[a]=e[a]}))}},{key:"setDatetime",value:function(e,t){var a=k(e),n=k(t);this.timeOpt.datetime=[a,n]}},{key:"setValidDatetime",value:function(e,t){this.timeOpt.validdatetime=[e,t]}},{key:"readValue",value:function(e){return this.options[e]}},{key:"query",value:function(){var e=this,t="";return Object.keys(this.options).forEach((function(a){e.options[a]&&(t+=a+"="+e.options[a]+"&")})),2===this.timeOpt.datetime.length&&(t+="datetime="+this.timeOpt.datetime[0]+"&datetime="+this.timeOpt.datetime[1]+"&"),t}}]),e}();a(180);function C(e){return e.name?r.a.createElement("div",{className:"hoverInformation"},r.a.createElement("p",null,e.name)):r.a.createElement("div",null)}var M=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={mouseover:null,feature:null,code:""},n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;p.a.accessToken="pk.eyJ1IjoibHVuYXNreSIsImEiOiJjazZidGtid2UxNTd1M2tuNTN0cDBzZDMyIn0.8ci4ul7Dh1kg2g6sRfDYQw";var t=new p.a.Map({container:this.container,center:[136.6,35],minZoom:4,maxZoom:10,zoom:5,attributionControl:!1,logoPosition:"bottom-right",hash:!0,style:"mapbox://styles/lunasky/ckbbbjs5v03aq1ipi2crj7ctd",localIdeographFontFamily:"'Hiragino Kaku Gothic ProN', '\u30d2\u30e9\u30ae\u30ce\u89d2\u30b4 ProN W3', Meiryo, \u30e1\u30a4\u30ea\u30aa, sans-serif"});t.touchZoomRotate.disableRotation();var a={};t.on("load",(function(){r("pref"),r("city"),i("pref"),i("city"),N("pref").then((function(e){return e.json()})).then((function(e){s("pref",e)})),N("city").then((function(e){return e.json()})).then((function(e){s("city",e)})),t.on("mousemove",o),t.on("click",c)}));var n=function(t){e.state.mouseover!==t&&e.setState({mouseover:t})};function r(e){t.addSource("vtile-"+e,{type:"vector",minzoom:"city"===e?6:4,tiles:["https://weatherbox.github.io/warning-area-vt/"+e+"/{z}/{x}/{y}.pbf"],attribution:'<a href="http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html" target="_blank">\u56fd\u571f\u6570\u5024\u60c5\u5831</a>'})}function i(e){var a=("city"===e?"":e)+"allgeojson";t.addLayer({id:"selected-area-"+e,type:"fill",source:"vtile-"+e,"source-layer":a,paint:{"fill-color":"rgba(255, 55, 55, 1)","fill-outline-color":"rgba(244, 244, 244, 1)"},filter:["==","code",""]})}function s(e,n){if(n){var r={none:"rgba(55, 55, 55, 1)",advisory:"rgba(254, 242, 99, 1)",warning:"rgba(233, 84, 107, 1)",emergency:"rgba(98, 68, 152, 1)"};a[e]=n[e+"list"];var i=("city"===e?"":e)+"allgeojson",s=[];Object.keys(n[e+"list"]).forEach((function(t){var a=n[e+"list"][t].status;s.push([t,r[a]])})),t.addLayer({id:"warning-area-"+e,type:"fill",source:"vtile-"+e,"source-layer":i,paint:{"fill-color":{property:"city"===e?"code":e+"Code",type:"categorical",stops:s},"fill-outline-color":"rgba(123, 124, 125, 0.7)"}}),t.moveLayer("selected-area-"+e)}else console.log("Error: does not get warning data.")}function o(e){var a=t.getZoom()<6?"pref":"city",r=t.queryRenderedFeatures(e.point,{layers:["warning-area-"+a]});if(t.getCanvas().style.cursor=r.length?"crosshair":"",r.length){var i="city"===a?"name":a+"Name",s=r[0].properties[i];n(s)}else n(null)}function c(n){var r=t.getZoom()<6?"pref":"city",i=t.queryRenderedFeatures(n.point,{layers:["warning-area-"+r]}),s="selected-area-"+r;if(i.length){var o,c,l="city"===r?"code":r+"Code",u=i[0].properties[l];t.setFilter(s,["==",l,u]),"pref"===r?t.setFilter("selected-area-city",["==",l,u]):t.setFilter("selected-area-pref",["==",l,u]),t.setFilter("selected-area-pref",["==",l,u]),o=i[0].properties,c=a[r][u],e.props.click(o,c)}}this.map=t}},{key:"changeFeaturedArea",value:function(e){if(e.code&&e.code!==this.state.code){this.setState({code:e.code}),console.log(e.code);var t=["any",["==","prefCode",""]];e.code.map((function(e){return t.push(["==","prefCode",e]),e})),this.map.setFilter("featured-area-pref",t),this.map.moveLayer("featured-area-pref")}}},{key:"componentWillUnmount",value:function(){this.map.remove()}},{key:"componentDidUpdate",value:function(e){this.changeFeaturedArea(e)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(C,{name:this.state.mouseover}),r.a.createElement("div",{className:"map",ref:function(t){return e.container=t}}))}}]),a}(n.Component);a(181);function S(e){var t=e.feature;return t?Object.keys(t).length>2?r.a.createElement("div",{className:"coodinate"},t.prefName," > ",t.distlictName," > ",t.divisionName," > ",t.name):r.a.createElement("div",{className:"coodinate"},t.prefName,r.a.createElement("p",{style:{fontSize:"small",marginTop:"0.5rem"}},t.prefCode)):r.a.createElement("div",null)}a(182);function T(e){if(!e.warnings)return r.a.createElement("div",null);if(0===e.warnings.warnings.length)return r.a.createElement("div",{className:"label-area"},r.a.createElement("p",{className:"label default"},"\u767a\u8868\u7121\u3057"));var t=e.warnings.warnings.map((function(e,t){return-1!==e.lastIndexOf("\u7279\u5225\u8b66\u5831")?r.a.createElement("p",{className:"label emergency",key:t},e):-1!==e.lastIndexOf("\u8b66\u5831")?r.a.createElement("p",{className:"label warning",key:t},e):-1!==e.lastIndexOf("\u6ce8\u610f\u5831")?r.a.createElement("p",{className:"label advisory",key:t},e):null}));return r.a.createElement("div",{className:"label-area"},t)}a(183);var Y=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={start:{date:11,term:6},warning:null,code:null,error:!1},n.callflag=!1,n.cache={},n}return Object(c.a)(a,[{key:"getStartTime",value:function(e){var t=b(e);return{date:t.getDate(),term:Math.floor(t.getHours()/3)}}},{key:"whichTypeWarning",value:function(e){return-1!==e.lastIndexOf("\u7279\u5225\u8b66\u5831")?"emergency":-1!==e.lastIndexOf("\u8b66\u5831")?"warning":-1!==e.lastIndexOf("\u6ce8\u610f\u5831")?"advisory":""}},{key:"time2mappingIndex",value:function(e){var t=this.convertDatetimeFormat(e);if(this.state.start.date===t.date){var a=t.term-this.state.start.term;return a>=0?a:0}return(a=8-this.state.start.term+t.term)>=0?a:0}},{key:"zenkaku2hankaku",value:function(e){return e.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g,(function(e){return String.fromCharCode(e.charCodeAt(0)-65248)}))}},{key:"extractNumber",value:function(e){var t=e.replace(/[^0-9]/g,"");return parseInt(t)}},{key:"term2number",value:function(e){var t={"\u672a\u660e":0,"\u660e\u3051\u65b9":1,"\u671d":2,"\u663c\u524d":3,"\u663c\u904e\u304e":4,"\u5915\u65b9":5,"\u591c\u306e\u306f\u3058\u3081\u9803":6,"\u591c\u9045\u304f":7};return t[e]?t[e]:0}},{key:"convertDatetimeFormat",value:function(e){return{date:this.extractNumber(this.zenkaku2hankaku(e.date)),term:this.term2number(e.term)}}},{key:"mappingPeriod",value:function(e,t,a,n){var r,i;if(n[e]){var s=n[e];r=s.startTime?this.time2mappingIndex(s.startTime):0,i=s.endTime?this.time2mappingIndex(s.endTime):8,s.zoneTime&&(r=i=this.time2mappingIndex(s.zoneTime));for(var o=r;o<=i;o+=1)t[o]=t[o]>a?t[o]:a}return t}},{key:"CreateDays",value:function(){for(var e=[r.a.createElement("div",{className:"datetime head",key:"day"},"\u65e5\u4ed8")],t=this.state.start.date,a=this.state.start.term,n=2,i=0;i<9;i+=1)(a+=1)<=8||(e.push(r.a.createElement("div",{className:"datetime middle",style:{gridColumn:n+"/"+(i+2)},key:t},t,"\u65e5")),a=0,t+=1,n=i+2);return e.push(r.a.createElement("div",{className:"datetime middle end",style:{gridColumn:n+"/11"},key:t},t,"\u65e5")),r.a.createElement("div",{className:"grid"},e)}},{key:"CreateTimes",value:function(){for(var e=[r.a.createElement("div",{className:"datetime head",key:"time"},"\u6642\u9593")],t=this.state.start.term,a=0;a<9;a+=1)t>7&&(t=0),8===a?e.push(r.a.createElement("div",{className:"datetime end",key:a},3*t," - ",3*(t+1))):e.push(r.a.createElement("div",{className:"datetime middle",key:a},3*t," - ",3*(t+1))),t+=1;return r.a.createElement("div",{className:"grid"},e)}},{key:"CreatePeriod",value:function(e){var t=this;if(e.property){if("\u89e3\u9664"===e.status)return r.a.createElement("div",{className:"grid",key:e.name},r.a.createElement("div",{className:"item head"}," ",e.name," "),r.a.createElement("div",{className:"item end",style:{gridColumn:"2/11"}},"\u89e3\u9664"));if("\u767a\u8868\u8b66\u5831\u30fb\u6ce8\u610f\u5831\u306f\u306a\u3057"===e.status)return r.a.createElement("div",{className:"grid",key:"none"},r.a.createElement("div",{className:"item head"}," \u767a\u8868\u7121\u3057 "));var a=e.property.map((function(a,n){var i=["","advisory","warning","emergency"],s=[0,0,0,0,0,0,0,0,0];s=t.mappingPeriod("emergencyPeriod",s,3,a),s=t.mappingPeriod("warningPeriod",s,2,a),s=t.mappingPeriod("advisoryPeriod",s,1,a);var o=a.type,c=r.a.createElement("div",{className:"item head "+t.whichTypeWarning(e.name)}," ",e.name," (",o,")"),l=s.map((function(t,a){return a===s.length-1?r.a.createElement("div",{className:"item end "+i[t],key:e.name+a,value:t}):r.a.createElement("div",{className:"item "+i[t],key:e.name+a,value:t})}));return r.a.createElement("div",{className:"grid",key:e.name+n},c,l)}));return r.a.createElement("div",{key:e.name},a)}}},{key:"shouldComponentUpdate",value:function(e,t){return!(this.state.warning===t.warning&&this.props.code===e.code)}},{key:"downloadData",value:function(){var e=Object(y.a)(g.a.mark((function e(t){var a,n,r,i,s=this;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t in this.cache)){e.next=3;break}return this.setState({error:!1,head:this.cache[t].head,start:this.getStartTime(this.cache[t].control.dateTime),warning:this.cache[t].body.warning,code:t}),e.abrupt("return");case 3:return this.callflag=!0,a=new x,(n=new Date).setDate(n.getDate()-2),a.setValues({title:"\u6c17\u8c61\u7279\u5225\u8b66\u5831\u30fb\u8b66\u5831\u30fb\u6ce8\u610f\u5831",areacode:t}),a.setDatetime(n,new Date),e.next=11,j(a).then((function(e){return e.json()}));case 11:if(0!==(r=e.sent).data.length){e.next=15;break}return this.callflag=!1,e.abrupt("return");case 15:return i=r.data[0].link+".json",e.next=19,w(i.substring(5,i.length)).then((function(e){return e.json()})).then((function(e){console.log(e),console.log(s.getStartTime(e.report.control.dateTime)),s.cache[t]=e.report,s.setState({error:!1,head:e.report.head,start:s.getStartTime(e.report.control.dateTime),warning:e.report.body.warning,code:t})})).catch((function(e){console.log(e),s.setState({error:!0,warning:{},code:s.props.code.prefCode})})).finally((function(){s.callflag=!1}));case 19:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"renderFigure",value:function(){var e=this,t=this.CreateDays(),a=this.CreateTimes(),n=this.state.warning[3].item[0];if(this.props.code.code)for(var i=0;i<this.state.warning[3].item.length;i+=1)if(this.props.code.code===this.state.warning[3].item[i].area.code){n=this.state.warning[3].item[i];break}var s=n.kind.map((function(t){return e.CreatePeriod(t)})),o=b(this.state.head.targetDateTime);return r.a.createElement("div",{style:{margin:"2rem 1rem 10% 10%"}},r.a.createElement("h4",{style:{textAlign:"left"}},r.a.createElement("u",null,this.state.head.title)),r.a.createElement("p",{style:{textAlign:"left"}},this.state.head.headline.text),r.a.createElement("p",{style:{textAlign:"right"}},"\u767a\u8868\u6642\u523b\uff1a",function(e,t){var a=e.getFullYear(),n=1+e.getMonth();n<10&&(n="0"+n);var r=e.getDate();r<10&&(r="0"+r);var i=e.getHours();i<10&&(i="0"+i);var s=e.getMinutes();s<10&&(s="0"+s);var o=e.getSeconds();o<10&&(o="0"+o);var c=t;return c=(c=(c=(c=(c=(c=c.replace(/YYYY/g,a)).replace(/MM/g,n)).replace(/DD/g,r)).replace(/hh/g,i)).replace(/mm/g,s)).replace(/ss/g,o)}(o,"YYYY/MM/DD hh:mm")),r.a.createElement("div",{className:"outline"},r.a.createElement("div",{className:"arealabel"},n.area.name," (code: ",n.area.code,")"),t,a,s))}},{key:"render",value:function(){if(!this.props.code)return console.log("area none"),r.a.createElement("div",null,"\u5730\u57df\u3092\u9078\u629e");var e=this.props.code.prefCode;return this.callflag||e===this.state.code||this.downloadData(e),this.state.warning?this.state.error?r.a.createElement("div",{style:{marginTop:"1rem"}},"No Data or Network Error"):this.renderFigure(e):r.a.createElement("div",null,"Wait a moment.....")}}]),a}(n.Component),F=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={feature:null,warn:null,code:"",isMenuOpened:!1},n}return Object(c.a)(a,[{key:"selectFeature",value:function(e,t){JSON.stringify(this.state.feature)!==JSON.stringify(e)&&this.setState({feature:e,warn:t}),this.state.feature&&this.handleClick(!0)}},{key:"setCode",value:function(e){e!==this.state.code&&this.setState({code:e})}},{key:"handleClick",value:function(e){e!==this.state.isMenuOpened&&this.setState({isMenuOpened:e})}},{key:"canvasSizeModuler",value:function(){var e=window.innerWidth;return e>=800?800:e}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"App"},r.a.createElement(m.OffCanvas,{width:this.canvasSizeModuler(),transitionDuration:400,effect:"parallax",isMenuOpened:this.state.isMenuOpened,position:"right"},r.a.createElement(m.OffCanvasBody,{className:"canvas-body"},r.a.createElement(S,{feature:this.state.feature}),r.a.createElement(M,{click:function(t,a){return e.selectFeature(t,a)},code:this.state.code})),r.a.createElement(m.OffCanvasMenu,{className:"canvas-menu"},r.a.createElement(h.a,{fontSize:"large",onClick:function(){return e.handleClick(!1)},className:"canvas-back-icon"}),r.a.createElement(S,{feature:this.state.feature}),r.a.createElement(T,{warnings:this.state.warn}),r.a.createElement(Y,{code:this.state.feature}))))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(F,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[101,1,2]]]);
//# sourceMappingURL=main.e4cf00dd.chunk.js.map