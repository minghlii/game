// klasse plank om plankjes te maken
var Plank = function(c, top, backgroundColor) {

    // this in een variabele t steken
    var t = this;

    // properties instellen
    this.left = 20;
    this.top = top;
    this.width = c.width - 40;
    this.height = 7;
    this.fill = backgroundColor;

    // tekent de rectangle
    this.draw = function() {
        var rect = new fabric.Rect({
            left: t.left,
            top: t.top,
            fill: t.fill,
            width: t.width,
            height: t.height,
            selectable: false

        });

        // voegt rect toe aan het canvas
        c.add(rect);

    }

}

var Monkey = function(c, left, top, imgElement) {
    // this steken we in een variable.
    //zodat we 'this' in elke methode kunnen gebruiken
    var t = this;

    this.monkey = null;

    this.element = imgElement; 

    this.size = {
        width: 100,
        height: 155
    };

    this.position = {
        left: left,
        top: top
    };
    this.draw = function() {
        t.monkey = new fabric.Image(t.element, {
            width: t.size.width,
            height: t.size.height,
            left: t.position.left,
            top: t.position.top,
            selectable: false, // anders zou je de kip kunnen selecteren (mag niet)
            originX: 'center',
            originY: 'bottom'
        });
        c.add(t.monkey);
    };
    this.wobble = function() {

        // kom op kipje kom maar wiebelen wiebelen

        // start door naar rechts te roteren
        rotateToRight();

        function rotateToRight() {

            // animeren (soortenAnimatie, verandering (graad of positie), {...})
            t.monkey.animate('angle', 30, {
                duration: 1000, // 1 seconden
                onChange: c.renderAll.bind(c), // canvas opnieuw renderen na elke beweging
                easing: fabric.util.ease['easeInQuad'],
                onComplete: rotateLeft
                
                    // roep de functie aan om naar links te roteren ;-)
            });
        }
        function rotateLeft() {
                t.monkey.animate('angle', -30, {
                    duration: 1000,
                    onChange: c.renderAll.bind(c),
                    easing: fabric.util.ease['easeInQuad'],
                    onComplete: function() {
                        rotateToRight();
                    }
                });
        }
    }
}
var Basket = function(c, element) {
        var t = this;
        this.basket = null;
        this.element = element;
        this.size = {
            width: 100,
            height: 53
        };

        // initiële positie
        this.position = {
            left: c.width/2,
            top: c.height -30
        };
        this.draw = function() {
            t.basket = new fabric.Image(t.element, {
                width: t.size.width,
                height: t.size.height,
                left: t.position.left,
                top: t.position.top,
                originX: 'center',
                originY: 'bottom',
                selectable: false
            });
            c.add(t.basket);
            }
        };


var Egg = function(c, left, top, element, isRotten) {
    var t = this;
    this.position = {left: left, top: top};
    this.element = element;
    this.egg = null;
    this.hasFallen = false;
    this.isRotten = isRotten;
    this.bulletEnd = false;
    this.dropped = false;
    this.draw = function() {
        // an egg = an ellipse
            t.egg = new fabric.Image(t.element, {
                left: t.position.left,
                top: t.position.top,
                width: 50,
                height: 30,
                originX: 'center',
                originY: 'center',
                selectable: false
          });
        


        //add egg to the canvas
        c.add(t.egg);

        // send eggs to back (z-index: 0)
        t.egg.moveTo(0);
    };
    this.rotate = function(rotation) {
        var newAngle = t.egg.getAngle() + rotation;
        t.egg.animate('angle' , newAngle, {
            duration: 500,
            // onChange: c.renderAll.bind(c),
            // easing: fabric.util.ease['easeInOutQuad'],
            onComplete: function(){
                t.rotate(rotation);
            }
        });
    };
    this.fall = function(direction, position, duration) {
		t.egg.animate(direction, position, {
	      duration: duration,
	      // onChange: c.renderAll.bind(c),
	      onComplete: function() {
	      	if(direction == 'left')
				t.fall('top', 450, 2000);
		  	else {
                t.dropped = true;
                 t.hasFallen = true;
				c.remove(t.egg);
			}
	      }
	    });
	}

    this.shoot = function(direction, position, duration) {
        t.egg.animate(direction, position ,{
            duration: duration,
            onComplete: function() {
                t.bulletEnd = true;
                c.remove(t.egg);
            }
        })
    }

};

var Rat = function(c, left, top, element) {
    
    var t = this;
    this.paused = false;
    this.rat = null;
    this.element = element;

    this.size = {
        width: 120,
        height: 77
    };
    this.position = {
        left: left,
        top: top
    };
    
    this.draw = function() {
        t.rat = new fabric.Image(t.element, {
            width: t.size.width,
            height: t.size.height,
            left: t.position.left,
            top: t.position.top,
            selectable: false, // anders zou je de rat kunnen selecteren (mag niet)
            originX: 'center',
            originY: 'bottom'
        });

        // rat toevoegen aan het canvas
        c.add(t.rat);

        // ratje ACHTER de kip plaatsen
        t.rat.moveTo(0);
    }
    
    // van links naar recht lopen (direction: left or right)
    this.catchEggs = function(direction) {

        if(direction == 'right') {
            var position = c.width - 50;
            t.rat.set('flipX', true); // rat spiegelen( andere loopt die achteruit)
        } 
        else{
            var position = 50;
            t.rat.set('flipX', false);
        }
            
        if(!t.paused) {
            t.rat.animate('left', position, {

                duration: 6000,
                onComplete: function() {
                    if(direction == 'right')
                        t.catchEggs('left');
                    else
                        t.catchEggs('right');
                }
            });
        }   
    }

}




