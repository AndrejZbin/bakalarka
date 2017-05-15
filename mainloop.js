/* informacie o aktualne prehravanej animacii 
   anim - meno animacie
   start - kedy zacala
   end - kedy ma skoncit
*/
function AnimationInfo(anim,start,end) {
    this.anim = anim;
    this.start = start;
    this.end = end;
}
/* Hlavny objekt, ovlada beh prugramu */
function Executor(interpreter) {
    this.interpreter = interpreter;

    this.nextAction = false; //robim nieco teraz
    this.currentAction= false; //mam robit nieco dalej?
    this.steps = false; //krokovanie programu
    this.animSpeed = 1; //rychlost animacie, menej=pomalsie       
    
    this.clock = new THREE.Clock();
    
    this.scene = new Scene(this.interpreter.robot, this.interpreter.world, function() {
        build_button.disabled=false;
        speed_slider.disabled=false;
        var currentTime = Date.now();
        var speed = this.animSpeed;
        this.currentAnimation = new AnimationInfo('standing', currentTime, currentTime + this.interpreter.robot.animationLength('standing')/speed); 
        this.interpreter.robot.playAnimation('standing', speed);
        this.mainLoop();
    }.bind(this));
}

/* Spustenie programu odznova */
Executor.prototype.restart = function() {
    this.currentAction = false;
    this.nextAction = false;
    this.steps = true;
    this.interpreter.robot.stopAnimation(this.currentAnimation.anim);
    var currentTime = Date.now();
    var speed = this.animSpeed;
    this.currentAnimation = new AnimationInfo('standing', currentTime, currentTime + this.interpreter.robot.animationLength('standing')/speed); 
    this.interpreter.robot.playAnimation('standing', speed);
}

/* Automaticke spustenie programu */
Executor.prototype.run = function() {
    this.nextAction = true;
    this.steps = false;
}

/* Pozastavenie programu */
Executor.prototype.pause = function() {
    this.nextAction = false;
    this.steps = true;
}

/* Spustenie dalsieho prikazu */
Executor.prototype.step = function() {
    this.steps = true;
    if(!this.currentAction) this.nextAction = true;
    
}

/* nastavi rychlost animacie, vacsia speed= rychlejsie animacie */
Executor.prototype.setAnimationSpeed = function(speed) {
    this.animSpeed = speed;
    console.log(speed);
}

