lizMap.events.on({
    'uicreated': function(e) {
        $('#profil-stop').click(function(){
            $('#button-altiProfil').click();
        });
        $('#altiProfil .menu-content #profil-chart').hide();
        initAltiProfil();
    }
});

function getAltiJsonResponse(params, aCallback){
    $.get(
        URLAJAXALTICOORD,
        params,
        function(data) {
            if(aCallback){
                    aCallback(data);
            }
        }
        ,'json'
    );
}

function getAlti(lon,lat, numFeat){
    //IGN Web Service only allows coordinates in 4326
    if(lizMap.map.projection.projCode != "EPSG:4326"){
        var fromProjection = new OpenLayers.Projection(lizMap.map.projection.projCode);
        var toProjection = new OpenLayers.Projection("EPSG:4326");
        var convertedPoint = new OpenLayers.LonLat(lon, lat);
        convertedPoint.transform(fromProjection, toProjection);
        lon = convertedPoint.lon;
        lat = convertedPoint.lat;    }

    var qParams = {
        'lon': lon,
        'lat':lat,
        'srs': lizMap.map.projection.projCode,
        'repository': lizUrls.params.repository,
        'project': lizUrls.params.project
    }
    getAltiJsonResponse(qParams, function(data){
        var alt = Number(data['elevations'][0]['z']).toFixed(2);
        $('#altiProfil .menu-content #alt-p'+numFeat).html( alt + " m" );
    });
}

function getProfilJsonResponse(params, aCallback){
    $('#altiProfil .menu-content #profil-chart .progress').show();
    $.get(
        URLAJAXALTIPROFIL,
        params,
        function(data) {
            if(aCallback){
                    aCallback(data);
            }
        }
        ,'json'
    );
}

function resizePlot(id){
    $('#'+id)
    .css({
        width: '100%',
        margin: '0px'
    });
    Plotly.Plots.resize($('#'+id)[0]);
}
function toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + '&#176;' + minutes + '&#39;' + seconds + '&#34;';
}

function convertDMS(lat, lng) {
    var latitude = toDegreesMinutesAndSeconds(lat);
    var latitudeCardinal = lat >= 0 ? "N" : "S";

    var longitude = toDegreesMinutesAndSeconds(lng);
    var longitudeCardinal = lng >= 0 ? "E" : "W";

    return longitude + longitudeCardinal + ' / ' + latitude + latitudeCardinal;
}

