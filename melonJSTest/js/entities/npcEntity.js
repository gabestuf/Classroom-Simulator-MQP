import * as me from 'https://esm.run/melonjs';

// a player entity
class NPC extends me.Sprite {

    constructor(x, y) {
        // call the constructor
        super(x, y,
            Object.assign({
                image: "Blank_Sprite_Sheet",
                framewidth: 32,
                frameheight: 32
            })
        );

        // add a physic body with a diamond as a body shape
        this.body = new me.Body(this, (new me.Rect(16, 16, 16, 16)).toIso());
        // walking & jumping speed
        this.body.setMaxVelocity(2.5, 2.5);
        this.body.setFriction(0.4, 0.4);

        this.timer = 0;


        // set the display around our position
        //me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);



        // define an additional basic walking animation
        this.addAnimation("walk_left", [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
        this.addAnimation("walk_right", [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
        this.addAnimation("walk_up", [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
        this.addAnimation("walk_down", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        // set default one
        this.setCurrentAnimation("walk_left");
    }

    /**
     * update the player pos
     */
    update(dt) {
        this.timer += dt;

        if (this.timer <= 1000) {
            this.body.force.x = -this.body.maxVel.x;
            if (!this.isCurrentAnimation("walk_left")) {
                this.setCurrentAnimation("walk_left");
            }
        } else if (this.timer > 1000 && this.timer <= 1500) {
            this.body.force.x = 0;
        } else if (this.timer > 1500 && this.timer <= 2500) {
            this.body.force.x = this.body.maxVel.x;
            if (!this.isCurrentAnimation("walk_right")) {
                this.setCurrentAnimation("walk_right");
            }
        } else if (this.timer > 2500 && this.timer <= 3000) {
            this.body.force.x = 0;
        } else {
            this.timer = 0;
        }


        // // check if we moved (an "idle" animation would definitely be cleaner)
        // if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
        //     super.update(dt);
        //     return true;
        // }
    }

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision(/*response, other*/) {
        // Make all other objects solid
        return false;
    }
};

export default NPC;
