<template>
  <div class="editor-top">
    菜单栏
    <ElButton v-for="(b, index) in button" :key="index" @click="b.handle">{{
      b.label
    }}</ElButton>

    <!-- 弹出的 -->
    <ElDialog v-if="onShow" v-model="onShow" title="导出">
      <ElInput type="textarea" v-model="content" rows="10"></ElInput>
    </ElDialog>
    <ElDialog v-if="onShow2" v-model="onShow2" title="导入">
      <ElInput type="textarea" v-model="content2" rows="10"></ElInput>
      <!-- 下面这个是导入才有 -->
      <div>
        <ElButton @click="onCancle">取消</ElButton>
        <ElButton type="primary" @click="onConfirm"> 确定 </ElButton>
      </div>
    </ElDialog>
  </div>
</template>
<script setup>
import { ElButton, ElInput, ElDialog } from "element-plus";
import { computed, ref } from "vue";
import useData from "../stores/data.ts"; //useData().state就是data.json的内容
import useCommand from "../components/useCommand.ts";
import { events } from "./event";
let { commands } = useCommand();
// console.log(useCommand);
//data导出的内容
// let content = ref(null);
// content.value = JSON.stringify(useData().state);

//上面那样可能是 只赋值了一次，用下面计算属性就解决了，
let content = computed(() => {
  return JSON.stringify(useData().state);
});

//导入的内容
let content2 = ref("");

let onShow = ref(false); //控制显示隐藏
let isShow = () => {
  //   alert(2);
  onShow.value = !onShow.value;
};

//导入的控制显示隐藏
let onShow2 = ref(false); //控制显示隐藏
let isShow2 = () => {
  //   alert(2);

  onShow2.value = !onShow2.value;
  // events.emit("end");
};

//点击取消
let onCancle = () => {
  onShow2.value = false;
};
//点击确定
let onConfirm = () => {
  commands.updateContainer(JSON.parse(content2.value)); //更新的时候就调用，把新的传过去
  // events.emit("start");
  onShow2.value = false;
  //将当前内容转化出来
  // useData().state = content2.value; //原来这样写是错的（不能直接将字符串赋值给 useData().state，因为 useData().state 期望的是一个对象，而 content2.value 是一个字符串。因此，你需要先将字符串解析为一个对象，然后再赋值给 useData().state。

  //有个buG:输入如果是空的 会报错
  useData().state = JSON.parse(content2.value);
  console.log(useData().state);
  //赋值后再清空
  content2.value = "";
};

//1111111
// const state = reactive({
//   option: props.option, //用户给组件的属性  //会更新一下（每次传的可能不同
//   isShow: false, //控制显示隐藏
// });

// //通过这个ctx直接调一个方法叫expose，表示组件要暴露哪个方法
// ctx.expose({
//   //这里暴露一个对象
//   //让外界可以调用组件的方法
//   showDialog(option) {
//     state.option = option; //会更新一下（每次传的可能不同
//     state.isShow = true;
//   },
// });

// let vm;
// function $dialog(option) {
//   //手动挂载组件  new SubComponent.$mount()
//   if (!vm) {
//     // //这里需要将el渲染到我们的页面中
//     // document.body.appendChild(render(vm, el), el); //渲染到真实结点扔到页面中

//     let el = document.createElement("div");
//     //创建虚拟节点的时候可以放一个类组件DialogComponent，传递属性{ option }
//     vm = createVNode(DialogComponent, { option }); //将组件渲染成虚拟节点

//     //（在vue3里面，想要把一个组件渲染到某个节点上，我们可以先创建一个组件的虚拟节点，然后把虚拟节点挂载到真实节点）

//     //render作用：把虚拟节点变成真实节点  （render方法返回的可能不是一个dom元素？
//     // 将虚拟节点渲染成真实的 DOM 元素
//     // const domElement = ;
//     // 将真实的 DOM 元素添加到页面中
//     document.body.appendChild((render(vm, el), el)); //这里 里面要加括号！！！☆
//     //上面这句 相当于第一步把虚拟节点渲染到el里去，最后呢插入的是一个el元素
//   }

//   //将组件渲染到这个el元素上
//   let { showDialog } = vm.component.exposed; //通过当前的虚拟节点，拿到vm.component.exposed里面的showDialog方法
//   showDialog(option); //加个判断，没有vm才需要做上面那些，不然会重复
//   //其他说明组件已经有了只需要显示出来即可
// }
//111111

//按钮
let button = [
  { label: "Pre", icon: "icon-back", handle: () => commands.undo() },
  { label: "Next", icon: "icon-Next", handle: () => commands.redo() },
  //   {
  //     label: "Refresh Page",
  //     icon: "icon-Refresh",
  //     handle: () => console.log("撤销"),
  //   },
  //   {
  //     label: "Source Code",
  //     icon: "icon-Source",
  //     handle: () => console.log("源码"),
  //   },
  //   {
  //     label: "Preview",
  //     icon: "icon-Preview",
  //     handle: () => console.log("预览"),
  //   },
  //   { label: "Save", icon: "icon-Save", handle: () => console.log("保存") },
  {
    label: "导出",
    icon: "icon-export",
    handle: isShow, //后面不要加（） 不然一开始还没点击就调用了
    // () => {
    //   // 点导出，在这放一个服务dialog
    //   //   $dialog({
    //   //     //定制里面的内容
    //   //     title: "导出JSON",
    //   //     // 导出的时候所有数据都要传（对象转为字符串）
    //   //     content: JSON.stringify(useData().state),
    //   //     // footer: false,
    //   //   });
    //   //   console.log("导出");
    //   alert("导出");
    // },
  },
  {
    label: "导入",
    icon: "icon-insert",
    handle: isShow2,
    // () => {
    // 点导出，在这放一个服务dialog
    //   $dialog({
    //     //定制里面的内容
    //     title: "导入JSON",
    //     content: "123123",
    //     footer: true,
    //     // 需要调方法拿到导出结果，那这里面就需要去提供一个回调函数
    //     //里面就可以拿到输入的文本
    //     onConfirm(text) {
    //       //那这里就可以拿到那个json,直接渲染到页面就好了
    //       //然后就是更新data
    //       useData().state = JSON.parse(text); //这样去更改无法保留历史记录，那我们就需要去注册一个能放到队列的方法
    //       //由于前进后退没做好，所以下面好像不起作用，等前面完成后再完善
    //       // commands.updateContainer(JSON.parse(text)); //更新的时候就调用，把新的传过去
    //     },
    //   });
    //   console.log("导入");
    //   alert("导入");
    // },
  },
  //   {
  //     label: "置顶",
  //     icon: "icon-place-top",
  //     handle: () => console.log("置顶"),
  //   },
  //   {
  //     label: "置底",
  //     icon: "icon-place-bottom",
  //     handle: () => console.log("置底"),
  //   },
];
</script>

<style></style>
