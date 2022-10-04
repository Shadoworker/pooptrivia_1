import { _decorator, Component, Node, Prefab, instantiate, Sprite, Label, find, Color } from 'cc';
import { stateManager } from '../managers/stateManager';
import { playerItemSCROB } from '../utils/scrobs';
import { PlayerData } from '../utils/types';
import { playerItemsCtrlr } from './playerItemsCtrlr';
const { ccclass, property } = _decorator;

@ccclass('playerRecapListCtrlr')
export class playerRecapListCtrlr extends Component {

    // Characters Data 
    @property ({type : Prefab})
    public m_playerItemsPrefab = null;

    public m_playerItemSCROBs : [playerItemSCROB];

    start() {
        this.initView()
    }

    initView()
    {

        var playerItemsPrefab = instantiate(this.m_playerItemsPrefab);
        this.m_playerItemSCROBs = playerItemsPrefab.getComponent(playerItemsCtrlr).playerItems;

        if(find('stateManager').getComponent(stateManager).m_playersListData.get() != '')
        {

            let playerData : PlayerData = JSON.parse(find('stateManager').getComponent(stateManager).m_playerData.get())

            // Get PlayersList
            let _playersListData : [PlayerData] = JSON.parse(find('stateManager').getComponent(stateManager).m_playersListData.get())
            let _list = [..._playersListData];

            let sortedList = _list.sort((a, b) => {
                return b.score - a.score;
            });



            for (let i = 0; i < sortedList.length; i++) {

                let player = sortedList.find(e=>e.podiumIndex == i);

                const scrob = this.m_playerItemSCROBs[player.index];

                let playerPupitreItem = this.node.children[i];

                // Trophy set
                let playerIndexInRanking = sortedList.findIndex(e=>e.index == player.index);
                if(playerIndexInRanking > 2) // 0, 1, 2 
                    playerIndexInRanking = 3; // The last item index in trophies

                let c : Color = player.eliminated ? Color.BLACK : Color.WHITE;
                // console.log(this.node.children);
                let leftover = sortedList.filter(e=>e.eliminated == false).length;
                if(playerData.eliminated || leftover == 1) // Player eliminated or the single one 
                {
                    playerPupitreItem.getChildByPath("trophies").children[playerIndexInRanking].active = true;

                    playerPupitreItem.getChildByPath("playerRank").active = true;
                    playerPupitreItem.getChildByPath("playerRank").getComponent(Label).string = (i+1).toString();
                    
                }
                
                playerPupitreItem.getChildByPath("playerMask/player").getComponent(Sprite).spriteFrame = scrob.m_avatar;
                playerPupitreItem.getChildByPath("playerMask/player").getComponent(Sprite).color = c;
                // playerPupitreItem.getChildByPath("playerMask/playerScore").getComponent(Label).string = player.eliminated ? "X" : player.score.toString();
                playerPupitreItem.getChildByPath("playerPoints").getComponent(Label).string = player.score.toString() + " pts";
                playerPupitreItem.getChildByPath("playerPoints").getComponent(Label).color = player.eliminated ? Color.RED : Color.BLACK;
                

            }
        
        }
        
    }

}

