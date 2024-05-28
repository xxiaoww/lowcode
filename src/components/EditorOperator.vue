<template>
  <div class="containerSetting">
    容器宽度<input type="text" v-model="width" />
    <br />
    容器高度<input type="text" v-model="height" />
  </div>
</template>

<script>
// 获取用户选中的组件，在右侧展示组件的配置信息
import { defineComponent, ref, watch } from "vue";

import useData from "../stores/data";
//获取选中的组件
import { useFocus } from "./useFocus"; //为啥要有{}
export default defineComponent({
  name: "EditorOperator",
  setup() {
    let width = ref(`${useData().state.container.width}px`);
    let height = ref(`${useData().state.container.height}px`);
    // const dynamicComponent = ref(null);
    // const dynamicProps = ref({});
    // // 创建一个容器设置的组件
    // const ContainerSettings = defineComponent({
    //   template: `
    //     <div>
    //       容器宽度<input type="text" v-model="${width}" />
    //       <br />
    //       容器高度<input type="text" v-model="${height}" />
    //     </div>
    //   `,
    //   props: {
    //     width: Number,
    //     height: Number,
    //   },
    //   setup(props) {
    //     const width = ref(props.width);
    //     const height = ref(props.height);
    //     // // 确保v-model是响应式的
    //     // watch(
    //     //   () => props.width,
    //     //   (newVal) => {
    //     //     width.value = newVal;
    //     //   }
    //     // );
    //     // watch(
    //     //   () => props.height,
    //     //   (newVal) => {
    //     //     height.value = newVal;
    //     //   }
    //     // );
    //     return { width, height };
    //   },
    // });
    // let content = ref(null);
    // watch(
    //   () => {
    //     //focus为0时，focus[0]是undefined，直接focus[0].props会报错
    //     if (useFocus().focusData.value.focus.length > 0) {
    //       return useFocus().focusData.value.focus[0].props;
    //     } else {
    //       return `容器宽度<input type="text" v-model="${
    //         useData().state.container.width
    //       }px">
    //     <br/>
    //     容器高度<input type="text" v-model="${
    //       useData().state.container.height
    //     }px">`;
    //     }
    //   },
    //   (newFocus) => {
    //     // if (newFocus.length > 0) {
    //     //   dynamicComponent.value = "div"; // 或其他默认组件
    //     //   dynamicProps.value = newFocus[0].props;
    //     // } else {
    //     //   dynamicComponent.value = ContainerSettings;
    //     //   dynamicComponent.value.width = useData().state.container.width;
    //     //   dynamicComponent.value.height = useData().state.container.height;
    //     // }
    //     content.value = newFocus;
    //   },
    //   { immediate: true } // 如果需要初始设置 content
    // );
    // // }
    // // 如果有选中，content就渲染选中组件对应的配置，否则默认渲染最外层容器的
    // // content.value = foucsCom ? foucsCom.label : "";
    return { width, height };
  },
});
</script>

<style></style>
