/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var floorPos_y;
var cameraPosX;
var pressStartButton;
var gameCharAppear;

var gameChar_x, gameChar_y;
var isLeft, isRight;
var isPlummeting;
var isFalling;
var charAngle = 0;

var enemies;
var enemyAngle;

var collectables;
var canyons;

var sunMovingCircle;
var trees_x;
var treePos_y;
var pointColor_1, pointColor_2;
var booleanPointColor_1;
var booleanPointColor_2;
var clouds;
var booleanCloudSize;
var mountains;
var mountainsColor;

var game_score;
var flagpole;

var lives;
var lifeToken_y;
var lifeToken;

var jumpSound;
var itemSound;
var fallingSound;
var bgm;

var platforms;

function preload()
{
    //sound settings
    soundFormats('mp3','wav');
    
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    itemSound = loadSound('assets/item.mp3');
    itemSound.setVolume(0.5);

    fallingSound = loadSound('assets/falling.mp3');
    fallingSound.setVolume(0.3);    
    
    bgm = loadSound('assets/bgm.mp3');
    bgm.setVolume(0.3); 
    
    enemySound = loadSound('assets/enemy.mp3');
    enemySound.setVolume(0.3); 

}

function setup()
{
	createCanvas(1024, 576);
    floorPos_y = (height * 3/4);
    lives = 3;
    pressStartButton = false;
    startGame();
}

function draw()
{
    console.log(gameChar_y);
    //continually change the value of cameraPosX so that the game character always appears
    //in the center of the screen but the background moves behind them. 
    if(isLeft && isRight)
    {
        cameraPosX = cameraPosX;
    }
    else if(isLeft)
    {
        cameraPosX -= 5;
    }
    else if(isRight)
    {
        cameraPosX += 5;
    }

	background(100,155,255);

    //draw some green ground
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); 

    //translate function to scroll the scenery
    push();
        translate(-cameraPosX, 0);
    
        //CLOUDS
        //create a for loop to traverse the `clouds` array
        drawClouds();

        //MOUNTAIN
        //create many mountains using the corresponding x position from `mountains_x[i]`. 
        drawMountains();

        //TREE
        //create many trees using the corresponding x position from `trees_x[i]`. 
        drawTrees();
    
        for(var i = 0; i < platforms.length ;i++)
        {
            platforms[i].draw();
        }

        //COLLECTABLE ITEM
        //CHECK COLLECTABLE ITEMS
        for(var i = 0; i < collectables.length ;i++)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);        
        }

        //CANYON
        //CHECK CANYON
        for(var i = 0; i < canyons.length ;i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }

        //Sun
        drawSun();
    
        if(pressStartButton)
        //call gameCharacter function
        {
            drawGameChar();
        }
       //check if character touch the enemy
       for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].draw();
            
            var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
            {
                if(isContact && lives > 0)
                {
                    enemySound.play();
                    lives -= 1;
                    startGame();
                    break;
                }
            
            }
        }
 
        renderFlagpole();
        
    pop();

    //Text decoration
    textSize(35);
    strokeWeight(1);
    stroke(0);
    fill(255);

    //The game over message
    if(lives == 0)
    {
        text("Game over. Press space to continue.", 170, height/2);
        noLoop();
        return;
    }
    
    //"Level complete. Press space to continue."
    if(flagpole.isReached)
    {
        text("Level complete. Press space to continue.", 170, height/2);
        noLoop();
        return;
    }

    //gravity
    //automatically return to the ground after jumping
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_x, gameChar_y))
            {
                isContact = true;
                break;
            }
        }
        if(!isContact)
        {
            gameChar_y += 3;
            isFalling = true;
        }
    }
    else
    {
        isFalling = false;
    }
    
    //Score on screen
    textSize(20);
    strokeWeight(1);
    stroke(0);
    fill(255);
    text("score: " + game_score, width - 120, 35);

    //Life token on screen
    for(var i = 0; i < lives; i++)
    {
        //Life Token's Face
        fill(245, 238, 237);
        ellipse(lifeToken[i], lifeToken_y - 60, 25);

        //cap
        fill(255, 0, 0);
        rect(lifeToken[i] -12, lifeToken_y -75, 24, 8, 5, 5, 0, 0);

        //right-eyes
        fill(0);
        ellipse(lifeToken[i] - 4, lifeToken_y - 60, 2, 8);

        //left-eyes
        fill(0);
        ellipse(lifeToken[i] + 4, lifeToken_y - 60, 2, 8);
    }
    
    //character move to the left if isLeft is true and vice versa
    //If both are true, the character stops
    if(isLeft && isRight)
    {
        gameChar_x;
    }
    else if(isLeft)
    {
        gameChar_x -= 5;
    }
    else if(isRight)
    {
        gameChar_x += 5;
    }
    
    if(!flagpole.isReached)
    {
        checkFlagpole();
    }
        
    checkPlayerDie();
    
    //At the beginning, screen stops until space button is pressed
    if(!pressStartButton)
    {
        //Text decoration
        textSize(35);
        strokeWeight(1);
        stroke(0);
        fill(255);
        text("Press space to start.", 350, height/2);
        noLoop();
        gameChar_y = gameChar_y - 494;
    }
    
    //if spacebutton is pressed, the character appears from the top of the screen
    else if(pressStartButton && gameChar_y < floorPos_y && gameCharAppear)
    {
        gameChar_y += 10;
        isLeft = false;
        isRight = false;
    }

    if(dist(gameChar_x, gameChar_y, gameChar_x, floorPos_y) < 10)
    {
       gameCharAppear = false;
    }
}

