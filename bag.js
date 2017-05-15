/* klasicka taska, vidim vsetko co v nej je a mozem do nej vsetko pridat */
function Bag() {
    this.red=0;
    this.green=0;
    this.blue=0;
}

Bag.prototype.hasBrick = function() {
    return (this.red>0 || this.green>0 || this.blue>0);
}

Bag.prototype.hasColor = function(color) {
    return this[color]>0;
}

Bag.prototype.takeBrick = function(color) {
    this[color]=Math.max(0, this[color]-1);
}

Bag.prototype.putBrick = function(color) {
    this[color]++;
}

/* zasobnikova taska, vidim len poslednu farbu */
function LIFOBag() {
    this.bag = [];
}

LIFOBag.prototype = new Bag();

LIFOBag.prototype.hasBrick = function() {
    return this.bag.length>0
}

LIFOBag.prototype.hasColor = function(color) {
    if (!this.hasBrick()) return false;
    this.bag[this.bag.length-1]==color;
}

LIFOBag.prototype.takeBrick = function(color) {
    if (this.hasColor(color)) this.bag.pop();
}

LIFOBag.prototype.putBrick = function(color) {
    this.bag.push(color);
}

/* Nekonecna taska, je v nej vsetko */
function InfinityBag() {

}

InfinityBag.prototype = new Bag();

InfinityBag.prototype.hasBrick = function() {
    return true;
}

InfinityBag.prototype.hasColor = function(color) {
    return true;
}

InfinityBag.prototype.takeBrick = function(color) {
    
}

InfinityBag.prototype.putBrick = function(color) {
    
}

/* Nekonecna farba len pre niektore farby 
red - nekonecna cervena?
green - nekonecna zelena?
blue - nekonecna modra?
*/
function InfinityColorBag(red,green,blue) {
    this.red=red;
    this.green=green;
    this.blue=blue;
}

InfinityColorBag.prototype = new Bag();

InfinityColorBag.prototype.hasBrick = function() {
    return true;
}

InfinityColorBag.prototype.hasColor = function(color) {
    return this[color];
}

InfinityColorBag.prototype.takeBrick = function(color) {
    
}

InfinityColorBag.prototype.putBrick = function(color) {
    
}


/* Prazdna taska, vsetko sa z nej straca, nic v nej nie je */
function EmptyBag() {

}

EmptyBag.prototype = new Bag();

EmptyBag.prototype.hasBrick = function() {
    return false;
}

EmptyBag.prototype.hasColor = function(color) {
    return false;
}

EmptyBag.prototype.takeBrick = function(color) {
    
}

EmptyBag.prototype.putBrick = function(color) {
    
}

function OneBag() {
    this.red=false;
    this.green=false;
    this.blue=false;
}

OneBag.prototype = new Bag();

OneBag.prototype.hasBrick = function() {
    return (this.red || this.green || this.blue);
}

OneBag.prototype.hasColor = function(color) {
    return this[color];
}

OneBag.prototype.takeBrick = function(color) {
    this[color]=false;
}

OneBag.prototype.putBrick = function(color) {
    this.red=false;
    this.green=false;
    this.blue=false;
    this[color]=true;
}