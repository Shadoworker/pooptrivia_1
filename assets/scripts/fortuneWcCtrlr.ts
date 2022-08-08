import { _decorator, Component, Node, Sprite, tween, Vec3, Vec2, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('fortuneWcCtrlr')
export class fortuneWcCtrlr extends Component {

    @property({type: Node})
    public m_wheel : Node = null;

    @property({type: Button})
    public m_launchBtn : Button = null;


    public m_tween;

    start() {

                        
    }

    launch()
    {


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
        let tours = Math.floor(Math.random() * 4);
        let angle = item.angle + (360 * tours) // For full tour at least

        let duration = 1.5;
        this.m_tween = tween().target(this.m_wheel)
            .to(duration, {angle : angle }, { easing: t => 1 - Math.pow( Math.min(1, Math.max(0, t) ) - 1, 2)})

        this.m_tween.start()


        //Deactivate btn
        this.m_launchBtn.enabled = false;

        setTimeout(() => {
            
            console.log(item);

        }, (duration * 1000 + 50));
    }

    update(deltaTime: number) {
        
    }
}

