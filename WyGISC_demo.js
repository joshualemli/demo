var demo;
var map;
var view;

var INIT_X = -107.4, INIT_Y = 43, INIT_SCALE = 1000;

require(
  [
    //  ESRI
    'esri/Camera',
    'esri/Map',
    'esri/views/SceneView',
    //  Dojo
    'dojo/on',
    'dojo/dom',
    //  Execute on DOM `load`
    'dojo/domReady!'
  ],
  function( Camera, Map, SceneView, on, dom ) {

    demo = (function() {

      var guide = dom.byId('guide');

      function show(e,instantaneous) {
        if (instantaneous) e.style.display = 'block';
        else {
          e.style.animationDuration = '1.5s';
          e.style.animationName = 'show';
          e.style.display = 'block';
        }
      }
      function hide(e,instantaneous) {
        if (instantaneous) e.style.display = 'none';
        else {
          e.style.animationDuration = '5s';
          e.style.animationName = 'hide';
          setTimeout(function(){e.style.display = 'none';}, 5000 );
        }
      }
      
      var steps = [
        
// 0 --------------------------------------
      function(){
        var endFlyover = false;
        var S = INIT_SCALE;
        var iteration = 0;
        var basemapIndex = 0;
        var basemapList = ['satellite','topo','national-geographic','dark-gray','oceans','osm','gray'];
        var azimuth = 29;
        var azimuthSweep = -0.1
        var zenith = 40;
        var zenithSweep = -1;
        var flyoverDelay = 100; // in iterations
        var flyoverClear = false;
        function flyover(x,y) {
          
          iteration += 1;
          view.goTo({center:[x,y], scale:S, tilt:zenith, heading:azimuth},{animate:true});
          
          if (!flyoverClear && iteration >= flyoverDelay) {
            flyoverClear = true;
            
            console.log("T");
          }
          else if (flyoverClear) {

            azimuth += azimuthSweep;
            if (azimuth > 90 && azimuth < 180) azimuthSweep = -azimuthSweep;

            zenith += (41-zenith)*zenithSweep/200;
            if (zenith > 40 || zenith < 0) zenithSweep = -zenithSweep;

            S += Math.sqrt(2e9-S)/4e2;
            x += Math.sqrt(S)/1e6;
            if (x > 180) x -= 360;

            if (iteration === 300) {
              iteration = 0;
              basemapIndex += 1;
              if (basemapIndex === basemapList.length) basemapIndex = 0;
              view.map.basemap = basemapList[basemapIndex];
            }
          }
          if (!endFlyover) setTimeout(function(){flyover(x,y);},30);
        }
        flyover(INIT_X,INIT_Y);
      },
        
// 1 ----------------------------------------
        function(){},
      ];

      function start() {
        hide(guide,true);
        steps[0]();
        //rotater([-107.4,43]);
      }
      function next() {

      }

      return {
        start:start,
        next:next
      };
    })(); // end `demo`
    
    
    
    //  Map
    
    view = new SceneView({
      map: new Map({
        basemap: 'satellite',
        ground: 'world-elevation'
      }),
      container: 'map'
    });
    
//     var camera = new Camera({
//       heading: 90, // face due east
//         tilt: 45, // looking from a bird's eye view
//         position: {
//           latitude: 43,
//           longitude: -107.4,
//           z: 20000,
//           spatialReference: { wkid: 3857 }
//         }
//     });
    
//     view.camera = camera;
    
    view.then(function() {
      demo.start();
    }).otherwise(function(err) {
      console.log(err);
    });

  }
);
