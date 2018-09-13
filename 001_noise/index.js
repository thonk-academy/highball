(function( global ) {

    function Ugl( containerId, config ) {
        this.config = config;
        this.domContainer = document.getElementById(containerId);
        this.containers = [];
        this.createDomElements();
        this.createRenderer();
        return this;
    }

    Ugl.prototype.createDomElements = function() {
        var scope = this;
        var id = 'render';

        this.containers[id] = document.createElement('div');

        var width = getElementSize( this.domContainer ).width;
        var height = getElementSize( this.domContainer ).height;

        window.addEventListener( 'resize', function() { scope.onWindowResize(); }, false );

        this.containers[id].style.webkitTouchCallout = 'none';
        this.containers[id].style.webkitUserSelect = 'none';
        this.containers[id].style.khtmlUserSelect = 'none';
        this.containers[id].style.mozUserSelect = 'none';
        this.containers[id].style.msUserSelect = 'none';
        this.containers[id].style.oUserSelect = 'none';
        this.containers[id].style.userSelect = 'none';

        this.containers[id].style.webkitTapHighlightColor = 'transparent';
        this.containers[id].style.height = height + 'px';
        this.containers[id].style.position = 'relative';
        this.containers[id].style.backgroundColor = 'transparent';  // for debugging

        this.domContainer.appendChild( this.containers[id] )
    };

    Ugl.prototype.onWindowResize = function() {
        var containerSize = getElementSize( this.domContainer );
        this.renderer.setSize( containerSize.width, containerSize.height );
    };

    Ugl.prototype.createRenderer = function() {
        var scope = this;

        var width = getElementSize( this.domContainer ).width;
        var height = getElementSize( this.domContainer ).height;

        var uniforms = scope.uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() }
        };
        uniforms.resolution.value.x = width;
        uniforms.resolution.value.y = height;

        var material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById('vertex-shader').textContent,
            fragmentShader: document.getElementById('fragment-shader').textContent
        });

        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );

        var scene = new THREE.Scene();
        scene.add( mesh );

        var camera = new THREE.Camera();
        camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( width, height );
        this.renderer.setClearColor( 'black' );
        this.renderer.render(scene, camera);

        // add webgl canvas renderer to DOM container
        this.containers.render.appendChild( this.renderer.domElement );

        var startTime = Date.now();
        scope.render = function() {
            var elapsedMilliseconds = Date.now() - startTime;
            var elapsedSeconds = elapsedMilliseconds / 1000.;
            scope.uniforms.time.value = elapsedSeconds;
            scope.renderer.render( scene, camera );
        }

        scope.animate = function() {
            requestAnimationFrame( scope.animate );
            scope.render();
        };

        scope.animate();

    }

    Ugl.prototype.setFoo = function( val ) {
        return ( this.foo = val );
    };

    // helper function
    var getElementSize = function( element ) {
        if ( element.getBoundingClientRect != undefined )
            return element.getBoundingClientRect();
        else
            return { width: element.offsetWidth, height: element.offsetHeight };
    }

    // To call constructor wihtout `new`.
    var ugl = function( containerId, config ) {
        return new Ugl( containerId, config );
    };

    global.ugl = ugl;

})( this );

var config = {};

ugl( 'ugl-container', config )
