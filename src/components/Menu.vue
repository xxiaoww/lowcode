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
import { ref } from "vue";
import useData from "../stores/data.ts"; //useData().state就是data.json的内容

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
};

//点击取消
let onCancle = () => {
  onShow2.value = false;
};
//点击确定
let onConfirm = () => {
  onShow2.value = false;
  //将当前内容转化出来
  useData().state = content2.value; //不知道是不是content
};
//data导出的内容
let content = ref(null);
content.value = JSON.stringify(useData().state);

//导入的内容
let content2 = ref("yruytiu");

//按钮
let button = [
  //   { label: "Pre", icon: "icon-back", handle: () => commands.undo() },
  //   { label: "Next", icon: "icon-Next", handle: () => commands.redo() },
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
