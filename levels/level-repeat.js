function LevelRepeatStep() {

}

LevelRepeatStep.prototype = new Level();

LevelRepeatStep.prototype.build = function (world_, robot_) {
    world_.build(1,11);
    robot_.build(0,10,1,'down', new EmptyBag(), 10, 10);
}

LevelRepeatStep.prototype.check = function (world_, robot_) {
    return {correct:robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelRepeatStep.prototype.taskHTML = `
    Robot by sa chcel pohnúť o 10 políčok dopredu. Jedna možnosť, ako to spraviť, je 10x napísať príkaz KROK<br>
    Písať však 10x KROK by nám však trvalo dlho. Vieme to však spraviť jednoduchšie a hlavne rýchlejšie.<br>
    Pomôže nám príkaz OPAKUJ. Za tento príkaz napíšeme, koľkokrát chceme, aby robot vykonal príkaz. <br>
    Napríklad OPAKUJ 4 ZOBER by prikázalo robotovi zobrať 4 zafarbené tehličky zo zeme. <br>
    Dostaň robota o 10 políčok dopredu.
`;

function LevelRepeatStepPlace() {

}

LevelRepeatStepPlace.prototype = new Level();

LevelRepeatStepPlace.prototype.build = function (world_, robot_) {
    world_.build(1,6);
    for (var i=0; i<5; i++) world_.putAt(0,i, this.bricks.blue);
    robot_.build(0,0,2,'up', new EmptyBag(), 10, 10);
}

LevelRepeatStepPlace.prototype.check = function (world_, robot_) {
    for (var i=0; i<5; i++) if (world_.isBrick(0,i)) return {correct:false, message:'Robot nepozbieral vŠetky zafarbené tehličky'};
    return {correct:robot_.y==5, message:'Robot sa nenachádza na správnom mieste'};
}

LevelRepeatStepPlace.prototype.taskHTML = `
    Pomocou príkazu OPAKUJ môžeme robotovi príkázať vykonať aj viacej príkazov. Stačí, keď všetky príkazy, ktoré chceme aby robot opakoval dáme medzi zátvorky { a }<br>
    Napríklad ak chceme, aby robot 5x zobral zafarbené tehličky zo zeme a potom ho hneď položil naspäť, môžeme napísať OPAKUJ 5 {ZOBER POLOZ CERVENA}<br>
    V tejto úlohe musí robot spraviť 5 krokov dopredu, ale predtým, ako spraví krok, musí zo zeme zobrať jednu zafarbenú tehličku.
`;

function LevelRepeatStepRepeatPlace() {

}

LevelRepeatStepRepeatPlace.prototype = new Level();

LevelRepeatStepRepeatPlace.prototype.build = function (world_, robot_) {
    world_.build(1,6);
    for (var i=0; i<5; i++) for (var j=0; j<3; j++) world_.putAt(0,i, this.bricks.blue);
    robot_.build(0,0,4,'up', new EmptyBag(), 20, 20);
}

LevelRepeatStepRepeatPlace.prototype.check = function (world_, robot_) {
    for (var i=0; i<5; i++) if (world_.isBrick(0,i)) return {correct:false, message:'Robot nepozbieral vŠetky zafarbené tehličky'};
    return {correct:robot_.y==5, message:'Robot sa nenachádza na správnom mieste'};
}

LevelRepeatStepRepeatPlace.prototype.taskHTML = `
    Podobná úloha ako predchádzajúca.<br>
    V tejto úlohe musí robot spraviť 5 krokov dopredu, ale predtým, ako spraví krok, musí zo zeme zobrať až tri zafarbené tehličky.<br>
    Použi OPAKUJ
`;

function LevelRepeatStepTurn() {

}

LevelRepeatStepTurn.prototype = new Level();

LevelRepeatStepTurn.prototype.build = function (world_, robot_) {
    world_.build(4,4);
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (x!=3 && y!=0 && y!=3) world_.makeHoleAt(x,y);
        }
    }
    world_.putAt(0,3, this.bricks.red);
    robot_.build(0,0,1,'right', new Bag(), 20, 20);
}

LevelRepeatStepTurn.prototype.check = function (world_, robot_) {
    if (!world_.isBrick(0,3)) return {correct:false, message:'Robot ukradol červenú tehličku'};
    return {correct:robot_.x==0 && robot_.y==3, message:'Robot sa nenachádza na správnom mieste'};
}

LevelRepeatStepTurn.prototype.taskHTML = `
    V tejto úlohe musí robot presť na červenú tehličku <br>
    Dostaň robota na zafarbenú tehličku. Skús napísať každý z príkazov KROK a OTOC len raz.
`;

function LevelRepeatStepPlaceTurn() {

}

LevelRepeatStepPlaceTurn.prototype = new Level();

LevelRepeatStepPlaceTurn.prototype.build = function (world_, robot_) {
    world_.build(4,4);
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (x!=0 && x!=3 && y!=0 && y!=3) world_.makeHoleAt(x,y);
            else {world_.putAt(x,y, this.bricks.blue); world_.putAt(x,y, this.bricks.red);}
        }
    }
    robot_.build(0,0,3,'right', new EmptyBag(), 20, 20);
}

LevelRepeatStepPlaceTurn.prototype.check = function (world_, robot_) {
    for (var x=0; x<4; x++) {
        for (y=0; y<4; y++) {
            if (world_.isBrick(x,y)) return {correct:false, message:'Robot nepozbieral všetky zafarbené tehličky'};
        }
    } 
    return {correct:robot_.x==0 && robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelRepeatStepPlaceTurn.prototype.taskHTML = `
    V tejto úlohe musí robot spraviť presť po okruhu a pozbierať všetky zafarbené tehličky. Zastaviť sa musí tam, kde začínal. <br>
    Môže sa rozhodnúť, že predtým, ako spraví krok, zoberie len jednu zafarbenú tehličku. V tom prípadne však musí spraviť až 2 okruhy. <br>
    Alebo pred každým krokom zoberie oboje tehličky. Riešenie je na tebe. Nezabudni použiť príkaz OPAKUJ.<br>
    Skús napísať každý z príkazov KROK, ZOBER a OTOC len raz.
`;