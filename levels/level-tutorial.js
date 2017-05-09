function LevelTutorialStep() {

}

LevelTutorialStep.prototype = new Level();

LevelTutorialStep.prototype.build = function (world_, robot_) {
    world.build(2,1);
    robot.build(0,0,1,'right', new EmptyBag(), 1, 1);
}

LevelTutorialStep.prototype.check = function (world_, robot_) {
    return {correct:robot_.x==1, message:'Robot sa nenachádza na správnom políčku'};
}

LevelTutorialStep.prototype.taskHTML = `
    Robotovi môžeš zadávať rôzne príkazy. Prvý príkaz, ktorý vyskúšame, je príkaz KROK. Úloha je jednoduchá, dostaň robota na políčko pred ním.<br>
    Daj si pozor, aby si spravil len jeden krok, nechceš predsa padnúť dole.
`;

function LevelTutorialTurn() {

}

LevelTutorialTurn.prototype = new Level();

LevelTutorialTurn.prototype.build = function (world_, robot_) {
    world_.build(2,2);
    world_.makeHoleAt(0,1);
    robot_.build(0,0,1,'right', new EmptyBag(), 1, 1);
}

LevelTutorialTurn.prototype.check = function (world_, robot_) {
    return {correct:robot_.y==1, message:'Robot sa nenachádza na správnom políčku'};
}

LevelTutorialTurn.prototype.taskHTML = `
    Ďalší užitočný príkaz je príkaz OTOC, ktorý prikáže robotovi otočiť sa DOĽAVA. Robot sa vie otáčať len do tejto strany.<br>
    Ako sa však otočiť dozadu alebo doprava? Stačí, keď mu prikážeme, aby sa viackrát otočil doľava. <br>
    V tejto úlohe je cieľom dostať sa na políčko za rohom. Teda robot musí ísť dopredu, potom sa otočiť a následne musí znova spraviť krok dopredu.
`;

function LevelTutorialPick() {

}

LevelTutorialPick.prototype = new Level();

LevelTutorialPick.prototype.build = function (world_, robot_) {
    world_.build(2,2);
    world_.makeHoleAt(0,1);
    world_.putAt(1,1,this.bricks.red);
    robot_.build(0,0,1,'right', new EmptyBag(), 1, 1);
}

LevelTutorialPick.prototype.check = function (world_, robot_) {
    if (world_.isBrick(1,1)) return {correct:false, message:'Robot nezdvihol zafarbenú tehličku'};
    return {correct:true, message:''};
}

LevelTutorialPick.prototype.taskHTML = `
    Vo svete sa môžu nachádzať zafarbené tehličky. Tieto tehličky vie robot zbierať príkazom ZOBER, pokiaľ na tehličke stojí.<br>
    Úlohu úspešne splníš ak zo zeme zdvihneš tehličku červenej farby. Ako na to? Dostaň robota na túto tehličku a prikáž mu ju zdvihnúť.
`;

function LevelTutorialPlace() {

}

LevelTutorialPlace.prototype = new Level();

LevelTutorialPlace.prototype.build = function (world_, robot_) {
    world_.build(2,2);
    world_.putAt(1,0,this.bricks.red);
    robot_.build(0,0,1,'right', new Bag(), 1, 1);
}

LevelTutorialPlace.prototype.check = function (world_, robot_) {
    if (world_.isBrick(1,0)) return {correct:false, message:'Zafarbená tehlička sa stále nachádza na rovnakom mieste'};
    if (robot_.hasColor(this.bricks.red.color)) return {correct:false, message:'Robot nepoložil zafarbenú tehličku na iné miesto'};
    return {correct:true, message:''};
}

LevelTutorialPlace.prototype.taskHTML = `
    V predchádzajúcej úlohe sme si ukázali, ako vie robot zbierať zafarbené tehličky zo zeme.<br>
    Robot ich však taktiež vie na zem položiť príkazom POLOZ.<br>
    Tehličky však môžu mať rôzne farby a to červenú, zelenú a modrú.<br>
    Robotovi musíme povedať, akú tehličku má položiť. Ak chceme, aby položil červenú, musíme napísať POLOZ CERVENA, ak zelenú POLOZ ZELENA, ak modrú POLOZ MODRA<br>
    ALE POZOR: Robot môže položiť iba tehličky, ktoré má pri sebe. Získať tehličky môže iba zdvihnutím alebo ich môže mať na začiatku. <br>
    V tejto úlohe robot pri sebe nemá žiadnu tehličku. Avšak na zemi jednu červenú vidíme. Príkaž robotovi túto tehličku zdvihnúť a položiť ju inde.
`;

function LevelTutorialColorReplace() {

}

LevelTutorialColorReplace.prototype = new Level();

LevelTutorialColorReplace.prototype.build = function (world_, robot_) {
    world_.build(4,4);
    world_.putAt(0,2,this.bricks.red);
    world_.makeHoleAt(0,1);
    world_.makeHoleAt(1,1);
    world_.makeHoleAt(1,2);
    world_.makeHoleAt(2,1);
    world_.makeHoleAt(2,2);
    robot_.build(0,0,1,'right', new Bag(), 10, 10);
    robot_.putBrick(this.bricks.blue.color);
}

LevelTutorialColorReplace.prototype.check = function (world_, robot_) {
    if (world_.isColor(0,2,this.bricks.red.color)) return {correct:false, message:'Robot nezdvihol červenú tehličku'};
    if (!robot.hasColor(this.bricks.red.color)) return {correct:false, message:'Robot pri sebe nemá červenú tehličku'};
    if (robot.hasColor(this.bricks.blue.color)) return {correct:false, message:'Robot nepoložil modrú tehličku'};
    if (!world_.isColor(0,2,this.bricks.blue.color)) return {correct:false, message:'Robot nepoložil modrú tehličku na správne miesto'};
    return {correct:true, message:''};
}

