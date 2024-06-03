import { Block, AppData } from "../../types/global";
import { computed } from "vue";
import useData from "../stores/data";
// 清空focus函数
export function useFocus(callback: any) {
  let blocks = useData().state;
  const clearBlockFocus = (block?: Block[]) => {
    if (block) {
      block.forEach((b: Block) => {
        b.focus = false;
        if (b.body && Array.isArray(b.body)) {
          clearBlockFocus(b.body);
        }
      });
    } else if (useData().state.blocks) {
      useData().state.blocks.forEach((block: Block) => {
        block.focus = false;
        if (block.body && Array.isArray(block.body)) {
          clearBlockFocus(block.body);
        }
      });
    }
  };
  const onmousedown = (e: any, block: Block, id: String) => {
    // 阻止默认事件
    e.preventDefault();
    // 阻止事件冒泡
    e.stopPropagation();
    console.log(block.focus);
    // block规划一个属性，focus，获取焦点后就将focus变为true
    if (!block.focus) {
      console.log(block);
      // 清空其他人的focus属性
      clearBlockFocus();
      block.focus = true;
      console.log(block.focus);
      console.log(useData().state);
    } else {
      block.focus = false;
    }
    useData().state.blocks.forEach((block) => {
      if (block.id === id) {
        block.focus = true;
      }
    });
    callback(e);
  };

  // 计算focus和unfocused的数组
  const focusData = computed(() => {
    let focus: Block[] = [];
    let unfocused: Block[] = [];
    com(useData().state.blocks, focus, unfocused);
    // console.log(useData().state.blocks);
    // console.log(focus);
    return { focus, unfocused };
  });
  function com(blocks: Block[], focus: Block[], unfocused: Block[]) {
    blocks.forEach((block: Block) => {
      if (block.focus) {
        focus.push(block);
      } else {
        unfocused.push(block);
      }
      // if (block.body!.length > 0 && Array.isArray(block.body)) {
      //   com(block.body, focus, unfocused);
      // }
      //更改：
      if (block.body!) {
        if (block.body!.length > 0 && Array.isArray(block.body))
          com(block.body, focus, unfocused);
      }
    });
  }
  return {
    onmousedown,
    focusData,
    clearBlockFocus,
  };
}
