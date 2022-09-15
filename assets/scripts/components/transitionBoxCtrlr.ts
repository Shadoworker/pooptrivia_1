import { _decorator, Component, Node, find, Label, Color, Sprite, Button, SpriteFrame } from 'cc';
import { saveWcCtrlr } from '../saveWcCtrlr';
import { selectPlayerCtrlr } from '../selectPlayerCtrlr';
import { playerItemSCROB } from '../utils/scrobs';
const { ccclass, property } = _decorator;

@ccclass('transitionBoxCtrlr')
export class transitionBoxCtrlr extends Component {


    
    @property({type: [SpriteFrame]})
    public m_poopTextures = [];

    start() {

    }

    setItem(_type : string, _message : string, _expression:string = 'happy', autoHide:boolean=true, _duration:number=1300)
    {

        let bubbleName = "overlay/bubble"+_type;
        this.node.getChildByPath(bubbleName).getComponentInChildren(Label).string = _message;

        let spriteframe = this.m_poopTextures[0];

        switch (_expression) {
            case "happy":
                var r = Math.floor(Math.random());
                spriteframe = this.m_poopTextures[r];
                break;
    
            case "sad":
                var r = Math.floor(Math.random()) + 2;
                spriteframe = this.m_poopTextures[r];
                break;
            
        }

        this.node.getChildByPath("overlay/poopCharacter").getComponent(Sprite).spriteFrame = spriteframe;

        this.node.active = true;

        if(autoHide)
            setTimeout(() => {
                if(this.node)
                this.node.active = false;
            }, _duration);

    }

 


}