function keyPressed()
{
	// switch boolean variable true when press key
    if(keyCode == 65 && !isPlummeting)
    {
        isLeft = true;
    }
    else if(keyCode == 68 && !isPlummeting)
    {
        isRight = true;
    }
   
  	// jump with the key "w"
    if((keyCode == 87 && !isFalling && !isPlummeting) || (keyCode == 87 && gameChar_y == 330))
    {
        gameChar_y -= 120;
        jumpSound.play();
    }
    
    // restart the game after no lives or reach the flag
    if(keyCode == 32 && lives == 0)
    {
        lives = 3;
        gameChar_y = floorPos_y;
        loop();
        startGame();
    }
    else if(flagpole.isReached && keyCode == 32)
    {
        lives = 3;
        flagpole.isReached = false;
        loop();
            startGame();

    }
    
    //start the game with space key
    if(keyCode == 32 && !pressStartButton)
    {
        pressStartButton = true;
        gameCharAppear = true;
        loop();
        bgm.play();
    }
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
    if(keyCode == 65)
    {
        isLeft = false;
    }
    else if(keyCode == 68)
    {
        isRight = false;
    }
};

function drawGameChar()
{
        //the game character
        //jumping-left
        if(isLeft && isFalling)
        {
            push();
                var translateY = 49;

                translate(gameChar_x, gameChar_y - 49);
                charAngle = charAngle - 10;
                rotate(radians(charAngle));
                //body
                fill(255, 204, 102);
                strokeWeight(1);
                stroke(0);
                rect(-11, translateY -50, 22, 30, 5);

                //face
                fill(245, 238, 237);
                ellipse(0, translateY - 60, 25);

                //hand
                ellipse(+9, translateY - 30, 7);

                //another-hand
                ellipse(-19, translateY - 57, 7);

               //left-eye
                fill(0);
                ellipse(-4, translateY - 60, 2, 8);

                //cap
                fill(255, 0, 0);
                rect(-12, translateY -75, 24, 8, 5, 5, 0, 0);
                rect(-19, translateY -70, 7,3,1);

                //left-foot
                strokeWeight(6);
                stroke(51, 88, 181);
                line(-8, translateY -18, 0 -15, translateY - 15);

                //right-foot
                line(8, translateY -18, 0 +15, translateY - 15);
                //strokeWeight(1)

                //arm
                line(0, translateY -45, 0 +7, translateY - 35);

                //another-arm
                line(-13, translateY -50, 0 -15, translateY - 53);
                strokeWeight(1);            
            pop(); 

        }
        else if(isRight && isFalling)
        {
            //jumping-right
            
            var translateY = 49;
            push();
                translate(gameChar_x, gameChar_y - 49);
                charAngle = charAngle + 14;
                rotate(radians(charAngle));
                
                //body
                fill(255, 204, 102);
                strokeWeight(1);
                stroke(0);
                rect(-11, translateY -50, 22, 30, 5);

                //face
                fill(245, 238, 237);
                ellipse(0, translateY - 60, 25);

                //hand
                ellipse(-9, translateY - 30, 7);

                //another-hand
                ellipse(19, translateY - 57, 7);

                //right-eye
                fill(0);
                ellipse(4, translateY - 60, 2, 8);

                //cap
                fill(255, 0, 0);
                rect(-12, translateY -75, 24, 8, 5, 5, 0, 0);
                rect(12, translateY -70, 7,3,1);

                //left-foot
                strokeWeight(6);
                stroke(51, 88, 181);
                line(-8, translateY -18, 0 -15, translateY - 15);

                //right-foot
                line(8, translateY -18, 0 +15, translateY - 15);

                //arm
                line(0, translateY -45, 0 -7, translateY - 35);

                //another-arm
                line(13, translateY -50, 0 +15, translateY - 53);
                strokeWeight(1);            
            pop();
            
        }
        else if(isLeft && !isRight)
        {
            //walking left
            fill(255, 204, 102);
            strokeWeight(1);
            stroke(0);
            rect(gameChar_x -11, gameChar_y -50, 22, 30, 5);

            //face
            fill(245, 238, 237);
            ellipse(gameChar_x, gameChar_y - 60, 25);

            //hand
            ellipse(gameChar_x, gameChar_y - 30, 7);

            //left-eye
            fill(0);
            ellipse(gameChar_x - 4, gameChar_y - 60, 2, 8);

            //cap
            fill(255, 0, 0);
            rect(gameChar_x -12, gameChar_y -75, 24, 8, 5, 5, 0, 0);
            rect(gameChar_x -19, gameChar_y -70, 7,3,1);

            //left-foot
            strokeWeight(6);
            stroke(51, 88, 181);
            line(gameChar_x -5, gameChar_y -18, gameChar_x -5, gameChar_y - 10);

            //right-foot
            line(gameChar_x +5, gameChar_y -18, gameChar_x +10, gameChar_y - 10);
            //strokeWeight(1)

            //arm
            line(gameChar_x, gameChar_y -45, gameChar_x, gameChar_y - 35);
            strokeWeight(1);
        }
        else if(isRight && !isLeft)
        {
            //wzalking right
             //body
            fill(255, 204, 102);
            strokeWeight(1);
            stroke(0);
            rect(gameChar_x -11, gameChar_y -50, 22, 30, 5);

            //face
            fill(245, 238, 237);
            ellipse(gameChar_x, gameChar_y - 60, 25);

            //hand
            ellipse(gameChar_x, gameChar_y - 30, 7);

            //right-eye
            fill(0);
            ellipse(gameChar_x + 4, gameChar_y - 60, 2, 8);

            //cap
            fill(255, 0, 0);
            rect(gameChar_x -12, gameChar_y -75, 24, 8, 5, 5, 0, 0);
            rect(gameChar_x +12, gameChar_y -70, 7,3,1);

            //left-foot
            strokeWeight(6);
            stroke(51, 88, 181);
            line(gameChar_x -5, gameChar_y -18, gameChar_x -10, gameChar_y - 10);

            //right-foot
            line(gameChar_x +5, gameChar_y -18, gameChar_x +5, gameChar_y - 10);

            //arm
            line(gameChar_x, gameChar_y -45, gameChar_x, gameChar_y - 35);
            strokeWeight(1);

        }
        else if((isFalling || isPlummeting) && gameChar_y != 330)
        {
            //jumping facing forwards
            //body
            fill(255, 204, 102);
            strokeWeight(1);
            stroke(0);
            rect(gameChar_x -12, gameChar_y -50, 24, 30, 5);

            //face
            fill(245, 238, 237);
            ellipse(gameChar_x, gameChar_y - 60, 25);

            //left-hand
            ellipse(gameChar_x - 17, gameChar_y - 62, 7);

            //right-hand
            ellipse(gameChar_x + 17, gameChar_y - 62, 7); 

            //left-foot
            strokeWeight(6);
            stroke(51, 88, 181);
            line(gameChar_x -10, gameChar_y -18, gameChar_x -16, gameChar_y - 16);

            //right-foot
            line(gameChar_x +10, gameChar_y -18, gameChar_x +16, gameChar_y - 16);

            //left-arm
            line(gameChar_x -17, gameChar_y -55, gameChar_x -17, gameChar_y - 45);

            //right-arm
            line(gameChar_x +17, gameChar_y -55, gameChar_x +17, gameChar_y - 45);

            strokeWeight(1);

            //cap
            fill(255, 0, 0);
            rect(gameChar_x -12, gameChar_y -75, 24, 8, 5, 5, 0, 0);

            //left-eyes
            fill(0);
            ellipse(gameChar_x - 4, gameChar_y - 60, 2, 8);

            //right-eyes
            fill(0);
            ellipse(gameChar_x + 4, gameChar_y - 60, 2, 8);

        }
        else
        {
            //standing front facing
            //body
            fill(255, 204, 102);
            strokeWeight(1);
            stroke(0);
            rect(gameChar_x -12, gameChar_y -50, 24, 30, 5);

            //face
            fill(245, 238, 237);
            ellipse(gameChar_x, gameChar_y - 60, 25);

            //cap
            fill(255, 0, 0);
            rect(gameChar_x -12, gameChar_y -75, 24, 8, 5, 5, 0, 0);

            //right-eyes
            fill(0);
            ellipse(gameChar_x - 4, gameChar_y - 60, 2, 8);

            //left-eyes
            fill(0);
            ellipse(gameChar_x + 4, gameChar_y - 60, 2, 8);

            //left-hand
            fill(245, 238, 237);
            ellipse(gameChar_x - 17, gameChar_y - 29, 7);

            //right-hand
            ellipse(gameChar_x + 17, gameChar_y - 29, 7); 

            //left-foot
            strokeWeight(6);
            stroke(51, 88, 181);
            line(gameChar_x -5, gameChar_y -18, gameChar_x -5, gameChar_y - 10);

            //right-foot
            line(gameChar_x +5, gameChar_y -18, gameChar_x +5, gameChar_y - 10);
            strokeWeight(1);

            fill(51, 88, 181);
            //right-arm
            rect(gameChar_x + 14, gameChar_y - 48, 5, 15, 2);

            //left-arm
            rect(gameChar_x - 19, gameChar_y - 48, 5, 15, 2);
        }    
}

