import { _decorator, Component, Node, find, Label } from 'cc';
import { stateManager } from '../managers/stateManager';
import { PlayerData } from '../utils/types';
const { ccclass, property } = _decorator;

@ccclass('gameHeaderCtrlr')
export class gameHeaderCtrlr extends Component {
    
    @property({type: Label})
    public m_pqPointsText = null;

    start() {

        this.setPqPoints();
    }

    setPqPoints()
    {
        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            this.m_pqPointsText.string = this.padWithZeroes(playerData.pq, 3);
        }
    }

    padWithZeroes(_number, _length) {
        var my_string = '' + _number;
        while (my_string.length < _length) {
            my_string = '0' + my_string;
        }
        return my_string;
    }

 
}

