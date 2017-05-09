/* 
    Object svet
    Vo svete su ulozene policka na mriezke, policok moze byt na jednom mieste na sebe viacero
*/
function World() {
    //rozmery sveta
    this.x = 0;
    this.y = 0;
    this.map = [];
}

/* vytvori svet 
   x - dlzka sveta
   y - sirka sveta
   Na zaciatku je vsade len jedno policko, podlaha
*/
World.prototype.build = function(x,y) {
    this.x = x;
    this.y = y;
    this.map = [];
    //vytvori 3 rozmerne pole, indexujeme y-sirka, x-dlzka, h-vyska
    for (var row=0; row<y; row++) {
        var line = []
        for (var column=0; column<x; column++) {
            line.push([{'type':'ground'}]);
        }
        this.map.push(line);
    }   
    this.syncScene();
}

/* Otazky na svet */

World.prototype.isHole = function(x,y) {
    if (x<0 || x>=this.x || y<0 || y>=this.y) return true;
    return this.map[y][x].length==0;
}

World.prototype.height = function(x,y) {
    if (x<0 || x>=this.x || y<0 || y>=this.y) return -1;
    return this.map[y][x].length-1;
}

World.prototype.isBrick = function(x,y) {
    if (x<0 || x>=this.x || y<0 || y>=this.y) return false;
    var pos = this.map[y][x];
    if (pos.length==0) return false;
    return pos[pos.length-1].type=='brick';
}

World.prototype.isColor = function(x,y,color) {
    if (x<0 || x>=this.x || y<0 || y>=this.y) return false;
    var pos = this.map[y][x];
    if (pos.length==0 || !pos[pos.length-1].hasOwnProperty('color')) return false;
    return pos[pos.length-1].color==color;
}

/* Uprava sveta */

World.prototype.makeHoleAt = function(x,y) {
    if (this.scene != undefined) {
        for (var height=0; height<this.map[y][x].length; height++) {
            this.scene.scene.remove(this.map[y][x][height].mesh);
        }
    }
    this.map[y][x]=[];
}  

World.prototype.clearAt = function(x,y) {
    if (this.scene != undefined) {
        for (var height=0; height<this.map[y][x].length; height++) {
            this.scene.scene.remove(this.map[y][x][height].mesh);
        }
    }
    this.map[y][x]=[{'type':'ground'}];
    this.syncAdd(y,x,this.map[y][x].length-1);
}

World.prototype.putAt = function(x,y,item) {
    this.map[y][x].push(jQuery.extend({}, item)); //prida kopiu objektu na spravne miesto
    this.syncAdd(y,x,this.map[y][x].length-1);
}

World.prototype.takeFrom = function(x,y) {
    var pos = this.map[y][x];
    if (pos.length>1) {
        var obj = pos.pop();  
        if (this.scene != undefined) {
            this.scene.scene.remove(obj.mesh);
            }
    }
}

World.prototype.getFrom = function(x,y) {
    var pos = this.map[y][x];
    if (pos.length>1) {
        var obj = pos[pos.length-1];  
        return obj;
    }
    return {'type':'hole'};
}

World.prototype.colorAt = function(x,y) {
    var pos = this.map[y][x];
    if (pos.length==0 || !pos[pos.length-1].hasOwnProperty('color')) return 'nocolor';
    return pos[pos.length-1].color;
}

/* Nastavi Three.js scenu */
World.prototype.setScene = function(scene) {
    this.clearScene();
    this.scene = scene;
    //materialy pre tehlicky
    this.materials = {
        red: new THREE.MeshLambertMaterial( { color: 0xff0000}),
        green: new THREE.MeshLambertMaterial( { color: 0x00ff00}),
        blue: new THREE.MeshLambertMaterial( { color: 0x0000ff}),
        nocolor: new THREE.MeshLambertMaterial( { color: 0x000000})
    }
    //ak nie je vytvorene mesh-e pre tehlicky, vytvorime ich
    this.syncScene();
}

/* Synchronizuje Three.js scenu, odporuca sa nepouzivat pokial fakt neviete co robite */
World.prototype.syncScene = function() {
    if (this.scene == undefined) return;
    for (var row=0; row<this.y; row++) {
        for (var column=0; column<this.x; column++) {
            for (var height=0; height<this.map[row][column].length; height++) {
                this.syncAdd(row, column, height);
            }
        }
    }
} 

/* Vymaze vsetko z sceny, odporuca sa nepouzivat pokial fakt neviete co robite */
World.prototype.clearScene = function() {
    if (this.scene == undefined) return;
    for (var row=0; row<this.y; row++) {
        for (var column=0; column<this.x; column++) {
            for (var height=0; height<this.map[row][column].length; height++) {
                this.scene.scene.remove(this.map[row][column][height].mesh);
            }
        }
    }
} 

/* Vytvori mesh pre jeden objekt a prida ho do sceny na suradniciach, odporuca sa nepouzivat pokial fakt neviete co robite */
World.prototype.syncAdd = function(row,column,height) {
    if (this.scene != undefined) {
        switch (this.map[row][column][height].type) {
            case 'ground' :                
                this.map[row][column][height].mesh = new THREE.Mesh (this.scene.ground.geometry, this.scene.ground.materials);
            break;
            case 'brick' :
                this.map[row][column][height].mesh = new THREE.Mesh (this.scene.brick.geometry, this.materials[this.map[row][column][height].color]);
            break;
       }
      this.map[row][column][height].mesh.position.set(column,0.1*height,-row);      
      this.map[row][column][height].mesh.receiveShadow = true;
      this.scene.scene.add(this.map[row][column][height].mesh);
   }
}