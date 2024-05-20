


//Menu那里引入这个文件，
// 这个文件导出state,Menu通过调用state里commands里面的函数来实现对应的操作
// 这个文件是导出一个函数，而这个函数返回一个state对象，state对象里面存放各种元素，其中commands里面就是对应操作的命令和功能的映射
//一个存放各种数据的对象，一个注册的函数（要传参），通过这个注册的函数去配置各种命令的操作。

import {onUnmounted} from 'vue'
import { AppData,Command,State } from "types/global"
import { events } from "@/components/event";
import deepcopy from "deepcopy";

export default function useCommand(data:AppData){
    const state:State = {
        //前进后退需要指针
        current: -1, //前进后退的索引值
        queue: [], //存放所有的操作命令
        commands:{},//制作命令和执行功能一个映射表 undo : () => {}   redo:()={}
        commandArray:[],//存放所有的命令
        destroyArray: [],//销毁数组

    }
    const registry = (command:Command) =>{
        state.commandArray.push(command);
        // 往那个映射表（commandArray）添加
        state.commands[command.name] = () =>{
            //拿到对应返回 的函数
            const {redo,undo} = command.execute();
            redo();//调用对应返回的函数  （所以也就是外面直接调用commands的对应操作命令名字就好了）

            if (!command.pushQueue) {
                //不需要放到队列中直接跳过即可
                return;
            }

            //如果需要：
            let { queue, current } = state;
            // 如果先放组件一，再放组件2，撤回，组件3
            if (queue.length > 0) {
              queue = queue.slice(0, current + 1); //可能放置的过程中有撤销操作，所以根据当前最新的current值来计算新的
              state.queue = queue;
            }
            queue.push({ redo, undo }); //保存指令的前进后退到队列里
            state.current = current + 1;    //更改索引值
            console.log(queue);
        }
    }
    registry({//恢复
        name:'redo',
        keyboard:'ctrl+y',
        execute(){
            return {
                redo(){
                    let item = state.queue[state.current + 1]; //找到当前的下一步还原操作
                    if (item) {
                        item.redo && item.redo();
                        state.current++;
                    }
                }
            }
        }
    })
    registry({
        name:'undo',
        keyboard:'ctrl+z',
        execute(){
            return {
                redo(){
                    if (state.current === -1) return; //没有可以撤销的了
                    let item = state.queue[state.current]; //找到当前的上一步还原操作
                    if (item) {
                      item.undo && item.undo(); //这里没有操作队列
                      state.current--;
                    }
                }
            }
        }

    })

    registry({
        name:'drag',
        pushQueue:true,
        init() {
            //初始化的时候 记住之前的状态
            this.before = null;

            const start = () => this.before = deepcopy(data.blocks);
            // 拖拽之后需要触发对应的指令
            const end = () => state.commands.drag();
            events.on("start", start); //绑定事件
            events.on("end", end);

            //初始化完之后，在组件卸载的时候还要销毁
            //返回一个卸载函数
            return () => {
                events.off("start", start);
                events.off("end", end);
            };
        },
        execute(){

            let before = this.before;
            let after = data.blocks;
            return {
                redo() {
                    data = { ...data, blocks: after };
                  },
                  // 前一步的
                  undo() {
                    data = { ...data, blocks: before };
                  },
            }
        }

    })

    
    ;(() => {
        // commandArray里面所有方法 遍历，看有没有init方法的，有的话就执行，init执行后会返回一个销毁的 放在销毁数组
        state.commandArray.forEach(
          (command) => command.init && state.destroyArray.push(command.init())
        );
      })();

    //通过销毁数组，遍历后销毁
    onUnmounted(() => {
        alert(1)
        //清理绑定的事件
        //等会销毁的时候建这个onUnmounted事件，遍历它的每一项，看有没有fn(有可能是undefined)
        state.destroyArray.forEach(fn => fn && fn());
      });
    return state
}


// import { events } from "./event";
// import { onUnmounted } from "vue";
// import _ from "lodash"; //引入第三方库实现深拷贝

// //按钮控制
// export default function useCommand(data) {
//   const state = {
//     //前进后退需要指针
//     current: -1, //前进后退的索引值
//     queue: [], //存放所有的操作命令
//     commands: {
//       //制作命令和执行功能一个映射表 undo : () => {}   redo:()={}
//     },
//     commandArray: [], //存放所有的命令
//     destroyArray: [],
//   };

//   const registry = (command) => {
//     //注册
//     state.commandArray.push(command);
//     //...arg是收到的参数（导入后传新值）
//     state.commands[command.name] = (...arg) => {
//       //命令名字对应的执行函数
//       const { redo, undo } = command.execute(...arg);
//       redo();

//       //看是否需要存
//       if (!command.pushQueue) {
//         //不需要放到队列中直接跳过即可
//         return;
//       }
//       let { queue, current } = state;

