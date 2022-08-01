import { _decorator, Component, Node } from 'cc';
import { Kayfo } from '../utils/persistentMember';
import { dataLoader } from './dataLoader';
const { ccclass, property } = _decorator;


@ccclass('uiManager')
export class uiManager extends Component {

    @property({type:Node})
    private questionBox = null;

    public m_persistentPlayer = new Kayfo.PersistentString("m_persistentPlayer", "");

    start() {

        // console.log(this.m_persistentPlayer)
        // console.log(dataLoader.getInstance().m_test)


    }

    update(deltaTime: number) {
        
    }
}

