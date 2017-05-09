/* nastavenie funkcionality tlacidlam */
window.onload = function() {
    build_button.onclick = function() {
        code = editor.getSession().getValue()+' ';
        if(!interpreter.loadProgram(code)) return;
        step_button.disabled=false;
        run_button.disabled=false;
        pause_button.disabled=false;
        restart_button.disabled=false;
        stop_button.disabled=false;
        build_button.disabled=true;
        executor.pause();
        editor.setReadOnly(true);
    }
    

    step_button.onclick = function() {executor.step();};
    
    
    run_button.onclick = function() {executor.run();};
    
    
    pause_button.onclick = function() {executor.pause();};
    
    
    restart_button.onclick = function() {
        executor.restart();
        world.clearScene();
        level.build(world, robot);
        interpreter.restart();
        executor.scene.updateCamera();
        step_button.disabled=false;
        run_button.disabled=false;
        pause_button.disabled=false;
        editor.deleteMarker();
    };
    
    stop_button.onclick = function() {
        executor.restart();
        world.clearScene();
        level.build(world, robot);
        executor.scene.updateCamera();
        step_button.disabled=true;
        run_button.disabled=true;
        pause_button.disabled=true;
        restart_button.disabled=true;
        stop_button.disabled=true;
        build_button.disabled=false;
        editor.setReadOnly(false);
        editor.deleteMarker();
    };
    
    //nacita ulozeny kod, skor testovacie
    if (typeof(Storage) !== "undefined") {
        var savedcode = localStorage.getItem('savedcode');
        if (savedcode !== null) editor.getSession().setValue(savedcode);
    }
}

//ulozy napisany kod, skor testovacie
window.onbeforeunload = function() {
    localStorage.setItem('savedcode', editor.getSession().getValue());
}