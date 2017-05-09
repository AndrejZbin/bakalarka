function LevelVarTower() {

}

LevelVarTower.prototype = new Level();

LevelVarTower.prototype.build = function (world_, robot_) {
    world_.build(15,1);
    world_.putAt(0,0, this.bricks.red);
    world_.putAt(0,0, this.bricks.green);
    world_.putAt(0,0, this.bricks.blue);
    this.red = 1;
    this.green = 1;
    this.blue = 1;
    for (var i=0; i<12; i++) {
        var brick=this.bricks.random();
        world_.putAt(0,0, brick);
        this[brick.color]++;
   }        
    robot_.build(0,0,world_.height(0,0)+1,'right', new Bag(), 0, 0);
}

LevelVarTower.prototype.check = function (world_, robot_) {
    if (world_.isBrick(0,0)) return {correct:false, message:'Robot nepozbieral všetky zafarbené tehličky z veže'};
    for (var i=1; i<15; i++) if (i!=this.red && world_.isBrick(i,0)) return {correct:false, message:'Robot položil tehličku na nesprávne miesto'};
    if (!world_.isBrick(this.red,0)) return {correct:false, message:'Robot nepoložil tehličku pod seba, keď spravil všetky kroky, ktoré mal'};
    if (world_.height(this.red,0)>1) return {correct:false, message:'Robot pod seba položil priliš veľa tehličiek po tom, ako spravil všetky kroky.'};
    if (this.blue>this.green) {
        if (!world_.isColor(this.red,0,this.bricks.blue.color)) return {correct:false, message:'Robot mal položiť modrú tehličku, ale nepoložil ju'};
    }
    else if (!world_.isColor(this.red,0,this.bricks.green.color)) return {correct:false, message:'Robot mal položiť zelenú tehličku, ale nepoložil ju'};
    return {correct:robot_.x==this.red && robot_.y==0, message:'Robot nespravil správny počet krokov'};
}

LevelVarTower.prototype.taskHTML = `
    Predmenné môžu mať 4 typy: číslo, farba, pravdivosť a smer.
    Premenná, ktorá má v sebe uložené číslo, musí mať na začiatku svojho mena 'cislo-', ak je v nej uložená farba 'farba-', ak odpoveď na otázku (PRAVDA, NEPRAVDA) 'pravdivost-' a ak smer robota 'smer-'<br>
    Premennú vytvoríme tak, že do nej priradíme nejakú hodnotu.<br>
    cislo-n:=4 priradi do premennej cislo-n hodnotu 4. Teraz môžeme napísať OPAKUJ cislo-n KROK. Robot vykoná príkaz KROK štyrikrát.<br>
    K tejto premennej môžme potom priradiť inú hodnotu, alebo ju zmeniť. Ak chceme, aby sa cislo-n zvýšilo o 2, napíšeme cislo-n:=cislo-n+2<br>
    Robota sa vieme pýtať otázky, v ktorých medzi sebou môžeme porovnávať čísla, farby a podobne.<br>
    Ak použijeme nevytvorenú premennú, robot si použije pre číslo 0, pre farbu CERVENA, pre pravdivosť NEPRAVDA a pre smer VPRAVO.<br>
    Napríklad AK cislo-n = 5 TAK KROK prikáže robotovi spraviť krok len ak je v premennej cislo-n uložené číslo 5. Ďalšie porovnávacie znamieka sú <,>,>=,<=,!= (rôzne)<br><br>
    Robot stojí na veži postavenej z niekoľkých tehličiek. Pozbieraj ich všetky, potom sprav toľko krokov, koľko bolo v tejto veži červených tehličiek.<br>
    Ak bolo vo veži viac modrých tehličiek ako zelených, polož jednu modrú tehličku. Inak polož jednu zelenú. Vo veži je určite aspoň jedna tehlička každej farby.<br>
    Robot v tejto úlohe nevie skákať.
    
`;

function LevelVarStairs() {

}

LevelVarStairs.prototype = new Level();

LevelVarStairs.prototype.build = function (world_, robot_) {
    world_.build(5,1);
    robot_.build(4,0,1,'left', new Bag(), 10, 10);
    for (var i=0; i<10; i++) robot_.putBrick(this.bricks.red.color);
}

LevelVarStairs.prototype.check = function (world_, robot_) {
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

LevelVarStairs.prototype.taskHTML = `
    Robot má pri sebe 10 červených tehličiek. Chcel by postaviť schody<br>
    Tam, kde robot začína, nepoložíme žiadnu tehličku. <br>
    Na druhom políčku má byť položená jedna zafarbená tehlička. <br>
    Na nasledujúcom 2 potom 3 a nakoniec 4 zafarbené tehličky. <br>
    Pomôž robotovi postaviť schody. Robot vie prejsť na ďalšie políčko len pokiaľ musí vykočiť najviac o 1 tehličku vyššie alebo zoskočiť najviac o 1 tehličku nižšie. Preto budeš musieť stavať poschodia schodov postupne<br>
    Nakoniec postav robota dole pred schody.
`;

function LevelVarStairsParams() {

}

LevelVarStairsParams.prototype = new Level();

LevelVarStairsParams.prototype.build = function (world_, robot_) {
    world_.build(5,1);
    robot_.build(4,0,1,'left', new Bag(), 10, 10);
    for (var i=0; i<10; i++) robot_.putBrick(this.bricks.red.color);
}

LevelVarStairsParams.prototype.check = function (world_, robot_) {
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

LevelVarStairsParams.prototype.taskHTML = `
    Vieme si vytvoriť vlastné príkazy. Čo ak by sme si chceli vytvoriť príkaz, pomocou ktorého robotovi môžeme povedať, koľko krokov dopredu má spraviť?<br>
    Číslo, ktoré hovorí, koľko krokov má robot spraviť budeme volať parameter príkazu. Zatiaľ sme roboli príkazy bez parametrov. Paramtrov príkazu môže byť viacero a možu byť každého typu.<br>
    Pri vytvorení príkazov dáme parametrom mená, rovnako, ako premenným. Píšeme ich za meno príkazu do zátvorky a oddeľujeme ich čiarkou.<br>
    PRIKAZ krokn(cislo-n) { OPAKUJ cislo-n KROK} je príkaz, ktorý prikáže robotovi spraviť toľko krokov, koľko mu povieme.<br>
    Ak chceme, aby robot spravil 5 krokov, musíme tento príkaz napísať s parametrom 5, parametre tiež píšeme za meno príkazu do zátvrky a oddeľujeme čiarkou.<br>
    krokn(5) prikáže robotovi spraviť 5 krokov.
    Robot má pri sebe 10 červených tehličiek. Chcel by postaviť schody<br>
    Tam, kde robot začína, nepoložíme žiadnu tehličku. <br>
    Na druhom políčku má byť položená jedna zafarbená tehlička. <br>
    Na nasledujúcom 2 potom 3 a nakoniec 4 zafarbené tehličky. <br>
    Pomôž robotovi postaviť schody. <br>
    Vytvor si prikaz poschodie(cislo-n), pomocou ktorého robot vytvorí jedno poschodie schodov. Celé schody vytvorí pomocou neho tak, že najskôr spraví príkaz poschodie s parametrom 4, potom s parametrom 3, potom 2 a nakoniec 1. <br>
    Robot vie prejsť na ďalšie políčko len pokiaľ musí vykočiť najviac o 1 tehličku vyššie alebo zoskočiť najviac o 1 tehličku nižšie. Preto budeš musieť stavať poschodia schodov postupne<br>
    Nakoniec postav robota dole pred schody.<br>
    
`;

