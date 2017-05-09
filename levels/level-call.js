function LevelCallTurnWalkPick() {

}

LevelCallTurnWalkPick.prototype = new Level();

LevelCallTurnWalkPick.prototype.build = function (world_, robot_) {
    world_.build(5,5);
    for (var x=1; x<4; x++) {
        for (var y=1; y<4; y++) {
            world_.makeHoleAt(x,y);
        }
    }
    var r1=Math.floor(Math.random()*4+2), r2=Math.floor(Math.random()*4+2), r3=Math.floor(Math.random()*4+2), r4=Math.floor(Math.random()*4+2);
    for (var i=0; i<r1; i++) world_.putAt(0,0, this.bricks.random());
    for (var i=0; i<r2; i++) world_.putAt(0,4, this.bricks.random());
    for (var i=0; i<r3; i++) world_.putAt(4,0, this.bricks.random());
    for (var i=0; i<r4; i++) world_.putAt(4,4, this.bricks.random());
    robot_.build(4,0,world_.height(4,0)+1,'left', new EmptyBag(), 20, 20);
}

LevelCallTurnWalkPick.prototype.check = function (world_, robot_) {
    if (world_.isBrick(0,0) || world_.isBrick(0,4) || world_.isBrick(4,0) || world_.isBrick(4,4)) return {correct:false, message:'Robot nepozbieral všetky zafarbené tehličky'};
    return {correct:robot_.x==4 && robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelCallTurnWalkPick.prototype.taskHTML = `
    Robota môžeme naučiť aj vlastné príkazy. Napríklad vieme, že robot sa vie otáčať len doľava. Ak chceme, aby sa otočil doprava, musíme použiť príkaz OTOC trikrát <br>
    To budeme v skutočnosti robiť aj teraz, ale nebudeme musieť zakaždým písať trikrát OTOC, ale jednoducho vytvoríme príkaz OTOCDOPRAVA, ktorý to spraví za nás. Vyzerá to takto:<br>
    PRIKAZ OTOCDOPRAVA {<br>
    dolava dolava dolava<br>
    }<br>
    Teraz ak chceme, aby sa robot otočil doprava, stačí použiť príkaz OTOCDOPRAVA.<br><br>
    Vytvor si príkazy, ktoré otočia robota doprava, pohnú robota o 4 políčka dopredu a prikážu robotovi zdvihnúť všetky políčka, na ktorých stojí. Potom ich použi na vyriešenie úlohy.<br>
    Cieľom úlohy prejsť po obvode štvorca so stranou 5 políčok, pozbierať všetky tehličky, ktoré sa nachádzajú vo vrcholoch, a vrátiť robota na miesto, kde začínal.
`;

function LevelCallGetOver() {

}

LevelCallGetOver.prototype = new Level();

LevelCallGetOver.prototype.build = function (world_, robot_) {
    world_.build(10,1);
    for (var i=0; i<10; i++) {
        var r=Math.floor(Math.random()*7);
        for (var j=0; j<r; j++) world_.putAt(i,0,this.bricks.red);
    }
    world_.putAt(9,0,this.bricks.green);
    robot_.build(0,0,world_.height(0,0)+1,'right', new InfinityColorBag(true,false,false), 0, 0);
}

LevelCallGetOver.prototype.check = function (world_, robot_) {
    if (world_.isColor(7,0,this.bricks.green.color)) return {correct:false, message:'Robot nestojí na zelenej tehličke, kam zmizla?'};
    return {correct:robot_.x==9 && robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelCallGetOver.prototype.taskHTML = `
    Túto úlohu si už riešil. Dostaň robota na zelenú tehličku. V tejto úlohe môžeš položiť hocikoľko červených tehličiek, ine tehličky položiť nemôžeš. Robot v tejto úlohe nevie skákať, vie prejsť iba na políčko v rovnakej výške, ako je on.<br>
    Na zelenú tehličku sa dostaneš tak, že pokiaľ nestojíš na zelenej tehličke spraviš krok dopredu. Pokiaľ robot nemôže spraviť krok dopredu, pretože je tam jama alebo stena, zariaď, aby mohol. Nezabudni, že na farbu tehličky sa môžeš pýtať len ak robot na nejakej stojí.<br>
    Vytvor si vlastný príkaz vyrovnaj, ktorý dostane robota do rovnakej výšky ako je políčko, na ktoré chce robot prejsť.
`;