function drawClouds()
{
    fill(255,255,255);
    for(var i = 0; i < clouds.length; i++){

        //keep changing the clouds sizes
        //by switch true and false according to the size
        if(clouds[i].size == 110)
        {
            booleanCloudSize = false;
        }
        else if(clouds[i].size == 80)
        {
            booleanCloudSize = true;
        }

        //if the cloud big enough it start shrinking, and vise versa
        if(booleanCloudSize)
        {
            clouds[i].size++;
        }
        else
        {
            clouds[i].size--;
        }
        
        //draw each cloud with the position and size determined by the 
        //corresponding object in the array
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size);
        ellipse(clouds[i].x_pos -40, clouds[i].y_pos, clouds[i].size -15);
        ellipse(clouds[i].x_pos +40, clouds[i].y_pos, clouds[i].size -15);
    }   
}

function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        fill(56, 74, 138);
        for(var i = 0; i < mountains.length; i++)
        {
            fill(mountainsColor[i]);
            triangle(mountains[i].x_pos1, mountains[i].y_pos1, 
                     mountains[i].x_pos2, mountains[i].y_pos2, 
                     mountains[i].x_pos3, mountains[i].y_pos3);
        }
    }
}

function drawTrees()
{
   for(var i = 0; i < trees_x.length; i++){
        //trunk
        fill(150, 70, 17);
        rect(trees_x[i], treePos_y, 63, 145);

        //branches
        fill(0, 155, 0);
        triangle(trees_x[i] - 80, treePos_y + 30, trees_x[i] + 150, treePos_y + 30, trees_x[i] + 30, treePos_y -40);
        triangle(trees_x[i] - 80, treePos_y, trees_x[i] + 150, treePos_y, trees_x[i] + 30, treePos_y -80);

        //Switch true and false to keep changing the decoration color of mountains
        if(pointColor_1 == 255)
        {
            booleanPointColor_1 = false;
        }
        else if(pointColor_1 == 50)
        {
            booleanPointColor_1 = true;
        }
        
        //Switch true and false to keep changing the decoration color of mountains
        //I use 2 variables for color variation
        if(pointColor_2 == 255)
        {
            booleanPointColor_2 = false;
        }
        else if(pointColor_2 == 50)
        {
            booleanPointColor_2 = true;
        }

        //If the boolean is true, the value of variable increase and vice versa
        if(booleanPointColor_1)
        {
            pointColor_1++;
        }
        else
        {
            pointColor_1--;
        }

        //If the boolean is true, the value of variable increase and vice versa
        //I use 2 variables for color variation
        if(booleanPointColor_2)
        {
            pointColor_2++;
        }
        else
        {
            pointColor_2--;
        }
        
        //change the decoration colors using pointColor variables
        strokeWeight(12);
        stroke(pointColor_1,90,pointColor_2);
        point(trees_x[i], treePos_y);
        stroke(pointColor_2,100,pointColor_1);
        point(trees_x[i] + 30, treePos_y);
        stroke(pointColor_1,pointColor_2,150);
        point(trees_x[i] + 10, treePos_y + 20);
        stroke(0, pointColor_1, pointColor_2);
        point(trees_x[i] + 40, treePos_y -30);
        stroke(pointColor_2,100, pointColor_1);
        point(trees_x[i], treePos_y - 40);
        stroke(200, pointColor_2, pointColor_1);
        point(trees_x[i] + 70, treePos_y - 30);
        stroke(pointColor_1,130, pointColor_2);
        point(trees_x[i] -15, treePos_y - 20);
        stroke(pointColor_2, pointColor_1, 170);
        point(trees_x[i] + 50, treePos_y + 10);
        noStroke();
    } 
}

