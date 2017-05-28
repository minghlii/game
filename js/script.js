window.onload = function() {

    // een fabric canvas variabele aanmaken
    var canvas = this.__canvas = new fabric.Canvas('playground');

    var imgMonkey = document.getElementById('monkey');
    var imgRat = document.getElementById('rat');
    var imgBasket = document.getElementById('basket');
    var imgBanana = document.getElementById('banana');
    var imgRottenBanana = document.getElementById('rottenBanana');

    var errorSound = new Audio('sounds/error.wav');
    var catchSound = new Audio('sounds/catch.wav');

    var elScore = document.getElementById('scoreValue');
    elScore.textContent = 0;

    //Set highscore
    var elHighscore = document.getElementById('highscoreValue');
    var storageSupport = false;
    var highscore = 0;

    //Check if browser supports localStorage, if so get highscore
    if (typeof(Storage) !== "undefined") {

        storageSupport = true;
        if (localStorage.highscoreEggs) highscore = localStorage.highscoreEggs;

    } else {

        elHighscore.textContent = 'Unfortunately your browser doesnt support storage';
    
    }

    elHighscore.textContent = highscore;

    //Lives
    var lives = 5;
    var elLives = document.getElementById('livesValue');
    elLives.textContent = lives;

    // knoppen declareren
    var btnStart = document.getElementById('btnStart');
    var btnPause = document.getElementById('btnPause');
    var btnStop = document.getElementById('btnStop');

    // game settings
    var score = 0;
    var eggs = [];
    var rats = [];
    var eggSpeed = 1000;
    var plankPosition = { top: 120};
    var chickenPosition = { left: canvas.width/2, top: 150};

    var gameStatus = 'stop';
	var createEggInterval;
	var monitorGameInterval;

   // spelletje starten
	btnStart.addEventListener('click', function() {
        //reset score
        score = 0;
        elScore.textContent = score;

        //reset lives
        lives = 5;
        elLives.textContent = lives;

		// status van het game op start zetten
		gameStatus = 'start';

		// chicken op canvas zetten
		monkey.draw();
		monkey.wobble();

		// rat op het canvas zetten
		rat.draw();
		rat.catchEggs('right');


		// eitjes laten vallen
		createEggInterval = setInterval(createEggs, eggSpeed);

		// eitjes controleren
		monitorGameInterval = setInterval(monitorGame, 50);

		// knop status veranderen
		btnStart.disabled = true;
		btnPause.disabled = false;
		btnStop.disabled = false;

	});

	// spelletje stoppen
	btnStop.addEventListener('click', function() {
        stop();
		/* gameStatus = 'stop';

		// elementen verwijderen van het canvas
		canvas.remove(monkey.monkey);
		canvas.remove(rat.rat);

		// loopen door de array van eieren
		for(var i = 0; i < eggs.length; i++) {
			var currentEgg = eggs[i];
			canvas.remove(currentEgg.egg);
		}

		// intervallen stopzetten
		clearInterval(createEggInterval);
		clearInterval(monitorGameInterval);

		btnStart.disabled = false;
		btnPause.disabled = true;
		btnStop.disabled = true;

        //save score in local storage
        if (score > highscore) {

            localStorage.highscoreEggs = score;
            elHighscore.textContent = score;
        }
        */
	});	

    function stop() {
        gameStatus = 'stop';

        // elementen verwijderen van het canvas
        canvas.remove(monkey.monkey);
        canvas.remove(rat.rat);

        // loopen door de array van bananen
        for(var i = 0; i < eggs.length; i++) {
            var currentEgg = eggs[i];
            canvas.remove(currentEgg.egg);
        }

        // intervallen stopzetten
        clearInterval(createEggInterval);
        clearInterval(monitorGameInterval);

        btnStart.disabled = false;
        btnPause.disabled = true;
        btnStop.disabled = true;

        //save score in local storage
        if (score > highscore) {

            localStorage.highscoreEggs = score;
            elHighscore.textContent = score;
        }

    }


	// spelletje pauzeren
	btnPause.addEventListener('click', function() {

		gameStatus = 'pause';
		btnStart.disabled = true;
		btnPause.disabled = true;
		btnStop.disabled = false;

		chicken.pause = true;
        rat.paused = true;
	});

    // positie van de plank in een object steken
    var plankPosition = {
        top: 120
    };

    // positie van de kip in een object steken
    var chickenPosition = {
        left: canvas.width/2,
        top: 150
    }

    // plank tekenen
    var plank = new Plank(canvas, 120, '#FFFF00');
    plank.draw();

    // chicken object maken en op canvas brengen
    var monkey = new Monkey(canvas, 350, 150, imgMonkey);

    var easterBasket = new Basket(canvas, imgBasket);
    easterBasket.draw();
    canvas.on('mouse:move', moveBasket);

    // mandje laten meebewegen met crusor
    function moveBasket(options) {
        // x-positie uit event halen
        var xPos = options.e.layerX;
        easterBasket.basket.left = xPos;

    }
    // Nieuw ei maken, parameters: canvas, startPositie (left), top 
    /*setInterval(function() {
    var egg = new Egg(canvas, chickenPosition.left, plankPosition.top - 15, getRandomRgb());
    egg.draw();
    egg.rotate(180);
    egg.fall(randomXPosition(), 1000);
    }, 3000);*/

    var rat = new Rat(canvas, 50, plankPosition.top, imgRat);

    //shoot eggs
    canvas.on('mouse:down', shootEgg);

    var bullets = [];

    var ratDead = false;
    
    function shootEgg(options) {
        if(score>0) {
            var egg = new Egg(canvas, easterBasket.basket.left, easterBasket.basket.top -30, imgBanana, false);
            egg.draw();
            egg.shoot('top', rat.rat.top - 100, 600);

            bullets.push(egg);
            score--;
            elScore.textContent = score;
        }
    }

// interval om elke x aantal milliseconden een ei te genereren
//setInterval(createEggs, eggSpeed);
// interval om elke 100ms te controleren of het ei in de mand valt
//setInterval(monitorGame, 100);
// functionality to check on eggs & rat
function monitorGame() {
    // check the eggs in basket
    checkEggs();
    if (rat != null) {
    checkRat();}
}

// create eggs every ... millisecond
function createEggs() {
        // get a random x position
		var randomLeft = randomXPosition();
        if (randomIsRotten()) {
            var egg = new Egg(canvas, chickenPosition.left, 110, imgRottenBanana, true);
        } else {
            var egg = new Egg(canvas, chickenPosition.left, 110, imgBanana, false);
        }
		
		egg.draw();

		// egg rotation varies whether it's going left / right
		if(randomLeft > chickenPosition.left)	egg.rotate(180);
		else egg.rotate(-180);

		// duration of the animation depends on distance
		var distance = Math.abs(chickenPosition.left - randomLeft);
		var duration = distance * 10;

		// let the egg fall
		egg.fall('left', randomLeft, duration);

		// add current egg to the array with eggs
		eggs.push(egg);

}

// check the catched eggs
function checkEggs() {
    //check bullets
    for(var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        if(bullet.bulletEnd) {
            bullets.splice(i,1);
        }
    }

    for(var i = 0; i < eggs.length; i++) {
        var egg = eggs[i];
        var x = egg.egg.left;
        var y = egg.egg.top;
        if(egg.dropped && !egg.isRotten) {
            lives -= 1; 
            elLives.textContent = lives;
            if (lives <= 0) stop();
            eggs.splice(i, 1);
        }
        if(egg.hasFallen) {
            // remove from array;
            eggs.splice(i, 1);
        }

        if( y >400 && egg.hasFallen == false) {
            
            var basketPosition = easterBasket.basket.left;
            var basketPadding = 50;

            if((basketPosition - basketPadding) < x && x < (basketPosition + basketPadding)) {
                egg.hasFallen = true;
                if (!egg.isRotten) {
                    score++;
                    catchSound.play();
                }
                else { 
                    score--;
                    errorSound.play();
                }
                elScore.textContent = score;
            }
        }
    }
}

// check if the rat stumbles upon an egg
	function checkRat() {

        //check bullethit
        for(var i = 0; i< bullets.length; i++) {

            var bullet = bullets[i];
            var bulletX = bullet.egg.left;
            var bulletY = bullet.egg.top;
            var ratX = rat.rat.left;
            var ratY = rat.rat.top;

            if ( ratY <= bulletY - 20 && ratY + 90 >= bulletY + 20 && bulletX - 30 > ratX - 70 && bulletX + 30 < ratX + 60 )
            {
                canvas.remove(rat.rat);
                rat = null;
            }

        }

		for(var i = 0; i < eggs.length; i++) {
			var egg = eggs[i];
			var x = egg.egg.left;
			var y = egg.egg.top;

			// als de y-waarde van het ei gelijk is aan de start-waarde
			// kan het ei gevangen worden (onder de plank niet meer)
			if( y < 111 ) {
				var ratPosition = rat.rat.left;
				var ratPadding = 25;
				if((ratPosition - ratPadding) < x && x < (ratPosition + ratPadding)) {
                   console.log("test");
					egg.hasFallen = true;
					canvas.remove(egg.egg);
				}
			}
		}
	}

    // niet overschrijven he, je vindt dat wel op 't internet
    function getRandomRgb() {
        var num = Math.round(0xffffff * Math.random());
        var r = num  >> 16;
        var g = num >> 8 & 255;
        var b = num & 255;
        return 'rgb(' + r + ', ' + g + ', ' + b +')';
    }

    function getRandomColor() {
        var black = [0,0,0];
        var white = [255,255,255];
        var red = [255, 0, 0];
        var yellow = [255,255, 0];
        var blue = [0,0,255];

        var colors = [black, white, red, yellow, blue];
        var random = colors[Math.floor(Math.random() * colors.length)];

        return 'rgb(' + random[0] + ', ' + random[1] + ', ' + random[2] + ')';

    }

    function randomIsRotten() {
        var d = Math.random();
        if (d < 0.3) {
            return true
        }
        else {
            return false;
        }
    }

    window.onkeydown = function(e){
         var kc = e.keyCode;
         e.preventDefault();

         if(kc === 37) easterBasket.basket.left -= 10;
         if(kc === 38) Keys.up = true;
         if(kc === 39) easterBasket.basket.left += 10;
         if(kc === 40) Keys.down = true;
     };


    function randomXPosition() {
        // minimaal 50px van de rand
        var min = 50;
        //maximaal 50px  van de rechterrand
        var max = canvas.width - 50;

        var randomPosition = Math.floor(
            Math.random()*(max-min+1)+min
        );
        return randomPosition;


    
}





    }
    



