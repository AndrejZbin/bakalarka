function LevelRecursionStairs() {

}

LevelRecursionStairs.prototype = new Level();

LevelRecursionStairs.prototype.build = function (world_, robot_) {
    world_.build(5,1);
    robot_.build(4,0,1,'left', new Bag(), 10, 10);
    for (var i=0; i<10; i++) robot_.putBrick(this.bricks.red.color);
}

LevelRecursionStairs.prototype.check = function (world_, robot_) {
    correct=(world_.height(0,0)==0);
    for (var i=1; i<5; i++) {
        if (world_.height(i,0)-1!=world_.height(i-1,0)) {
            correct=false;
            break;
        }
    }
    if (!correct) return {correct:false, message:'Schody nie sú postavené správne'};
    return {correct:robot_.x==0, message:'Robot nestojí na správnom mieste'};
}

LevelRecursionStairs.prototype.taskHTML = `    
    Robot má pri sebe 10 červených tehličiek. Chcel by postaviť schody<br>
    Tam, kde robot začína, nepoložíme žiadnu tehličku. <br>
    Na druhom políčku má byť položená jedna zafarbená tehlička. <br>
    Na nasledujúcom 2 potom 3 a nakoniec 4 zafarbené tehličky. <br>
    Pomôž robotovi postaviť schody. <br>
    Vytvor si prikaz poschodie(cislo-n), pomocou ktorého robot vytvorí celé schody. Celé schody vytvorí pomocou neho tak, že spraví príkaz poschodie s parametrom 4.<br>
    V tomto príkaze postav jedno poschodie a potom znova použi príkaz poschodie ale s parametrom a jedna menším. Ale iba ak je tento parameter väčší ako 0.<br>
    Robot vie prejsť na ďalšie políčko len pokiaľ musí vykočiť najviac o 1 tehličku vyššie alebo zoskočiť najviac o 1 tehličku nižšie. Preto budeš musieť stavať poschodia schodov postupne<br>
    Nakoniec postav robota dole pred schody.<br>
    
`;

function LevelRecursionWalk() {

}

LevelRecursionWalk.prototype = new Level();

LevelRecursionWalk.prototype.build = function (world_, robot_) {
    world_.build(11,9);
    world_.makeHoleAt(0,8); world_.makeHoleAt(1,8); world_.makeHoleAt(2,8); world_.makeHoleAt(3,8); world_.makeHoleAt(4,8); world_.makeHoleAt(5,8); world_.makeHoleAt(6,8); world_.makeHoleAt(8,8); world_.makeHoleAt(9,8); world_.makeHoleAt(10,8);
    world_.makeHoleAt(0,7); world_.makeHoleAt(1,7); world_.makeHoleAt(3,7); world_.makeHoleAt(4,7); world_.makeHoleAt(5,7); world_.makeHoleAt(10,7);
    world_.makeHoleAt(5,6); world_.makeHoleAt(6,6); world_.makeHoleAt(8,6); world_.makeHoleAt(10,6);
    world_.makeHoleAt(1,5); world_.makeHoleAt(3,5); world_.makeHoleAt(4,5); world_.makeHoleAt(5,5); world_.makeHoleAt(8,5);
    world_.makeHoleAt(0,4); world_.makeHoleAt(1,4); world_.makeHoleAt(5,4); world_.makeHoleAt(7,4); world_.makeHoleAt(8,4); world_.makeHoleAt(10,4);
    world_.makeHoleAt(0,3); world_.makeHoleAt(1,3); world_.makeHoleAt(2,3); world_.makeHoleAt(4,3); world_.makeHoleAt(5,3); world_.makeHoleAt(7,3);
    world_.makeHoleAt(0,2); world_.makeHoleAt(7,2); world_.makeHoleAt(8,2); world_.makeHoleAt(9,2); world_.makeHoleAt(10,2);   
    world_.makeHoleAt(0,1); world_.makeHoleAt(1,1); world_.makeHoleAt(2,1); world_.makeHoleAt(4,1); world_.makeHoleAt(6,1); world_.makeHoleAt(7,1); world_.makeHoleAt(8,1); world_.makeHoleAt(9,1); world_.makeHoleAt(10,1);
    world_.makeHoleAt(0,0); world_.makeHoleAt(1,0); world_.makeHoleAt(2,0); world_.makeHoleAt(4,0); world_.makeHoleAt(6,0); world_.makeHoleAt(7,0); world_.makeHoleAt(8,0); world_.makeHoleAt(9,0); world_.makeHoleAt(10,0);
    for (var x=0; x<11; x++) for (var y=0; y<9; y++) if (!world_.isHole(x,y)) world_.putAt(x,y, this.bricks.random());
    robot_.build(5,0,world_.height(5,0)+1,'up', new EmptyBag, 1, 1);
}

LevelRecursionWalk.prototype.check = function (world_, robot_) {
    for (var x=0; x<11; x++) for (var y=0; y<9; y++) if (world_.isBrick(x,y)) return {correct:robot_.x==0, message:'Robot nepozbieral všetky tehličky'};
    return {correct:robot_.x==5 && robot_.y==0, message:'Robot nestojí na správnom mieste'};
}

LevelRecursionWalk.prototype.taskHTML = `    
    Pozbieraj všetky techličky, použi rekurziu. Vráť sa na miesto, kde začínaš.  
`;