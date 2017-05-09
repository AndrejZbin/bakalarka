/* Robot */
function Robot() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.o = 0;
    this.bag = new Bag(); 
    this.maxjumpup = 1;
    this.maxjumpdown = 1;
}

/* Nastavi robota
   x - suradnica vo svete
   y - suradnica vo svete
   z - vyska, v ktorej sa nachadza
   o - orientacia, text
   bag - taska na tehlicka typu Bag
   maxjumpup - kolko moze skocit hore
   maxjumpdown - kolko moze skocit dole
*/
Robot.prototype.build = function(x,y,z,o,bag,maxjumpup,maxjumpdown){
    this.x = x;
    this.y = y;
    this.z = z;
    switch (o.toLowerCase()) {
        case 'right' : 
            this.o=0;
        break;
        case 'up' : 
            this.o=1;
        break;
        case 'left' : 
            this.o=2;
        break;
        case 'down' : 
            this.o=3;
        break;
        default:
            this.o=0;
        break;
    }
    this.bag = bag;
    this.maxjumpup = maxjumpup;
    this.maxjumpdown = maxjumpdown;
    if (this.hasOwnProperty('mesh')) {
        this.mesh.position.set(this.x+0.5, 0.1*this.z, -this.y-0.5);
        this.mesh.rotation.y = this.o*Math.PI / 2;
    }
}
/* Vrati, kam by sa robot pohol, keby spravi krok */
Robot.prototype.nextPos = function(){
     switch (this.o) {
        case 0 : 
            return {'x':this.x+1, 'y': this.y};
        break;
        case 1 : 
            return {'x':this.x, 'y': this.y+1};
        break;
        case 2 : 
            return {'x':this.x-1, 'y': this.y};
        break;
        case 3 : 
            return {'x':this.x, 'y': this.y-1};
        break;
    }
}

/* Aktualna pozicia robota */
Robot.prototype.currentPos = function(){
     return {'x':this.x, 'y': this.y};
}

/* Posunie robota o policko dopredu */
Robot.prototype.step = function() {
    var nextpos = this.nextPos();
    this.x = nextpos.x;
    this.y = nextpos.y;
}

/* Otoci robota dolava */
Robot.prototype.turn = function() {
    this.o = (this.o+1)%4;
    if (this.mesh!=undefined) this.mesh.rotation.y = this.o*Math.PI / 2;
}

/* Otazky na robota */

Robot.prototype.isFacing = function(o) {
    return this.o==o;
}

Robot.prototype.hasBrick = function() {
    return this.bag.hasBrick();
}

Robot.prototype.hasColor = function(color) {
    return this.bag.hasColor(color);
}

Robot.prototype.takeBrick = function(color) {
    this.bag.takeBrick(color);
}

Robot.prototype.putBrick = function(color) {
    this.bag.putBrick(color);
}

/* Vytvory mesh a prida ho do sceny scene */

Robot.prototype.createMesh = function(scene) {
    this.mesh = new THREE.Mesh (this.geometry, this.materials);
    this.mesh.position.set(this.x+0.5, 0.1*this.z, -this.y-0.5);
    this.mesh.rotation.y = this.o*Math.PI / 2;
    this.mesh.castShadow = true;
    scene.add(this.mesh);
    
}

/* Animacie, su v geometry */

Robot.prototype.animationLength = function(anim) {
    return 500;
}

Robot.prototype.playAnimation = function(anim, speed) {
    console.log('new anim started: ' + anim); 
}

Robot.prototype.stopAnimation = function(anim) {

}