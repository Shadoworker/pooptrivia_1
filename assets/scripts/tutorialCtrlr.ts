import { _decorator, Component, Node, SpriteFrame, find, director, Asset, Vec2, ValueType, Prefab, instantiate, Button, Sprite, Label, Color } from 'cc';
import { playerAvatarCtrlr } from './components/playerAvatarCtrlr';
import { playerItemsCtrlr } from './components/playerItemsCtrlr';
import { definePlayers } from './global';
import { stateManager } from './managers/stateManager';
import { playerItemSCROB } from './utils/scrobs';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;
   
 
@ccclass('tutorialCtrlr')
export class tutorialCtrlr extends Component {


    public m_sectionIndex= 0;
    public m_sections: Node[];

    @property({type: Button})
    public m_nextBtn : Button;
 
    @property({type: Node})
    public m_preloader : Node = null;

    start() {

        this.m_sections = this.node.getChildByPath("panelBg/sectionsContainer").children;
    }
  

    gotoNext()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        this.m_sectionIndex++;
        if(this.m_sectionIndex < this.m_sections.length)
        {

            this.m_sections[(this.m_sectionIndex-1)].active = false;
            this.m_sections[this.m_sectionIndex].active = true;

            if(this.m_sectionIndex == (this.m_sections.length-1))
            {
                this.m_nextBtn.getComponentInChildren(Label).string = "TERMINER"
            }

        }   
        else if(this.m_sectionIndex == (this.m_sections.length-1))
        {
            this.m_nextBtn.getComponentInChildren(Label).string = "TERMINER"
        }
        else
        {
            this.m_preloader.active = true;

            director.loadScene("difficultyScene");
        }
    }

    goBack()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        this.m_preloader.active = true;

        director.loadScene("homeScene");
    }
 


}

