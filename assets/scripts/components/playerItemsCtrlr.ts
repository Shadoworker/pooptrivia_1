import { _decorator, Component, Node, SpriteFrame } from 'cc';
import { playerItemSCROB } from '../utils/scrobs';
// import { playerAvatarSCROB } from '../utils/scrobs';
const { ccclass, property } = _decorator;

@ccclass('playerItemsCtrlr')
export class playerItemsCtrlr extends Component {

  
    @property ({type : [playerItemSCROB]})
    public playerItems = [];

    
    start() {


    }
 
}

