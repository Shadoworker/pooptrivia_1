import { _decorator, Component, Node, find, Label, Color } from 'cc';
import { saveWcCtrlr } from '../saveWcCtrlr';
const { ccclass, property } = _decorator;

@ccclass('letterBtnCtrlr')
export class letterBtnCtrlr extends Component {

    start() {


    }

    onClickLetter(ev:any)
    {
        let letter = this.getComponentInChildren(Label).string;

        let isCorrect = find('Canvas').getComponent(saveWcCtrlr).onClickLetter(letter);

        let col = isCorrect ? Color.GREEN : Color.RED;
    }

}

