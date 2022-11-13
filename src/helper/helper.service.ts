import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Board } from "../board/board.model";
import { Card } from "../board/card.model";

@Injectable()
export class HelperService{
    constructor(@InjectModel(Board) private boardRepository: typeof Board,
             @InjectModel(Card) private cardRepository: typeof Card,
) {}

async gameForFour() {
    let cardArr = [];
    for(let i = 0; i<4; i++){
    let cardNum = Math.floor(Math.random() * 101)

    for(let k = 0; k< cardArr.length; k++) {
       if(cardArr[k]==cardNum) {
        break;
       } 
       cardArr.push(cardNum)
    }
    }; 
}



}
