import { _decorator, Component, Node, SpriteFrame, find, director, Asset, Vec2, ValueType, Prefab, instantiate, Button, Sprite, Label, Color, color } from 'cc';
import { gameHeaderCtrlr } from './components/gameHeaderCtrlr';
import { playerAvatarCtrlr } from './components/playerAvatarCtrlr';
import { playerItemsCtrlr } from './components/playerItemsCtrlr';
import { definePlayers } from './global';
import { stateManager } from './managers/stateManager';
import { playerItemSCROB } from './utils/scrobs';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;
   
 
@ccclass('optionsCtrlr')
export class optionsCtrlr extends Component {


    @property ({type : Label})
    public m_title : Label;

    @property ({type : Node})
    public m_ctaBtn;

    @property ({type : [Button]})
    public m_btns = [];

    @property ({type : [SpriteFrame]})
    public m_btnsTextures = [];

    @property({type: Node})
    public m_preloader : Node = null;

    public m_screenType = "SETTINGS";

    start() {

        this.m_screenType = localStorage.getItem("screenType") || "SETTINGS";

        if(this.m_screenType == "SETTINGS")
        {
            this.m_title.string = "PARAMETRES";
            this.m_ctaBtn.active = false;
        }

        this.setUI();
    }
  
    setUI()
    {
        let soundEffects = find('stateManager').getComponent(stateManager).m_gameSoundEffects.get();
        let music = find('stateManager').getComponent(stateManager).m_gameMusic.get();

        this.m_btns[0].node.getComponent(Sprite).spriteFrame = soundEffects == "true" ? this.m_btnsTextures[0] : this.m_btnsTextures[1] ;
       
        this.m_btns[1].node.getComponent(Sprite).spriteFrame = music == "true" ? this.m_btnsTextures[0] : this.m_btnsTextures[1] ;

    }

    switchOpt(e:Event, ind:number)
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        if(ind == 0)
        {
            let prevVal = find('stateManager').getComponent(stateManager).m_gameSoundEffects.get();

            find('stateManager').getComponent(stateManager).m_gameSoundEffects.set(prevVal == "true" ? "false" : "true");
        }

        if(ind == 1)
        {
            let prevVal = find('stateManager').getComponent(stateManager).m_gameMusic.get();

            find('stateManager').getComponent(stateManager).m_gameMusic.set(prevVal == "true" ? "false" : "true");

            if(prevVal != "true")
            {
            
                find('stateManager').getComponent(stateManager).m_bgSound.play();

            }
            else
            {
                find('stateManager').getComponent(stateManager).m_bgSound.pause();
            }
        }
       
        setTimeout(() => {
        
            this.setUI();
            
        }, 100);

    }

    
    leaveRound()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        this.m_preloader.active = true;

        director.loadScene("homeScene");
    }

    goBack()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        if(this.node.parent.getComponent(gameHeaderCtrlr) != null)
            this.node.parent.getComponent(gameHeaderCtrlr).updatePauseBtn(0);
        // console.log(this.node.parent.getComponentInChildren(gameHeaderCtrlr))

        setTimeout(() => {
            this.node.active = false;
        }, 10);
    }
 


}

