function LevelWhileCollect() {

}

LevelWhileCollect.prototype = new Level();

LevelWhileCollect.prototype.build = function (world_, robot_) {
    world_.build(4,4);
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (x!=0 && x!=3 && y!=0 && y!=3) world_.makeHoleAt(x,y);
            else {
                var r = Math.floor(Math.random()*4);
                for (var i=0; i<r; i++) world_.putAt(x,y, this.bricks.random());                
                }
        }
    }
    if (!world_.isBrick(3,3)) world_.putAt(3,3, this.bricks.random()); world_.putAt(3,3, this.bricks.random());
    while (world_.isBrick(0,3)) world_.takeFrom(0,3);
    robot_.build(0,0,world_.height(0,0)+1,'right', new EmptyBag(), 20, 20);
}

LevelWhileCollect.prototype.check = function (world_, robot_) {
    for (var x=0; x<4; x++) {
        for (y=0; y<4; y++) {
            if (world_.isBrick(x,y)) return {correct:false, message:'Robot nepozbieral všetky zafarbené tehličky'};
        }
    } 
    return {correct:robot_.x==0 && robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelWhileCollect.prototype.taskHTML = `
    Ďalším užitočným príkazom je príkaz POKIAL. Pomocou tohto príkazu vie robot opakovať jeden alebo viacero príkazov (podobne ako pri OPAKUJ).<br>
    Opakuje ich pokiaľ odpovedá na otázku za príkazom pokial PRAVDA (podobne ako pri AK, teraz však nemôžeme použiť inak ak je odpoveď NEPRAVDA). <br> 
    Napríklad POKIAL NIE JE DIERA TAK KROK prikáže robotovi kráčať dopredu, až pokiaľ nepríde k diere. <br>
    Predtým, ako prejdeme k úlohe, si povieme ešte jednu užitočnú vec. Otázku môžeme nahradiť priamo odpoveďou, teda PRAVDA alebo NEPRAVDA<br>
    POKIAL PRAVDA TAK KROK prikáže robotovi kráčať donekonečka. Môžeme si všimnúť, že je to to isté ako OPAKUJ KROK. Vykononávanie príkazov cez príkaz POKIAL môžeme tiež prerušiť pomocou PRERUS<br><br>
    Podobnú úlohu si už riešil pri príkaze AK. Robot musí prejsť po okruhu a pozbierať všetky zafarbené tehličky. Niekde je položených viacero tehličiek na sebe.<br>
    Robot sa musí zastaviť tam, kde skončil. Použi príkazy KROK, OTOC, ZOBER, POKIAL.
`;

function LevelWhileGetOver() {

}

LevelWhileGetOver.prototype = new Level();

LevelWhileGetOver.prototype.build = function (world_, robot_) {
    world_.build(10,1);
    for (var i=0; i<10; i++) {
        var r=Math.floor(Math.random()*7);
        for (var j=0; j<r; j++) world_.putAt(i,0,this.bricks.red);
    }
    world_.putAt(9,0,this.bricks.green);
    robot_.build(0,0,world_.height(0,0)+1,'right', new InfinityColorBag(true,false,false), 0, 0);
}

LevelWhileGetOver.prototype.check = function (world_, robot_) {
    if (world_.isColor(7,0,this.bricks.green.color)) return {correct:false, message:'Robot nestojí na zelenej tehličke, kam zmizla?'};
    return {correct:robot_.x==9 && robot_.y==0, message:'Robot sa nenachádza na správnom mieste'};
}

LevelWhileGetOver.prototype.taskHTML = `
    V tejto úlohe vie robot spraviť krok dopredu, len pokiaľ sa nachádza v rovnakej výške, ako políčko, na ktoré chce prejsť. <br>
    JE JAMA je PRAVDA, pokiaľ sa robot nachádza vyššie ako políčko, na ktoré chce prejsť. Ak je toto políčko diera, túto otázku sa pýtať nesmieme.<br>
    JE DIERA je PRAVDA, pokiaľ sa robot nachádza nižšie ako políčko, na ktoré chce prejsť. Ak je toto políčko diera, túto otázku sa pýtať nesmieme.<br>
    JE VOĽNO je PRAVDA, pokiaľ robot môže spraviť krok dopredu.<br><br>
    Úloha je jednoduchá, dostaň robota na zelenú tehličku. V tejto úlohe môžeš položiť hocikoľko červených tehličiek, ine tehličky položiť nemôžeš. Nezabudni, že robot v tejto úlohe nevie skákať.<br>
    Na zelenú tehličku sa dostaneš tak, že pokiaľ nestojíš na zelenej tehličke spraviš krok dopredu. Pokiaľ robot nemôže spraviť krok dopredu, pretože je tam jama alebo stena, zariaď, aby mohol. Nezabudni, že na farbu tehličky sa môžeš pýtať len ak robot na nejakej stojí.
`;
