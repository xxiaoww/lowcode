import { v4 as uuid } from "uuid";
import {
  AppData,
  Block,
  componentConfig,
  RegisterConfig,
} from "../../types/global";
import useData from "../stores/data"; //useData().state就是data.json的内容



// 给左侧组件添加点击事件，
// 具体表现为 如果有选中的盒子，则在点击左侧组件后添加在选中盒子添加一个EditorBlock
// 如果没有选中的盒子，则在最大的盒子里默认添加组件
export function editorClick(component: componentConfig, focusData: any, state: any) {
  const focus: Block[] = focusData.focus
  console.log(focus)
  if (focus.length !== 0) {
    // 要分为内容盒子，flex盒子，和普通已知具体标签的盒子
    // 1.如果选中的为内容组件
    if (focus[0].key === "container") {
      console.log(focus[0].id)

      useData().state.blocks.forEach(block => {
        console.log(block.id)
       
        lookforContainer(state, block, focus, component)
      })
      console.log(useData().state)
    }
    // 2.如果选中的为flex组件，自动在flex盒子添加
    else if (focus[0].key === "flex") {
      useData().state.blocks.forEach(block => {
        lookforFlex(state, block, focus, component)
      })

    }
    else if (focus[0].key !== "container" && focus[0].key !== "flex") {
      // 先记住这些必要信息
      // 寻找最外层是否为latercontainer，
      // 1.如果为latercontainer，则在later container的body上添加具体的组件
     
      // 2.如果为flex盒子，则直接在flex盒子上添加
      useData().state.blocks.forEach(block => {
        let fatherBlock = block
        let sonBlock = block
        lookforId(state,block, focus,component,fatherBlock,sonBlock)
      })
      // 寻找
    }
  } else {
    let blockBody: Block[] = [];
    if (component.body!.length >= 1) {
      for (let i = 0; i < component!.body!.length; i++) {
        let r: string = uuid();
        // console.log(currentComponent.value!.body![i].key)
        // console.log(r)
        blockBody = [
          ...blockBody,
          {
            zIndex: 1,
            id: r,
            key: component!.body![i].key,
            alignCenter: true,
            focus: false,
            body: [],
            props: {},
          },
        ];
      }
    }

    //随机生成id
    const random: string = uuid();
    console.log(random);
    // 置空
    let blocks = useData().state.blocks as Block[];
    useData().state = {
      ...useData().state,
      blocks: [
        ...blocks,
        {
          zIndex: 1,
          id: random,
          key: component!.key,
          alignCenter: true,
          focus: false,
          body: blockBody,
          props: {},
        },
      ],
    };
    console.log(useData().state);
  }

}
// 寻找内容盒子
const lookforContainer = function (state: any, block: any, focus: any, component: any) {
  if (Array.isArray(block)) {
    block.forEach(b => {
      if (b.id === focus[0].id) {
        b.key = 'latercontainer'
        let blockBody: Block[] = [];
        console.log(component.body)
        if (component.body!.length >= 1) {
          for (let i = 0; i < component.body!.length; i++) {
            let r: string = uuid();
            // console.log(currentComponent.value!.body![i].key)
            // console.log(r)
            blockBody = [
              ...blockBody,
              {
                zIndex: 1,
                id: r,
                key: component.body![i].key,
                alignCenter: true,
                focus: false,
                body: [],
                props: {},
              },
            ];
          }
          console.log(blockBody)
        }
        // latercontainer的body添加点击的组件
        createid(b, component, blockBody)
        console.log(b)
        console.log(b.body)
        // 更新 state.blocks
        state.value = { ...state.value };
        console.log(state.value)
        console.log(useData().state)
      } else if (b.body && b.body.length > 0) {
        lookforContainer(state, b.body!, focus, component)
      }
    })
  }
  else if (block.id === focus[0].id) {
    let blockBody: Block[] = [];
    console.log(component.body)
    if (component.body!.length >= 1) {
      for (let i = 0; i < component.body!.length; i++) {
        let r: string = uuid();
        // console.log(currentComponent.value!.body![i].key)
        // console.log(r)
        blockBody = [
          ...blockBody,
          {
            zIndex: 1,
            id: r,
            key: component.body![i].key,
            alignCenter: true,
            focus: false,
            body: [],
            props: {},
          },
        ];
      }
      console.log(blockBody)
    }
    block.key = component.key
    console.log(block)
    // 使用 Vue.set
    // 更新 state.blocks
    state.value = { ...state.value };
    console.log(useData().state)
    console.log(state.value)
    console.log(block.body)
  } else if (block.body && block.body.length > 0) {
    lookforContainer(state, block.body!, focus, component)
  }
}
//寻找flex盒子
const lookforFlex = function (state: any, block: any, focus: any, component: any) {
  if (Array.isArray(block)) {
    block.forEach(b => {
      if (b.id === focus[0].id) {
        // b.key = component.key
        addbox(b, component)
        // 更新 state.blocks
        state.value = { ...state.value };
        console.log(state.value)
      } else if (b.body && b.body.length > 0) {
        lookforContainer(state, b.body!, focus, component)
      }
    })
  }
  else if (block.id === focus[0].id) {
    addbox(block, component)

    // block.key = component.key
    // 更新 state.blocks
    state.value = { ...state.value };
    console.log(state.value)
    console.log(block.body)
  } else if (block.body && block.body.length > 0) {
    lookforFlex(state, block.body!, focus, component)
  }
}
// 添加盒子的函数
const addbox = function (block: any, component: any) {
  let blockBody: Block[] = [];
  if (component.body!.length >= 1) {
    for (let i = 0; i < component.body!.length; i++) {
      let r: string = uuid();
      // console.log(currentComponent.value!.body![i].key)
      // console.log(r)
      blockBody = [
        ...blockBody,
        {
          zIndex: 1,
          id: r,
          key: component.body![i].key,
          alignCenter: true,
          focus: false,
          body: [],
          props: {},
        },
      ];
    }
    console.log(blockBody)
  }
  let random = uuid()
  block.body.push({
    zIndex: 1,
    id: random,
    key: component.key,
    alignCenter: true,
    focus: false,
    body: blockBody,
    props: {},
  })
}
// 寻找id一致的盒子
const lookforId = function(state: any, block: any, focus: any, component: any, fatherBlock: any, sonBlock: any) {
  console.log(fatherBlock.body);
  // 回溯
  const dfs = function(block: any) {
    if (block.id === focus[0].id) {
      fatherBlock = sonBlock
      const blockBody = componentbody(component);
      // 生成id
      let id = uuid();
      fatherBlock.body = [
        ...fatherBlock.body,
        {
          zIndex: 1,
          id: id,
          key: component.key,
          alignCenter: true,
          focus: false,
          body: blockBody,
          props: {},
        },
      ];

      // 更新 state.blocks
      state.value = { ...state.value };
      console.log(state.value);
      console.log(block.body);
      return;
    }

    if (block.body && block.body.length > 0) {
      for (let i = 0; i < block.body.length; i++) {
        sonBlock = block.body[i];
        dfs(sonBlock);
      }
    }
  };

  if (Array.isArray(block)) {
    for (let i = 0; i < block.length; i++) {
    sonBlock = block[i]
     
      console.log(sonBlock);
      dfs(sonBlock);
    } 
  } else {
    dfs(block);
  }
};

