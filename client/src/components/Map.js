import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
// import {get} from './Get.js';
import {getWarningArea} from './tools/Get.js';
import './style/map.css';

class Map extends Component {
    constructor(props){
        super(props);
        this.state = {
            mouseover: null,
            feature: null,
            code: "",
        };
    }

    componentDidMount() {
        const zoomThreshold = 6;

        // マップの生成
        mapboxgl.accessToken = 'pk.eyJ1IjoibHVuYXNreSIsImEiOiJjazZidGtid2UxNTd1M2tuNTN0cDBzZDMyIn0.8ci4ul7Dh1kg2g6sRfDYQw';
        var map = new mapboxgl.Map({
            container: this.container,
            center: [136.6, 35],
            minZoom: 4,
            maxZoom: 10,
            zoom: 5,
            attributionControl: false,
            logoPosition: 'bottom-right',
            hash: true,
            style: 'mapbox://styles/lunasky/ckbbbjs5v03aq1ipi2crj7ctd',
            localIdeographFontFamily: "'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, メイリオ, sans-serif",
        });
        map.touchZoomRotate.disableRotation();

        var warning_data = {};

        // レイヤーの生成
        map.on('load', () => {
            addSource("pref");
            addSource("city");

            mountLayer("pref");
            mountLayer("city");
            
            // get("/api/warning/pref").then(v => v.json()).then(v => {
            getWarningArea("pref").then(v => v.json()).then(v => {
                    renderWaringArea('pref', v);
            });
            // get("/api/warning/city").then(v => v.json()).then(v => {
            getWarningArea("city").then(v => v.json()).then(v => {
                renderWaringArea('city', v);
            });

            map.on('mousemove', hoverArea);
            map.on('click', selectArea);
            
            // createSelectLayer();
        });

        // マウスオーバー時の名前を表示
        let setMouseOver = (v) => {
            if (this.state.mouseover !== v){
                this.setState({mouseover: v});
            }
        };

        // 都市選択時の表示
        let clickCity = (v, w) => {
            this.props.click(v, w);
        }

        //-------------------------- map setting functions

        function addSource(layer){

            map.addSource("vtile-" + layer, {
                "type": "vector",
                "minzoom": (layer === 'city') ? zoomThreshold : 4,
                "tiles": ["https://weatherbox.github.io/warning-area-vt/" + layer + "/{z}/{x}/{y}.pbf"],
                "attribution": '<a href="http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html" target="_blank">国土数値情報</a>'
            });
        }
        
        function mountLayer(layer){
            // Layer's item - pref > distlict > division > city
            var source_layer = ((layer === 'city') ? '' : layer) + 'allgeojson';

            map.addLayer({
                "id": "selected-area-" + layer,
                "type": "fill",
                "source": "vtile-" + layer,
                "source-layer": source_layer,
                "paint": {
                    "fill-color": "rgba(0, 0, 0, 0)",
                    "fill-outline-color": "rgba(244, 44, 44, 1)",
                },
                "filter": ["==", "code", ""],
            });
        }

        function renderWaringArea(layer, data){
            if (!data) {
                console.log("Error: does not get warning data.");
                return;
            }
            var warningColor = {
                none:      "rgba(55, 55, 55, 1)",
                advisory:  "rgba(254, 242, 99, 1)",
                warning:   "rgb(191, 13, 13)",
                emergency: "rgba(98, 68, 152, 1)"
            };
            warning_data[layer] = data[layer + 'list'];

            var source_layer = ((layer === 'city') ? '' : layer) + 'allgeojson';
            
            var stops = [];
            Object.keys(data[layer + 'list']).forEach((code) => {
                var status = data[layer + 'list'][code].status;
                stops.push([code, warningColor[status]]);
            });

            map.addLayer({
                "id": "warning-area-" + layer,
                "type": "fill",
                "source": "vtile-" + layer,
                "source-layer": source_layer,
                "paint": {
                    "fill-color": {
                        "property": (layer === 'city') ? 'code' : layer + 'Code',
                        "type": "categorical",
                        "stops": stops,
                    },
                    "fill-outline-color": "rgba(123, 124, 125, 0.7)",
                }
            });

            map.moveLayer('selected-area-' + layer);
        }

        function hoverArea(e){
            var layer = (map.getZoom() < zoomThreshold) ? "pref":"city";
            var features = map.queryRenderedFeatures(e.point, {layers : ["warning-area-" + layer]});
            map.getCanvas().style.cursor = (features.length) ? 'crosshair' : '';
        
            if(!features.length){
                setMouseOver(null);
                return;
            }
            var feature = features[0];
            var name_prop = (layer === 'city') ? 'name' : layer + 'Name';
            var name = feature.properties[name_prop];
            setMouseOver(name);
        }

        function selectArea(e) {
            var layer = (map.getZoom() < zoomThreshold) ? "pref" : "city";
            var features = map.queryRenderedFeatures(e.point, {layers : ["warning-area-" + layer]});
            var layerId = 'selected-area-' + layer;

            if(!features.length){
                return;
            }

            var code_prop = (layer === 'city') ? 'code' : layer + 'Code';
            var code = features[0].properties[code_prop];
            map.setFilter(layerId, ["==", code_prop, code]);

            if (layer === 'pref'){
                map.setFilter('selected-area-city', ["==", code_prop, code]);
            } else {
                map.setFilter('selected-area-pref', ["==", code_prop, code]);
            }
            map.setFilter('selected-area-pref', ["==", code_prop, code]);
            clickCity(features[0].properties, warning_data[layer][code]);
        }

        function createSelectLayer(){
            // const layers = ["city", "division", "distlict", "pref"];
            const layers = ["pref"];
            layers.reverse().map((layer) => {
                var source_layer = ((layer === 'city') ? '' : layer) + 'allgeojson';
                map.addLayer({
                    "id": "featured-area-" + layer,
                    "type": "fill",
                    "source": "vtile-" + layer,
                    "source-layer": source_layer,
                    "paint": {
                        "fill-color": "rgba(250,250,250,1)",
                        "fill-outline-color": "rgba(250, 30, 30, 1)",
                    },
                    "filter": ["==", "code", ""],
                });
                return null;
            });
        }
        
        this.map = map;
    }

    changeFeaturedArea(props) {
        if(!props.code) return;
        if(props.code === this.state.code) return;
        this.setState({"code": props.code});
        console.log(props.code);

        var layerId = "featured-area-pref";
        var code_prop = 'prefCode';

        var filter = ["any", ["==", code_prop, ""]];
        props.code.map(c => {
            filter.push(["==", code_prop, c]);
            return c;
        })

        this.map.setFilter(layerId, filter);
        this.map.moveLayer('featured-area-pref');
    }

    componentWillUnmount() {
        this.map.remove();
    }

    componentDidUpdate(props){
        this.changeFeaturedArea(props);
    }

    render() {
        return (
            <div>
                <HoverCordinate name={this.state.mouseover} />
                <div className={'map'} ref={e => (this.container = e)} />
            </div>
        );
    }
}

function HoverCordinate(name){
    if(!(name.name)) return <div></div>;
    return (
        <div className='hoverInformation'>
            <p>{name.name}</p>
        </div>
    );
}

export default Map;