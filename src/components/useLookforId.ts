import useData from "../stores/data"; //useData().state就是data.json的内容
import {Block} from '../../types/global'
// 这是一个递归函数来寻找id的
export function lookforId(id: string){
   com(useData().state!.blocks,id)
}
function com(block:Block[],id:string){
    block.forEach((block:Block)=>{
        if(block.id === id){
            console.log(id)
        }else if (block.body!.length>0 && Array.isArray(block.body)){
            com(block.body,id)
        }
    })
}