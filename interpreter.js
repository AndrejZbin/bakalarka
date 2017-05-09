/*
    Interpreter spusta program
*/
function Interpreter(robot, world) {
    //globalne premmenne
    this.numvars = {};
    this.boolvars = {};
    this.colorvars = {};
    this.rotationvars = {};
    
    //stack, obsahuje objekty typu StackFrame
    this.stack = [];
    
    //robot a svet, Interpreter ich nemodifikuje
    this.robot = robot;
    this.world = world;
    
    //uklada informacie o chybach alebo varovaniach, ktore nastali pocas behu programu
    this.error = {error:false, warning:false, message:''};
}
/* Vytvori sa pri volani funkcie(vlastneho prikazu) v programe
   subroutine - cast kodu programu
   params - parametre
   error - odovzdanie informacii o chybe interpreteru
*/
function StackFrame (subroutine, params, error) {
    //index prikazu, na ktorom sa aktualne nachadzame
    this.i = 0;
    
    //pole prikazov
    this.commands = subroutine.commands;
    
    //lokalne premenne
    this.numvars = {};
    this.boolvars = {};
    this.colorvars = {};
    this.rotationvars = {};
    
    //pocitadlo pre prikaz opakuj, klucom je index prikazu, hodnotou pocet opakovani
    this.repeats = {};
    
    //nezhoduje sa pocet parametrov
    if (subroutine.params.length != params.length) {
        error.error=true;
        error.message='Zly pocet parametrov';
    }
    else {
        // prejdeme cez vsetky parametre, vytvorime lokalne premenne
        for (var index=0; index<subroutine.params.length; index++) {
            //nezhoduje sa typ
            if (params[index].type!=subroutine.params[index].type) {
                error.error=true;
                error.message='Nespravny typ parametrov';
            }
            //podla typu vytvorime lokalnu premennu
            switch (params[index].type) {
                case 'number' :
                    this.numvars[subroutine.params[index].value]=params[index].value;
                break;
                case 'bool' :
                    this.boolvars[subroutine.params[index].value]=params[index].value;
                break;
                case 'color' :
                    this.colorvars[subroutine.params[index].value]=params[index].value;
                break;
                case 'rotation' :
                    this.rotationvars[subroutine.params[index].value]=params[index].value;
                break;
            }
        }
    }
}

/* vrati prikaz, na ktorom sa aktualne nachadzame */
StackFrame.prototype.currentCommand = function() {
    //nemalo by nastat
    if (this.i>=this.commands.length) {        
        return {'command':'return'};
        }
    return this.commands[this.i];
}

/* Nacitanie kodu programu
    code - kod programu 
*/
Interpreter.prototype.loadProgram = function(code) {
    /* funkcia volana pri chybe parsovania, chceme zvyraznit, kde nastala chyba, parser to pravdepodobne neumoznuje */
    parser.yy.parseError = function(message,details) {
          //console.log(message);
          //chybova hlaska je string, v ktorom je vypisane cislo riadku. Je to prve cislo v tejto hlaske
          throw message.match(/\d+/)[0];
    }
    try {
        this.parsedCode = parser.parse(code);
        this.restart();
        editor.deleteMarker();
        return true;
    }
    //nastala chyba, error je cislo riadku, kde chyba nastala, zvyraznime tento riadok
    catch (error) {
        var Range = ace.require("ace/range").Range;
        var line = parseInt(error)-1;
        console.log('line ' + error);
        range = new Range(line,  0, line, 1000);  
        editor.deleteMarker();
        editor.marker = editor.getSession().addMarker(range,"ace_error_command", "fullLine");
        return false;
    }
}
/* Spusti program odznova */
Interpreter.prototype.restart = function() {
    this.numvars = {};
    this.boolvars = {};
    this.colorvars = {};
    this.rotationvars = {};
    this.stack = [];
    this.error = {error:false, message:''};
    
    /* na stacku mame len main */
    this.stack.push(new StackFrame(this.parsedCode['__main__'],[],this.error));
    
    /* nastavime globalne premmenne */
    for (var i=0; i<this.parsedCode['__globalvars__'].length; i++) {
        var command = this.parsedCode['__globalvars__'][i];    
        switch (command.command) {
            case 'assign-number' :
                this.numvars[command.name]=command.value(this);
            break;            
            case 'assign-bool' :
                this.boolvars[command.name]=command.value(this);
            break;
            case 'assign-color' :
                this.colorvars[command.name]=command.value(this);
            break;
            case 'assign-rotation' :
                this.rotationvars[command.name]=command.value(this);
            break;
        }
    }
}

