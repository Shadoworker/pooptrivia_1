import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('finalCtrlr')
export class finalCtrlr extends Component {
    start() {

    }

    replay()
    {
        localStorage.clear()
        setTimeout(() => {
            director.loadScene('splashScene');
        }, 200);
    }
}

