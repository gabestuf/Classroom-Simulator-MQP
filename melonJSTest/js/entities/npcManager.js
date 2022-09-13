import * as me from 'https://esm.run/melonjs';
import NPC from './npcEntity.js'

class npcManager extends me.Renderable {
    constructor() {
        super(0, 0, {
            width: 10,
            height: 10
        })
        this.timer = 0;

        //add npc
        const npc1 = new NPC(500, 200)
        me.game.world.addChild(npc1)
    }

    update(dt) {


    }
}

export default npcManager;