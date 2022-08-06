import { _decorator, Component, Node, Prefab } from 'cc';
import { playerItemSCROB } from '../utils/scrobs';
const { ccclass, property } = _decorator;

@ccclass('playerPupitreListCtrlr')
export class playerPupitreListCtrlr extends Component {

    // Characters Data 
    @property ({type : Prefab})
    public m_playerItemsPrefab = null;
    public m_playerItemSCROBs : [playerItemSCROB];

    start() {
        this.initView()
    }

    initView()
    {

    }

}

