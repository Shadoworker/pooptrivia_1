import { _decorator, Component, Node, Label, find } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { dataLoader } from './dataLoader';
import { stateManager } from './stateManager';
const { ccclass, property } = _decorator;


@ccclass('uiManager')
export class uiManager extends Component {

    @property({type:Node})
    private questionBox = null;

    @property({type:Label})
    private playerName = null;

    public m_persistentPlayer = new Kayfo.PersistentString("m_persistentPlayer", "");

    start() {

        // console.log(this.m_persistentPlayer)
        // console.log(dataLoader.getInstance().m_test)
        if(find('stateManager'))
        {
            let playerData = find('stateManager').getComponent(stateManager).m_playerData.get();
            this.playerName.string = JSON.parse(playerData).name;
        }
    }

    update(deltaTime: number) {
        
    }
}