// 调用DFS搜索函数
// const lookforId = function (state: any, block: any, focus: any, component: any,fatherBlock: any,sonBlock:any) {
//   console.log(fatherBlock.body)
//   if (Array.isArray(block)) {
//     block.forEach(b => {
//       if (b.id === focus[0].id) {
//         fatherBlock = sonBlock
//         const blockBody = componentbody(component)
//         // 生成id
//         let id = uuid()
//           fatherBlock.body = [...fatherBlock.body, {
//             zIndex: 1,
//             id: id,
//             key: component.key,
//             alignCenter: true,
//             focus: false,
//             body: blockBody,
//             props: {},
//           }]
        
//         // 更新 state.blocks
//         state.value = { ...state.value };
//         console.log(state.value)

//       } else if (b.body && b.body.length > 0) {
//         sonBlock = b
//         console.log(sonBlock)
//         lookforId(state,block, focus,component,fatherBlock,sonBlock)

//       }
//     })
//   }
//   else if (block.id === focus[0].id) {
//     const blockBody = componentbody(component)
//     // 生成id
//     let id = uuid()
//       fatherBlock.body = [...fatherBlock.body, {
//         zIndex: 1,
//         id: id,
//         key: component.key,
//         alignCenter: true,
//         focus: false,
//         body: blockBody,
//         props: {},
//       }]
    
//     // 更新 state.blocks
//     state.value = { ...state.value };
//     console.log(state.value)

//     // 使用 Vue.set
//     // 更新 state.blocks
//     state.value = { ...state.value };
//     console.log(useData().state)
//     console.log(state.value)
//     console.log(block.body)
//   } else if (block.body && block.body.length > 0) {
//     sonBlock = block
//     lookforId(state,block, focus,component,fatherBlock,sonBlock)
//   }
// }
// 一个生成id的函数
const createid = function (block: any, component: any, blockBody: any) {
  let id = uuid()
  component.body = blockBody
  block.body = [...block.body,
  {
    zIndex: 1,
    id: id,
    key: component.key,
    alignCenter: true,
    focus: false,
    body: [],
    props: {},

  }]

}

const componentbody = function (component: any) {
  let blockBody: Block[] = [];
  console.log(component.body)
  if (component.body!.length >= 1) {
    for (let i = 0; i < component.body!.length; i++) {
      let r: string = uuid();
      // console.log(currentComponent.value!.body![i].key)
      // console.log(r)
      blockBody = [
        ...blockBody,
        {
          zIndex: 1,
          id: r,
          key: component.body![i].key,
          alignCenter: true,
          focus: false,
          body: [],
          props: {},
        },
      ];
    }
    console.log(blockBody)
  }
  return blockBody
}