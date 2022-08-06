import { _decorator, Component, Node, Prefab, instantiate, Sprite, Label, find } from 'cc';
import { stateManager } from '../managers/stateManager';
import { playerItemSCROB } from '../utils/scrobs';
import { PlayerData } from '../utils/types';
import { playerItemsCtrlr } from './playerItemsCtrlr';
const { ccclass, property } = _decorator;

@ccclass('playerPupitreListCtrlr')
export class playerPupitreListCtrlr extends Component {

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

        // Get PlayersList
        let _playersListData : [PlayerData] = JSON.parse(find('stateManager').getComponent(stateManager).m_playersListData.get())


        for (let i = 0; i < _playersListData.length; i++) {

            let player = _playersListData.find(e=>e.podiumIndex == i);

            const scrob = this.m_playerItemSCROBs[player.index];

            let playerPupitreItem = this.node.children[i];

            // console.log(this.node.children);
            playerPupitreItem.getChildByPath("playerMask/player").getComponent(Sprite).spriteFrame = scrob.m_avatar;
            playerPupitreItem.getChildByPath("playerMask/playerName").getComponent(Label).string = scrob.m_name.toString();
            playerPupitreItem.getChildByPath("playerMask/playerScore").getComponent(Label).string = player.score.toString();
            

        }

    }

}

