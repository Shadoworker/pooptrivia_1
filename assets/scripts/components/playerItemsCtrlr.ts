import { _decorator, Component, Node, SpriteFrame } from 'cc';
import { playerItemSCROB } from '../utils/scrobs';
// import { playerAvatarSCROB } from '../utils/scrobs';
const { ccclass, property } = _decorator;

@ccclass('playerItemsCtrlr')
export class playerItemsCtrlr extends Component {

  
    @property ({type : [playerItemSCROB]})
    public playerItems = [];


    public playersNames = 
    [
        // M
        ["Lucas","Juma","Cedric","Kevin","Habibe","Peter","Caleb","Lamine","Abdou","Amos","Tichona","Tidiane","Musa","Cheikh","Omar","Franck","Thomas","Uche","Eyasu","Sam","Daniel","Malick","Jean","Koffi","Dieudonne","Vicente","Adama","Djamal"], 
        // F
        ["Emma","Binta","Pamela","Fatou","Sandra","Aicha","Astou","Yemi","Isabelle","Valerie","Isa","Sofia","Amina","Eva","Kadi","Faty","Nafi","Bané","Njeri","Marie","Rose","Aida","Nancy","Rose","Aya","Maria","Hasnaa","Nneka"]
    ]
    
    start() {

    }

    updatePlayersData()
    {
        
        for (let i = 0; i < this.playerItems.length; i++) 
        {
            const el = this.playerItems[i];

            var randomNameIndex = Math.floor(Math.random() * this.playersNames[el.m_sex].length);

            var name = this.playersNames[el.m_sex].splice(randomNameIndex, 1)[0];
            
            this.playerItems[i].m_name = name;
            
        }
    }
 
}