function getProfil(p1,p2){
    let p1clone = p1.clone();
    let p2clone = p2.clone();
    if(lizMap.map.projection.projCode != "EPSG:4326"){
        // reproject point to 4326
        p1clone.transform(lizMap.map.projection.projCode, 'EPSG:4326');
        p2clone.transform(lizMap.map.projection.projCode, 'EPSG:4326');
    }
    const p1coord = p1.getCoordinates();
    const p2coord = p2.getCoordinates();
    let line =new lizMap.ol.geom.LineString([p1coord, p2coord]);

    const distance = Math.round(line.getLength());
    const sampling = Math.round(distance <= 100 ? distance - 2 : (distance <= 500 ? distance / 5 : distance / 25));

    var qParams = {
        'p1Lon': p1clone.getCoordinates()[0],
        'p1Lat': p1clone.getCoordinates()[1],
        'p2Lon': p2clone.getCoordinates()[0],
        'p2Lat': p2clone.getCoordinates()[1],
        'srs': lizMap.map.projection.projCode,
        'repository': lizUrls.params.repository,
        'project': lizUrls.params.project,
        'sampling' : sampling /* Only use with french mapping Agency (IGN) web service  */,
        'distance' : distance
    }

    getProfilJsonResponse(qParams, function(data){
        var _x = data[0]['x'];
        var _y = data[0]['y'];
        var _customdata = data[0]['customdata'];
        var _srs = data[0]['srid'];
        var _altisource = data[0]['altisource'];

        var layout = {
            title: '<b>'+LOCALES_ALTI_PROFIL+'</b>',
            xaxis: {
                title: LOCALES_ALTI_DISTANCE +' (m)',
                showaxeslabels:false
            },
            yaxis: {
                title: LOCALES_ALTI_ELEVATION +' (m)'
            },
            hovermode:'closest',
            annotations: [{
                font: {
                    size: 11
                },
                align:'center',
                xref:'paper',
                yref:'paper',
                y: 1.16,
                showarrow: false,
                text: `P1 (${convertDMS(qParams.p1Lat.toFixed(5), qParams.p1Lon.toFixed(5))}) | P2 (${convertDMS(qParams.p2Lat.toFixed(5), qParams.p2Lon.toFixed(5))})`
            },{
                font: {
                    size: 10
                },
                align:'left',
                xref:'paper',
                yref:'paper',
                x: -0.02,
                y: -0.21,
                showarrow: false,
                text: `<i>${LOCALES_ALTI_DATASOURCE} : ${_altisource}</i>`
            }],
            showlegend: false,
            autosize: true,
            margin: {
                l: 60,
                r: 20,
                b: 60
            }
        };

        //add extra info if datasource from DB
        if ( ALTI_PROVIDER == "database"){
            var _resolution = data[0]['resolution'];
            var _slope = data[0]['slope'];

            layout['title'] = '<b>'+LOCALES_ALTI_PROFIL+' ('+ LOCALES_ALTI_RESOLUTION +' ' +_resolution+ 'm)';
            layout['annotations'].push(
                {
                    font: {
                        size: 11
                    },
                    align:'center',
                    xref:'paper',
                    yref:'paper',
                    y: 1.10,
                    showarrow:false,
                    text: `${LOCALES_ALTI_SLOPE} ${LOCALES_ALTI_UNIT}  min :  ${_slope.min_slope} | max : ${_slope.max_slope} | ${LOCALES_ALTI_MEAN} : ${_slope.mean_slope}`
                }
            )
        }

        var profilLine = {
            x: _x,
            y: _y,
            customdata:_customdata,
            mode: 'lines',
            line: {
              color: 'rgb(128, 0, 128)',
              width: 1
            }
            ,hovertemplate: '<b>' + LOCALES_ALTI_ELEVATION + '</b>: %{y}m' +
            '<br /><b>lon</b> : %{customdata[0].lon:.2f} / <b>lat</b> : %{customdata[0].lat:.2f}</b>'+
            '<extra></extra>'
          };
        var StartStopLine = {
            x: [_x[0], _x[_x.length - 1]],
            y: [_y[0], _y[_y.length - 1]],
            customdata:_customdata,
            mode: 'lines+markers',
            line: {
              color: 'red',
              width: 1.5
            },
            hovertemplate: '<b>' + LOCALES_ALTI_ELEVATION + '</b>: %{y}m' +
            '<br /><b>' + LOCALES_ALTI_DISTANCE + '</b>: %{x}m'+
            '<extra></extra>'
          };
        data = [profilLine,StartStopLine];

        var plotLocale = lizMap.config.datavizLayers.locale.substr(0,2).toLowerCase();
        var config = {
            showlegend: false,
            displaylogo: false,
            responsive: true,
            locale: plotLocale,
            toImageButtonOptions: {
              format: 'jpeg', // one of png, svg, jpeg, webp
              filename: 'profil',
              height: 500,
              width: 700,
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            modeBarButtonsToRemove: ['zoom2d', 'pan2d','select2d','lasso2d','resetScale2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d',
                'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews',
                'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox', 'hoverClosestCartesian', 'hoverCompareCartesian']
          };
        Plotly.newPlot('profil-chart-container', data, layout, config);
        $('#altiProfil .menu-content #profil-chart .progress').hide();
        var myPlot = document.getElementById('profil-chart-container');

        myPlot.on('plotly_click', function(data){
            p = data.points[0].customdata[0];
            let layers = lizMap.mainLizmap.map.getAllLayers();
            // searching for altiProfil layer
            layers.forEach( function (layer) {
                if (layer.get('altiprofil') == true) {
                    // add a point to the layer corresponding to chart click
                    let features = layer.getSource().getFeatures();
                    let pCoord = new lizMap.ol.geom.Point([p.lon, p.lat]);
                    pCoord.transform('EPSG:'+_srs,lizMap.map.projection.projCode );
                    // remove last inserted feature if more than 3 (2 points + 1 line)
                    if(features.length > 3){
                        layer.getSource().removeFeature(features[features.length-1]);
                    }
                    layer.getSource().addFeature(  new lizMap.ol.Feature({
                        geometry: pCoord,
                        name: 'My point on plotly',
                    }) );
                }
            });
        });
        document.getElementsByClassName('xtitle')[0].y.baseVal[0].value = document.getElementsByClassName('xtitle')[0].y.baseVal[0].value - 20;
        resizePlot('profil-chart-container')
    });
}

function initAltiProfil() {
    //Layer to display clic location
    // define styes
    let styles = new lizMap.ol.style.Style({
        stroke: new lizMap.ol.style.Stroke({color: 'red', width :2}),
        fill: new lizMap.ol.style.Fill({color: 'red', width :2}),
        image: new lizMap.ol.style.RegularShape({
          fill: new lizMap.ol.style.Fill({color: 'red', width :2}),
          stroke: new lizMap.ol.style.Stroke({color: 'red', width: 5}),
          points: 4,
          radius: 10,
          radius2: 0,
          angle: 0,
        }),
      });
    const altiProfilSource= new lizMap.ol.source.Vector();
    const altiProfilLayer = new  lizMap.ol.layer.Vector({
        style: styles,
        source: altiProfilSource,
        projection : lizMap.map.projection,
        properties : {"altiprofil" : true},
        visible : false
    });

    function onAltiDockOpened() {
        // disable popup
        lizMap.mainLizmap.popup.active = false;
        altiProfilLayer.setVisible(true);
        lizMap.addMessage(LOCALES_ALTI_HELP, 'info', true, 3000).attr('id','altiProfil-message');
    }

    function onAltiDockClosed() {
        // enable popup
        lizMap.mainLizmap.popup.active = true;
        $('#altiProfil .menu-content #profil-chart-container').empty();
        $('#altiProfil .menu-content span').html( "" );
        $('#altiProfil .menu-content #profil-chart-container').removeClass('js-plotly-plot');
        altiProfilSource.clear();
        altiProfilLayer.setVisible(false);
        $('#altiProfil-message').remove();
    }


    lizMap.events.on({
        // Dock opened
        dockopened: function(e) {
            if ( e.id == 'altiProfil' ) {
                onAltiDockOpened();
            }
        },
        minidockopened: function(e) {
            if ( e.id == 'altiProfil' ) {
                onAltiDockOpened();
            }
        },
        rightdockopened: function(e) {
            if ( e.id == 'altiProfil' ) {
                onAltiDockOpened();
            }
        },
        // Dock closed
        dockclosed: function(e) {
            if ( e.id == 'altiProfil' ) {
                onAltiDockClosed();
            }
        },
        minidockclosed: function(e) {
            if ( e.id == 'altiProfil' ) {
                onAltiDockClosed();
            }
        },
        rightdockclosed: function(e) {
            if ( e.id == 'altiProfil' ) {
                onAltiDockClosed();
            }
        }
    });

    lizMap.mainLizmap.map.addToolLayer(altiProfilLayer);

    lizMap.mainLizmap.map.on('singleclick', evt => {
            if (altiProfilLayer.getVisible()) {
                let nbFeatures = altiProfilSource.getFeatures().length;
                if(nbFeatures>=2){
                    altiProfilSource.clear();
                    $('#altiProfil .menu-content #profil-chart').hide();
                    $('#altiProfil .menu-content #profil-chart-container').empty();
                    $('#altiProfil .menu-content span').html( "" );
                    $('#altiProfil .menu-content #profil-chart-container').removeClass('js-plotly-plot');
                    nbFeatures = 0;
                }

                const feature = new lizMap.ol.Feature({
                    geometry: new lizMap.ol.geom.Point(evt.coordinate),
                    name: 'AltiPoint'+nbFeatures,
                });
                altiProfilSource.addFeature(feature);
                nbFeatures++;
                getAlti(evt.coordinate[0],evt.coordinate[1], nbFeatures);
                // Add a line between points
                if(nbFeatures ==2){
                    let altiLayerFeature = altiProfilSource.getFeatures();

                    p1Geom = altiLayerFeature[0].getGeometry();
                    p2Geom = altiLayerFeature[1].getGeometry();

                    altiProfilSource.addFeature(  new lizMap.ol.Feature({
                        geometry: new lizMap.ol.geom.LineString([p1Geom.getFirstCoordinate(), p2Geom.getFirstCoordinate()]),
                        style :  new lizMap.ol.style.Style({
                            stroke: new lizMap.ol.style.Stroke({color: 'red', width: 4}),
                        }),
                        name: 'AltiLine',
                    }) );
                    getProfil(p1Geom, p2Geom);
                    $('#altiProfil .menu-content #profil-chart').show();
                }
            }
        }
        );


}
