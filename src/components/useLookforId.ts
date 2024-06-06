// import useData from "../stores/data"; //useData().state就是data.json的内容
// import { Block } from "../../types/global";
// // 这是一个递归函数来寻找id的
// export function lookforId(id: string) {
//   com(useData().state!.blocks, id);

// }


// function com(block:Block[],id:string){
//     block.forEach((block:Block)=>{
//         if(block.id === id){
//             console.log(id) 
//         }else if (block.body!.length>0 && Array.isArray(block.body)){
//             com(block.body,id)
//         }
//     })
// }

import useData from "../stores/data"; // useData().state 就是 data.json 的内容
import { Block } from "../../types/global";
import { computed } from "vue";
// 这是一个递归函数来查找并删除指定 ID 的块
function findAndRemoveBlock(blocks:Block[], id: string):Block|null {
  let block:Block
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id === id) {
          // console.log(blocks.splice(i, 1)[0])
          block = blocks.splice(i, 1)[0]
            return block; // 删除并返回找到的块
        } else if (blocks[i].body && blocks[i].body!.length > 0) {
            const foundBlock = findAndRemoveBlock(blocks[i].body!, id);
            // if (foundBlock) {
            //   console.log(foundBlock)
            //     return foundBlock;
            // }
        }
    }
    return null;
    // return block
}

// 这是一个递归函数来查找目标位置的块
function findBlock(blocks: Block[], id: string): Block | null {
    for (let block of blocks) {
        if (block.id === id) {
            return block;
        } else if (block.body && block.body.length > 0) {
            const foundBlock = findBlock(block.body, id);
            if (foundBlock) {
                return foundBlock;
            }
        }
    }
    return null;
}

// 主函数来移动块
export function moveBlock(sourceId: string, targetId: string, position: 'before' | 'after') {
    const dataStore = useData();
    let blocks = computed(()=> useData().state.blocks);
  console.log(blocks.value)

    // 查找并删除源块
    const sourceBlock = findAndRemoveBlock(blocks.value, sourceId);
    console.log(sourceBlock)
    if (!sourceBlock) { 
        console.error(`Block with id ${sourceId} not found`);
        return;
    }

    // 查找目标块
    const targetBlock = findBlock(blocks.value, targetId);
    if (!targetBlock) {
        console.error(`Block with id ${targetId} not found`);
        return;
    }

    // 插入源块到目标块的前或后
    if (position === 'before') {
        const parentBlock = findParentBlock(blocks.value, targetId);
        if (parentBlock) {
            const targetIndex = parentBlock.body!.findIndex(block => block.id === targetId);
            parentBlock.body!.splice(targetIndex, 0, sourceBlock);
        }
    } else if (position === 'after') {
        const parentBlock = findParentBlock(blocks.value, targetId);
        if (parentBlock) {
            const targetIndex = parentBlock.body!.findIndex(block => block.id === targetId);
            parentBlock.body!.splice(targetIndex + 1, 0, sourceBlock);
        }
    }

    console.log('Block moved successfully');
}

// 查找父块
 function findParentBlock(blocks: Block[], id: string): Block | null {
    for (let block of blocks) {
        if (block.body && block.body.some(child => child.id === id)) {
            return block;
        } else if (block.body && block.body.length > 0) {
            const foundBlock = findParentBlock(block.body, id);
            if (foundBlock) {
                return foundBlock;
            }
        }
    }
    return null;
}

