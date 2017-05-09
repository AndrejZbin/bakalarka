function LevelSandbox() {

}

LevelSandbox.prototype = new Level();

LevelSandbox.prototype.build = function (world_, robot_) {
    world_.build(21,21);
    robot_.build(10,10,1,'right', new InfinityBag(), 10, 10);
}

LevelSandbox.prototype.check = function (world_, robot_) {
    return {correct:true, message:''}
}

LevelSandbox.prototype.taskHTML = `
    Nachádzaš sa vo voľnom svete, kde si môžeš vyskúšať príkazy.
`;