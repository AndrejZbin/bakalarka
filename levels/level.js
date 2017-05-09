/* Objekt pre ulohu, kazda uloha ma svoj objekt */
function Level() {
    // pre zjednodusenie
    this.bricks = {
        red:{'type':'brick', 'color':'red'},
        green:{'type':'brick', 'color':'green'},
        blue:{'type':'brick', 'color':'blue'},
        random: function() {var indx = Math.floor(Math.random()*3); return this[['red','green','blue'][indx]];}
    }
}

/*spusti ulohu, vytvori svet a robota */
Level.prototype.start = function() {
    if (stop_button.onclick!=null) {
        stop_button.onclick(); //spravi to iste co stop button, pokial funckcia este neexistuje, stranka nebola plne nacitana a vyber ulohy zatial nepovolime
        var element = document.getElementById("tasktext");
        element.innerHTML = this.taskHTML; //zmenim text ulohy
        //var top = $('#task').position().top;
        $(window).scrollTop( 0 );
    }
    else {
        level = new LevelSandbox();
    }
}

/* Overi splnenie aktualnej ulohy a zobrazi spravu */
Level.prototype.verify = function(world_, robot_) {
    var ret =this.check(world_, robot_);
    if (ret.correct) {
        alert('Úlohu si vyriešil správne\nGratulujem!');
    }
    else {
        alert('Úlohu si vyriešil nesprávne\n'+ret.message+'\nVyskúšaj to znova');
    }
}

/* Funkcia, ktora vytvori level, upravuje svet a robota. Kazda uloha ma svoju vlastnu funkciu. 
    world_ - svet, ktory ma postavit
    robot - robot, ktoreho ma nastavit 
*/
Level.prototype.build = function(world_, robot_) {    
}

/* Funkcia, ktora overi, ci level bol uspesne splneny updava sveta a robota. Kazda uloha ma svoju vlastnu funkciu. 
    world_ - svet, ktory overuje
    robot - robot, ktoreho overuje
*/
Level.prototype.check = function(world_, robot_) {
    return {correct:false,message:'test'};
}

/* Text ulohy */
Level.prototype.taskHTML = `
    Chýbajúci text
`;
