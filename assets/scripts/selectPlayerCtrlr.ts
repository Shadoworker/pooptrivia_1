import { _decorator, Component, Node, SpriteFrame, find, director, Asset, Vec2, ValueType, Prefab, instantiate, Button, Sprite, Label, Color } from 'cc';
import { playerAvatarCtrlr } from './components/playerAvatarCtrlr';
import { playerItemsCtrlr } from './components/playerItemsCtrlr';
import { definePlayers } from './global';
import { stateManager } from './managers/stateManager';
import { playerItemSCROB } from './utils/scrobs';
import { GameStruct, PlayerData } from './utils/types';
const { ccclass, property } = _decorator;
   
 
@ccclass('selectPlayerCtrlr')
export class selectPlayerCtrlr extends Component {


    // Player View Nodes
    @property ({type : Sprite})
    public m_selectedPlayerAvatar : Sprite = null;
    @property ({type : Label})
    public m_selectedPlayerName : Label = null;
    @property ({type : Label})
    public m_selectedPlayerAge : Label = null;
    @property ({type : Label})
    public m_selectedPlayerJob : Label = null;





    // Characters Data container
    @property ({type : Prefab})
    public m_playerItemsPrefab = null;


    @property ({type : Prefab})
    public m_playerAvatarPrefab = null;

    @property ({type : Node})
    public m_playerAvatarsContainer = null;

    public m_selectedPlayer : playerItemSCROB;
    public m_selectedPlayerData : PlayerData;

    public m_playerItemSCROBs : [playerItemSCROB];

    @property({type: Node})
    public m_preloader : Node = null;

    start() {
        

        this.initPlayers();
    }
 
    initPlayers()
    {
        let playerItemsPrefab = instantiate(this.m_playerItemsPrefab);
        
        playerItemsPrefab.getComponent(playerItemsCtrlr).updatePlayersData();
        this.m_playerItemSCROBs = playerItemsPrefab.getComponent(playerItemsCtrlr).playerItems;
        // console.log(this.m_playerItemSCROBs)

        this.m_playerAvatarsContainer.destroyAllChildren();

        for (let i = 0; i < this.m_playerItemSCROBs.length; i++) {

            const scrob = this.m_playerItemSCROBs[i];

            let playerAvatar = instantiate(this.m_playerAvatarPrefab)
            
            playerAvatar.getComponent(playerAvatarCtrlr).setItem(this.node, scrob);

            this.m_playerAvatarsContainer.addChild(playerAvatar)
            
        }



        setTimeout(() => {
                
            // Trigger click on First Element : Select the first Avatar
            this.m_selectedPlayer = this.m_playerItemSCROBs[0];
            const el = this.m_playerAvatarsContainer.children[0];
            // console.log(this.m_playerAvatarsContainer);
            // console.log(el);
            el.getComponent(playerAvatarCtrlr).onClickPlayerAvatar(this.m_selectedPlayer);
            
        }, 50);
           

    }

    goBack()
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        // this.m_preloader.active = true;

        // director.loadScene("homeScene");
        find('stateManager').getComponent(stateManager).switchScene("homeScene");

    }

    onClickPlayerAvatar(_d: playerItemSCROB)
    {
        find('stateManager').getComponent(stateManager).playBtnSound();

        this.m_selectedPlayer = _d;
        // console.log(_d);
        let thisIndex = this.m_playerItemSCROBs.indexOf(_d);
        // Reset other
        for (let i = 0; i < this.m_playerAvatarsContainer.children.length; i++) {
            
            const el = this.m_playerAvatarsContainer.children[i];
            el.getComponent(Button).enabled = (i != thisIndex);  
            if(i != thisIndex)          
                el.getComponent(Sprite).color = new Color("#FFFFFF");
            el.getComponent(playerAvatarCtrlr).m_clicked = (i == thisIndex);            
        }

        this.setPlayerView();
    }


    setPlayerView()
    {
        this.m_selectedPlayerAvatar.spriteFrame = this.m_selectedPlayer.m_avatar; 
        this.m_selectedPlayerName.string = this.m_selectedPlayer.m_name.toString(); 
        this.m_selectedPlayerAge.string = this.m_selectedPlayer.m_age.toString() + " ans"; 
        this.m_selectedPlayerJob.string = this.m_selectedPlayer.m_job.toString(); 
    }

    play()
    {

        find('stateManager').getComponent(stateManager).playBtnSound();

        //New only if not current new one
        // if(find('stateManager').getComponent(stateManager).m_playerData.get() == '')
        {
            // Get Player Index among playerItemSCROBs (Later use to get UI details)
            let playerIndex = this.m_playerItemSCROBs.indexOf(this.m_selectedPlayer);
            
            this.m_selectedPlayerData = {
                index: playerIndex, // Index among playerItemSCROBs
                podiumIndex:0,
                name:  this.m_selectedPlayer.m_name.toString(),
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
                },
                stats:{
                    pq: 0,
                    wrong_answers: 0,
                    right_answers: 0,
                    poop_coins: 0,
                },
                level_coins : [0,0,0],
                eliminated:false
            };
            
            find('stateManager').getComponent(stateManager).setPlayerData(this.m_selectedPlayerData);
        }

        // Select random Players (4) + selctedPlayer = 5
        let allPlayers = definePlayers(this.m_selectedPlayerData, this.m_playerItemSCROBs, this.m_selectedPlayer);
        find('stateManager').getComponent(stateManager).setPlayersListData(allPlayers);

        setTimeout(() => {
            
            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())
            let gameStruct : GameStruct = JSON.parse(find('stateManager').getComponent(stateManager).m_gameStruct.get())
    
            // let levelIndex = find('stateManager').getComponent(stateManager).m_selectedDifficulty.get();
            let levelIndex = playerData.progression.levelIndex; 
            // Getting the fist game not yet played "levels/rounds/games"
            let nextGame = gameStruct.levels[levelIndex]
                                        .rounds[playerData.progression.roundIndex]
                                            .games.find((g)=>{return g.played == false}).name;
    
            // console.log(nextGame);
    
            setTimeout(() => {

                // this.m_preloader.active = true;
                let scene = nextGame + "Scene";
                // director.loadScene(scene);
                
                find('stateManager').getComponent(stateManager).switchScene(scene);

            }, 100);

        }, 10);
  

    }




}

