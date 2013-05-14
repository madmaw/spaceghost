var alone = {

    Modes : {
        Menu : 0,
        Intro : 1,
        Play : 2
    },

    Menus : {
        Continue : 0,
        Restart : 1
    },
    MenuLast : 1,

    SpecialKeyCodes: {
        ArrowLeft : 37,
        ArrowUp : 38,
        ArrowRight : 39,
        ArrowDown : 40,
        Enter : 13,
        Space : 32,
        BackSpace : 8

    },

    ObjectTypes : {
        Player : 0,
        Target : 1,
        Missile : 2,
        Asteriod : 3,
        Bonus : 4,
        Explosion : 5
    },

    EnemyTypes : {
        Lady : 0,
        Happy : 1
    },


    createResources: function (width, height, leveldata, fps) {
        var resources = new Object();
        resources.canvasWidth = width;
        resources.canvasHeight = height;
        resources.backgroundColor = "#000000";
        resources.selectedMenuColors = ["#ffff00", "#ffffff"];
        resources.unselectedMenuColors = ["#888888", "#aaaaaa"];
        resources.playCoordinatesColors = ["#ffff00", "#ffffff"];
        resources.fps = fps;
        resources.missileLineWidth = 2;
        resources.missileColors = [
            "rgba(255, 200, 0, 1)",
            "rgba(255, 200, 0, 0.9)",
            "rgba(255, 200, 0, 0.8)",
            "rgba(255, 200, 0, 0.7)",
            "rgba(255, 200, 0, 0.6)",
            "rgba(255, 200, 0, 0.5)",
            "rgba(255, 200, 80, 0.4)",
            "rgba(255, 200, 60, 0.3)",
            "rgba(255, 200, 40, 0.2)",
            "rgba(255, 200, 20, 0.1)"
        ];
        resources.explosionColors = [
            "rgba(255, 200, 0, 1)",
            "rgba(255, 200, 0, 0.95)",
            "rgba(255, 200, 0, 0.9)",
            "rgba(255, 200, 0, 0.85)",
            "rgba(255, 200, 0, 0.8)",
            "rgba(255, 200, 0, 0.75)",
            "rgba(255, 200, 0, 0.65)",
            "rgba(255, 200, 0, 0.4)",
            "rgba(255, 200, 0, 0.1)"
        ];
        resources.helpMessage = [
            "HELP!",
            "ENTER A FORMULA TO DEFINE THE MISSILES PATH",
            "THERE IS ONLY ONE PREDEFINED VARIABLE, TIME (t)",
            "EXAMPLE INPUT",
            "x = 0",
            "y = t",
            "lnch",
            "YOU CAN USE JAVASCRIPT FUNCTIONS AND CONSTANTS",
            "EXAMPLE. Math.sin(t), Math.PI, Math.sqrt(t)",
            "",
            "SPECIAL COMMANDS",
            "(L)NCH: LAUNCH THE MISSILE",
            "CLR: CLEAR THE SCREEN",
            "CMD: CHECK EXISTING COMMANDS",
            "EXIT: RETURN TO TITLE SCREEN",
            "?: HELP"
        ]
        // load up the images
        resources.playerImages = new Array();
        for( var  i=1; i<=40; i++ ) {
            var image = new Image();
            image.src = "station_small_amber_"+i+".png";
            resources.playerImages.push(image);
        }

        resources.ghostImages = new Array();
        for( var i=0; i<=3; i++ ) {
            var images = new Array();
            for( var j=1; j<=20; j++ ) {
                var image = new Image();
                image.src = "ghost_small_"+i+"_"+j+".png";
                images.push(image);
            }
            resources.ghostImages.push(images);
        }

        resources.bonusImages = new Array();
        for( var i=1; i<20; i++ ) {
            var image = new Image();
            image.src = "bonus_small_"+i+".png";
            resources.bonusImages.push(image);
        }

        resources.lineColors = [
            "rgba(255, 255, 255, 0.25)",
            "rgba(255, 255, 255, 0.20)"
        ];

        var statusStripHeight = 18;
        resources.playAreaHeight = height - statusStripHeight;
        resources.playAreaWidth = width;

        resources.statusStripBackgroundColors = ["#ffaa00", "#ffbb00"];
        resources.asteroidBackgroundColors = ["rgba(255, 200, 0, 0.5)", "rgba(255, 210, 0, 0.5)"];
        resources.asteroidStrokeColors = ["#ffaa00", "#ffbb00"];
        resources.statusStripHeight = statusStripHeight;
        resources.statusStripWidth = width;
        resources.statusStripX = 0;
        resources.statusStripY = resources.playAreaHeight;
        resources.statusStripFont = "bold "+(statusStripHeight * 0.8)+"px Courier New";
        resources.statusStripTextColors = ["#000000"];
        resources.asteroidLineWidth = 3;
        resources.minGridGap = width / 10;
        resources.terminalFontHeight = statusStripHeight;
        resources.terminalFont = "bold "+(resources.terminalFontHeight)+"px Courier New";
        resources.terminalFontColors = ["#ffaa00", "#ffbb00"];

        var menuItemWidth = width / 2;
        var menuItemX = (width - menuItemWidth)/2;
        var menuItemHeight = height / ((alone.MenuLast+1) * 2 + 1);
        resources.menuTitleFont = "bold "+(menuItemHeight / 3)+"px Courier New";
        resources.menuPositions = new Array();
        for( var i = 0; i<=alone.MenuLast; i++ ) {
            resources.menuPositions[i] = {
                x : menuItemX,
                y : (i * 2 + 1) * menuItemHeight,
                width : menuItemWidth,
                height : menuItemHeight
            };
        }
        resources.leveldata = leveldata;

        // load up the images and sounds?

        resources.explosionSound = new Audio("explosion.wav");
        resources.bonusSound = new Audio("bonus.wav");
        resources.launchSound = new Audio("launch.wav");
        resources.startSound = new Audio("start.wav");

        return resources;
    },

    createInitialGameState: function(resources) {
        var gameState = new Object();
        gameState.mode = alone.Modes.Menu;
        gameState.selectedMenu = null;
        gameState.activeMenu = null;
        gameState.highestLevel = 0;
        gameState.previousInput = new Array();
        gameState.ticks = 0;
        gameState.score = 0;
        gameState.highScore = null;
        return gameState;
    },

    createLevel: function (levelId, gameState, resources) {
        var level = new Object();
        level.startTick = gameState.ticks;
        var lid = levelId % resources.leveldata.length;
        var levelData = resources.leveldata[lid];
        level.objects = new Array();
        level.id = levelId;

        var xscale = resources.canvasWidth / levelData.bounds.width;
        var yscale = resources.canvasHeight / levelData.bounds.height;
        var xoffset = -levelData.bounds.x * xscale;
        var yoffset = -levelData.bounds.y * yscale;

        level.xscale = xscale;
        level.yscale = yscale;
        level.xoffset = xoffset;
        level.yoffset = yoffset;
        level.bounds = levelData.bounds;
        level.preamble = levelData.preamble;
        level.queuedCommandQueues = new Array();

        level.output = new Array();
        level.output.push(level.preamble);
        level.output.push("");

        level.commandQueue = new Array();


        var toScreenX = function(x) {
            return xscale * x + xoffset;
        };
        var toScreenY = function(y) {
            return resources.playAreaHeight - (yscale * y + yoffset);
        };
        var fromScreenX = function(x) {
            return (x - xoffset)/xscale;
        };
        var fromScreenY = function(y) {
            return ((resources.playAreaHeight - y) - yoffset)/yscale;
        };

        level.zerox = toScreenX(0);
        level.zeroy = toScreenY(0);
        level.onex = Math.abs(toScreenX(1) - level.zerox);
        level.oney = Math.abs(toScreenY(1) - level.zeroy);

        var imageDivisor = 200;

        for( var i = 0; i<levelData.objects.length; i++ ) {
            var objectData = levelData.objects[i];
            var object = new Object();
            object.type = objectData.type;
            if( objectData.type == alone.ObjectTypes.Player ) {
                object.x = toScreenX(objectData.x);
                object.y = toScreenY(objectData.y);
                object.width = resources.playerImages[0].width * xscale / imageDivisor;
                object.height = resources.playerImages[0].height * yscale / imageDivisor;
            } else if( objectData.type == alone.ObjectTypes.Target || objectData.type == alone.ObjectTypes.Bonus ) {
                object.x = toScreenX(objectData.x);
                object.y = toScreenY(objectData.y);
                object.r = objectData.r * xscale;
                object.targetType = objectData.targetType;
            } else if( objectData.type == alone.ObjectTypes.Asteriod ) {
                object.points = new Array();
                for( var j = 0; j<objectData.points.length; j++ ) {
                    var point = objectData.points[j];
                    object.points.push(
                        { x: toScreenX(point.x), y:toScreenY(point.y) }
                    );
                }
                // work out bounds
                object.bounds = collisions.calculatePolygonBounds(object.points);
                object.originalPoints = objectData.points;
                object.transform = objectData.transform;
            }
            level.objects.push(object);
        }
        level.toScreenX = toScreenX;
        level.toScreenY = toScreenY;
        level.fromScreenX = fromScreenX;
        level.fromScreenY = fromScreenY;

        return level;
    },

    doCycle: function(canvasContext, gameState, resources) {
        alone.update(gameState, resources);
        alone.render(canvasContext, gameState, resources);
    },

    handleMouseEvent: function(x, y, clicked, gameState, resources) {
        if( gameState.mode == alone.Modes.Menu ) {
            alone.menu.handleMouseEvent(x, y, clicked, gameState, resources);
        } else if( gameState.mode == alone.Modes.Play ) {
            alone.play.handleMouseEvent(x, y, clicked, gameState, resources);
        }
    },

    handleKeyboardPress: function(evt, charCode, gameState, resources) {
        if( gameState.mode == alone.Modes.Menu ) {
            //alone.menu.handleKeyboardPress(evt, charCode, gameState, resources);
        } else if( gameState.mode == alone.Modes.Play ) {
            alone.play.handleKeyboardPress(evt, charCode, gameState, resources);
        }
    },

    handleKeyboardDown: function(evt, gameState, resources) {
        if( gameState.mode == alone.Modes.Menu ) {
            alone.menu.handleKeyboardDown(evt, gameState, resources);
        } else if( gameState.mode == alone.Modes.Play ) {
            alone.play.handleKeyboardDown(evt, gameState, resources);
        }
    },

    update: function(gameState, resources) {
        gameState.ticks++;
        if( gameState.mode == alone.Modes.Menu ) {
            alone.menu.update(gameState, resources);
        } else if( gameState.mode == alone.Modes.Play ) {
            alone.play.update(gameState, resources);
        }
    },

    render: function(canvasContext, gameState, resources) {
        if( gameState.mode == alone.Modes.Menu ) {
            alone.menu.render(canvasContext, gameState, resources);
        } else if( gameState.mode == alone.Modes.Play ) {
            alone.play.render(canvasContext, gameState, resources);
        }
    },

    menu : {

        handleMouseEvent: function(x, y, clicked, gameState, resources) {
            var selectedMenu = null;
            for( var i=0; i<resources.menuPositions.length; i++ ) {
                var menuPosition = resources.menuPositions[i];
                if( menuPosition.x <= x && menuPosition.y <= y && menuPosition.x + menuPosition.width > x && menuPosition.y + menuPosition.height > y ) {
                    if( !clicked ) {
                        selectedMenu = i;
                    } else {
                        gameState.activeMenu = i;
                    }
                    break;
                }
            }
            gameState.selectedMenu = selectedMenu;
        },

        handleKeyboardDown: function(evt, gameState, resources) {
            var selectedMenu = gameState.selectedMenu;
            var lastMenu = alone.MenuLast;
            if( evt.keyCode == alone.SpecialKeyCodes.ArrowDown ) {
                if( selectedMenu == null ) {
                    selectedMenu = 0;
                } else {
                    selectedMenu++;
                    if( selectedMenu > lastMenu ) {
                        selectedMenu = 0;
                    }
                }
            } else if( evt.keyCode == alone.SpecialKeyCodes.ArrowUp ) {
                if( selectedMenu == null ) {
                    selectedMenu = lastMenu;
                } else {
                    selectedMenu--;
                    if( selectedMenu < 0 ) {
                        selectedMenu = lastMenu;
                    }
                }
            } else if( evt.keyCode == alone.SpecialKeyCodes.Space || evt.keyCode == alone.SpecialKeyCodes.Enter ) {
                gameState.activeMenu = selectedMenu;
            }
            gameState.selectedMenu = selectedMenu;
        },

        update: function(gameState, resources) {
            if( gameState.activeMenu == alone.Menus.Continue ) {
                // we want to adjust the game state to reflect the selected option
                if( gameState.highestLevel != null ) {
                    gameState.currentLevel = alone.createLevel(gameState.highestLevel, gameState, resources);
                    gameState.mode = alone.Modes.Play;
                } else {
                    gameState.currentLevel = alone.createLevel(0, gameState, resources);
                    gameState.mode = alone.Modes.Play;
                }
                gameState.score = 0;
            } else if( gameState.activeMenu == alone.Menus.Restart ) {
                gameState.currentLevel = alone.createLevel(0, gameState, resources);
                gameState.mode = alone.Modes.Play;
                gameState.score = 0;
            }
        },

        render: function(canvasContext, gameState, resources) {

            canvasContext.fillStyle = resources.backgroundColor;
            canvasContext.fillRect(0, 0, resources.canvasWidth, resources.canvasHeight);
            var count = 0;
            for( menuName in alone.Menus ) {
                var menuId = alone.Menus[menuName];
                if( menuId == gameState.selectedMenu ) {
                    var color = resources.selectedMenuColors[gameState.ticks % resources.selectedMenuColors.length];
                    canvasContext.strokeStyle = color;
                    canvasContext.fillStyle = color;
                } else {
                    var color = resources.unselectedMenuColors[gameState.ticks % resources.unselectedMenuColors.length];
                    canvasContext.strokeStyle = color;
                    canvasContext.fillStyle = color;
                }
                var menuRect = resources.menuPositions[menuId];
                canvasContext.strokeRect(menuRect.x, menuRect.y, menuRect.width, menuRect.height);
                canvasContext.font = resources.menuTitleFont;
                canvasContext.textAlign = "center";
                canvasContext.fillText(menuName.toUpperCase(), menuRect.x + menuRect.width/2, menuRect.y + menuRect.height/2, menuRect.width);
                count++;
            }
        }

    },

    play: {
        handleMouseEvent: function(x, y, clicked, gameState, resources) {
            var level = gameState.currentLevel;
            var coordinate = {
                "x":level.fromScreenX(x),
                "y":level.fromScreenY(y)
            };
            gameState.mouseCoordinate = coordinate;
            if( clicked ) {
                gameState.lockedCoordinate = coordinate;
            }
        },

        handleKeyboardDown: function(evt, gameState, resources) {
            var level = gameState.currentLevel;
            var output = level.output;
            var line = output[output.length - 1];
            if( evt.keyCode == alone.SpecialKeyCodes.BackSpace ) {
                if( line.length > 0 ) {
                    line = line.substring(0, line.length-1);
                    output[output.length - 1] = line;
                }
            } else if( evt.keyCode == alone.SpecialKeyCodes.ArrowUp ) {
                var index = gameState.scrollIndex;
                if( index == null ) {
                    index = gameState.previousInput.length;
                }
                if( index > 0 ) {
                    index--;
                    output[output.length - 1] = gameState.previousInput[index];
                    gameState.scrollIndex = index;
                }
            } else if( evt.keyCode == alone.SpecialKeyCodes.ArrowDown ) {
                var index = gameState.scrollIndex;
                if( index == null ) {
                    index = gameState.previousInput.length;
                }
                if( index < gameState.previousInput.length - 1 ) {
                    index++;
                    output[output.length - 1] = gameState.previousInput[index];
                    gameState.scrollIndex = index;
                }
            }
            level.output = output;
        },

        handleKeyboardPress: function(evt, charCode, gameState, resources) {
            var level = gameState.currentLevel;
            var output = new Array();
            var line = level.output[level.output.length - 1];
            // check for special characters
            if( evt.keyCode == alone.SpecialKeyCodes.Enter ) {
                // check the command
                line = line.trim();
                if( (gameState.previousInput.length == 0 || gameState.previousInput[gameState.previousInput.length-1] != line) && line.length > 0  ) {
                    gameState.previousInput.push(line);
                }
                gameState.scrollIndex = null;
                if( line.length == 0 ) {
                    // do nothing
                } else {
                    // make sure it doesn't execute though
                    // otherwise we assume it's probably OK
                    if( line.toUpperCase() == "CLR" || line.toUpperCase() == "CLEAR" ) {
                        level.output = new Array();
                        output.push(gameState.currentLevel.preamble);
                    } else if( line == "?" ) {
                        gameState.output = new Array();
                        for( var i = 0; i<resources.helpMessage.length; i++ ) {
                            output.push(resources.helpMessage[i]);
                        }
                    } else if( line.toUpperCase() == "EXIT" || line.toUpperCase() == "QUIT" ) {
                        gameState.mode = alone.Modes.Menu;
                        gameState.activeMenu = null;
                    } else if( line.toUpperCase() == "L" || line.toUpperCase() == "LNCH" || line.toUpperCase() == "LAUNCH" ) {
                        // check that x and y have values set
                        var hasX = false;
                        var hasY = false;
                        for( var i = 0; i<level.commandQueue.length; i++ ) {
                            var command = level.commandQueue[i];
                            if( command.variable == "x" ) {
                                hasX = true;
                            } else if( command.variable == "y" ) {
                                hasY = true;
                            }
                        }
                        if( hasX && hasY ) {
                            // we launch
                            level.queuedCommandQueues.push(level.commandQueue);
                            // keep the command queue
                            //level.commandQueue = new Array();
                        } else {
                            output.push("MUST SPECIFY EXPRESSIONS FOR X AND Y");
                        }
                    } else if( line.toUpperCase() == "CMD" || line.toUpperCase() == "COMMANDS" ) {
                        for( var i = 0; i<level.commandQueue.length; i++ ) {
                            var command = level.commandQueue[i];
                            output.push(command.variable +" = "+command.expression);
                        }
                    } else {
                        try {
                            // attempt some rudimentary parsing
                            eval("(function(){"+line+";})");
                            var equalsIndex = line.indexOf('=');
                            if( equalsIndex > 0 ) {
                                var variableName = line.substring(0, equalsIndex).trim();
                                if( variableName != "t" ) {
                                    var expression = line.substring(equalsIndex+1).trim();
                                    // check that the variable doesn't already exist
                                    for( var i = 0; i<level.commandQueue.length; i++ ) {
                                        var command = level.commandQueue[i];
                                        if( command.variable == variableName ) {
                                            level.commandQueue.splice(i, 1);
                                            break;
                                        }
                                    }
                                    level.commandQueue.push(
                                        {
                                            "variable":variableName,
                                            "expression":expression
                                        }
                                     );
                                } else {
                                    output.push("CANNOT REDEFINE (t)IME");
                                }
                            } else {
                                output.push("EXPECTED [variable name] = [expression]");
                            }
                        } catch( e ) {
                            output.push("SYNTAX ERROR");
                        }
                    }
                }
                output.push("");
            } else {
                line = line + String.fromCharCode(charCode);
                level.output[level.output.length-1] = line;
            }
            // check that we wont run out of space with this batch of commands
            if( (level.output.length + output.length ) * resources.terminalFontHeight > resources.playAreaHeight ) {
                level.output = output;
            } else {
                for( var i=0; i<output.length; i++ ) {
                    level.output.push(output[i]);
                }
            }
        },


        update: function(gameState, resources) {
            // for every queued command queue, add a missile
            var level = gameState.currentLevel;
            var levelTicks = gameState.ticks - level.startTick;
            if( levelTicks == resources.fps / 4 ) {
                resources.startSound.play();
            }
            var queuedCommandQueues = level.queuedCommandQueues;
            // TODO there should be a maximum rate of fire
            for( var i=0; i<queuedCommandQueues.length; i++ ) {
                var missile = new Object();
                var commandQueue = queuedCommandQueues[i];
                try {
                    var positionString = "(function(t){ var x; var y;";
                    for( var j=0; j<commandQueue.length; j++ ) {
                        var command = commandQueue[j];
                        var variable = command.variable;
                        var expression = command.expression;
                        if( variable != "x" && variable != "y" ) {
                            positionString += "var ";
                        }
                        positionString += variable;
                        positionString += " = ";
                        positionString += expression;
                        positionString += ";";
                    }
                    positionString += "return {'x':x,'y':y};})";
                    var f = eval(positionString);
                    var initialCoords = f(0);
                    // assume the first object is the player
                    var player = level.objects[0];
                    var px = level.fromScreenX(player.x);
                    var py = level.fromScreenY(player.y);
                    missile.positionFunction = function(t) {
                        var coords = f(t)
                        return {
                            "x":level.toScreenX(coords.x - initialCoords.x + px),
                            "y":level.toScreenY(coords.y - initialCoords.y + py)
                        };
                    }

                    missile.type = alone.ObjectTypes.Missile;
                    missile.launchTick = gameState.ticks;
                    missile.positions = new Array();
                    level.objects.push(missile);
                    gameState.score--;
                    resources.launchSound.play();
                }catch(e){
                    level.output.push("COULD NOT LAUNCH, CHECK SYNTAX");
                    level.output.push("");
                }
            }
            level.queuedCommandQueues = new Array();
            var i = 0;
            while( i<level.objects.length ) {
                var o = level.objects[i];
                if( o.type == alone.ObjectTypes.Explosion ) {
                    var diffTicks = gameState.ticks - o.startTick;
                    if( diffTicks >= resources.explosionColors.length ) {
                        // remove
                        level.objects.splice(i,1);
                        i--;
                        // is it the winning explosion?
                        if( o.winning ) {
                            // change the game state, we want to go to the next level
                            var highestLevel = gameState.highestLevel;
                            var levelId = level.id + 1;
                            highestLevel = Math.max( levelId, highestLevel );
                            gameState.highestLevel = highestLevel;
                            gameState.currentLevel = alone.createLevel(levelId, gameState, resources);
                        }
                    } else {
                        o.r *=2;
                    }
                } if( o.type == alone.ObjectTypes.Asteriod ) {
                    if( o.transform != null ) {
                        for( var j=0; j<o.originalPoints.length; j++ ) {
                            var p = o.transform(o.originalPoints[j], levelTicks);
                            o.points[j].x = level.toScreenX(p.x);
                            o.points[j].y = level.toScreenY(p.y);
                        }
                    }
                } else if( o.type == alone.ObjectTypes.Missile ) {
                    // update
                    var diffTicks = gameState.ticks - o.launchTick;
                    var t = diffTicks / resources.fps;
                    var previousPosition;
                    if( o.positions.length > 0 ) {
                        previousPosition = o.positions[o.positions.length-1];
                    } else {
                        previousPosition = null;
                    }
                    var addPosition = true;
                    var position = o.positionFunction(t);
                    // check for collisions with all other objects
                    if( previousPosition != null ) {
                        var collisionDistance = null;
                        var collisionPoint = null;
                        var collisionObject = null;
                        var collisionIndex = null;
                        for( var j=0; j<level.objects.length; j++ ) {
                            var test = level.objects[j];
                            var collision;
                            if( test.type == alone.ObjectTypes.Target ) {
                                // work out collision point
                                collision = collisions.intersectionLineCircle(
                                    previousPosition.x,
                                    previousPosition.y,
                                    position.x,
                                    position.y,
                                    test.x,
                                    test.y,
                                    test.r
                                );
                            } else if( test.type == alone.ObjectTypes.Bonus ) {
                                // work out collision point
                                collision = collisions.intersectionLineCircle(
                                    previousPosition.x,
                                    previousPosition.y,
                                    position.x,
                                    position.y,
                                    test.x,
                                    test.y,
                                    test.r
                                );
                            } else if( test.type == alone.ObjectTypes.Asteriod ) {
                                collision = collisions.intersectionLinePolygon(
                                    previousPosition.x,
                                    previousPosition.y,
                                    position.x,
                                    position.y,
                                    test.points,
                                    test.bounds
                                );
                            } else {
                                collision = null;
                            }
                            if( collision != null ) {
                                /*
                                level.objects.splice(i,1);
                                i--;
                                */
                                var dx = collision.x - previousPosition.x;
                                var dy = collision.y - previousPosition.y;
                                var distance = dx*dx + dy*dy;
                                if( collisionDistance == null || collisionDistance > distance ) {
                                    collisionPoint = collision;
                                    collisionObject = test;
                                    collisionDistance = distance;
                                    collisionIndex = j;
                                }
                            }
                        }
                        var dead = false;
                        if( collisionPoint != null ) {
                            if( collisionObject.type == alone.ObjectTypes.Bonus ) {
                                if( i > collisionIndex ) {
                                    level.objects.splice(collisionIndex, 1);
                                    gameState.score++;
                                    if( gameState.highScore == null || gameState.points > gameState.highScore ) {
                                        gameState.highScore = gameState.points;
                                    }
                                    i--;
                                }
                                resources.bonusSound.play();
                            } else {
                                dead = true;
                                var winning = collisionObject.type == alone.ObjectTypes.Target;
                                if( winning ) {
                                    gameState.score+=2;
                                    if( gameState.highScore == null || gameState.score > gameState.highScore ) {
                                        gameState.highScore = gameState.score;
                                    }
                                }
                                o.positions.push(collisionPoint);
                                var explosion = {
                                    "x":collisionPoint.x,
                                    "y":collisionPoint.y,
                                    "r":1,
                                    "startTick":gameState.ticks,
                                    "type":alone.ObjectTypes.Explosion,
                                    "winning":winning,
                                    "previousPositions":o.positions
                                };
                                //level.objects.splice(i, 1, explosion);
                                //level.objects.push(explosion);
                                level.objects[i] = explosion;
                                resources.explosionSound.play();
                                addPosition = false;
                            }
                        }
                        if( !dead && diffTicks > resources.fps * 10 ) {
                            // remove this object
                            level.objects.splice(i, 1);
                            i--;
                        }

                    }
                    if( addPosition ) {
                        o.positions.push(position);
                    }
                }
                i++;
            }
        },


        render: function(canvasContext, gameState, resources) {

            canvasContext.fillStyle = resources.backgroundColor;
            canvasContext.fillRect(0, 0, resources.canvasWidth, resources.canvasHeight);
            var level = gameState.currentLevel;
            var lx = level.zerox;
            canvasContext.strokeStyle = resources.lineColors[gameState.ticks % resources.lineColors.length];
            canvasContext.beginPath();
            canvasContext.moveTo(level.zerox, 0);
            canvasContext.lineTo(level.zerox, resources.playAreaHeight);
            canvasContext.stroke();
            canvasContext.lineWidth = 1;
            while( lx > 0 ) {
                lx -= level.onex;
            }
            while( lx < resources.playAreaWidth ) {
                canvasContext.beginPath();
                canvasContext.moveTo(lx, 0);
                canvasContext.lineTo(lx, resources.playAreaHeight);
                canvasContext.stroke();
                lx += level.onex;
            }
            var ly = level.zeroy;
            while( ly > 0 ) {
                ly -= level.oney;
            }
            canvasContext.beginPath();
            canvasContext.moveTo(0, level.zeroy);
            canvasContext.lineTo(resources.playAreaWidth, level.zeroy);
            canvasContext.stroke();
            while( ly < resources.playAreaHeight ) {
                canvasContext.beginPath();
                canvasContext.moveTo(0, ly);
                canvasContext.lineTo(resources.playAreaWidth, ly);
                canvasContext.stroke();
                ly += level.oney;
            }
            //canvasContext.clearRect(0, 0, resources.canvasWidth, resources.canvasHeight);
            var objects = level.objects;
            for( var i = 0; i<objects.length; i++) {
                var o = objects[i];
                if( o.type == alone.ObjectTypes.Player ) {
                    var image = resources.playerImages[gameState.ticks % resources.playerImages.length];
                    canvasContext.drawImage(image, o.x - o.width/2, o.y - o.height /2, o.width, o.height);
                } else if( o.type == alone.ObjectTypes.Bonus ) {
                    var image = resources.bonusImages[gameState.ticks % resources.bonusImages.length];
                    canvasContext.drawImage(image, o.x - o.r, o.y - o.r, o.r*2, o.r*2);

                } else if( o.type == alone.ObjectTypes.Target ) {
                    var images = resources.ghostImages[o.targetType];
                    var index = gameState.ticks - level.startTick;
                    if( index > images.length - 1 ) {
                        index = index % images.length;
                        index -= images.length/2;
                        if( index < 0 ) {
                            index = images.length/2 - index - 1;
                        } else {
                            index = images.length/2 + index;
                        }
                    }
                    var image = images[index];
                    canvasContext.drawImage(image, o.x - o.r, o.y - o.r, o.r*2, image.height * (o.r*2) / image.width);
                } else if( o.type == alone.ObjectTypes.Explosion ) {
                    var diffTicks = gameState.ticks - o.startTick;
                    var colorIndex = diffTicks;
                    if( o.previousPositions.length > 0 ) {
                        var previousPosition = o.previousPositions[o.previousPositions.length - 1];
                        for( var j=o.previousPositions.length-1; j>0; ) {
                            j--;
                            if( colorIndex >=  resources.explosionColors.length ) {
                                break;
                            }
                            var position = o.previousPositions[j];
                            canvasContext.beginPath();
                            canvasContext.strokeStyle = resources.explosionColors[colorIndex];
                            canvasContext.moveTo(previousPosition.x, previousPosition.y);
                            canvasContext.lineTo(position.x, position.y);
                            canvasContext.stroke();
                            canvasContext.closePath();

                            previousPosition = position;
                            colorIndex++;
                        }
                    }
                    canvasContext.fillStyle = resources.explosionColors[diffTicks];
                    canvasContext.beginPath();
                    canvasContext.arc(o.x, o.y, o.r, 0, Math.PI*2, false);
                    canvasContext.fill();
                } else if( o.type == alone.ObjectTypes.Missile ) {
                    if( o.positions != null && o.positions.length > 0 ) {
                        var previousPosition = o.positions[o.positions.length - 1];

                        var colorIndex = 0;
                        for( var j=o.positions.length-1; j>0; ) {
                            j--;
                            var position = o.positions[j];
                            canvasContext.beginPath();
                            canvasContext.strokeStyle = resources.missileColors[colorIndex];
                            canvasContext.lineWidth = resources.missileLineWidth;
                            canvasContext.moveTo(previousPosition.x, previousPosition.y);
                            canvasContext.lineTo(position.x, position.y);
                            canvasContext.stroke();
                            canvasContext.closePath();

                            previousPosition = position;
                            colorIndex++;
                            if( colorIndex >=  resources.missileColors.length ) {
                                break;
                            }
                        }

                    }
                } else if( o.type == alone.ObjectTypes.Asteriod ) {
                    var point = o.points[0];
                    canvasContext.beginPath();
                    canvasContext.moveTo(point.x, point.y);
                    for( var j = 1; j < o.points.length; j++ ) {
                        point = o.points[j];
                        canvasContext.lineTo(point.x, point.y);
                    }
                    canvasContext.fillStyle = resources.asteroidBackgroundColors[gameState.ticks % resources.asteroidBackgroundColors.length];
                    canvasContext.strokeStyle = resources.asteroidStrokeColors[gameState.ticks % resources.asteroidStrokeColors.length];
                    canvasContext.lineWidth = resources.asteroidLineWidth;
                    canvasContext.closePath();
                    canvasContext.fill();
                    canvasContext.stroke();
                }
            }
            // render out the status strip
            canvasContext.fillStyle = resources.statusStripBackgroundColors[gameState.ticks % resources.statusStripBackgroundColors.length];
            canvasContext.fillRect(resources.statusStripX, resources.statusStripY, resources.statusStripWidth, resources.statusStripHeight);
            // render out the coordinates
            canvasContext.fillStyle = resources.statusStripTextColors[gameState.ticks % resources.statusStripTextColors.length];
            canvasContext.font = resources.statusStripFont;
            canvasContext.textBaseline = "middle";
            if( gameState.mouseCoordinate != null ) {
                canvasContext.textAlign = "start";
                canvasContext.fillText("("+gameState.mouseCoordinate.x.toFixed(3)+","+gameState.mouseCoordinate.y.toFixed(3)+")",resources.statusStripX, resources.statusStripY + resources.statusStripHeight/2);
            }
            canvasContext.textAlign = "end";
            var s = ""+gameState.score;
            /*
            if( gameState.highScore != null ) {
                s += " / "+gameState.highScore;
            }
            */
            canvasContext.fillText( s, resources.playAreaWidth, resources.statusStripY + resources.statusStripHeight/2);
            var output = level.output;
            if( output != null ) {
                canvasContext.textAlign = "start";
                canvasContext.fillStyle = resources.terminalFontColors[gameState.ticks % resources.terminalFontColors.length];
                canvasContext.font = resources.terminalFont;
                canvasContext.textBaseline = "top";
                for( var i=0; i<output.length; i++ ) {
                    var line = output[i];
                    canvasContext.fillText(line, 0, i*resources.terminalFontHeight);
                }
            }
        }
    }
}