function drawCollectable(t_collectable)
{
    //if collectable item is not found by character, it remains on the screen
    if(!t_collectable.isFound){
        fill(32, 214, 66);
        triangle(t_collectable.x_pos -2, t_collectable.y_pos -20,t_collectable.x_pos +8, t_collectable.y_pos -33, t_collectable.x_pos +5, t_collectable.y_pos -42);
        fill(255, 0, 0);
        ellipse(t_collectable.x_pos -5, t_collectable.y_pos -13, t_collectable.size, t_collectable.size +5);
        ellipse(t_collectable.x_pos +5, t_collectable.y_pos -13, t_collectable.size, t_collectable.size +5);
    }
}

function checkCollectable(t_collectable)
{
    if(dist(gameChar_x, gameChar_y,t_collectable.x_pos,t_collectable.y_pos) < t_collectable.size && !t_collectable.isFound)
    {
        t_collectable.isFound = true;
        game_score += 1;
        itemSound.play();

    }
}

function drawCanyon(t_canyon)
{
    fill(100, 155, 255);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height);
    fill(32, 87, 214);
    rect(t_canyon.x_pos, floorPos_y + 50, t_canyon.width, height);
}

function checkCanyon(t_canyon)
{
    if(dist(gameChar_x, gameChar_y, t_canyon.x_pos + t_canyon.width/2, floorPos_y) < 25 && !isPlummeting)
    {
        isPlummeting = true;
        t_canyon.falling = true;
        fallingSound.play();
    }

    if(t_canyon.falling){
        gameChar_y += 3;
        isLeft = false;
        isRight = false;
    }
}

