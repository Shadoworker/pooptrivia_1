import { Component } from "cc";


export class Singleton extends Component{

    static instance: Singleton = null;

}
Singleton.instance = new Singleton();
