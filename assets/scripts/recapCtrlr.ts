import { _decorator, Component, Node, find, director, assetManager, SpriteFrame, ImageAsset, Texture2D, Sprite, dynamicAtlasManager, SpriteAtlas, Prefab } from 'cc';
import { qualifyPlayers } from './global';
import { stateManager } from './managers/stateManager';
import { playerItemSCROB } from './utils/scrobs';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;

@ccclass('recapCtrlr')
export class recapCtrlr extends Component {

    // Characters Data 
    @property ({type : Prefab})
    public m_playerItemsPrefab = null;
    public m_playerItemSCROBs : [playerItemSCROB];

    @property ({type : Node})
    public m_podiumPlayersContainer = null;


    start() {

        this.initPlayers()

    }

    initPlayers()
    {
        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

        let _playersListData : [PlayerData] = JSON.parse(find('stateManager').getComponent(stateManager).m_playersListData.get())
        let playersListData = [..._playersListData]

        let playedRoundIndex = playerData.progression.roundIndex - 1; // At this stage round has been decreased
        let eliminated = 0;
        switch (playedRoundIndex) {
            case 0:
                eliminated = 2;
                break;
            case -1:
            case 1:
            case 2:
                eliminated = 1;
                break;
        }

        console.log("eliminated : " + eliminated)
        let newPlayersListData = qualifyPlayers(playersListData, eliminated)

        // Check if Player is among qualified or not
        if(newPlayersListData.findIndex(e=>(e.index == playerData.index) && (e.eliminated == false)) != -1 ) // IN
        {

        }
        else // OUT
        {

        }


        find('stateManager').getComponent(stateManager).m_playersListData.set(JSON.stringify(newPlayersListData));

        this.setPlayersView(newPlayersListData)

    }

    setPlayersView(_playersList : any[])
    {

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

