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
      <!-- 用于测试，可删 -->
      <!-- <div class="a" v-for="(p, index) in keyName" :key="index">{{ p }}</div> -->

      <div class="text">{{ text }}</div>
      <!-- 遍历props对象,渲染每一个值，判断对应的类型进行渲染 -->

      <!-- props的类型 -->
      <template v-for="(p, index) in propsContent" :key="index">
        <ElFormItem :label="p.label">
          <!-- 输入框的 (model) -->
          <ElInput
            v-if="p.model"
            v-model="state.editData.props[keyName[index]]"
          ></ElInput>
          <!-- 只是输入内容 -->
          <ElInput
            v-if="p.type === 'input'"
            v-model="state.editData.props[keyName[index]]"
          ></ElInput>

          <ElColorPicker
            v-if="p.type === 'color'"
            v-model="state.editData.props[keyName[index]]"
          ></ElColorPicker>
          <ElSelect
            v-if="p.type === 'select'"
            v-model="state.editData.props[keyName[index]]"
          >
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

  <ElFormItem>
    <ElButton type="primary" @click="apply()">应用</ElButton>
    <ElButton>重置</ElButton>
  </ElFormItem>
</template>

<script>
// 获取用户选中的组件，在右侧展示组件的配置信息
import { computed, defineComponent, inject, ref, watch, reactive } from "vue";
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
import { h } from "vue";
import useCommand from "../components/useCommand.ts";

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
    console.log(useCommand());
    let { commands } = useCommand();
    console.log(commands.updateBlock);
    //引入config
    const config = inject("config");

    //控制显示的是组件的还是最外面容器的
    let onClick = ref(false); //默认没有点击组件

    //显示的文本、input类型
    let text = ref("");
    let type = ref("");

    let propsContent = ref([]);
    let editText = ref(""); //响应输入文本

    let keyName = ref("");

    //定义一个对象用于放新props
    const state = reactive({
      editData: {
        props: {},
      },
    });
    // state.editData.props;
    watch(
      () => {
        return useFocus().focusData.value.focus.length;
      },
      (newValue) => {
        //判断是否有点击的组件，有的话就标记onClick
        if (newValue > 0) {
          onClick.value = true;

          // 获取该block的key
          let comKey = useFocus().focusData.value.focus[0].key;
          //通过key拿到对应props
          let comProps = config.componentList.filter((item) => {
            if (item.key === comKey) {
              return item;
            }
          });

          //1111111用于测试,赋新值
          // useFocus().focusData.value.focus[0].style = {
          //   width: "200px",
          //   color: "red",
          //   height: "300px",
          // };

          // console.log(comProps[0].render());

          // 获取该block的props（是渲染的，不是配置的
          // let bloProp = useFocus().focusData.value.focus[0].props;

          // （（（（（（（（（（（（（（（（
          // 改变editor.vue里面的props?怎么赋值给已渲染的组件
          // useFocus().focusData.value.focus[0].props = {
          //   text: "2222",
          // };

          text.value = useFocus().focusData.value.focus[0].props;
          // text.value = comProps[0].render().children; //comProps[0].render().children是渲染的默认文本

          //文本部分默认是渲染的默认文本
          // editText.value = comProps[0].render().children;

          // if(comKey == 'input'){

          // }

          // let resetText = (key) => {
          //   if (key === "button") {
          //     comProps[0].render = () => h(ElButton, {}, editText.value);
          //   } else if (key === "text") {
          //     comProps[0].render = () => h("span", {}, editText.value);
          //   } else if (key === "radio") {
          //     comProps[0].render = () =>
          //       h("div", { class: "mb-2 flex items-center text-sm" }, [
          //         h(
          //           ElRadioGroup,
          //           {
          //             class: "ml-4",
          //           },
          //           [
          //             h(ElRadio, { value: "1", size: "large" }, "选择1"),
          //             h(ElRadio, { value: "2", size: "large" }, "选择2"),
          //           ]
          //         ),
          //       ]);
          //   }
          // };
          //判断key类型,从而修改对应的文本部分
          // resetText(comKey);
          //修改渲染函数render

          // text.value = Object.values(comProps[0].props);
          // text.value = state;
          console.log(state.editData.props);
          console.log(useFocus().focusData.value.focus[0].props);
          if (comProps[0]) {
            //拿到对应props对象的所有key对应的值的数组，然后v-for遍历渲染
            propsContent.value = Object.values(comProps[0].props);

            // obj.value = comProps[0].props;
            keyName.value = Object.keys(comProps[0].props);
          }
        } else {
          onClick.value = false;
        }
      }
    );
    let apply = () => {
      //判断是容器还是组件
      if (useFocus().focusData.value.focus.length > 0) {
        //点击的是组件
        alert(1);

        let oldBlock = useFocus().focusData.value.focus[0];
        // useFocus().focusData.value.focus[0].props.props = state.editData.props;
        let newProps = state.editData.props;
        useFocus().focusData.value.focus[0].props = newProps;
        let newBlock = useFocus().focusData.value.focus[0];
        console.log(oldBlock);
        console.log(useFocus().focusData.value.focus[0].props);
        commands.updateBlock(newBlock, oldBlock);
        console.log(useData().state.blocks);
        // console.log(useFocus().focusData.value.focus[0]);
        //

        //修改第二个文本时，第一个也会被修改，
        //可能是因为绑定的输入框 对象一样？
      } else {
        //点击的是容器
        alert(2);
      }
    };
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
    //     return editText.value;
    //   },
    //   (newValue) => {
    //     // useFocus().focusData.value.focus[0].value = newValue;
    //     console.log(useFocus().focusData.value.focus[0].render);
    //   }
    // );

    let confirmUse = (blockProp) => {
      //遍历当前组件的props对象，拿到每个key,设置对应的值
      Object.keys(blockProp).forEach((key) => {
        // blockProp.style[key] =
      });
    };

    // const apply = () => {
    //         if (!props.block) {//更改组件容器的大小
    //             props.updataContainer({...props.data,container:state.editData})
    //         } else {//更改组件容器配置
    //             props.updateBlock(state.editData,props.block)
    //         }
    //     }
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
      editText,
      keyName,
      state,
      apply,
    };
  },
});
</script>

<style></style>
