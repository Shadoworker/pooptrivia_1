import { _decorator, Component, Node, SpriteFrame, find, director, Asset, Vec2, ValueType, Prefab, instantiate, Button, Sprite, Label, Color, color } from 'cc';
import { playerAvatarCtrlr } from './components/playerAvatarCtrlr';
import { playerItemsCtrlr } from './components/playerItemsCtrlr';
import { definePlayers } from './global';
import { stateManager } from './managers/stateManager';
import { playerItemSCROB } from './utils/scrobs';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;
   
 
@ccclass('aboutCtrlr')
export class aboutCtrlr extends Component {


    public m_sectionIndex= 0;
    public m_sections: Node[];

    @property ({type : [Button]})
    public m_btns = [];

    start() {

        this.m_sections = this.node.getChildByPath("panelBg/sectionsContainer").children;

        this.setUI();
    }
  
    setUI()
    {
        for (let i = 0; i < this.m_btns.length; i++) {
            const el = this.m_btns[i].node.getComponent(Sprite);

            el.color = color(255, 255, 255, (this.m_sectionIndex == i ? 200 : 255))
            
        }
    }

    selectCompany(e:Event, ind:number)
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        this.m_sectionIndex = ind;
 
        this.m_sections[(1 - this.m_sectionIndex)].active = false;
        this.m_sections[this.m_sectionIndex].active = true;

        this.setUI();

    }

    goBack()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        director.loadScene("homeScene");
    }
 


}