/* Hlavny loop */
Executor.prototype.mainLoop = function() {
    var currentTime = Date.now();
    var progress = -1;
    //Progress animacie, 0 = zaciatok, 1=koniec 
    if (currentTime>=this.currentAnimation.end) {
        progress=1;
    }
    else progress = (currentTime-this.currentAnimation.start)/(this.currentAnimation.end-this.currentAnimation.start);
    
    //Akcie zavisle od progressu animacie
    switch (this.currentAnimation.anim) {
        case 'step' :
            var robot = this.interpreter.robot;
            var nextpos = robot.nextPos();
            var currentpos = robot.currentPos();
            //treba skocit hore
            if (this.currentAnimation.heightDifference>0) {
                if (progress<0.4) this.interpreter.robot.mesh.position.set(currentpos.x + progress*(nextpos.x-currentpos.x) + 0.5, 0.1*robot.z, -(0.5 + currentpos.y + progress*(nextpos.y-currentpos.y)));
                else this.interpreter.robot.mesh.position.set(currentpos.x + progress*(nextpos.x-currentpos.x) + 0.5, 0.1*(robot.z+this.currentAnimation.heightDifference), -(0.5 + currentpos.y + progress*(nextpos.y-currentpos.y)));
            }
            //treba skocit dole
            else {
                if (progress<0.6) this.interpreter.robot.mesh.position.set(currentpos.x + progress*(nextpos.x-currentpos.x) + 0.5, 0.1*robot.z, -(0.5 + currentpos.y + progress*(nextpos.y-currentpos.y)));
                else this.interpreter.robot.mesh.position.set(currentpos.x + progress*(nextpos.x-currentpos.x) + 0.5, 0.1*(robot.z+this.currentAnimation.heightDifference), -(0.5 + currentpos.y + progress*(nextpos.y-currentpos.y)));
            }
            //animacia konci, update
            if (progress==1) {
                this.interpreter.robot.z+=this.currentAnimation.heightDifference;
                this.interpreter.robot.step();
            }
            this.scene.updateCamera();                 
        break;
        case 'turn' :
            var robot = this.interpreter.robot;
            robot.mesh.rotation.y =  (robot.o+progress)*Math.PI / 2;
            if (progress==1) {
                this.interpreter.robot.turn();
            }
        break;
        case 'pick':
            var robot = this.interpreter.robot;
            var brick = this.interpreter.world.getFrom(robot.x, robot.y);
            var mesh = brick.mesh;
            //zmensujeme tehlicku podla progressu
            mesh.scale.set(1-progress,1-progress,1-progress);
            mesh.position.set(robot.x+progress/2, mesh.position.y, -robot.y-progress/2);
            this.interpreter.robot.mesh.position.set(robot.x+0.5, 0.1*(robot.z-progress), -(0.5 + robot.y));
            if (progress==1) {
                this.interpreter.world.takeFrom(robot.x, robot.y);
                this.interpreter.robot.putBrick(brick.color);
                robot.z--;
            }
            this.scene.updateCamera();
        break;
        case 'put':
            var robot = this.interpreter.robot;
            var brick = this.interpreter.world.getFrom(robot.x, robot.y);
            var mesh = brick.mesh;
            //zvacsujeme tehlicku podla progressu
            mesh.scale.set(progress,progress,progress);
            mesh.position.set(robot.x+(1-progress)/2, mesh.position.y, -robot.y-(1-progress)/2);
            this.interpreter.robot.mesh.position.set(robot.x+0.5, 0.1*(robot.z+progress), -(0.5 + robot.y));
            if (progress==1) {
                robot.z++;
            }
            this.scene.updateCamera();
        break;
    }    
    
    /* ak sa prave dokoncila animacia alebo chceme vykonat novu animaciu ak prebieha len nudna animacia statia
         ak je dalsia akcia len nudne statie, restartujeme
         ak je nejaka nova, zistime aka, ak je zaujimava, zacneme novu, ak nudna, pokracujeme v tej, co sme mali (pokial je step false vzdy bude zaujimava)*/
    if (progress==1 || (!this.currentAction && this.nextAction)) {
        //nemam robit dalsiu akciu, pustime animaciu statia
        if (!this.nextAction) {
            this.currentAction=false;
            var speed = this.animSpeed;
            this.currentAnimation=new AnimationInfo('standing', currentTime, currentTime + this.interpreter.robot.animationLength('standing')/speed);
            this.interpreter.robot.stopAnimation(this.currentAnimation.anim);
            this.interpreter.robot.playAnimation('standing', speed);
        }
        else if (this.nextAction) {
            if (this.steps) this.nextAction=false;
            var newAnim=false;
            var executedCommands = 0;
            do {
                var Range = ace.require("ace/range").Range;
                var range;
                var ret = this.interpreter.next();
                //nastala chyba
                if (ret.error.error) {
                    step_button.disabled=true;
                    pause_button.disabled=true;
                    run_button.disabled=true;
                    //end program with error
                    console.log('Error: ' + ret.error.message);
                    if (ret.command.hasOwnProperty('source')) {
                        range = new Range(ret.command.source.first_line-1,  ret.command.source.first_column, ret.command.source.last_line-1, ret.command.source.last_column );                    
                        editor.deleteMarker();
                        editor.marker = editor.getSession().addMarker(range,"ace_error_command", "text");
                    }
                    this.pause();
                    break;
                }
                else {
                    //zvyraznime kde sme
                    if (ret.command.hasOwnProperty('source')) {
                        range = new Range(ret.command.source.first_line-1,  ret.command.source.first_column, ret.command.source.last_line-1, ret.command.source.last_column );                    
                        editor.deleteMarker();
                        if (!ret.error.warning) editor.marker = editor.getSession().addMarker(range,"ace_selected_word", "text");
                        else editor.marker = editor.getSession().addMarker(range,"ace_warning", "text");
                    }
                }
                //animacie, ktore nie su nudne (resp. existuju)
                if (ret.command.command=='turn' || ret.command.command=='pick' || ret.command.command=='put' || ret.command.command=='step') {
                    newAnim=true;
                    this.currentAction=true;
                     //start new animation
                    var speed = this.animSpeed;                    
                    this.interpreter.robot.stopAnimation(this.currentAnimation.anim);
                    this.currentAnimation=new AnimationInfo(ret.command.command, currentTime, currentTime + this.interpreter.robot.animationLength(ret.command.command)/speed);
                    this.interpreter.robot.playAnimation(ret.command.command, speed);
                    if (ret.command.command=='put') {
                        //pridame tehlicku do sveta
                        this.interpreter.world.putAt(this.interpreter.robot.x, this.interpreter.robot.y, {'type':'brick', 'color':ret.command.color});
                        var mesh = this.interpreter.world.getFrom(this.interpreter.robot.x, this.interpreter.robot.y).mesh;
                        mesh.scale.set(0.00001,0.00001,0.00001);
                        this.interpreter.robot.takeBrick(ret.command.color);
                    }
                    else if (ret.command.command=='step') {
                        var robot = this.interpreter.robot;
                        var world = this.interpreter.world;
                        var currentLocation = robot.currentPos();
                        var nextLocation = robot.nextPos();
                        this.currentAnimation.heightDifference=world.height(nextLocation.x,nextLocation.y)-world.height(currentLocation.x,currentLocation.y);;
                    }
                }
                else if (ret.command.command=='turn-off') {                    
                    //overime splnenie ulohy
                    level.verify(this.interpreter.world, this.interpreter.robot);
                    stop_button.onclick();
                    break;
                }             
                
                executedCommands++;
            } while ((!this.steps && executedCommands<1000 && !newAnim) || !ret.command.hasOwnProperty('source')); //pokracujeme, skoncime, ak mame novu animaciu, alebo ak robime prilis vela alebo krokujeme. Ak command nie je napisany v kode, pokracujeme
            if (!newAnim && progress==1) {
                //animacia statia
                this.currentAction=false;
                var speed = this.animSpeed;               
                this.interpreter.robot.stopAnimation(this.currentAnimation.anim);
                this.currentAnimation=new AnimationInfo('standing', currentTime, currentTime + this.interpreter.robot.animationLength('standing')/speed);
                this.interpreter.robot.playAnimation('standing', speed);
            }
        }
    }  
    this.scene.render();
    this.interpreter.robot.mixer.update(this.clock.getDelta());
    requestAnimationFrame(this.mainLoop.bind(this));
}
