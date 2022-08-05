import { _decorator, Component, Node, find, game } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { Singleton } from '../utils/singleton';
import { GameData, GameStruct, PlayerData } from '../utils/types';
import { dataLoader } from './dataLoader';
const { ccclass, property } = _decorator;


@ccclass('stateManager')
export class stateManager extends Component {

    public m_gameLang = new Kayfo.PersistentString('m_persistentGameLang', 'fr');


    public m_gameStruct = new Kayfo.PersistentString('m_persistentGameStruct', '');
    public m_quizData = new Kayfo.PersistentString('m_persistentQuizData', '');
    public m_fiowData = new Kayfo.PersistentString('m_persistentFiowData', '');
    public m_saveWcData = new Kayfo.PersistentString('m_persistentSaveWcData', '');

    // selected levelIndex (0=EASY, 1=MEDIUM, 2=)
    // public m_currentLevelIndex = new Kayfo.PersistentNum('m_persistentCurrentLevelIndex', 0);
    
    public m_playerData = new Kayfo.PersistentString('m_persistentPlayerData', '');
    public m_playersListData = new Kayfo.PersistentString('m_persistentPlayersListData', '');

    
    onLoad()
    {
        this.m_gameLang.set(navigator.language.substring(0,2));

        if(!this.node._persistNode)
            game.addPersistRootNode(this.node);
    }

    start() {

       
        if(find('dataLoader') != null)
        {      
            let persistentDataLoader = find('dataLoader').getComponent(dataLoader);
            // console.log(persistentDataLoader.m_quizData);
    
            // console.log(dataLoader.getInstance().m_quizData)
            if(this.m_gameStruct.get() == '')
                this.m_gameStruct.set(JSON.stringify(persistentDataLoader.m_gameStruct))

            if(this.m_quizData.get() == '')
                this.m_quizData.set(JSON.stringify(persistentDataLoader.m_quizData))

            if(this.m_fiowData.get() == '')
                this.m_fiowData.set(JSON.stringify(persistentDataLoader.m_fiowData))

            // console.log(persistentDataLoader.m_saveWcData);
            if(this.m_saveWcData.get() == '')
                this.m_saveWcData.set(JSON.stringify(persistentDataLoader.m_saveWcData))


        }
        else
        {
            console.log("No dataLoader !")
            // console.log(JSON.parse(this.m_fiowData.get()));

        }


    }

    setPlayerData(_playerData : PlayerData)
    {
        // For Test
        // if(_playerData.name == "")
        //     _playerData = { ..._playerData,
        //         name : "Moussa"
        //     }

        
        this.m_playerData.set(JSON.stringify(_playerData));
    }

    setPlayersListData(_playersListData : [PlayerData])
    {
        this.m_playersListData.set(JSON.stringify(_playersListData))
    }

    updateProgress(_score:number)
    {
        // INFO : Data below are sent when round is over ; if the player is among best scorers then these data are processed
        let didClearLevel = false;
        let didClearRound = false;

        let playerData : PlayerData = JSON.parse(this.m_playerData.get());
        let gameStruct : GameStruct = JSON.parse(this.m_gameStruct.get());

        
        let currentGame = gameStruct.levels[playerData.progression.levelIndex]
        .rounds[playerData.progression.roundIndex]
            .games.find((g)=>g.played == false);
        
        
        
        currentGame.played = true;
        playerData.progression.gameIndex += 1;
        playerData.score += _score;

        // Last game of that round : Go to next round
        if(playerData.progression.gameIndex == gameStruct.levels[playerData.progression.levelIndex].rounds[playerData.progression.roundIndex].games.length)
        {
            playerData.progression.gameIndex = 0;
            playerData.progression.roundIndex += 1;
            didClearRound = true;
            // If last Round
            if(playerData.progression.roundIndex == gameStruct.levels[playerData.progression.levelIndex].rounds.length)
            {

                playerData.progression.roundIndex = 0;
                playerData.progression.levelIndex += 1;

                if(playerData.progression.levelIndex == gameStruct.levels.length)
                {
                    playerData.progression.levelIndex -= 1; // Rollback to valid index (0 -> 2)
                    playerData.progression.roundIndex = 2; // Rollback to valid index (0 -> 2)
                }
                else
                {
                    // playerData.progression.levelIndex += 1;
                    // Unlock level of difficulty
                    gameStruct.levels[(playerData.progression.levelIndex+1)].unlocked = true;
                    didClearLevel = true;

                    // Reset score to ZERO
                    playerData.score = 0;

                }
            }
            // else
            // {
            //     playerData.progression.roundIndex += 1;
            // }

        }
        // else
        // {
        //     // Progress in games
        //     playerData.progression.gameIndex += 1;
        // }

        // Save New Data
        console.log("SM v")
        console.log(playerData);
        console.log(gameStruct);

        this.m_playerData.set(JSON.stringify(playerData));

        this.m_gameStruct.set(JSON.stringify(gameStruct));
       
        return [didClearRound ,didClearLevel];

    }


    // update(deltaTime: number) {
        
    // }
}

