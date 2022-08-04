import { _decorator, Component, Node, AssetManager, assetManager, director, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('loaderCtrlr')
export class loaderCtrlr extends Component {

    
    @property({type:Node})
    private dataLoader = null;

    start() {

        // setTimeout(() => {
        //     director.loadScene("quizScene");
        // }, 500);

        

    }

 
}

