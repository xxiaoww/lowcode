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

let cachedSourceBlock:null|Block = null;
let previousParentBlock: Block | null = null;
let previousPosition: 'before' | 'after' | null = null;
let previousTargetId: string | null = null;
// 这是一个递归函数来查找并删除指定 ID 的块
function findAndRemoveBlock(blocks: Block[], id: string): Block | null {
  console.log(blocks)
  for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].id === id) {
          return blocks.splice(i, 1)[0]; // 删除并返回找到的块
      } else if (blocks[i].body && blocks[i].body!.length > 0) {
          const foundBlock = findAndRemoveBlock(blocks[i].body!, id);
          if (foundBlock) {
              return foundBlock; // 返回找到的块
          }
      }
  }
  return null; // 如果没有找到则返回 null
}


// 这是一个递归函数来查找目标位置的块
function findBlock(blocks: Block[], id: string): Block | null {
    for (let block of blocks) {
        if (block.id === id) {
            return block;
        } else if (block.body && Array.isArray(block.body) && block.body.length > 0) {
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
    // const dataStore = useData();
    let blocks = computed(()=> useData().state.blocks);
  console.log(blocks.value)

    // 查找并删除源块
    console.log(sourceId)
   
    // 查找并删除源块，只在第一次调用时执行删除操作
    if (!cachedSourceBlock ) {
      console.log(sourceId);
      cachedSourceBlock = findAndRemoveBlock(blocks.value, sourceId);
      console.log(cachedSourceBlock);
      if (!cachedSourceBlock) {
          console.error(`Block with id ${sourceId} not found`);
          return;
      }
  }else if(cachedSourceBlock.id !== sourceId){
    cachedSourceBlock = findAndRemoveBlock(blocks.value, sourceId);
      console.log(cachedSourceBlock);
  }
  console.log(cachedSourceBlock)
    // 查找目标块
    const targetBlock = findBlock(blocks.value, targetId);
    console.log(targetBlock)
    if (!targetBlock) {
        console.error(`Block with id ${targetId} not found`);
        return;
    }

    // 插入源块到目标块的前或后
    // 如果有上一次的插入位置，则先删除
    if (previousParentBlock && previousTargetId && previousPosition) {
      const previousTargetBlock = findBlock(previousParentBlock.body!, previousTargetId);
      if (previousTargetBlock) {
          removeBlockFromParent(previousParentBlock, cachedSourceBlock?.id!);
      }
  }
    // if (position === 'before') {
    //     const parentBlock = findParentBlock(blocks.value, targetId);
    //     console.log(parentBlock)
    //     if (parentBlock) {
    //         const targetIndex = parentBlock.body!.findIndex(block => block.id === targetId);
    //         parentBlock.body!.splice(targetIndex, 0, cachedSourceBlock);
    //     }
    // } else if (position === 'after') {
    //     const parentBlock = findParentBlock(blocks.value, targetId);
    //     if (parentBlock) {
    //         const targetIndex = parentBlock.body!.findIndex(block => block.id === targetId);
    //         parentBlock.body!.splice(targetIndex + 1, 0, cachedSourceBlock);
    //     }
    // }
    //  // 保存这次的插入位置
    //  previousParentBlock = parentBlock;
    //  previousTargetId = targetId;
    //  previousPosition = position;
  // 插入源块到目标块的前或后
  const parentBlock = findParentBlock(blocks.value, targetId);
  if (parentBlock) {
      const targetIndex = parentBlock.body!.findIndex(block => block.id === targetId);
      if (position === 'before') {
          parentBlock.body!.splice(targetIndex, 0, cachedSourceBlock);
      } else if (position === 'after') {
          parentBlock.body!.splice(targetIndex + 1, 0, cachedSourceBlock);
      }

      // 保存这次的插入位置
      previousParentBlock = parentBlock;
      previousTargetId = targetId;
      previousPosition = position;
  }
    console.log('Block moved successfully');
}
// 查找父块
 function findParentBlock(blocks: Block[], id: string): Block | null {
  console.log(blocks)
   // 在根 blocks 数组中查找
   if (blocks.some(block => block.id === id)) {
    return { body: blocks } as Block; // 创建一个虚拟的父块对象来表示根 blocks 数组
  }
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
// 从父块中删除指定块
function removeBlockFromParent(parentBlock: Block, blockId: string) {
  parentBlock.body = parentBlock.body!.filter(block => block.id !== blockId);
}