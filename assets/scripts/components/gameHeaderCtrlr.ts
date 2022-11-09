import { _decorator, Component, Node, find, Label, director, SpriteFrame, Sprite } from 'cc';
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

    @property({type: Sprite})
    public m_pauseBtn : Sprite = null;
    
    @property ({type : [SpriteFrame]})
    public m_pauseBtnTextures = [];


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


    updatePauseBtn(_ind : number)
    {
        this.m_pauseBtn.spriteFrame = this.m_pauseBtnTextures[_ind];
    }

    gotoOpts()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        this.updatePauseBtn(1);

        localStorage.setItem("screenType", "PAUSE");

        setTimeout(() => {
            this.m_optsCanvas.active = true;
        }, 50);
    }

 
}

