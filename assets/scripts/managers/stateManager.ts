import { _decorator, Component, Node, find, game, director, AudioSource } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { sceneItemSCROB } from '../utils/sceneItemScrob';
import { Singleton } from '../utils/singleton';
import { GameData, GameStruct, PlayerData, sceneItem } from '../utils/types';
import { dataLoader } from './dataLoader';
const { ccclass, property } = _decorator;



@ccclass('stateManager')
export class stateManager extends Component {

    public m_gameLang = new Kayfo.PersistentString('m_persistentGameLang', null);
    
    public m_gameSoundEffects = new Kayfo.PersistentString('m_persistentGameSoundEffects', "true");
    public m_gameMusic = new Kayfo.PersistentString('m_persistentGameMusic', null);

    public m_gameStruct = new Kayfo.PersistentString('m_persistentGameStruct', '');
    public m_quizData = new Kayfo.PersistentString('m_persistentQuizData', '');
    public m_fiowData = new Kayfo.PersistentString('m_persistentFiowData', '');

    public m_saveWcData = new Kayfo.PersistentString('m_persistentSaveWcData', '');

    public m_quizDataInit = new Kayfo.PersistentString('m_persistentQuizDataInit', '');
    public m_fiowDataInit = new Kayfo.PersistentString('m_persistentFiowDataInit', '');
    public m_saveWcDataInit = new Kayfo.PersistentString('m_persistentSaveWcDataInit', '');

    public m_sanitizeData = new Kayfo.PersistentString('m_persistentSanitizeData', '');

    // selected levelIndex (0=EASY, 1=MEDIUM, 2=)
    // public m_currentLevelIndex = new Kayfo.PersistentNum('m_persistentCurrentLevelIndex', 0);
    
    public m_playerData = new Kayfo.PersistentString('m_persistentPlayerData', '');
    public m_playersListData = new Kayfo.PersistentString('m_persistentPlayersListData', '');



    public m_selectedDifficulty = new Kayfo.PersistentNum('m_persistentSelectedDifficulty', 0);
    public m_didClearRound = new Kayfo.PersistentString('m_persistentDidClearRound', 'false');
    public m_didClearLevel = new Kayfo.PersistentString('m_persistentDidClearLevel', 'false');
    public m_didSeeTutorial = new Kayfo.PersistentString('m_persistentDidSeeTutorial', 'false');


    public m_currentScene = new Kayfo.PersistentString('m_persistentCurrentScene', '');


    @property ({type : AudioSource})
    public m_bgSound = null;
    
    @property ({type : AudioSource})
    public m_btnSound = null;

    @property ({type : AudioSource})
    public m_errorSound = null;

    @property ({type : AudioSource})
    public m_successSound = null;
    
    @property ({type : [sceneItemSCROB]})
    public m_sceneItems = [];


    onLoad()
    {
        this.m_gameLang.set(navigator.language.substring(0,2));

        if(!this.node._persistNode)
            game.addPersistRootNode(this.node);
    }

    start() 
    {
        // this.initialize();

        if(this.m_currentScene.get() == '')
        {
            this.m_currentScene.set("splashScene");
        }

    }

