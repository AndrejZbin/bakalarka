/* Scena, nacita a zobrazi svet a robota 
    robot -
    world -
    startFunction - funkcia, ktora sa zavola po nacitani vsetkeho */
function Scene(robot, world, startFunction) {
    this.robot = robot;
    this.world = world;
    this.startFunction = startFunction;
    this.scene = new THREE.Scene();
    this.skyBoxScene = new THREE.Scene();
    
    //Kamera
    this.camera = new THREE.PerspectiveCamera( 45, $('#world-container').width() / $('#world-container').height(), 0.1, 1000 );
    this.camera.position.set(0,5,5);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.scene.add(this.camera);
    
    //svetla
    var ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(ambientLight);
       
    this.topLight =  new THREE.PointLight(0xFFFFFF);
    this.topLight.position.set((world.x+1)/2, 100, 20, -(world.y+1)/2);

    this.scene.add(this.topLight);
    
    var loader = new THREE.JSONLoader();
    this.brick={loaded:false};
    this.ground={loaded:false};
    this.robot.loaded=false;
    loader.load('models/brick.json', function ( geometry, materials ) {
        this.brick.geometry = geometry;
        this.brick.materials = materials;
        this.brick.loaded=true;
        this.onFinishLoading();               

    }.bind(this));
    loader.load('models/ground.json', function ( geometry, materials ) {
        this.ground.geometry = geometry;
        this.ground.materials = materials;
        this.ground.loaded=true;
        this.onFinishLoading();        
    }.bind(this));
    loader.load('models/robot.json', function ( geometry, materials ) {
        this.robot.geometry = geometry;
        this.robot.materials = materials;
        this.robot.createMesh(this.scene);
        this.robot.loaded=true;
        this.onFinishLoading();        
    }.bind(this));
    //nacita skybox, teraz viacmenej zbytocne, ale funguje pekne pri otacani kamery
    var urls = [ 'skybox/arrakisday_ft.jpg', 'skybox/arrakisday_bk.jpg',
        'skybox/arrakisday_up.jpg', 'skybox/arrakisday_dn.jpg',        
        'skybox/arrakisday_rt.jpg',         'skybox/arrakisday_lf.jpg'
         ];
    var textureCube = new THREE.CubeTextureLoader().load( urls, function(texture) {
        shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = texture;
        
      var shaderMaterial = new THREE.ShaderMaterial( {

            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });        
        this.skyBox = new THREE.Mesh( new THREE.BoxGeometry( 50, 50, 50 ), shaderMaterial );
        this.skyBoxScene.add(this.skyBox);
        this.camera.add(this.skyBox);
        this.skyBox.position.y=-8;
    }.bind(this));

           
}

/* Zavola sa, ked sa nieco nacitalo. Overi, ci je vsetko nacitane a ak ano, spravi potrebne veci */

Scene.prototype.onFinishLoading = function() {
    if (this.brick.loaded && this.ground.loaded && this.robot.loaded) {
        this.container = document.getElementById('world-container'); 
      
        this.stats = new Stats();    
        this.container.appendChild(this.stats.domElement);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });        
        this.renderer.setClearColor( 0xffffff );
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled=true;

        this.renderer.setSize($('#world-container').width(), $('#world-container').height());
        this.container.appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
        this.world.setScene(this);
        this.updateCamera();
        this.startFunction();
    }
}

/* Nastala zmena velkosti okna */
Scene.prototype.onWindowResize = function() {
    this.camera.aspect = $('#world-container').width() / $('#world-container').height();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize($('#world-container').width(), $('#world-container').height());
}

/* Update kamery, nieco sa pohlo (mozno pouzit follow ako pri skyboxe?) */
Scene.prototype.updateCamera = function() {
    if (this.robot.loaded) {
        this.camera.position.set(robot.mesh.position.x,robot.mesh.position.y+3, robot.mesh.position.z+5);
        this.camera.lookAt(new THREE.Vector3(robot.mesh.position.x,robot.mesh.position.y+1, robot.mesh.position.z)); 
    }
}

/* Hlavny render */
Scene.prototype.render = function() {
    this.renderer.clear();                     
    this.renderer.render( this.skyBoxScene, this.camera );
    this.renderer.clearDepth();       //vykreslujeme vsetko pred skyboxom
    this.renderer.render( this.scene, this.camera );
    this.stats.update();
    }