function drawSun()
{
    push();
        translate(100, 100);
        fill(255, 255, 153);
        ellipse(0, 0, 100);
        rotate(sunMovingCircle);

        //small circles keep rotating around the sun 
        push();
            translate(52, 52);
            ellipse(0, 0, 17);
        pop();
        push();
            translate(-52, -52);
            ellipse(0, 0, 17);
        pop();
        push();
            translate(52, -52);
            ellipse(0, 0, 17);
        pop();
        push();
            translate(-52, 52);
            ellipse(0, 0, 17);
        pop();
        push();
            translate(70, 0);
            ellipse(0, 0, 17);
        pop();
        push();
            translate(-70, 0);
            ellipse(0, 0, 17);
        pop();
        push();
            translate(0, 70);
            ellipse(0, 0, 17);
        pop();
        push();
            translate(0, -70);
            ellipse(0, 0, 17);
        pop();

        //rotate circles by increasing the value
        sunMovingCircle += 0.01;
    
    pop();
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y -250);
    fill(255, 0, 255);
    noStroke();
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y -250, 50, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y -50, 50, 50);
    }
    pop();
}

function checkFlagpole()
{
    var distance = abs(gameChar_x - flagpole.x_pos);

    if(distance < 15)
    {
        flagpole.isReached = true;
    }
}

function checkPlayerDie()
{
    if(gameChar_y - 70 > height && lives > 1)
    {
        lives -= 1;
        startGame();       
    }
    else if(gameChar_y - 70 > height && lives == 1)
    {
        lives -= 1;
    }
}