    initialize() {

        this.playBgSound();

        if(find('dataLoader') != null)
        {      
    
            let persistentDataLoader = find('dataLoader').getComponent(dataLoader);
            // console.log(persistentDataLoader.m_quizData);
 
            // console.log(dataLoader.getInstance().m_quizData)
            if(this.m_gameStruct.get() == '')
            {
                this.m_gameStruct.set(JSON.stringify(persistentDataLoader.m_gameStruct))

                // console.log("@-struct")

            }

            if(this.m_quizData.get() == '')
            {
                this.m_quizData.set(JSON.stringify(persistentDataLoader.m_quizData))
                this.m_quizDataInit.set(JSON.stringify(persistentDataLoader.m_quizData))
                // console.log("@-quiz")

            }

            if(this.m_fiowData.get() == '')
            {
                this.m_fiowData.set(JSON.stringify(persistentDataLoader.m_fiowData))
                this.m_fiowDataInit.set(JSON.stringify(persistentDataLoader.m_fiowData))
                // console.log("@-fiow")

            }

            // console.log(persistentDataLoader.m_saveWcData);
            if(this.m_saveWcData.get() == '')
            {
                this.m_saveWcData.set(JSON.stringify(persistentDataLoader.m_saveWcData))
                this.m_saveWcDataInit.set(JSON.stringify(persistentDataLoader.m_saveWcData))
                // console.log("@-savewc")

            }

            if(this.m_sanitizeData.get() == '')
            {
                this.m_sanitizeData.set(JSON.stringify(persistentDataLoader.m_sanitizeData))
                // console.log("@-sanitize")

            }

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

    updateProgress(_score:number, _isRightAnswer:boolean=true)
    {
        // INFO : Data below are sent when round is over ; if the player is among best scorers then these data are processed
        let didClearLevel = false;
        let didClearRound = false;

        let playerData : PlayerData = JSON.parse(this.m_playerData.get());
        let gameStruct : GameStruct = JSON.parse(this.m_gameStruct.get());

        // let levelIndex = this.m_selectedDifficulty.get();
        let levelIndex = playerData.progression.levelIndex;

        
        let currentGame = gameStruct.levels[levelIndex]
        .rounds[playerData.progression.roundIndex]
            .games.find((g)=>g.played == false);
        
        
        
        currentGame.played = true;
        playerData.progression.gameIndex += 1;
        playerData.score += Math.round(_score);
        playerData.stats.right_answers = _isRightAnswer ?  playerData.stats.right_answers + 1 :  playerData.stats.right_answers;
        playerData.stats.wrong_answers = !_isRightAnswer ?  playerData.stats.wrong_answers + 1 :  playerData.stats.wrong_answers;

        // Last game of that round : Go to next round
        if(playerData.progression.gameIndex == gameStruct.levels[levelIndex].rounds[playerData.progression.roundIndex].games.length)
        {
    
            playerData.progression.gameIndex = 0;
            playerData.progression.roundIndex += 1;
            didClearRound = true;
            // If last Round
            if(playerData.progression.roundIndex == gameStruct.levels[levelIndex].rounds.length)
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
                    
                    gameStruct.levels[playerData.progression.levelIndex].unlocked = true;

                    didClearLevel = true; 
                    console.log("CLEARED LEVEL")                   

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
        // console.log("SM v")
        // console.log(playerData);
        // if(didClearLevel)
        // console.log(gameStruct);

        this.m_playerData.set(JSON.stringify(playerData));

        this.m_gameStruct.set(JSON.stringify(gameStruct));

        this.m_didClearRound.set(didClearRound);
        this.m_didClearLevel.set(didClearLevel);

       
        return [didClearRound ,didClearLevel];

    }


    playErrorSound()
    {
        if(this.m_gameSoundEffects.get() == "true")
        {
            this.m_errorSound.play();
        }
    }

    playSuccessSound()
    {
        if(this.m_gameSoundEffects.get() == "true")
        {
            this.m_successSound.play();
        }
    }

    playBtnSound()
    {
        if(this.m_gameSoundEffects.get() == "true")
        {
            this.m_btnSound.play();
        }
    }


    playBgSound()
    {
        if(this.m_gameMusic.get() == "true")
        {
            this.m_bgSound.play();
        }
    }

    switchScene(_name : string)
    {
        // console.log(this.m_currentScene.get());
        // console.log(_name);

        let prevScene = this.m_sceneItems.find(e=>e.m_name == this.m_currentScene.get());
        let nextScene = this.m_sceneItems.find(e=>e.m_name == _name);

        this.m_currentScene.set(_name);

        prevScene.m_scene.active = false;
        nextScene.m_scene.active = true;


    }
    // update(deltaTime: number) {
        
    // }
}

