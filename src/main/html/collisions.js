var collisions = {
    "intersectionLineCircle":function(lx1, ly1, lx2, ly2, cx, cy, cr) {
        var collisionPoint;
        if( lx1 != lx2 || ly2 != ly1 ) {
            // normalize circle to 0,0
            var nlx1 = lx1 - cx;
            var nly1 = ly1 - cy;
            var nlx2 = lx2 - cx;
            var nly2 = ly2 - cy;

            // rotate line so that it is horizontal
            var langle = Math.atan2(ly2-ly1, lx2-lx1);
            var sin = Math.sin(-langle);
            var cos = Math.cos(-langle);
            var rlx1 = nlx1 * cos - nly1 * sin;
            var rly1 = nlx1 * sin + nly1 * cos;
            var rlx2 = nlx2 * cos - nly2 * sin;
            var rly2 = nlx2 * sin + nly2 * cos;
            // should be horizontal now
            if( rly2 < cr && rly2 > -cr ) {
                // possible intersection
                var crsq = cr*cr;
                var ysq = rly2 * rly2;
                var xsq = crsq - ysq;
                var maxx = Math.sqrt(xsq);
                var minx = -maxx;
                var rcolx;
                var rcoly = rly2;
                if( rlx1 < minx && rlx2 >= maxx ) {
                    // use closes collision point
                    rcolx = minx;
                } else if( rlx1 < minx && rlx2 >= minx ) {
                    rcolx = minx;
                } else if( rlx1 < maxx && rlx2 >= maxx ) {
                    rcolx = maxx;
                } else if( rlx2 < minx && rlx1 >= maxx ) {
                    rcolx = maxx;
                } else if( rlx2 < minx && rlx1 >= minx ) {
                    rcolx = minx;
                } else if( rlx2 < maxx && rlx1 >= maxx ) {
                    rcolx = maxx;
                } else {
                    rcolx = null;
                }
                if( rcolx != null ) {
                    var rsin = Math.sin(langle);
                    var rcos = Math.cos(langle);
                    var ncolx = rcolx * rcos - rcoly * rsin;
                    var ncoly = rcolx * rsin + rcoly * rcos;
                    collisionPoint = {
                        "x":ncolx + cx,
                        "y":ncoly + cy
                    }
                } else {
                    collisionPoint = null;
                }
            } else {
                collisionPoint = null;
            }



        } else {
            collisionPoint = null;
        }
        return collisionPoint;
    },
    "intersectsLineBounds":function(lx1, ly1, lx2, ly2, bounds) {
        var minlx = Math.min(lx1, lx2);
        var maxlx = Math.max(lx1, lx2);
        var minly = Math.min(ly1, ly2);
        var maxly = Math.max(ly1, ly2);
        return minlx <= bounds.maxx && maxlx >= bounds.minx && minly <= bounds.maxy  && maxly >= bounds.miny;
    },
    "intersectionLinePolygon": function(lx1, ly1, lx2, ly2, points, bounds){
        var collisionPoint;
        if( collisions.intersectsLineBounds(lx1, ly1, lx2, ly2, bounds) ) {
            var minlx = Math.min(lx1, lx2);
            var maxlx = Math.max(lx1, lx2);
            var minly = Math.min(ly1, ly2);
            var maxly = Math.max(ly1, ly2);

            collisionPoint = null;
            var collisionDistance = null;

            // check for an intersection on each of the lines
            var previousPoint = points[points.length-1];
            for( var i = 0; i<points.length; i++ ) {
                var point = points[i];

                var px1 = previousPoint.x;
                var py1 = previousPoint.y;
                var px2 = point.x;
                var py2 = point.y;

                var ix;
                var iy;

                var pm;
                var pc;

                if( px1 != px2 ) {
                    pm = (py2 - py1)/(px2 - px1);
                    pc = py1 - pm*px1;
                } else {
                    // pline is vertical
                    pm = null;
                    pc = null;
                }

                if( lx1 != lx2 ) {
                    var lm = (ly2 - ly1)/(lx2 - lx1);
                    var lc = ly1 - lm*lx1;

                    if( pm != null ) {
                        ix = (pc - lc)/(lm - pm);
                    } else {
                        ix = px1;
                    }
                    iy = ix * lm + lc;

                } else {
                    // lline is vertical
                    if( pm != null ) {
                        ix = lx1;
                        iy = ix * pm + pc;
                    } else {
                        // both lines are vertical
                        ix = null;
                        iy = null;
                    }
                }

                if( ix != null ) {
                    // check that it's in bounds
                    if( ix >= minlx && ix <= maxlx && iy >= minly && iy <= maxly ) {
                        if( ix >= Math.min(px1, px2) && ix <= Math.max(px1, px2) && iy >= Math.min(py1, py2) && iy <= Math.max(py1, py2) ) {
                            var dx = ix - lx1;
                            var dy = iy - ly1;
                            var d = (dx*dx)+(dy*dy)
                            if( collisionDistance == null || collisionDistance > d ) {
                                collisionDistance = d;
                                collisionPoint = {x:ix, y:iy};
                            }
                        }
                    }
                }

                previousPoint = point;
            }
        } else {
            collisionPoint = null;
        }
        return collisionPoint;
    },

    "calculatePolygonBounds": function(points) {
        var minpx = points[0].x;
        var minpy = points[0].y;
        var maxpx = minpx;
        var maxpy = minpy;
        for( i=1; i<points.length; i++ ) {
            var p = points[i];
            if( p.x < minpx ) {
                minpx = p.x;
            } else if( p.x > maxpx ) {
                maxpx = p.x;
            }
            if( p.y < minpy ) {
                minpy = p.y;
            } else if( p.y > maxpy ) {
                maxpy = p.y;
            }
        }
        return {minx:minpx, miny:minpy, maxx:maxpx, maxy:maxpy};
    }
};