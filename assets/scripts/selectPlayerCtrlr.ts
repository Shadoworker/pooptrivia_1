import { _decorator, Component, Node, SpriteFrame, find, director, Asset, Vec2, ValueType, Prefab } from 'cc';
import { playerItemsCtrlr } from './components/playerItemsCtrlr';
import { stateManager } from './managers/stateManager';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;
   
 
@ccclass('selectPlayerCtrlr')
export class selectPlayerCtrlr extends Component {


    @property ({type : Prefab})
    public playerItemsPrefab = null;

    start() {
        
        // console.log("")
    }
 

    goBack()
    {
        director.loadScene("homeScene");
    }

    play()
    {
        //New only if not current new one
        if(find('stateManager').getComponent(stateManager).m_playerData.get() == '')
        {
            let p : PlayerData = {
                name: 'Lamine',
                avatar: '',
                score: 0,
                globalScore: 0,
                coins: 0,
                pq: 0,
                progression: {
                    levelIndex: 0,
                    roundIndex: 0,
                    gameIndex: 0,
                    bestScore: 0
                }
            };
            find('stateManager').getComponent(stateManager).setPlayerData(p);
        }

        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
        let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())

        // Getting the fist game not yet played "levels/rounds/games"
        let nextGame = gameStruct.levels[playerData.progression.levelIndex]
                                    .rounds[playerData.progression.roundIndex]
                                        .games.find((g)=>{return g.played == false}).name;

        console.log(nextGame);

        setTimeout(() => {
            let scene = nextGame + "Scene";
            director.loadScene(scene);
        }, 200);

    }


}