/* Zistenie hodnoty lokalnej premmenej typu cislo*/
Interpreter.prototype.getVarNumber = function(name) {
    if (this.stack[this.stack.length-1].numvars.hasOwnProperty(name)) return this.stack[this.stack.length-1].numvars[name];
    else return this.getGlobalVarNumber(name); //neexistuje, vratime globalnu
}

/* Zistenie hodnoty lokalnej premmenej typu pravdivost*/
Interpreter.prototype.getVarBool = function(name) {
    if (this.stack[this.stack.length-1].boolvars.hasOwnProperty(name)) return this.stack[this.stack.length-1].boolvars[name];
    else return this.getGlobalVarBool(name); //neexistuje, vratime globalnu
}

/* Zistenie hodnoty lokalnej premmenej typu farba*/
Interpreter.prototype.getVarColor = function(name) {
    if (this.stack[this.stack.length-1].colorvars.hasOwnProperty(name)) return this.stack[this.stack.length-1].colorvars[name];
    else return this.getGlobalVarColor(name); //neexistuje, vratime globalnu
}

/* Zistenie hodnoty lokalnej premmenej typu smer*/
Interpreter.prototype.getVarRotation = function(name) {
    if (this.stack[this.stack.length-1].rotationvars.hasOwnProperty(name)) return this.stack[this.stack.length-1].rotationvars[name];
    else return this.getGlobalVarRotation(name); //neexistuje, vratime globalnu
}

/* Zistenie hodnoty globalne premmenej typu cislo*/
Interpreter.prototype.getGlobalVarNumber = function(name) {
    if (this.numvars.hasOwnProperty(name)) return this.numvars[name];
    else {
        this.error.warning = true;
        return 0; //default hodnota
    }
}

/* Zistenie hodnoty globalne premmenej typu pravdivost*/
Interpreter.prototype.getGlobalVarBool = function(name) {
    if (this.boolvars.hasOwnProperty(name)) return this.boolvars[name];
    else {
        this.error.warning = true;
        return false; //default hodnota
    }
}

/* Zistenie hodnoty globalne premmenej typu farba*/
Interpreter.prototype.getGlobalVarColor = function(name) {
    if (this.colorvars.hasOwnProperty(name)) return this.colorvars[name];
    else {
        this.error.warning = true;
        return 'red'; //default hodnota
    }
}

/* Zistenie hodnoty globalne premmenej typu smer*/
Interpreter.prototype.getGlobalVarRotation = function(name) {
    if (this.rotationvars.hasOwnProperty(name)) return this.rotationvars[name];
    else {
        this.error.warning = true;
        return 0; //default hodnota
    }
}

/* Otazky na robota a svet */

Interpreter.prototype.isHole = function() {
    var robotnextpos = this.robot.nextPos();
    return this.world.isHole(robotnextpos.x, robotnextpos.y);
}

Interpreter.prototype.isCliff = function() {
    var robotnextpos = this.robot.nextPos();
    var delta = -this.world.height(robotnextpos.x, robotnextpos.y) + this.world.height(this.robot.x, this.robot.y);
    return delta>this.robot.maxjumpdown;
}

Interpreter.prototype.isWall = function() {
    var robotnextpos = this.robot.nextPos();
    var delta = this.world.height(robotnextpos.x, robotnextpos.y) - this.world.height(this.robot.x, this.robot.y);
    return delta>this.robot.maxjumpup;
}

Interpreter.prototype.isFree = function() {
    return (!this.isWall() && !this.isCliff() && !this.isHole());
}

Interpreter.prototype.isBrick = function() {
    return this.world.isBrick(this.robot.x, this.robot.y);
}

Interpreter.prototype.isColor = function(color) {
    if (!this.world.isBrick(this.robot.x, this.robot.y)) {
        this.error.error=true;
        this.error.message='Policko nema tehlu';
    }
    return this.world.isColor(this.robot.x, this.robot.y, color(this));
}

Interpreter.prototype.hasBrick = function() {
    return this.robot.hasBrick();
}

Interpreter.prototype.hasColor = function(color) {
    return this.robot.hasColor(color(this));
}

Interpreter.prototype.height = function() {
    return this.world.height(this.robot.x, this.robot.y);
}

Interpreter.prototype.facing = function(o) {
    return this.robot.isFacing(o(this));
}

