
/*
storyboard

1. Splashscreen + Introduction

--> SPLASHSCREEN --> map fades in

[panning out, basemaps changing]
-GIS is transforming the way we interact with out everyday world.
-But what is GIS?
-How can it help us?
-And why is it so important?
-This interactive demonstration is designed to help answer these questions.
[panning continues as whole globe is in view.  menu fades in]

2.  What is GIS? [Geographic Information Science: the basics] [history of GIS] [GIS environments (eg web, print maps, etc)]

3.  GIS in our everyday lives

4.  GIS as an investigative and decision making tool

5.  Behind the scenes of modern web-enabled GIS

*/

var demo;

require([
  //  ESRI
  'esri/Camera',
  'esri/Map',
  'esri/views/SceneView',
  //  Dojo
  'dojo/on',
  'dojo/dom',
  'dojo/domReady!'
], function(Camera, Map, SceneView, on, dom) {

  demo = (function(){

    //  ***  DECLARATIONS  ***  //

    var map;
    var view;
    var canvas;
    var context;
    var menu;
    var navigator;
    var ui;
    var textBox;
    var storyboard;
    var chapters;

    //  ***  MACRO FUNCTIONS  ***  //

    function hide(e,transTime) {
      if (transTime) e.style.transition = transTime+'s';
      if (!e.classList.contains('hide')) e.classList.add('hide');
    }
    function show(e,transTime) {
      if (transTime) e.style.transition = transTime+'s';
      e.classList.remove('hide');
    }
    function mapWhiteIn(t) {
      var a = 1;
      var _inc = 1/(t*60);
      function _wi() {console.log(1);
        context.fillStyle = 'rgba(255,255,255,'+a.toFixed(2)+')';
        context.clearRect(0,0,context.canvas.width,context.canvas.height);
        context.fillRect(0,0,context.canvas.width,context.canvas.height);
        a -= _inc;
        if (a > 0) window.requestAnimationFrame(_wi);
      }
      window.requestAnimationFrame(_wi);
    }
    function mapWhiteOut() {}


    function textQueue(Q) {
      var tTrans = 2500;
      var _t = 0;
      Q.forEach(function(q){
        setTimeout(function(){
          textBox.classList.remove('transparent');
          textBox.innerHTML = q.html;
          textBox.style.left = q.x;
          textBox.style.top = q.y;
          setTimeout(function(){textBox.classList.add('transparent');},q.t+tTrans);
        }, _t );
        _t += q.t+tTrans*2;
      });
    }

    //  ***  ELEMENTS  ***  //

    //  Map & map view
    var map = dom.byId('map');
    var view = new SceneView({
      map: new Map({
        basemap: 'satellite',
        ground: 'world-elevation'
      }),
      container: 'map'
    });
    //  Canvas
    var canvas = dom.byId('canvas');
    var context = canvas.getContext('2d');
    function resizeContext() {
      context.canvas.width = canvas.offsetWidth;
      context.canvas.height = canvas.offsetHeight;
    }
    resizeContext();
    on(window,'resize',resizeContext);
    //  Menu
    var menu = dom.byId('menu');
    //  Navigator (chapters)
    var navigator = dom.byId('navigator');
    //  User interface
    var ui = dom.byId('ui');
    //  Text messages
    var textBox = dom.byId('textBox');

    var storyboard = {
      intro:function() {
        mapWhiteIn(5);
        view.goTo({center:[-107,43], scale:1e4, tilt:0, heading:0},{animate:true});
        var basemapList = ['satellite','topo','national-geographic','dark-gray','oceans','osm','gray'];
        textQueue([
          {html:'GIS is transforming the way we interact with out everyday world.',x:'30%',y:'30%',t:2000},
          {html:'But what is GIS?',x:'30%',y:'30%',t:3000},
          {html:'Why is it so important?',x:'30%',y:'30%',t:2000},
          {html:'And how are GIS applications created?',x:'30%',y:'30%',t:4000},
          {html:'This interactive demonstration is designed to help answer these questions.',x:'30%',y:'30%',t:4000}
        ]);
      }
    };

    var chapters = [
      {
        title:'Introduction',
        func:storyboard.intro
      },
    ];

    view.then(function(){

      view.ui.move('compass','bottom-right');
      view.ui.remove(['navigation-toggle','zoom']);
      hide(ui);

      chapters[0].func();


      // view.environment = {
      //   lighting: {
      //     date: new Date(),  // sets the lighting to reflect the current time of day
      //     directShadowsEnabled: true,  // enables shadows
      //     cameraTrackingEnabled: false
      //   },
      //   atmosphere: {
      //     quality: 'high'  // creates a more realistic atmosphere
      //   }
      // };

    }).otherwise(function(err){console.log(err);});

  })(); // end `demo`
});
