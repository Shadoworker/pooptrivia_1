import { _decorator, Component, Node, find, director, assetManager, SpriteFrame, ImageAsset, Texture2D, Sprite, dynamicAtlasManager, SpriteAtlas, Prefab, Label, instantiate } from 'cc';
import { playerItemsCtrlr } from './components/playerItemsCtrlr';
import { definePlayers, padWithX, qualifyPlayers, TROPHIES_ACCESS } from './global';
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
    @property ({type : Label})
    public m_continuBtnLabel = null;

    public m_isEliminated : boolean = false;
    public m_clearedLevel : boolean = false;

    public m_levelCoins : number = 0;

    // Stats
    @property ({type : Label})
    public m_pqCountLabel = null;
    @property ({type : Label})
    public m_rightAnswersCountLabel = null;
    @property ({type : Label})
    public m_wrongAnswersCountLabel = null;
    @property ({type : Label})
    public m_coinsCountLabel = null;

    @property({type: Node})
    public m_preloader : Node = null;

    start() {


    }

    onEnable()
    {
        this.m_isEliminated = false;
        this.m_clearedLevel = false;

        this.initPlayers()

        setTimeout(() => {
        
            this.setupPlayers()
            
        }, 500);
    }

    initPlayers()
    {
        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

        let _playersListData : [PlayerData] = JSON.parse(find('stateManager').getComponent(stateManager).m_playersListData.get())
        let playersListData = [..._playersListData]

        // console.log(playersListData);

        let playerIndex = playersListData.findIndex(e=>e.index == playerData.index);
        playersListData[playerIndex] = playerData;

        var playerItemsPrefab = instantiate(this.m_playerItemsPrefab);
        this.m_playerItemSCROBs = playerItemsPrefab.getComponent(playerItemsCtrlr).playerItems;


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


        this.setPlayerStats(playerData)


        // console.log("eliminated : " + eliminated)
        let newPlayersListData = qualifyPlayers(playersListData, eliminated)
        
        find('stateManager').getComponent(stateManager).m_playersListData.set(JSON.stringify(newPlayersListData));

        // Check if Player is among qualified or not
        if(newPlayersListData.findIndex(e=>(e.index == playerData.index) && (e.eliminated == false)) != -1 ) // IN
        {

        }
        else // OUT
        {
            this.m_isEliminated = true;
            this.m_continuBtnLabel.string = "REJOUER"
        }


        if(find('stateManager').getComponent(stateManager).m_didClearRound.get() == 'true')
        {

            this.m_levelCoins = playerData.stats.poop_coins;

            // Set Level Poop levels
            let levelIndex = playerData.progression.levelIndex - 1 ; // We are already in next level index
            playerData.level_coins[levelIndex] += this.m_levelCoins;

            // Reset player data
            playerData.eliminated = false;
            playerData.stats = {pq:0, wrong_answers:0, right_answers:0, poop_coins:0};
            // playerData.score = 0;
            find('stateManager').getComponent(stateManager).m_playerData.set(JSON.stringify(playerData));

            // Reset round clear status
            find('stateManager').getComponent(stateManager).m_didClearRound.set('false');
        }


        // this.setPlayersView(newPlayersListData)

    }

    setPlayerStats(_playerData: PlayerData)
    {
        this.m_pqCountLabel.string = padWithX(_playerData.stats.pq, 3);
        this.m_rightAnswersCountLabel.string = padWithX(_playerData.stats.right_answers, 3);
        this.m_wrongAnswersCountLabel.string = padWithX(_playerData.stats.wrong_answers, 3);
        this.m_coinsCountLabel.string = padWithX(_playerData.stats.poop_coins, 3);
    }

    setPlayersView(_playersList : any[])
    {

    }

    
    gotoSanitize()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        // this.m_preloader.active = true;

        // director.loadScene("sanitizeScene");

        find('stateManager').getComponent(stateManager).switchScene("sanitizeScene");

    }

    setupPlayers()
    {


        if(find('stateManager').getComponent(stateManager).m_didClearLevel.get() == 'true' || find('stateManager').getComponent(stateManager).m_didClearLevel.get() == true)
        {
                   
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

            this.m_clearedLevel = true;

            let playerScore = playerData.score;

            // Reset player data
            playerData.eliminated = false;

            // Set Level Poop levels
            let levelIndex = playerData.progression.levelIndex - 1 ; // We are already in next level index
            playerData.level_coins[levelIndex] = playerData.level_coins[levelIndex] > playerData.stats.poop_coins ? playerData.level_coins[levelIndex] : playerData.stats.poop_coins;
            
            playerData.level_coins[levelIndex] += playerScore;

            playerData.stats = {pq:0, wrong_answers:0, right_answers:0, poop_coins:0};
            playerData.score = 0;
            find('stateManager').getComponent(stateManager).m_playerData.set(JSON.stringify(playerData));

            // Reset players list data
            let _selectedPlayerData = playerData;
            let _playerItemSCROBs = this.m_playerItemSCROBs;
            let _selectedPlayer = this.m_playerItemSCROBs[playerData.index];
            // Select random Players (4) + selctedPlayer = 5
            let allPlayers = definePlayers(_selectedPlayerData, _playerItemSCROBs, _selectedPlayer);
            find('stateManager').getComponent(stateManager).setPlayersListData(allPlayers);

            // Reset level clear status
            find('stateManager').getComponent(stateManager).m_didClearLevel.set(false);

            // Check trophy
            let trophyItem = TROPHIES_ACCESS.find(e=>(playerScore >= e.scoreMin && playerScore <= e.scoreMax))
            if(trophyItem)
            {
                let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())
                let levelIndex = playerData.progression.levelIndex - 1 ; // We are already in next level index
                // let levelIndex = find('stateManager').getComponent(stateManager).m_selectedDifficulty.get();
                

                let currentTrophyIndex = TROPHIES_ACCESS.findIndex(e=>e.name == gameStruct.levels[levelIndex].trophy)

                if(trophyItem.id > currentTrophyIndex) // Not to downgrade
                    gameStruct.levels[levelIndex].trophy = trophyItem.name;
                
                
                // Save Gamestruct with new trophy
                find('stateManager').getComponent(stateManager).m_gameStruct.set(JSON.stringify(gameStruct));
            }
        
        }

    }

    continue()
    {
       
        // this.m_preloader.active = true;
        
        find('stateManager').getComponent(stateManager).playBtnSound();


        let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
        let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())


        // Getting the fist game not yet played "levels/rounds/games"
        let nextGameItem = gameStruct.levels[playerData.progression.levelIndex]
                                    .rounds[playerData.progression.roundIndex]
                                        .games.find((g)=>{return g.played == false})
        
        if(!this.m_isEliminated)
        {

            if(nextGameItem) // Left unplayed game
            {

                let nextGame = nextGameItem.name;

                console.log(this.m_clearedLevel);

                // Reseting for next Level
                if(this.m_clearedLevel)
                {

                        setTimeout(() => {
                            let _scene = "difficultyScene";
                            // director.loadScene(_scene);
                            console.log('@DIFF')
                            find('stateManager').getComponent(stateManager).switchScene(_scene);

                        }, 200);
                }
                else
                {
                    setTimeout(() => {
                        let gameScene = nextGame + "Scene";
                        // director.loadScene(gameScene);
                        console.log('@GAME')
                        find('stateManager').getComponent(stateManager).switchScene(gameScene);

                    }, 200);
                }
            

            }
            else // No longer game to be played
            {
                setTimeout(() => {
                    let gameScene = "finalScene";
                    // director.loadScene(gameScene);
                    find('stateManager').getComponent(stateManager).switchScene(gameScene);

                }, 200);
            }

        }
        else
        {
            
            localStorage.clear();

            setTimeout(() => {
                let _scene = "splashScene";
                // director.loadScene(_scene);
                find('stateManager').getComponent(stateManager).switchScene(_scene);

            }, 200);
        }

        // console.log(nextGame);



    }

    
}

