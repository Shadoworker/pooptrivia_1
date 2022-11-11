import { _decorator, Component, Node, AssetManager, assetManager, director, game, find } from 'cc';
import { stateManager } from './managers/stateManager';
const { ccclass, property } = _decorator;

@ccclass('loaderCtrlr')
export class loaderCtrlr extends Component {

    
    @property({type:Node})
    private dataLoader = null;

    start() {

        // setTimeout(() => {
        //     find('stateManager').getComponent(stateManager).switchScene("onboardScene");
        // }, 500);

        

    }

 
}