//       //如果先放了 组件1 -> 组件2 -> 组件3 -> 组件4
//       //组件1 -> 组件3
//       if (queue.length > 0) {
//         queue = queue.slice(0, current + 1); //可能在放置的过程中有撤销操作，所以根据当前最新的current值来计算新的队列

//         state.queue = queue;
//       }
//       queue.push({ redo, undo }); //保存指令的前进后退
//       state.current = current + 1;
//       console.log(queue);
//     };
//   };

//   //注册需要的命令
//   registry({
//     name: "redo",
//     keyboard: "ctrl+y",
//     execute() {
//       return {
//         redo() {
//           console.log("重做");
//           //   console.log(state.queue);
//           let item = state.queue[state.current + 1]; //找到当前值的下一步 还原操作
//           if (item) {
//             item.redo && item.redo();
//             state.current++;
//           }
//         },
//       };
//     },
//   });
//   registry({
//     name: "undo",
//     keyboard: "ctrl+z",
//     execute() {
//       return {
//         redo() {
//           console.log("撤销");
//           if (state.current == -1) return; //没有可以撤销的了
//           let item = state.queue[state.current]; //找到下一步
//           if (item) {
//             item.undo && item.undo();
//             state.current--;
//           }
//         },
//       };
//     },
//   });

//   // 当我们默认注册这个指令的时候，就会去监控开始和之后，开始就会保留开始的状态,结束就会调用指令，调用指令的时候就会拿到开始的状态和之后的状态

//   registry({
//     name: "drag",
//     pushQueue: true, //如果希望将操作放到队列中可以增加一个属性 标识等会操作要放到队列中

//     // 这里注册的指令得监控事件，如果写在excute里面，得state.commands.drag()执行才会走这个方法，但我们想要一上来就能 注册？
//     init() {
//       //初始化操作 默认就会执行

//       //初始化的时候 记住之前的状态
//       this.before = null;

//       //监控拖拽开始事件，保存状态
//       //传进来的data是useData().state
//       // deepcopy(data.blocks)
//       //这里好像之后跟之前的值是一样的，到那时deepcopy用不了

//       const start = () => (this.before = _.cloneDeep(data.blocks)); //本来写 = data.value.blocks，但后面变before也会变，所以写deepcopy（）保留初始状态
//       //拖拽之后需要触发对应的指令(????)
//       const end = () => state.commands.drag(); //就走了execute执行了
//       events.on("start", start); //绑定事件
//       events.on("end", end);

//       //初始化完之后，在组件卸载的时候还要销毁
//       //返回一个卸载函数
//       return () => {
//         events.off("start", start);
//         events.off("end", end);
//       };
//     },
//     execute() {
//       //state.commands.drag()
//       //执行 拿到之前的和最新的
//       let before = this.before;
//       let after = data.blocks; //之后的状态
//       return {
//         redo() {
//           //默认一松手 就直接把当前事情做了
//           //下面这个写法没看懂。。。（？？？？？）
//           data = { ...data, blocks: after }; //调用redo()的时候用最新的状态去获取
//         },
//         undo() {
//           //前一步的
//           data = { ...data, blocks: before };
//         },
//       };
//     },
//   });

//   //带有历史记录常用模式
//   registry({
//     name: "updateContainer", //更新整个容器
//     pushQueue: true, //表示要放到队列里
//     execute(newValue) {
//       let state = {
//         before: data, //当前值
//         after: newValue, //新值
//       };
//       return {
//         redo: () => {
//           //前进
//           data = state.after;
//         },
//         undo: () => {
//           //后退
//           data = state.before;
//         },
//       };
//     },
//   });

//   // registry({
//   //   name: "placeTop",
//   //   pushQueue: true,
//   //   execute() {
//   //     let before = _.cloneDeep(data.blocks); //深拷贝
//   //     let after = (() => {
//   //       //置顶就是在所有的 block中找到最大zindex加一
//   //     })();
//   //     return {
//   //       undo() {
//   //         //前一步的

//   //         //vue3   如果当前blocks前后一致 则不会更新  所以前面深拷贝一下？
//   //         data = { ...data, blocks: before };
//   //       },
//   //       redo() {
//   //         data = { ...data, blocks: after }; //调用redo()的时候用最新的状态去获取
//   //       },
//   //     };
//   //   },
//   // });

//   //前面要有分号（？？？？？
//   (() => {
//     // commandArray里面所有方法 遍历，看有没有init方法的，有的话就执行，执行后会返回一个销毁的 放在销毁数组
//     state.commandArray.forEach(
//       (command) => command.init && state.destroyArray.push(command.init())
//     );
//   })();

//   onUnmounted(() => {
//     //清理绑定的事件
//     //等会销毁的时候建这个onUnmounted事件，遍历它的每一项，看有没有fn(有可能是undefined)
//     state.destroyArray.forEach((fn) => fn && fn());
//   });
//   return state;
// }
