import { Component, _decorator } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export class DataManager extends Component {
// …
 
//게으른 초기화
//static _instance: DataManager = null;;

//부지런한 초기화
static _instance: DataManager = new DataManager();


static get instance(): DataManager {

if (this._instance == null) {
this._instance = new DataManager();
}
return this._instance;
}


setLog() {
// console.log(this.names);
};
};