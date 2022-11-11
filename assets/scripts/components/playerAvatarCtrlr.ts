import { _decorator, Component, Node, find, Label, Color, Sprite, Button } from 'cc';
import { saveWcCtrlr } from '../saveWcCtrlr';
import { selectPlayerCtrlr } from '../selectPlayerCtrlr';
import { playerItemSCROB } from '../utils/scrobs';
const { ccclass, property } = _decorator;

@ccclass('playerAvatarCtrlr')
export class playerAvatarCtrlr extends Component {

    m_clicked : boolean;

    @property({type: playerItemSCROB})
    public m_playerData = null;

    @property({type: Node})
    public m_selectPlayerCtrlr = null;


    start() {

        this.m_clicked = false;
    }

    setItem(_ctrlr : Node, _d : playerItemSCROB)
    {
        this.m_selectPlayerCtrlr = _ctrlr;
        this.m_playerData = _d;
        this.node.getComponentInChildren(Sprite).spriteFrame = _d.m_avatar;
    }


    onClickPlayerAvatar(ev:any)
    {
        if(!this.m_clicked)
        {

            this.m_selectPlayerCtrlr.getComponent(selectPlayerCtrlr).onClickPlayerAvatar(this.m_playerData);
 
            this.node.getComponent(Button).enabled = false;

            this.node.getComponent(Sprite).color = new Color("#FAC800");

            this.m_clicked = true;
        }

    }



}

