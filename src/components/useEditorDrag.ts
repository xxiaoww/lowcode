export function useEditorDrag(e:DragEvent,focusData:any){
    const dragenter = function(e:DragEvent){

    }
    const dragover  = function(e:DragEvent){
        
    }
    const dragleave = function(e:DragEvent){

    }
    const drop = function(e:DragEvent){

    }
    let dragstart = function(e:DragEvent){
        // 获取选中的组件
        const focus = focusData.focus
        // 过进行拖拽的元素添加的事件是dragstart，drag，dragend
        console.log(e.target)
        // 给过程元素添加的是dragenter、dragover、dragleave事件

        // 给目标元素添加的是drop事件，dragover事件（这个事件为拖拽元素进入到目标元素的时候触发的函数，并且执行阻止默认行为

        
    }
}