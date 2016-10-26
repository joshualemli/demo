var demo;
var map;
var view;

require(
  [
    //  ESRI
    'esri/Map',
    'esri/views/SceneView',
    //  Dojo
    'dojo/on',
    'dojo/dom',
    //  Execute on DOM `load`
    'dojo/domReady!'
  ],
  function( Map, SceneView, on, dom ) {

    demo = (function() {

      var guide = dom.byId('guide');

      var animation_time = 2; // in seconds
      function show(e) {
        e.style.display = 'block';
        e.style.animationDuration = animation_time + 's';
        e.style.animationName = 'show';
      }
      function hide(e) {
        e.style.animationDuration = animation_time + 's';
        e.style.animationName = 'hide';
        setTimeout(function(){e.style.display = 'none';}, animation_time * 1000 );
      }

      var steps = [
        // 0
        function(){},
        // 1
        function(){},
      ];

      function start() {
        show(guide);
      }
      function next() {

      }

      return {
        start:start,
        next:next
      };
    })(); // end `demo`

    // create a SceneView instance (for 3D viewing)
    view = new SceneView({
      map: new Map({
        basemap: 'satellite'
      }),
      container: 'map'
    });
    var stillRotate = true;
    var dx = 0.001;
    var ds = 200000;
    var rotate_i = 0;
    var rotate_b = 0;
    var basemapList = ['satellite','topo','national-geographic','dark-gray','oceans','osm','gray'];
    function rotater(coord) {
      view.goTo({center:coord, scale:ds, tilt:-20, heading:26},{animate:true});
      dx += 0.0001;
      ds += 2000;
      coord[0] += dx;
      rotate_i += 1;
      if (rotate_i % 350 === 0) {
        rotate_b += 1; if (rotate_b === basemapList.length) rotate_b = 0;
        view.map.basemap = basemapList[rotate_b];
      }
      if (stillRotate) setTimeout(function(){rotater(coord);},30);
    }
    view.then(function() {
      rotater([-107.4,43]);
    });

  }
);
