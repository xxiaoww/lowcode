<template>
  <template v-if="!onClick">
    <div class="containerSetting">
      容器宽度<input type="text" v-model="width" />px
      <br />
      容器高度<input type="text" v-model="height" />px
    </div>
  </template>
  <template v-if="onClick">
    <div class="componentSetting">
      <div class="text">{{ text }}</div>
      <input :type="type" />
    </div>
  </template>
</template>

<script>
// 获取用户选中的组件，在右侧展示组件的配置信息
import { computed, defineComponent, inject, ref, watch } from "vue";

import useData from "../stores/data";
//获取选中的组件
import { useFocus } from "./useFocus"; //为啥要有{}
import { textProps } from "element-plus";
export default defineComponent({
  name: "EditorOperator",
  setup() {
    //引入config
    const config = inject("config");

    //控制显示的是组件的还是最外面容器的
    let onClick = ref(false); //默认没有点击组件

    //显示的文本、input类型
    let text = ref("");
    let type = ref("");
    // let text = null;
    // let type = null;
    watch(
      () => {
        return useFocus().focusData.value.focus.length;
      },
      (newValue) => {
        if (newValue > 0) {
          onClick.value = true;
          // text = computed(() => {
          //   return useFocus().focusData.value.focus[0].props.text;
          // });
          // type = computed(() => {
          //   return useFocus().focusData.value.focus[0].props.type;
          // });
          // return { text, type };

          // 获取该block的key
          let comKey = useFocus().focusData.value.focus[0].key;
          let comProps = config.componentList.filter((item) => {
            if (item.key === comKey) {
              return item;
            }
          });
          text.value = comProps[0].props;
          // type.value = useFocus().focusData.value.focus[0].props.type;
          // text.value = "11";
        } else {
          onClick.value = false;
        }
      }
    );

    const width = computed({
      get() {
        return useData().state.container.width;
      },
      set(value) {
        useData().state.container.width = Number(value);
      },
    });
    const height = computed({
      get() {
        return useData().state.container.height;
      },
      set(value) {
        useData().state.container.height = Number(value);
      },
    });

    // watch(
    //   () => {
    //     return { width, height };
    //   },
    //   (newFocus) => {
    //     useData().state.container.width = newFocus.width.value;
    //     useData().state.container.height = newFocus.height.value;
    //   },
    //   { immediate: true } // 如果需要初始设置 content
    // );
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
    return { width, height, onClick, text, type };
  },
});
</script>

<style></style>
