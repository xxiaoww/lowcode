
import { lookforId } from "./useLookforId";
export function useEditorDrag() {
// 记录拖拽元素
let dragElement:null|HTMLElement = null
// 记录鼠标在拖动元素上的位置信息
let x=0,y = 0

  const dragenter = function (e: DragEvent) {
    console.log(e)
    console.log(e.target)
    e.dataTransfer!.dropEffect = "move";
    console.log(e.dataTransfer)
    const mouseY = e.clientY;
    // 获取拖拽进入的元素editor-block父元素的offsetTop和offsetLeft
    const target = e.target as HTMLElement;
    const father = target.closest('.editor-block') as HTMLElement;
    father.style.border = '2px dashed #ccc'; // 设置拖放目标的边框样式
    const top = father.offsetTop
    const height = father.offsetHeight
    const distance = Math.abs(mouseY - top)
    const key = father.getAttribute('keys') as string
    const id = father.getAttribute('data-id') as string
    console.log(key)
    // console.log(father!.offsetTop,father!.offsetLeft)





    // 感觉可以通过几次判断
    // 1.拖拽元素其实还未在过程元素的上方，这时候可以通过判断鼠标的e.clientY和元素的offsetTop来比较
    // 此外还要判断进入的元素是否是flex盒子，或者container盒子，
    // 分别判断鼠标在元素的上方和鼠标在元素的下方（所以要用到height）
    if(key !=='container' && key !=='flex'&& key!=='latercontainer') {
      if(distance<= 5) {
        // 不可以用dataTransfer，因为在dragover这个函数是只读的，无法直接修改
        // e.dataTransfer?.dropEffect = 'move'
      // 鼠标在元素上方
      father.parentNode!.insertBefore(dragElement!, father);
      }else if(distance>=(height - 5)){
        console.log(1111)
        // 鼠标在元素下方
    father.parentNode!.insertBefore(dragElement!, father.nextSibling);
      }
    }
    // 2.如果是其他类型
    
  };
  const dragover = function (e: DragEvent) {
    // 阻止默认事件
    e.preventDefault();
    const target = e.target as HTMLElement;
    
  }; // 设置节流的延迟时间，这里设置为200毫秒
  const dragleave = function (e: DragEvent) {
    const target = e.target as HTMLElement;
    const father = target.closest('.editor-block') as HTMLElement;
    father.style.border = '0px'
  };
  const drop = function (e: DragEvent) {
    if (dragElement) {
      dragElement.style.removeProperty('top');
      dragElement.style.removeProperty('left');
      dragElement.style.removeProperty('position');
    }
    dragElement = null;
    document.removeEventListener('dragenter', dragenter);
    document.removeEventListener('dragover', dragover);
    document.removeEventListener('drop', drop);
  };  
  let dragstart = function (e: DragEvent,focusData:any) {
    // e.dataTransfer!.effectAllowed = 'move'
    console.log(e.target);
    const target = e.target as HTMLElement;
    target.style.opacity = "0.5"
    e.dataTransfer!.setData("text/plain", focusData);
    console.log(e.dataTransfer!.getData("text/plain"));
    
    console.log(target!.getAttribute("data-id"));
    const id = target!.getAttribute("data-id");

    dragElement = e.target as HTMLElement;
    const rect = dragElement.getBoundingClientRect();
    x = e.clientX - rect.left
    y = e.clientY - rect.top
    lookforId(id!);
    // 获取选中的组件
    const focus = focusData.focus;
    // 过进行拖拽的元素添加的事件是dragstart，drag，dragend
    console.log(e.target);
    // 给过程元素添加的是dragenter、dragover、dragleave事件
    const editorblock = document.querySelectorAll('.editor-block')
    console.log(editorblock)
    for(let i = 0;i<editorblock.length;i++){
      editorblock[i].addEventListener("dragenter",dragenter as (this: Element, ev: Event) => any);
      editorblock[i].addEventListener("dragover",dragover as (this: Element, ev: Event) => any);
      editorblock[i].addEventListener("dragleave",dragleave as (this: Element, ev: Event) => any);

      editorblock[i].addEventListener("drop",drop as (this: Element, ev: Event) => any);
    }
    // 给目标元素添加的是drop事件，dragover事件（这个事件为拖拽元素进入到目标元素的时候触发的函数，并且执行阻止默认行为
  };
  return {
    dragstart
  }
}
