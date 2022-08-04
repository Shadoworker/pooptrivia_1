import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
   
type PlayerAvatarData = {

    avatar : SpriteFrame,
    name: string,
    age: number,
    job: string
    
}

@ccclass('selectPlayerCtrlr')
export class selectPlayerCtrlr extends Component {

   


    // @property({type: })
    public m_playersData = null;

    start() {

    }
 
}