LevelTutorialColorReplace.prototype.taskHTML = `
    Ak si vyriešil všetky predchádzajúce úlohy, som si istý, že si poradíš aj s touto. <br>
    Robot má pri sebe jednu modrú tehličku. Robotova obľúbená farba je však červená. Vo svete sa nachádza jedna červená tehlička <br>
    Zober túto červenú tehličku a modrú tehličku, ktorú pri sebe robot má, polož tam, kde je teraz červená tehlička.
`;

function LevelTutorialCollect() {

}

LevelTutorialCollect.prototype = new Level();

LevelTutorialCollect.prototype.build = function (world_, robot_) {
    world_.build(3,3);
    world_.putAt(1,0,this.bricks.red);
    world_.putAt(1,0,this.bricks.green);
    world_.putAt(2,1,this.bricks.red);
    world_.putAt(2,0,this.bricks.red);
    world_.putAt(1,2,this.bricks.blue);
    world_.putAt(0,1,this.bricks.blue);
    robot_.build(0,0,1,'right', new EmptyBag(), 10, 10);
}

LevelTutorialCollect.prototype.check = function (world_, robot_) {
    var correct = true;
    for (var x=0; x<world_.x; x++) {
        for (var y=0; y<world_.y; y++) {
            if (world_.isBrick(x,y)) correct=false;
        }  
    }
    return {correct:correct, message:'Robot nepozbieral všetky zafarbené tehličky.'};
}

LevelTutorialCollect.prototype.taskHTML = `    
    Vo svete sa nachádza viacero zafarbených tehličiek. Pozbieraj ich všetky. <br>
    Všimni si, že na jednom miesto sú položené 2 zafarbené tehličky na sebe. Robot vie zdvihnúť vždy len tú navrchu.<br>
    Až keď zdvihneš tehličku navrchu, môžeš zdvihnúť aj tehličku pod ňou.
`;

function LevelTutorialSwap() {

}

LevelTutorialSwap.prototype = new Level();

LevelTutorialSwap.prototype.build = function (world_, robot_) {
    world_.build(2,1);
    world_.putAt(0,0,this.bricks.blue);
    world_.putAt(1,0,this.bricks.green);
    robot_.build(0,0,2,'right', new Bag(), 10, 10);
}

LevelTutorialSwap.prototype.check = function (world_, robot_) {
    return {correct:world_.isColor(0,0, this.bricks.green.color) &&world_.isColor(1,0, this.bricks.blue.color), message:'Zafarbené políčka nie sú na správnom mieste.'};
}

LevelTutorialSwap.prototype.taskHTML = `
    Na zemi sú 2 zafarbené tehličky, modrá a zelená <br>
    Premiestni zelenú tehličku tam, kde je teraz modrá a premiestni modrú tehličku tam, kde je teraz zelená.
`;

function LevelTutorialStairs() {

}

LevelTutorialStairs.prototype = new Level();

LevelTutorialStairs.prototype.build = function (world_, robot_) {
    world_.build(5,1);
    robot_.build(0,0,1,'right', new Bag(), 10, 10);
    for (var i=0; i<10; i++) robot_.putBrick(this.bricks.red.color);
}

LevelTutorialStairs.prototype.check = function (world_, robot_) {
    correct=(world_.height(0,0)==0);
    for (var i=1; i<5; i++) {
        if (world_.height(i,0)-1!=world_.height(i-1,0)) {
            correct=false;
            break;
        }
    }
    return {correct:correct, message:'Schody nie sú postavené správne'};
}

LevelTutorialStairs.prototype.taskHTML = `
    Robot má pri sebe 10 červených tehličiek. Chcel by postaviť schody<br>
    Tam, kde robot začína, nepoložíme žiadnu tehličku. <br>
    Na druhom políčku má byť položená jedna zafarbená tehlička. <br>
    Na nasledujúcom 2 potom 3 a nakoniec 4 zafarbené tehličky. <br>
    Pomôž robotovi postaviť schody.
    
    
`;

function LevelTutorialReverseStairs() {

}

LevelTutorialReverseStairs.prototype = new Level();

LevelTutorialReverseStairs.prototype.build = function (world_, robot_) {
    world_.build(5,1);
    robot_.build(0,0,5,'right', new Bag(), 10, 10);
    for (var i=0; i<5; i++) {
        for (var p=0; p<4-i; p++) {
            world_.putAt(i,0,this.bricks.red);
        }
    }
}

LevelTutorialReverseStairs.prototype.check = function (world_, robot_) {
    correct=(world_.height(0,0)==0);
    for (var i=1; i<5; i++) {
        if (world_.height(i,0)-1!=world_.height(i-1,0)) {
            correct=false;
            break;
        }
    }
    return {correct:correct, message:'Schody nie sú postavené správne'};
}

LevelTutorialReverseStairs.prototype.taskHTML = `
    Podobne ako v predchádzajúcej úlohe budeme stavať schody<br>
    Tentokrát však nemá robot pri sebe zafarbené tehličky a musí si pozbierať. <br>
    Vo svete sú už schody postavené, ale sú naopak. Pozbieraj všetky tehličky z týchto schodov a postav nové schody, ale v opačnom smere. Presne rovnako, ako boli postavené v predchádzajúcej úlohe<br>   
    
`;
