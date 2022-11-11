import { _decorator, Component, Node, find, director, assetManager, SpriteFrame, ImageAsset, Texture2D, Sprite, dynamicAtlasManager, SpriteAtlas, Button } from 'cc';
import { stateManager } from './managers/stateManager';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('homeCtrlr')
export class homeCtrlr extends Component {

    @property({type: Button})
    public m_investBtn : Button = null;

    @property({type: Node})
    public m_optsCanvas : Node = null;

    @property({type: Node})
    public m_preloader : Node = null;

    start() {


        this.setInvestBtn();

    }

    setInvestBtn()
    {
        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            if(playerData.coins > 0)
            {
                this.m_investBtn.node.active = true;
            }
            else
            {
                this.m_investBtn.node.active = false;
            }
        }
        else
        {
            this.m_investBtn.node.active = false;
        }

    }

    play()
    {

        find('stateManager').getComponent(stateManager).playBtnSound();

        // this.m_preloader.active = true;

        //New only if not current new one
        if(find('stateManager').getComponent(stateManager).m_playerData.get() != '')
        {

            
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())

            // console.log(typeof(playerData.progression.levelIndex));

            // Getting the fist game not yet played "levels/rounds/games"
            let nextGame = gameStruct.levels[playerData.progression.levelIndex]
                                        .rounds[playerData.progression.roundIndex]
                                            .games.find((g)=>{return g.played == false}).name;


            // Set selectedDifficulty Then
            find('stateManager').getComponent(stateManager).m_selectedDifficulty.set(playerData.progression.levelIndex);
            

            setTimeout(() => {
                let scene = nextGame + "Scene";
                // director.loadScene(scene);
                find('stateManager').getComponent(stateManager).switchScene(scene);

                // director.loadScene("difficultyScene");

            }, 20);

            // let p : PlayerData = {
            //     name: 'Lamine',
            //     avatar: '',
            //     score: 0,
            //     globalScore: 0,
            //     coins: 0,
            //     pq: 0,
            //     progression: {
            //         levelIndex: 0,
            //         roundIndex: 0,
            //         gameIndex: 0,
            //         bestScore: 0
            //     }
            // };
            // find('stateManager').getComponent(stateManager).setPlayerData(p);
        }
        else
        {
            // director.loadScene("selectPlayerScene");

            if(find('stateManager').getComponent(stateManager).m_didSeeTutorial.get() == "false")
            {

                find('stateManager').getComponent(stateManager).m_didSeeTutorial.set("true")
                        
                find('stateManager').getComponent(stateManager).switchScene("tutorialScene");
         

            }
            else
            {
                        
                find('stateManager').getComponent(stateManager).switchScene("difficultyScene");         

            }
        }

        // let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
        // let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())

        // // Getting the fist game not yet played "levels/rounds/games"
        // let nextGame = gameStruct.levels[playerData.progression.levelIndex]
        //                             .rounds[playerData.progression.roundIndex]
        //                                 .games.find((g)=>{return g.played == false}).name;

        // console.log(nextGame);

        // setTimeout(() => {
        //     let scene = nextGame + "Scene";
        //     director.loadScene(scene);
        // }, 200);

    }

    gotoSanitize()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        let playerData = find('stateManager').getComponent(stateManager).m_playerData.get();
        if(playerData != '')
            // director.loadScene("sanitizeScene");
            find('stateManager').getComponent(stateManager).switchScene("sanitizeScene");

        else
        {
            alert("Choisissez un personnage d'abord !")
        }
    }

    gotoAbout()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();
        
        find('stateManager').getComponent(stateManager).switchScene("aboutScene");
         
    }


    gotoOpts()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        localStorage.setItem("screenType", "SETTINGS");

        setTimeout(() => {
          this.m_optsCanvas.active = true;
        }, 50);
    }

    
    gotoTutorial()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();
        
        find('stateManager').getComponent(stateManager).switchScene("tutorialScene");
         
        // this.m_preloader.active = true;

        // director.loadScene("tutorialScene");
    }
    

    reset()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        localStorage.clear();

        find('dataLoader').destroy();
        find('stateManager').destroy();

        setTimeout(() => {
            director.loadScene("splashScene");
        }, 10);
    }
    
}