/* prejde na dalsi prikaz */
Interpreter.prototype.next = function() {
    // vynulujeme, ak nastal konflikt predtym, bol nejako spracovany, my mozme pokracovat dalej, netrapi nas, co sa dialo so svetom alebo robotom
    this.error.warning=false;
    this.error.error=false;
    
    //koniec programu
    if (this.stack.length==0) return {'command':{'command':'turn-off'}, error:this.error};
    //execution frame na vrchu zasobnika
    var frame = this.stack[this.stack.length-1];
    var command = frame.currentCommand();
    //spracujeme prikaz, na ktorom sme
    switch (command.command) {
        case 'return' : 
            this.stack.pop(); //koniec funkcie, vymazeme jej execution frame
        break
        case 'turn-off' :
            this.stack = []; //koniec programu
        break;
        case 'step' :
            if (!this.isFree()) {
                this.error.error=true;
                this.error.message='Robot sa nemoze pohnut';
            }
            frame.i++;
        break;
        case 'turn' :
            frame.i++;
        break;
        case 'pick' :
            if (!this.isBrick()) {
                this.error.error=true;
                this.error.message='Robot nema co zdvihnut';
            }
            frame.i++;
        break;
        case 'put' :
            if (!this.hasColor(command.value)) {
                this.error.error=true;
                this.error.message='Robot nema co polozit';                
            }
            command.color=command.value(this);
            frame.i++;
        break;
        case 'assign-number' :
            if (command.global) {
                //globalna premenna musi existovat
                if (this.numvars.hasOwnProperty(command.name)) this.numvars[command.name]=command.value(this);
                else {                
                    this.error.error=true;
                    this.error.message='Premenna neexistuje';
                }
            }
            else frame.numvars[command.name]=command.value(this);
            frame.i++;
        break;
        case 'assign-bool' :
            if (command.global) {
                //globalna premenna musi existovat
                if (this.boolvars.hasOwnProperty(command.name)) this.boolvars[command.name]=command.value(this);
                else {                this.error.error=true;
                this.error.message='Premenna neexistuje';}
            }
            else frame.boolvars[command.name]=command.value(this);
            frame.i++;
        break;
        case 'assign-color' :
            if (command.global) {
                //globalna premenna musi existovat
                if (this.colorvars.hasOwnProperty(command.name)) this.colorvars[command.name]=command.value(this);
                else {this.error.error=true;
                this.error.message='Premenna neexistuje';}
            }
            else frame.colorvars[command.name]=command.value(this);
            frame.i++;
        break;
        case 'assign-rotation' :
            if (command.global) {
                //globalna premenna musi existovat
                if (this.rotationvars.hasOwnProperty(command.name)) this.rotationvars[command.name]=command.value(this);
                else {this.error.error=true;
                this.error.message='Premenna neexistuje';}
            }
            else frame.rotationvars[command.name]=command.value(this);
            frame.i++;
        break;
        case 'jump' :
            frame.i+=command.value;
        break;
        case 'break' :
            frame.i+=frame.commands[frame.i+command.value].end;
        break;
        case 'if' :
            if(!command.value(this)) frame.i+=command['else']; //podmienka nesplnena, skocime do else bloku
            else frame.i++;
        break;
        case 'while' :
            if(!command.value(this)) frame.i+=command.end; //podmienka nesplnena, skocime za while blok
            else frame.i++;
        break;
        case 'repeat' :
            //ak sme tu prvykrat, resp. ak uz bol tento repeat predtyp dokonceny
            if (!frame.repeats.hasOwnProperty(frame.i) || frame.repeats[frame.i]==-2) {
                if (command.infinite) frame.repeats[frame.i]=-1; //nekonecne repeat, pocitadlo bude -1
                else frame.repeats[frame.i]=Math.max(0, command.value(this)); //zaporne zmenime na 0
            }
            if (frame.repeats[frame.i]>0) { //repeat pokracuje
                frame.repeats[frame.i]--;
                frame.i++;
            }
            else if (frame.repeats[frame.i]==-1) frame.i++; //infinite loop
            else {
                //repeat je dokonceny, prejdime na koniec
                frame.repeats[frame.i]=-2; 
                frame.i+=command.end;
            }
        break;
        case 'while' :
            if(!command.value(this)) frame.i+=command.end;
            else frame.i++;
        break;
        case 'call' :
            //parametre vypocitame pri volani funkcie
            params = [];
            for (var i=0; i<command.params.length; i++) {
                params.push({'type': command.params[i].type,'value':command.params[i].value(this)});
            }
            //volanie neexistujucej funkcie
            if (!this.parsedCode.hasOwnProperty(command.value)) {
                this.error.error=true;
                this.error.message='Prikaz neexistuje';
            }
            //vytvorime novy execution frame a pridame ho na vrch zasobnika
            else this.stack.push(new StackFrame(this.parsedCode[command.value], params, this.error));
            frame.i++;
        break;
        default:
            //zabudnuty prikaz :|
            this.error.error=true;
            this.error.message='Nieco sa velmi pokazilo ' + command.command;
            frame.i++;
        break;
    }
    //console.log(command.command);
    return {command:command, error:this.error};
}