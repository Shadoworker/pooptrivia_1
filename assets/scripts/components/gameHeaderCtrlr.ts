import { _decorator, Component, Node, find, Label, director } from 'cc';
import { stateManager } from '../managers/stateManager';
import { PlayerData } from '../utils/types';
const { ccclass, property } = _decorator;

@ccclass('gameHeaderCtrlr')
export class gameHeaderCtrlr extends Component {
    
    @property({type: Label})
    public m_pqPointsText = null;
    
    @property({type: Label})
    public m_coinsPointsText = null;

    @property({type: Node})
    public m_optsCanvas : Node = null;


    start() {

        this.setPqPoints();

        this.setCoinsPoints();
    }

    setPqPoints()
    {
        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            this.m_pqPointsText.string = this.padWithZeroes(playerData.pq, 3);
        }
    }

    setCoinsPoints()
    {
        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            this.m_coinsPointsText.string = this.padWithZeroes(playerData.coins, 3);
        }
    }

    padWithZeroes(_number, _length) {
        var my_string = '' + _number;
        while (my_string.length < _length) {
            my_string = '0' + my_string;
        }
        return my_string;
    }


    gotoOpts()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        localStorage.setItem("screenType", "PAUSE");

        setTimeout(() => {
            this.m_optsCanvas.active = true;
        }, 50);
    }

 
}

