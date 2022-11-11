import { _decorator, Component, Node, Sprite, tween, Vec3, Vec2, Button, find, director, Label } from 'cc';
import { transitionBoxCtrlr } from './components/transitionBoxCtrlr';
import { stateManager } from './managers/stateManager';
import { TRANSITIONS } from './utils/transitions';
import { PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('fortuneWcCtrlr')
export class fortuneWcCtrlr extends Component {

    @property({type: Node})
    public m_wheel : Node = null;

    @property({type: Button})
    public m_launchBtn : Button = null;

    public m_lang:string = "fr";
    public m_tween;


    @property({type: Node})
    public m_transitionBox = null;

    @property({type: Node})
    public m_preloader : Node = null;

    start() {

        this.m_lang = find('stateManager').getComponent(stateManager).m_gameLang.get();
        
        this.displayTransition();
    }

    displayTransition()
    {
        // Display transition message
        var messages = TRANSITIONS[this.m_lang].wc;
        var mess = messages[Math.floor(Math.random() * messages.length)]

        this.m_transitionBox.getComponent(transitionBoxCtrlr).setItem("Small", mess, "happy", true, 2000);
        
    }

    launch()
    {

        find('stateManager').getComponent(stateManager).playBtnSound();


        let FULL_ANGLE = 360;
        let PARTS = 8;
        let PORTION = 360 / 8;

        let data = [
            {type:"coin", value : 100, angle : PORTION * 0},
            {type:"pq",   value :   2, angle : PORTION * 1},
            {type:"coin", value : 200, angle : PORTION * 2},
            {type:"pq",   value :   3, angle : PORTION * 3},
            {type:"coin", value : 300, angle : PORTION * 4},
            {type:"pq",   value :   4, angle : PORTION * 5},
            {type:"coin", value : 400, angle : PORTION * 6},
            {type:"pq",   value :   1, angle : PORTION * 7}
        ]

        let item = data[Math.floor(Math.random() * data.length)];
        let tours = Math.floor(Math.random() * 4) + 2;
        let angle = item.angle + (360 * tours) // For full tour at least

        let duration = 1.5;
        this.m_tween = tween().target(this.m_wheel)
            .to(duration, {angle : angle }, { easing: t => 1 - Math.pow( Math.min(1, Math.max(0, t) ) - 1, 2)})

        this.m_tween.start()


        //Deactivate btn
        this.m_launchBtn.enabled = false;

        setTimeout(() => {
            
            console.log(item);

            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

            switch (item.type) {
                case "coin":
                    // Global value
                    playerData.coins += item.value;
                    // Stats local value
                    playerData.stats.poop_coins = item.value;
                    break;
                
                case "pq":
                    // Global value
                    playerData.pq += item.value;
                    // Stats local value
                    playerData.stats.pq = item.value;
                    break;
            }

            let _node = item.type+'View';

            this.node.getChildByName(_node).getComponentInChildren(Label).string = item.value.toString();

            this.node.getChildByName(_node).active = true;

            find('stateManager').getComponent(stateManager).m_playerData.set(JSON.stringify(playerData));

            setTimeout(() => {

                this.m_preloader.active = true;

                // director.loadScene('recapScene');
                find('stateManager').getComponent(stateManager).switchScene("recapScene");

            }, 1000);


        }, (duration * 1000 + 50));
    }

}