function startGame()
{

    cameraPosX = 0;

	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    gameCharAppear = false;
    
    //initialise trees_x variable with an array of numbers.
    //Each number represent the x-positions at which a tree will be drawn on the canvas
    trees_x = [300, 900, 500, 1150];
    treePos_y = floorPos_y - 145;
    pointColor_1 = 0;
    pointColor_2 = 100;
    booleanPointColor_1 = true, booleanPointColor_2 = true;
    booleanCloudSize = true;

    //initialise clouds variable with array of values x_pos, y_pos and size
    clouds = [
        {x_pos:800, y_pos:150, size:80},   
        {x_pos:300, y_pos:170, size:80},
        {x_pos:550, y_pos:200, size:80}
    ];

    //initialize the mountains variables
    mountains = [
        {x_pos1: 700, y_pos1: floorPos_y -350, x_pos2: 760, y_pos2:floorPos_y, x_pos3:640, y_pos3: floorPos_y},
        {x_pos1: 750, y_pos1: floorPos_y -300, x_pos2: 800, y_pos2:floorPos_y, x_pos3:700, y_pos3: floorPos_y},
         {x_pos1: 800, y_pos1: floorPos_y -180, x_pos2: 730, y_pos2:floorPos_y, x_pos3:870, y_pos3: floorPos_y},
        {x_pos1: 850, y_pos1: floorPos_y -200, x_pos2: 920, y_pos2:floorPos_y, x_pos3:780, y_pos3: floorPos_y},
        {x_pos1: 650, y_pos1: floorPos_y -150, x_pos2: 710, y_pos2:floorPos_y, x_pos3:590, y_pos3: floorPos_y},
    ];

    mountainsColor = [
        "SlateBlue", 
        "DarkBlue", 
        "DarkGreen", 
        "Silver", 
        "DimGray"
    ];

    //initialize the size of the moving circle around the sun
    sunMovingCircle = 0;

    isLeft = false;
    isRight = false;
    isPlummeting = false;
    isFalling = false;
    
    collectables = [
        {x_pos: 55, y_pos: floorPos_y, size: 20, isFound: false},
        {x_pos: 400, y_pos: floorPos_y, size: 23, isFound: false},
        {x_pos: 800, y_pos: floorPos_y, size: 18, isFound: false},
        {x_pos: 1200, y_pos: floorPos_y, size: 25, isFound: false},
        {x_pos: 1600, y_pos: floorPos_y, size: 20, isFound: false}
        
    ];

    canyons = [
        {x_pos: 100, width: 100, falling: false},
        {x_pos: 1000, width: 80, falling: false},
        {x_pos: 1400, width: 120, falling: false}
    ];
    
    platforms = [];
    
    platforms.push(createPlatforms(100, floorPos_y - 100, 100));
    platforms.push(createPlatforms(800, floorPos_y - 100, 100));
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 1800};

    lifeToken = [980, 950, 920];
    lifeToken_y = 120;

    //calling Enemy and push them into array 
    enemies = [];
    enemies.push(new Enemy(220, floorPos_y, 700));
    enemies.push(new Enemy(600, floorPos_y, 300));

    enemyAngle = 0;
    
    
}

//Platforms
function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(255, 0, 255);
            rect(this.x, this.y, this.length, 20);
        },        
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    };
    
    return p;
}


//create enemy using constructor function
function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc -= 1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }

    };
  
    this.draw = function()
    {
        this.update();
        
        push();
            enemyAngle += 5; 
            translate(this.currentX, this.y - 35);
            rotate(radians(enemyAngle));
            //face
            fill(228, 148, 255);
            ellipse(0, 22.5 - 25, 45);

            //top spine
            triangle(0, 22.5 - 60, //top 
                     0 - 5, 22.5 - 50, //bottom_left
                     0 + 5, 22.5 - 50) //bottom_right

            //right spine
            triangle(0 + 35, 22.5 - 28, //top 
                     0 + 25, 22.5 - 33, //bottom_left
                     0 + 25, 22.5 - 23) //bottom_right

            //bottom spine
            triangle(0, 22.5 + 10, //top 
                     0 - 5, 22.5, //bottom_left
                     0 + 5, 22.5) //bottom_right

            //left spine
            triangle(0 - 35, 22.5 - 28, //top 
                     0 - 25, 22.5 - 33, //bottom_left
                     0 - 25, 22.5 - 23) //bottom_right

            //eyes
            fill(255);
            ellipse(0 - 9, 22.5 - 32, 14, 14);
            ellipse(0 + 9, 22.5 -32, 14, 14);

            //eyes
            fill(30);
            ellipse(0 - 9, 22.5 - 32, 8, 8);
            ellipse(0 + 9, 22.5 -32, 8, 8);

            //mouse
            noFill();
            stroke(0)
            strokeWeight(3);
            arc(0, 22.5 - 27, 30, 30, QUARTER_PI, PI - QUARTER_PI );
            strokeWeight(1);
        
        pop();
    };
    
    //check if the character touches the enemy
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 40)
        {
            return true;
        }
        
        return false;
    };
}
