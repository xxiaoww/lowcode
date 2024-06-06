import { moveBlock } from "./useLookforId";
import useData from "../stores/data"; // useData().state 就是 data.json 的内容

export function useEditorDrags(){
    // 记录拖拽的元素
    let dragElement:null|HTMLElement = null
    let width:string, height:string
    // 拖拽开始函数
    const dragstart = function(e:DragEvent){
        dragElement = e.target as HTMLElement
        // 获取拖拽元素的高和宽
        width = dragElement.style.width
        height = dragElement.style.height
        console.log(width, height)
 
        // 设置拖拽效果
    e.dataTransfer!.effectAllowed = 'move'
    }
    // 拖拽结束事件
    const dragend = function(e:DragEvent){
        console.log(e.target)
    }
    // 过程元素进入的函数
    const dragenter = function(e:DragEvent){
        // 设置可放置效果
        e.dataTransfer!.dropEffect = 'move'
        let target = e.target as HTMLElement
        console.log(target)
        
        // 寻找target的最近的父级元素editor-block添加进入的提示
        let father = target.closest('.editor-block') as HTMLElement
        console.log(father)
        if (father && father!==dragElement) {
            father.style.border = '1px dashed #ccc';
        }
        let key = father.getAttribute('keys') as string
        // 父元素的id
        let id = father.getAttribute('data-id') as string
        // soucrId拖拽元素的id
        let sourceId = dragElement?.getAttribute('data-id') as string
        let top = father.offsetTop
        let height = father.offsetHeight
        let distance = e.clientY - top
        if(key !=='container' && key !=='flex'&& key!=='latercontainer') {
            if(distance<= 5) {
              console.log(1111)
            // father.parentNode!.insertBefore(dragElement!, father);
                // 直接拿到dragElement的数据，然后插入到对应位置，影响state来改变页面布局
                moveBlock(sourceId,id,'before')
            
            }else if(distance>=(height - 5)){
              console.log(2222)
        //   father.parentNode!.insertBefore(dragElement!, father.nextSibling);
          moveBlock(sourceId,id,'after')
          console.log(useData().state.blocks)

            }
          }
        
    }
    // 过程元素在拖拽元素上的函数
    const dragover = function(e:DragEvent){
        // 阻止默认事件发生
        e.preventDefault()
    }
    // 过程元素离开拖拽元素的函数
    const dragleave = function(e:DragEvent){
        const target = e.target as HTMLElement
        console.log(target)
        // 寻找target的最近的父级元素editor-block添加进入的提示
        let father = target.closest('.editor-block') as HTMLElement
        // console.log(father)
        if (father && father!== dragElement) {
            father.style.border = '0px dashed #ccc';
        }
      
        
    }

    // 作用在目标元素的函数
    const drop = function(e:DragEvent){

    }

    return {
        dragstart,
        dragend,
        dragenter,
        dragover,
        dragleave,
        drop
    }
}