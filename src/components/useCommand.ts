// 按钮对应触发事件调用的函数

export default function useCommand(){
    // const state = {
    //     commands:{}, //制作命令和执行功能一个映射表undo=>()  redo()=>{}
    //     commandArray: any[]=[], //存放所有的命令

    // }

    // const registry = (command:object) =>{
    //     state.commandArray.push(command);
    //     state.commands[command.name] = () =>{

    //     };
    // }
    // const registry = (command) => {
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
}