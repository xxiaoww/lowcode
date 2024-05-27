<template>
  <!-- <ElForm> -->
  <!-- <ElForm labelPosition="top" style="padding: 30px"> -->
  <!-- {content} -->
  <!-- <ElFormItem> -->
  <!-- <ElButton type="primary" onClick={() => apply()}>应用</ElButton>
                    <ElButton onClick={reset} >重置</ElButton> -->
  <!-- <ElButton></ElButton> -->
  <!-- </ElFormItem> -->
  <!-- </ElForm> -->
  <form action="">
    <!-- <input type="text" /> -->
    <!-- content内容 -->
    {{ content }}
  </form>
</template>

<script>
import { defineComponent, ref } from "vue";

//获取选中的组件
import { focusData } from "./useFocus";

// import { ElForm } from "element-plus";
// import {
//   ElButton,
//   ElFormItem,
//   ElForm,
//   //   ElInputNumber,
//   //   ElInput,
//   //   ElColorPicker,
//   //   ElSelect,
//   //   ElOption,
// } from "element-plus";
export default defineComponent({
  name: "EditorOperator",
  //   components: {
  // ElFormItem,
  // ElButton,
  // ElForm,
  //   },
  setup() {
    // let { focus } = useFocus();
    // let foucsCom = focus[0]; //focus[0]就是选中的组件
    let content = ref("1");
    // if (focusData.focus) {
    //   console.log(useFocus().focus[0]);
    // }
    // 如果有选中，content就渲染选中组件对应的配置，否则默认渲染最外层容器的
    // content.value = foucsCom ? foucsCom.label : "";
    return { content };
  },
});
</script>

<style></style>
