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

      //  Canvas

      var canvas = dom.byId('canvas');
      var context = canvas.getContext('2d');
      function resizeContext() {
        context.canvas.width = canvas.offsetWidth;
        context.canvas.height = canvas.offsetHeight;
      }
      resizeContext();
      on(window,'resize',resizeContext);

      //  Guide

      var guide = dom.byId('guide');

      //  Macros

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
      
      //  Storyboard

      var storyIndex = 0;
      var storyboard = [
        
// 0 --------------------------------------
      function(){
        var endFlyover = false;
        var S = INIT_SCALE;
        var iteration = 0;
        var basemapIndex = 0;
        var basemapList = ['satellite','topo','national-geographic','dark-gray','oceans','osm','gray'];
        var azimuth = 29;
        var azimuthSweep = -0.08
        var zenith = 40;
        var zenithSweep = -1;
        var flyoverClear = false;

        //  Ready map
        view.goTo({center:[INIT_X,INIT_Y], scale:S, tilt:zenith, heading:azimuth},{animate:true});
        function flyover(x,y) {
          iteration += 1;
          view.goTo({center:[x,y], scale:S, tilt:zenith, heading:azimuth},{animate:true});
          azimuth += azimuthSweep;
          if (azimuth > 90 && azimuth < 180) azimuthSweep = -azimuthSweep;
          zenith += (41-zenith)*zenithSweep/200;
          if (zenith > 40 || zenith < 0) zenithSweep = -zenithSweep;
          S += S/200;
          x += Math.sqrt(S)/8e5;
          if (x > 180) x -= 360;
          if (iteration === 300) {
            iteration = 0;
            basemapIndex += 1;
            if (basemapIndex === basemapList.length) basemapIndex = 0;
            view.map.basemap = basemapList[basemapIndex];
          }
          if (!endFlyover) setTimeout(function(){flyover(x,y);},30);
        }

        context.fillStyle = '#000';
        context.fillRect(0,0,context.canvas.width,context.canvas.height);
        context.font = '48px serif';
        var sfI = 0;
        var sfA = 0;
        var sfState = 1;
        function splashFade() {console.log(sfState);
          sfI += 1;
          if (sfI > 500) {sfA=0;sfState+=1;sfI=0;if (sfState===2) sfI=200;}
          switch(sfState) {
            case 1:
              sfA += 0.01;
              context.fillRect(0,0,context.canvas.width,context.canvas.height);
              context.strokeStyle = 'rgba(255,255,255,' + sfA + ')';
              context.strokeText('A Demonstration of Modern GIS',200,200);
              window.requestAnimationFrame(splashFade);
              break;
            case 2:
              sfA += 0.01;
              context.clearRect(0,0,context.canvas.width,context.canvas.height);
              context.strokeStyle = 'rgba(255,255,255,' + sfA + ')';
              context.strokeText('GIS',200,200);
              window.requestAnimationFrame(splashFade);
              break;
            default: return;
          }
        }
        window.requestAnimationFrame(splashFade);
        flyover(INIT_X,INIT_Y);
      },
        
// 1 ----------------------------------------
        function(){},
      ];

      function start() {
        hide(guide,true);
        storyboard[storyIndex++]();
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
