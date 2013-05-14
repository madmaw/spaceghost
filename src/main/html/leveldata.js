var leveldata = [
    // level 0
    {
        preamble: "? = help",
        objects: [
            {
                type:alone.ObjectTypes.Player,
                x: 0,
                y: 0
            },
            {
                type:alone.ObjectTypes.Target,
                x:0,
                y:1,
                r:0.05,
                targetType:1
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:-1,
                y:0.3,
                r:0.05
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:1,
                y:0.7,
                r:0.05
            }

        ],
        bounds: {
            x: -1.5,
            y: -0.6,
            width: 3,
            height: 2.2
        }
    },
    // level 0
    {
        preamble: "? = help",
        objects: [
            {
                type:alone.ObjectTypes.Player,
                x: 0,
                y: 0
            },
            {
                type:alone.ObjectTypes.Target,
                x:-1,
                y:0,
                r:0.05,
                targetType:1
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:-0.7,
                y:0.5,
                r:0.05
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:-0.3,
                y:0.5,
                r:0.05
            }

        ],
        bounds: {
            x: -1.5,
            y: -0.6,
            width: 3,
            height: 2.2
        }
    },
    // level 1
    {
        preamble: "Squared",
        objects: [
            {
                type:alone.ObjectTypes.Player,
                x: 0,
                y: 0
            },
            {
                type:alone.ObjectTypes.Target,
                x:0,
                y:1,
                r:0.05,
                targetType:0
            },
            {
                type:alone.ObjectTypes.Asteriod,
                /*
                points:[
                    {x:-0.07, y:0.38},
                    {x:0.07, y:0.38},
                    {x:0.14, y:0.5},
                    {x:0.07, y:0.62},
                    {x:-0.07, y:0.62},
                    {x:-0.14, y:0.5}
                ],
                */
                points:[
                    {x:-0.1, y:0.4},
                    {x: 0.1, y:0.4},
                    {x: 0.1, y:0.6},
                    {x:-0.1, y:0.6}
                ],
                transform: function(p, t) {
                    var xoff = 0;
                    var yoff = 0.5;
                    var sin = Math.sin(t * Math.PI/100);
                    var cos = Math.cos(t * Math.PI/100);
                    var x = p.x - xoff;
                    var y = p.y - yoff;
                    return {
                        x: x * sin + y * cos + xoff,
                        y: x * cos - y * sin + yoff
                    };
                }
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:0,
                y:1.2,
                r:0.05
            }
        ],
        bounds: {
            x: -1.5,
            y: -0.5,
            width: 3,
            height: 2.2
        }
    },
    // level 2
    {
        preamble: "Give me a sine",
        objects: [
            {
                type:alone.ObjectTypes.Player,
                x: 0,
                y: 0
            },
            {
                type:alone.ObjectTypes.Target,
                x:0,
                y:1,
                r:0.05,
                targetType:2
            },
            {
                type:alone.ObjectTypes.Asteriod,
                points:[
                    {x:-100, y:100},
                    {x:100, y:100},
                    {x:100, y:-100},
                    {x: 0.2, y:-100},
                    {x: 0.2, y:0},
                    {x: 1.1,   y:0},
                    {x: 1.1,   y:0.7},
                    {x: -0.75, y:0.7},
                    {x: -0.75, y:0.8},
                    {x: 0.2, y:0.8},
                    {x: 0.2, y:1.2},
                    {x: -1.1, y:1.2},
                    {x: -1.1, y:0.3},
                    {x: 0.75, y:0.3},
                    {x: 0.75, y:0.2},
                    {x: -0.2, y:0.2},
                    {x: -0.2, y:0},
                    {x: -0.2, y:-100},
                    {x:-100, y:-100}
                ]
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:-0.85,
                y:0.75,
                r:0.05
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:0.85,
                y:0.25,
                r:0.05
            }
        ],
        bounds: {
            x: -2,
            y: -1,
            width: 4,
            height: 3
        }
    },
    // level 3
    {
        preamble: "Square route",
        objects: [
            {
                type:alone.ObjectTypes.Player,
                x: 0,
                y: 0
            },
            {
                type:alone.ObjectTypes.Target,
                x:Math.sqrt(2),
                y:2,
                r:0.05,
                targetType:1
            },
            {
                type:alone.ObjectTypes.Asteriod,
                points:[
                    {x: 0.5, y:-100},
                    {x: 0.5, y:0},
                    {x: 1, y:0},
                    {x:50, y:100}
                ]
            },
            {
                type:alone.ObjectTypes.Asteriod,
                points:[
                    {x:-100, y:100},
                    {x: 50, y:100},
                    {x: 0.5, y:0.3},
                    {x:-100, y:1}
                ]
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:0.9,
                y:0.25,
                r:0.05
            }
        ],
        bounds: {
            x: -1,
            y: -0.5,
            width: 4,
            height: 3
        }
    },
    // level 4
    {
        preamble: "Same same, but different",
        objects: [
            {
                type:alone.ObjectTypes.Player,
                x: 0,
                y: 0
            },
            {
                type:alone.ObjectTypes.Target,
                x:0,
                y:1,
                r:0.05,
                targetType:3
            },
            {
                type:alone.ObjectTypes.Asteriod,
                points:[
                    {x: 0.4, y:0.2},
                    {x: 0.6, y:0.2},
                    {x: 0.6, y:0.5},
                    {x: 0.4, y:0.5}
                ]
            },
            {
                type:alone.ObjectTypes.Asteriod,
                points:[
                    {x: -0.4, y:0.5},
                    {x: -0.6, y:0.5},
                    {x: -0.6, y:0.8},
                    {x: -0.4, y:0.8}
                ]
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:-0.5,
                y:0.3,
                r:0.05
            },
            {
                type:alone.ObjectTypes.Bonus,
                x:0.5,
                y:0.7,
                r:0.05
            }

        ],
        bounds: {
            x: -1.5,
            y: -0.6,
            width: 3,
            height: 2.2
        }
    }

];
