function LevelIfCollect() {

}

LevelIfCollect.prototype = new Level();

LevelIfCollect.prototype.build = function (world_, robot_) {
    world_.build(4,4);
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (x!=0 && x!=3 && y!=0 && y!=3) world_.makeHoleAt(x,y);
            else if (Math.random()<0.5) world_.putAt(x,y, this.bricks.blue);
        }
    }
    if (!world_.isBrick(0,0)) world_.putAt(0,0, this.bricks.blue);
    if (!world_.isBrick(3,3)) world_.putAt(3,3, this.bricks.blue);
    if (world_.isBrick(0,3)) world_.takeFrom(0,3);
    robot_.build(0,0,3,'right', new EmptyBag(), 20, 20);
}

LevelIfCollect.prototype.check = function (world_, robot_) {
    for (var x=0; x<4; x++) {
        for (y=0; y<4; y++) {
            if (world_.isBrick(x,y)) return {correct:false, message:'Robot nepozbieral všetky zafarbené tehličky'};
        }
    } 
    return {correct:robot_.x==0 && robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelIfCollect.prototype.taskHTML = `
    Robot vie odpovedať na jednoduché otázky o sebe alebo o svete okolo seba. Jeho odpoveď je vždy PRAVDA alebo NEPRAVDA.<br>
    Tu sú niektoré otázky, na ktoré vie robot odpovedať:<br>
    - MA farba, odpovie PRAVDA, pokiaľ robot má pri sebe tehličku s touto farbou, napríklad MA MODRA<br>
    - NEMA farba, odpovie PRAVDA, pokiaľ robot pri sebe nemá tehličku s touto farbou, napríklad NEMA MODRA<br>
    - JE TEHLA, odpovie PRAVDA, pokiaľ robot stojí na nejakej zafarbenej tehličke<br>
    - JE farba, odpovie PRAVDA, pokiaľ robot stojí na zafarbenej tehličke s touto farbou, napríklad JE ZELENA. Tento otázku môžeš položiť robotovi len pokiaľ stojí na nejakej zafarbenej tehličke.<br>
    - JE DIERA, odpovie PRAVDA, pokiaľ sa robot nemôže pohnúť dopredu, pretože je pred ním diera<br>
    Týchto otázok je viacej, postupne sa naučíme ďalšie v ďalších úlohách.<br> <br>
    Ak napíšeme pred nejaký príkaz AK otazka TAK, tak tento príkaz robot spraví len pokiaľ odpovie na otázku PRAVDA. <br>
    Napíklad AK MA ZELENA POTOM POLOZ ZELENA. Ak má robot pri sebe zelenú tehličku, tak ju položí. <br>
    Podobne ako pri opakuj, ak chceme, aby robot spravil viacej príkazov, možeme ich napísať medzi { a }<br>
    V tejto úlohe robot musí prejsť po okruhu a pozbierať všetky zafarbené tehličky. Na žiadnom mieste nie sú na sebe položené dve zafarbené tehličky.<br>
    Robot sa musí zastaviť tam, kde skončil. Použi príkazy KROK, OTOC, ZOBER, AK a OPAKUJ.
`;

function LevelIfNavigate() {

}

LevelIfNavigate.prototype = new Level();

LevelIfNavigate.prototype.build = function (world_, robot_) {
    world_.build(5,4);    
    world_.makeHoleAt(0,0);
    world_.makeHoleAt(0,2);
    world_.makeHoleAt(0,3);
    world_.makeHoleAt(1,0);
    world_.makeHoleAt(1,2);
    world_.makeHoleAt(1,3);    
    world_.makeHoleAt(3,1);
    world_.makeHoleAt(3,2);
    world_.makeHoleAt(2,0);
    world_.putAt(2,1, this.bricks.red);
    world_.putAt(2,3, this.bricks.blue);
    world_.putAt(4,3, this.bricks.blue);
    world_.putAt(4,0, this.bricks.blue);
    world_.putAt(3,0, this.bricks.green);
    robot_.build(0,1,1,'right', new Bag(), 20, 20);
}

LevelIfNavigate.prototype.check = function (world_, robot_) {

    if (!world_.isColor(2,1, this.bricks.red.color) || !world_.isColor(2,3, this.bricks.blue.color) || !world_.isColor(4,3, this.bricks.blue.color) || !world_.isColor(4,0, this.bricks.blue.color) || !world_.isColor(3,0, this.bricks.green.color)) return {correct:false, message:'Robot ukradol nejakú tehličku.'};
    return {correct:robot_.x==3 && robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelIfNavigate.prototype.taskHTML = `
    Pomocou príkazu opakuj vieme robotovi povedať, koľkokrát má robot opakovať nejaký príkaz. Ak chceme, aby robot vykonával príkazy donekonečna alebo pokiaľ mu nepovieme, aby prestal, môžeme vynechať číslo za OPAKUJ<br>
    Prerušiť vykonávanie týchto príkazov môžeme pomocou príkazu PRERUS. <br>
    Viacero otázok môžeme spojiť do jednej pomocou A, ALEBO. Napríklad AK JE TEHLA A JE ZELENA TAK ZOBER prikáže robotovi zobrať tehličku, ak na nejakej stojí a je zelená.<br><br>
    Robot má v tejto úlohe prejsť po úzkej ceste a dostať sa k zelenej tehličke na konci.<br>
    Pokiaľ robot stojí na červenej tehličke, musí sa otočiť doľava. <br>
    Pokiaľ stojí na modrej tehličke, musí sa otočiť doprava (alebo 3x doľava).
    Pokiaľ stojí na zelenej tehličke, skončí vykonávanie príkazov. Dostal sa na koniec.
`;

function LevelIfElse() {

}

LevelIfElse.prototype = new Level();

LevelIfElse.prototype.build = function (world_, robot_) {
    world_.build(3,4);    
    world_.makeHoleAt(0,0);
    world_.makeHoleAt(1,0);
    world_.makeHoleAt(1,3);
    world_.makeHoleAt(0,3);
    world_.makeHoleAt(0,2);
    world_.putAt(0,1, this.bricks.green);
    world_.putAt(0,1, this.bricks.blue);
    world_.putAt(2,1, this.bricks.red);
    world_.putAt(2,1, this.bricks.blue);
    world_.putAt(2,3, this.bricks.green);
    robot_.build(1,2,1,'right', new Bag(), 20, 20);
}

LevelIfElse.prototype.check = function (world_, robot_) {

   if (!world_.isColor(2,3, this.bricks.green.color) || !world_.isColor(2,1, this.bricks.red.color) ) return {correct:false, message:'Robot zobral nesprávnu tehličku.'};
   if (world_.isBrick(1,1) || world_.isBrick(1,2) || world_.isBrick(2,2) || world_.isBrick(2,0) || world_.height(2,1)>1 || world_.height(2,3)>1) return {correct:false, message:'Robot položil tehličku'};
   return {correct:robot_.x==0 && robot_.y==1, message:'Robot sa nenachádza na správnom mieste'};
}

LevelIfElse.prototype.taskHTML = `
    
    Ak chceme, aby sa robot otočil, ak je pred ním diera, ale spravil krok, ak pred ním diera nie je, vieme to urobiť nasledovne: <br>
    - AK DIERA TAK OTOC AK NIE JE DIERA TAK KROK<br>
    Pomocou 'AK otazka TAK prikaz' vieme povedať robotovi, že má nejaký príkaz alebo príkazy spraviť len ak je odpoveď na otázku PRAVDA. Robotovi však vieme zadať aj príkazy, ktoré má vykonať, pokiaľ je odpoveď NEPRAVDA.<br>
    Preto predchádzajúci príklad vieme spraviť aj takto:<br>
    - AK DIERA TAK OTOC INAK KROK<br><br>
    V tejto úlohe musí robot postupovať nasledovne: <br> 
    Ak robot stojí na tehličke, tak<br>  
    Ak je zelená, tak zoberie tehličku a úloha je splnená, robot sa už nesmie pohnúť, inak (ak nie je zelená) sa otočí doľava a sú dve možnosti:<br>  
    Ak je modrá, zoberie tehličku inak (ak nie je modrá) sa znova otočí doľava a spraví krok.  <br>      
    Inak (ak nestojí na tehličke) ak pred robotom nie je diera, spraví krok, inak (ak pred ním diera je), otočí sa doprava.<br>
`;