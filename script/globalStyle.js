// #######################################
// Variabili style e controlli Openlayers
// #######################################

var symbolizersHighLightLayer = {
  "Point": {
    pointRadius: 4,
    graphicName: "circle",
    fillColor: "#FF8C00",
    fillOpacity: 0.3,
    strokeWidth: 1,
    strokeColor: "#FF8C00"
  },
  "Line": {
    strokeWidth: 3,
    strokeOpacity: 1,
    strokeColor: "#FF8C00",
    strokeDashstyle: "dash"
  },
  "Polygon": {
    strokeWidth: 2,
    strokeColor: "#FF8C00",
    fillColor: "lightgray",
    fillOpacity: 0.3
  }
};

var styleHighLightLayer = new OpenLayers.Style();
styleHighLightLayer.addRules([
   new OpenLayers.Rule({symbolizer: symbolizersHighLightLayer})
]);
var styleMapHighLightLayer = new OpenLayers.StyleMap({"default": styleHighLightLayer});

// Controlli di misura
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
var control;
var measureControls = {
    line: new OpenLayers.Control.Measure(
        OpenLayers.Handler.Path, {
            persist: true,
            handlerOptions: {
                layerOptions: {
                    renderers: renderer,
                    styleMap: styleMapHighLightLayer
                }
            }
        }
    ),
    polygon: new OpenLayers.Control.Measure(
        OpenLayers.Handler.Polygon, {
            persist: true,
            handlerOptions: {
                layerOptions: {
                    renderers: renderer,
                    styleMap: styleMapHighLightLayer
                }
            }
        }
    )
};