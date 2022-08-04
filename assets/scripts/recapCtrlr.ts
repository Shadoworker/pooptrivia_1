import { _decorator, Component, Node, find, director, assetManager, SpriteFrame, ImageAsset, Texture2D, Sprite, dynamicAtlasManager, SpriteAtlas } from 'cc';
import { stateManager } from './managers/stateManager';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('recapCtrlr')
export class recapCtrlr extends Component {
    start() {

    }

    continue()
    {
       
        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
        let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())

        // Getting the fist game not yet played "levels/rounds/games"
        let nextGame = gameStruct.levels[playerData.progression.levelIndex]
                                    .rounds[playerData.progression.roundIndex]
                                        .games.find((g)=>{return g.played == false}).name;

        console.log(nextGame);

        setTimeout(() => {
            let gameScene = nextGame + "Scene";
            director.loadScene(gameScene);
        }, 200);

    }

    
}

