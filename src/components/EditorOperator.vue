<template>
  <div class="editor-content">
    <template v-if="!onClick">
      <div class="containerSetting">
        <ElFormItem label="容器宽度"
          ><ElInput type="text" v-model="state.editData.width"></ElInput
        ></ElFormItem>

        <ElFormItem label="容器高度"
          ><ElInput type="text" v-model="state.editData.height"></ElInput
        ></ElFormItem>
        <!-- <ElColorPicker
          label="背景颜色"
          v-model="state.editData.backgroundColor"
        ></ElColorPicker> -->
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
            <ElInput
              v-if="p.type == 'model'"
              v-model="state.editData.props[keyName[index]]"
            ></ElInput>
            <!-- <ElInput
            v-if="keyName[index] == 'model'"
            v-model="state.editData.model.default"
          ></ElInput> -->
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
    <!-- 自定义样式 -->
    <div class="diy-style">
      <ElInput type="text-eare" v-model="diyContent"></ElInput>
    </div>
  </div>

  <ElFormItem>
    <ElButton type="primary" @click="apply()">应用</ElButton>
    <ElButton @click="reset()">重置</ElButton>
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
import deepcopy from "deepcopy";

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
    //最开始默认是显示容器的
    // state.editData = deepcopy(useData().state.container);

    // state.editData.props;

    let diyContent = ref(""); //自定义部分  （字符串）

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

          //state对象先获取原有的数据
          state.editData = deepcopy(useFocus().focusData.value.focus[0]);

          // text.value = useFocus().focusData.value.focus[0].props;
          text.value = useFocus().focusData.value.focus[0].style;
          // text.value = useFocus().focusData.value.focus[0];
          // text.value = comProps[0].render().children; //comProps[0].render().children是渲染的默认文本
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
          state.editData = deepcopy(useData().state.container);
        }
      }
    );
    const apply = () => {
      //判断是容器还是组件
      if (useFocus().focusData.value.focus.length > 0) {
        //点击的是组件
        alert(1);

        //自定义代码
        let beforeStyle = useFocus().focusData.value.focus[0].style;
        // let newStyle = JSON.parse(diyContent.value); //将字符串转为对象
        let newStyle = {};
        let arr = diyContent.value.split(";"); //转为数组
        arr.map((item) => {
          if (item != "") {
            // 分离键和值
            const [key, value] = item.split(":");
            if (key && value) {
              // 去掉值的引号并去掉多余的空格
              newStyle[key.trim()] = value.trim().replace(/(^"|"$)/g, "");
            }
          }
        });
        //合并到原来的对象当中
        useFocus().focusData.value.focus[0].style = {
          ...beforeStyle,
          ...newStyle,
        };

        const oldBlock = useFocus().focusData.value.focus[0];
        // useFocus().focusData.value.focus[0].props.props = state.editData.props;
        let newProps = state.editData.props;
        useFocus().focusData.value.focus[0].props = newProps;
        const newBlock = useFocus().focusData.value.focus[0];
        console.log(oldBlock);
        console.log(useFocus().focusData.value.focus[0].props);

        commands.updateBlock(newBlock, oldBlock);
        // console.log(useData().state.blocks);
        // console.log(useFocus().focusData.value.focus[0]);
        //

        //修改第二个文本时，第一个也会被修改，
        //可能是因为绑定的输入框 对象一样？
      } else {
        //点击的是容器
        alert(2);
        commands.updataContainer({
          ...useData().state,
          container: state.editData,
        });
      }

      //这一步 解决修改下一个文本时上一个也跟着改变的问题
      //应用后先重置state的值（
      // reset();
      state.editData = {
        props: {},
      };
    };

    const reset = () => {
      if (useFocus().focusData.value.focus.length > 0) {
        state.editData = deepcopy(useFocus().focusData.value.focus[0]);
        console.log(state.editData.props);
      } else {
        // 说明要绑定的是容器的宽高
        // state.editData = deepcopy(props.data.container);
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
      reset,
      diyContent,
    };
  },
});
</script>

<style scoped lang="less">
.editor-content {
  width: 100%;
  height: 86%;
  overflow: scroll;
  margin-bottom: 12px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
