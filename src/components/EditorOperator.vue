<template>
  <template v-if="!onClick">
    <div class="containerSetting">
      <ElFormItem label="容器宽度"
        ><ElInput type="text" v-model="width"></ElInput
      ></ElFormItem>

      <ElFormItem label="容器高度"
        ><ElInput type="text" v-model="height"></ElInput
      ></ElFormItem>
    </div>
  </template>
  <template v-else>
    <div class="componentSetting">
      <div class="text">{{ text }}</div>
      <!-- 遍历props对象,渲染每一个值，判断对应的类型进行渲染 -->

      <!-- props的类型 -->
      <template v-for="(p, index) in propsContent" :key="index">
        <ElFormItem :label="p.label">
          <!-- 输入框的 (model) -->
          <ElInput v-if="p.model" v-model="p.model.default"></ElInput>
          <!-- 只是输入内容 -->
          <ElInput v-if="p.type === 'input'"></ElInput>

          <ElColorPicker v-if="p.type === 'color'"></ElColorPicker>
          <ElSelect v-if="p.type === 'select'">
            <ElOption
              v-for="(opt, index) in p.option"
              :key="index"
              :label="opt.label"
              :value="opt.value"
              >{{ opt.label }}
            </ElOption>
          </ElSelect>
        </ElFormItem>
      </template>
    </div>
  </template>
</template>

<script>
// 获取用户选中的组件，在右侧展示组件的配置信息
import { computed, defineComponent, inject, ref, watch } from "vue";
import {
  ElButton,
  ElFormItem,
  ElInput,
  ElColorPicker,
  ElSelect,
  ElOption,
} from "element-plus";
import useData from "../stores/data";
//获取选中的组件
import { useFocus } from "./useFocus"; //为啥要有{}
import { textProps } from "element-plus";
export default defineComponent({
  name: "EditorOperator",
  components: {
    ElButton,
    ElFormItem,
    ElInput,
    ElColorPicker,
    ElSelect,
    ElOption,
  },
  setup() {
    //引入config
    const config = inject("config");

    //控制显示的是组件的还是最外面容器的
    let onClick = ref(false); //默认没有点击组件

    //显示的文本、input类型
    let text = ref("");
    let type = ref("");

    let propsContent = ref([]);
    watch(
      () => {
        return useFocus().focusData.value.focus.length;
      },
      (newValue) => {
        if (newValue > 0) {
          onClick.value = true;
          // 获取该block的key
          let comKey = useFocus().focusData.value.focus[0].key;
          let comProps = config.componentList.filter((item) => {
            if (item.key === comKey) {
              return item;
            }
          });
          //拿到对应props对象的所有key对应的值的数组，然后遍历渲染
          // text.value = Object.values(comProps[0].props);
          propsContent.value = Object.values(comProps[0].props);
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

    // // 如果有选中，content就渲染选中组件对应的配置，否则默认渲染最外层容器的
    return {
      width,
      height,
      onClick,
      text,
      type,
      propsContent,
      ElButton,
      ElFormItem,
      ElInput,
      ElColorPicker,
      ElSelect,
      ElOption,
    };
  },
});
</script>

<style></style>
