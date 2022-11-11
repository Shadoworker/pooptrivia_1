import { Node, _decorator } from "cc";

// avatarModule.ts
const {ccclass, property} = _decorator;

    
enum sex {
    M = 0,
    F = 1
}

@ccclass('sceneItemSCROB')
export class sceneItemSCROB  {

    @property (String)
    public m_name: String = "";

    @property (Node)
    public m_scene: Node = null; 

}