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

    // selected levelIndex (0=EASY, 1=MEDIUM, 2=)
    // public m_currentLevelIndex = new Kayfo.PersistentNum('m_persistentCurrentLevelIndex', 0);
    
    public m_playerData = new Kayfo.PersistentString('m_persistentPlayerData', '');

    
    onLoad()
    {
        this.m_gameLang.set(navigator.language.substring(0,2));

        game.addPersistRootNode(this.node);
    }

    start() {

       
        if(find('dataLoader') != null)
        {      
            let persistentDataLoader = find('dataLoader').getComponent(dataLoader);
            // console.log(persistentDataLoader.m_quizData);
    
            // console.log(dataLoader.getInstance().m_quizData)
            if(persistentDataLoader.m_gameStruct != null)
                this.m_gameStruct.set(JSON.stringify(persistentDataLoader.m_gameStruct))

            if(persistentDataLoader.m_quizData != null)
                this.m_quizData.set(JSON.stringify(persistentDataLoader.m_quizData))

            if(persistentDataLoader.m_fiowData != null)
                this.m_fiowData.set(JSON.stringify(persistentDataLoader.m_fiowData))

            // console.log(this.m_fiowData.get());
        }
        else
        {
            console.log("No dataLoader !")
            // console.log(JSON.parse(this.m_fiowData.get()));

        }

    
        // For Test : Normally called by selectPlayer screen
        let p: PlayerData = {
            name: '',
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
        this.setPlayerData(p)

    }

    setPlayerData(_playerData : PlayerData)
    {
        // For Test
        if(_playerData.name == "")
            _playerData = { ..._playerData,
                name : "Moussa"
            }

        
        this.m_playerData.set(JSON.stringify(_playerData));
    }


    updateProgress()
    {
        let didUnlockLevelOfDifficulty = false;

        let playerData : PlayerData = JSON.parse(this.m_playerData.get());
        let gameStruct : GameStruct = JSON.parse(this.m_gameStruct.get());

        let currentGame = gameStruct.levels[playerData.progression.levelIndex]
        .rounds[playerData.progression.roundIndex]
            .games.find((g)=>g.played == false);
        
        currentGame.played = true;

        // Last game of that round : Go to next round
        if(playerData.progression.gameIndex == gameStruct.levels[playerData.progression.levelIndex].rounds[playerData.progression.roundIndex].games.length-1)
        {
            playerData.progression.gameIndex = 0;

            // If last Round
            if(playerData.progression.roundIndex == gameStruct.levels[playerData.progression.levelIndex].rounds.length-1)
            {
                if(playerData.progression.levelIndex == gameStruct.levels.length-1)
                {

                }
                else
                {
                    playerData.progression.levelIndex += 1;
                    // Unlock level of difficulty
                    gameStruct.levels[(playerData.progression.levelIndex+1)].unlocked = true;
                    didUnlockLevelOfDifficulty = true;
                }
            }
            else
            {
                playerData.progression.roundIndex += 1;
            }

        }

        // Save New Data

        this.m_playerData.set(JSON.stringify(playerData));
        this.m_gameStruct.set(JSON.stringify(gameStruct))
       
        return didUnlockLevelOfDifficulty;

    }


    // update(deltaTime: number) {
        
    // }
}

