import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import './style/map.css';

class Map extends Component {
    constructor(props){
        super(props);
        this.state = {
            mouseover: null,
            feature: null,
        };
    }

    componentDidMount() {
        const zoomThreshold = 7;

        // マップの生成
        mapboxgl.accessToken = 'pk.eyJ1IjoibHVuYXNreSIsImEiOiJjazZidGtid2UxNTd1M2tuNTN0cDBzZDMyIn0.8ci4ul7Dh1kg2g6sRfDYQw';
        var map = new mapboxgl.Map({
            container: this.container,
            center: [136.6, 35],
            minZoom: 3,
            maxZoom: 10,
            zoom: 5,
            attributionControl: false,
            logoPosition: 'bottom-right',
            hash: true,
            style: 'mapbox://styles/lunasky/ck6btz0rn0c6u1itduqjh60dd',
            localIdeographFontFamily: "'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, メイリオ, sans-serif",
        });
        map.touchZoomRotate.disableRotation();

        // レイヤーの生成
        map.on('load', () => {
            mountLayer("city");
            mountLayer("pref");

            map.on('mousemove', hoverArea);
            map.on('click', selectArea);
        });

        // マウスオーバー時の名前を表示
        let setMouseOver = (v) => {
            if (this.state.mouseover !== v){
                this.setState({mouseover: v});
            }
        };

        // 都市選択時の表示
        let clickCity = (v) => {
            this.props.click(v);
        }

        //-------------------------- map setting functions
        
        function mountLayer(layer){
            // Layer's item - pref > distlict > division > city
            var source_layer = ((layer === 'city') ? '' : layer) + 'allgeojson';

            map.addSource("vtile-" + layer, {
                "type": "vector",
                "minzoom": (layer === 'city') ? zoomThreshold : 3,
                "maxzoom": 10,
                "tiles": ["https://weatherbox.github.io/warning-area-vt/" + layer + "/{z}/{x}/{y}.pbf"],
                "attribution": '<a href="http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html" target="_blank">国土数値情報</a>'
            });

            map.addLayer({
                "id": "warning-area-" + layer,
                "type": "fill",
                "source": "vtile-" + layer,
                "source-layer": source_layer,
                "paint": {
                    "fill-color": "rgba(55, 55, 55, 0.3)",
                    "fill-outline-color": "rgba(113, 181, 153, 0.6)"
                }
            });

            map.addLayer({
                "id": "selected-area-" + layer,
                "type": "fill",
                "source": "vtile-" + layer,
                "source-layer": source_layer,
                "paint": {
                    "fill-color": "rgba(255, 55, 55, 1)",
                    "fill-outline-color": "rgba(113, 181, 153, 0.6)"
                },
                "filter": ["==", "code", ""],
            });
        }
        
        function renderWaringArea(layer, data){
            var warningColor = {
                none:      "rgba(255, 255, 255, 0)",
                advisory:  "rgba(254, 242, 99, 0.4)",
                warning:   "rgba(233, 84, 107, 0.4)",
                emergency: "rgba(98, 68, 152, 0.4)"
            };
            var source_layer = ((layer === 'city') ? '' : layer) + 'allgeojson';

            var stops = [];
            Object.keys(data).forEach((code) => {
                var status = data[code].status;
                if(!status) return;
                stops.push([code, warningColor[status]]);
            });

            console.log(stops)

            map.addLayer({
                "id": "warning-are-" + layer,
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
        }

        function hoverArea(e){
            var layer = (map.getZoom() <= zoomThreshold) ? "pref":"city";
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
            var layer = (map.getZoom() <= zoomThreshold) ? "pref" : "city";
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
            clickCity(features[0].properties);
            // console.log(features[0]);
        }
        
        this.map = map;
    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        return (
            <div>
                {/* <SelectCordinate prop={this.state.feature}/> */}
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