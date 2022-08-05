import { _decorator, Component, Node, find, Label, Color, Sprite, Button } from 'cc';
import { saveWcCtrlr } from '../saveWcCtrlr';
const { ccclass, property } = _decorator;

@ccclass('letterBtnCtrlr')
export class letterBtnCtrlr extends Component {

    m_clicked : boolean;

    start() {

        this.m_clicked = false;
    }

    onClickLetter(ev:any)
    {
        if(!this.m_clicked)
        {
            let letter = this.getComponentInChildren(Label).string;

            let refs = find('Canvas').getComponent(saveWcCtrlr).onClickLetter(letter);

            let isCorrect = refs[0];
            let amongWord = refs[1];

            let col = isCorrect || amongWord ? Color.GREEN : Color.RED;

            this.node.getComponent(Button).enabled = false;

            this.node.getComponent(Sprite).color = col;

            this.m_clicked = true;
        }

    }

}

