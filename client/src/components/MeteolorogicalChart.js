import {get} from './tools/Get.js';
// var map = new mapboxgl.Map({
//     container: 'map',
//     center: [136.6, 35],
//     zoom: 4.2,
//     attributionControl: false,
//     logoPosition: 'bottom-right',
//     hash: true,
//     style: 'mapbox://styles/lunasky/ck6btz0rn0c6u1itduqjh60dd',
//     localIdeographFontFamily: "'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, メイリオ, sans-serif"
//   });
  
//   map.setMaxZoom(6.5);
//   map.setMinZoom(3.5);
  
//   map.on('load', () => {
//     // map.addSource('meteorological-data', {
//     //   type: "geojson",
//     //   data: "geojson/202002140300.geojson",
//     // });
export default function createMeteolorogicalChart(map){
    var isobars = {
      type: "FeatureCollection",
      features: [],
      meta: {title: "Isobar"}
    };
  
    var lowers = {
      type: "FeatureCollection",
      features: [],
      meta: {title: "LowerPressure"},
    }
  
    var highers = {
      type: "FeatureCollection",
      features: [],
      meta: {title: "HigherPressure"},
    }

    get('geojson/202002140300.geojson').then(res => res.json()).then(geojson => {
        isobars.features = geojson.features.filter(ft => ft.properties.type === 'isobar').map(ft => {
            ft.properties['width'] = ft.properties.pressure % 20 == 0 ? 3 : 1;
            return ft;
        });
        lowers.features = data.features.filter(ft => ft.properties.type === "低気圧");
        highers.features = data.features.filter(ft => ft.properties.type === "高気圧");
        
        // Add Data
        map.addSource('isobars-data', {
          type: "geojson",
          data: isobars,
        });
      
        map.addSource('latlng-data', {
          type: "geojson",
          data: createLatLngLine(),
        });
      
        map.addSource('lowers', {
          type: "geojson",
          data: lowers,
        });
      
        map.addSource('highers', {
          type: "geojson",
          data: highers,
        });
        
  
        // Add Map Layer for each elements
        map.addLayer({
            id: 'latlng',
            type: 'line',
            source: "latlng-data",
            paint: {
            'line-color': '#484848'
            }
        });
        
        map.addLayer({
            id: 'isobars',
            type: 'line',
            source: "isobars-data",
            paint: {
            'line-color': '#292929',
            'line-width': ['get', 'width'],
            },
        });

        map.loadImage(
            './icon/center.png',
            (err, img) => {
            if (err) {console.log(err); throw err;}
            map.addImage('center', img);
        
            map.addLayer({
                id: 'lowers',
                type: 'symbol',
                source: 'lowers',
                paint: {
                'text-color': '#1338A9',
                'text-halo-width': 2,
                'text-halo-color': '#7A7A7A',
                },
                layout: {
                'icon-image': 'center',
                'icon-size': 0.25,
                'text-field': ['concat', ['get', 'pressure'], 'hPa'],
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-radial-offset': 0.75,
                'text-justify': 'auto',
                'text-size':20,
                }
            });
            
            map.addLayer({
                id: 'highers',
                type: 'symbol',
                source: 'highers',
                paint: {
                'text-color': '#A20310',
                'text-halo-width': 2,
                'text-halo-color': '#7A7A7A',
                },
                layout: {
                'icon-image': 'center',
                'icon-size': 0.25,
                'text-field': ['concat', ['get', 'pressure'], 'hPa'],
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-radial-offset': 0.75,
                'text-justify': 'auto',
                'text-size':20,
                }
            });
            }
        )
    });
}