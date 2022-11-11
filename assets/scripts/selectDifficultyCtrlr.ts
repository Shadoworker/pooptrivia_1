import { _decorator, Component, Node, SpriteFrame, find, director, Asset, Vec2, ValueType, Prefab, instantiate, Button, Sprite, Label, Color } from 'cc';
import { playerAvatarCtrlr } from './components/playerAvatarCtrlr';
import { playerItemsCtrlr } from './components/playerItemsCtrlr';
import { definePlayers } from './global';
import { stateManager } from './managers/stateManager';
import { playerItemSCROB } from './utils/scrobs';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;
   
 
@ccclass('selectDifficultyCtrlr')
export class selectDifficultyCtrlr extends Component {


    @property ({type : [Node]})
    public m_difficultyItems = [];

    
    @property({type: [SpriteFrame]})
    public m_boxTextures = [];

    @property({type: [SpriteFrame]})
    public m_trophiesTextures = [];

    @property({type: Node})
    public m_preloader : Node = null;
 
    start() {
        
    }

    onEnable()
    {
        this.initDifficulties();
    }
 
    initDifficulties()
    {
        let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())

        let levels = gameStruct.levels;

        for (let i = 0; i < levels.length; i++) 
        {
            const lvlItem = levels[i];
            let dItem = this.m_difficultyItems[i];

            this.setupDifficultyItem(lvlItem, dItem, i);
            
        }

    }

    setupDifficultyItem(lvlItem:any, dItem:Node, lvlInd:number)
    {
        let isUnlocked = lvlItem.unlocked;
        
        //ui
        dItem.getComponent(Sprite).spriteFrame = this.m_boxTextures[!isUnlocked ? 0 : 1];
        dItem.getComponent(Button).enabled = isUnlocked;
        dItem.getChildByName("lock").active = !isUnlocked;
        
        let trophiesNameToSprite = {
            "NONE" : this.m_trophiesTextures[0],
            "BRONZE" : this.m_trophiesTextures[1],
            "SILVER" : this.m_trophiesTextures[2],
            "GOLD" : this.m_trophiesTextures[3],
        }

        let trophySprite = trophiesNameToSprite[lvlItem.trophy];
        dItem.getChildByName("trophy").getComponent(Sprite).spriteFrame = trophySprite;

        dItem.getChildByPath("coinsBox/value").getComponent(Label).string = "0";
        
        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            dItem.getChildByPath("coinsBox/value").getComponent(Label).string = playerData.level_coins[lvlInd].toString();
        }

    }

    selectDifficulty(e:Event, d:number)
    {

        // this.m_preloader.active = true;
        
        find('stateManager').getComponent(stateManager).playBtnSound();

        find('stateManager').getComponent(stateManager).m_selectedDifficulty.set(d);

        // Check if player already exist in order to reset progression 
        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

            playerData.progression.levelIndex = d;
            playerData.progression.roundIndex = 0;
            playerData.progression.gameIndex = 0;

            find('stateManager').getComponent(stateManager).m_playerData.set(JSON.stringify(playerData));

        }

        setTimeout(() => {
        
            if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
            {
            
                let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
                let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())
        
                // let levelIndex = find('stateManager').getComponent(stateManager).m_selectedDifficulty.get();
                let levelIndex = playerData.progression.levelIndex; 
                console.log(levelIndex)
                // Getting the fist game not yet played "levels/rounds/games"
                let nextGame = gameStruct.levels[levelIndex]
                                            .rounds[playerData.progression.roundIndex]
                                                .games.find((g)=>{return g.played == false}).name;
        
                // console.log(nextGame);
        
                setTimeout(() => {
                    let scene = nextGame + "Scene";
                    // director.loadScene(scene);
                    find('stateManager').getComponent(stateManager).switchScene(scene);

                }, 100);
        
          
            }
            else
            {
                // director.loadScene("selectPlayerScene");
                find('stateManager').getComponent(stateManager).switchScene("selectPlayerScene");

            }
            
        }, 50);
    }

    goBack()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        // this.m_preloader.active = true;
        
        // director.loadScene("homeScene");
        find('stateManager').getComponent(stateManager).switchScene("homeScene");

    }
 



}

