//左侧列表区可以显示所有的物料
// key是对应的组件映射关系

// 引入element-plus
import {
  ElButton,
  ElInput,
  ElButtonGroup,
  ElIcon,
  ElRadioGroup,
  ElRadio,
} from "element-plus";
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Share,
} from "@element-plus/icons-vue";
import { h } from "vue";
import { componentConfig, RegisterConfig } from "../../types/global";
function createEditorConfig(): RegisterConfig {
  // 组件列表
  const componentList: componentConfig[] = [];
  // 列表映射的关系
  const componentMap: Record<string, componentConfig> = {};
  return {
    componentList,
    componentMap,
    register: (component: componentConfig) => {
      componentList.push(component);
      componentMap[component.key] = component;
    },
  };
}

// 内容属性
const createInputProp = (label: string) => ({ type: "input", label });
// 颜色选择属性
const createColorProp = (label: string) => ({ type: "color", label });
// 选择框属性
const createSelectProp = (label: string, option: object) => ({
  type: "select",
  label,
  option,
});
// 下拉框属性
const createTableProp = (label: string, table: string) => ({
  type: "table",
  label,
  table,
});

// 设置字体大小的配置
// const createInputProp = (label:string):componentProps=>({
//     type:'input',
//     label,
// })
// 设置字体颜色的配置
// 设置
export let registerConfig = createEditorConfig();
// console.log(registerConfig)
// 注册左侧物料
// flex布局
registerConfig.register({
  label: "flex布局",
  preview: () => h(ElInput, { placeholder: "预览输入框" }, ""),
  render: () => h("div", { style: { display: "flex" } }),
  key: "flex",
  icon: "icon-anniu",
  body: [{ key: "container" }, { key: "container" }, { key: "container" }],
  props: {
    text: createInputProp("文本内容"),
    color: createColorProp("颜色"),
  },
});
// 容器组件
registerConfig.register({
  label: "容器",
  preview: () => h(ElInput, { placeholder: "预览输入框" }, ""),
  render: () => h("div", { class: "contain " }, "内容区"),
  key: "container",
  icon: "icon-fangkuang",
  body: [],
  props: {
    text: createInputProp("文本内容"),
    color: createColorProp("颜色"),
  },
});
// 另一个容器
registerConfig.register({
  label: "小容器",
  render: () => h("div"),
  key: "latercontainer",
  icon: "icon-fangkuang",
  body: [],
  props: {
    text: createInputProp("文本内容"),
    color: createColorProp("颜色"),
  },
});
// 文本
registerConfig.register({
  label: "文本",
  preview: () => h("span", {}, "预览文本"),
  render:
    // ({ props }) => h("span", { class: "text" }, props.text || "渲染文本"),
    () => h("span", { class: "text" }, "渲染文本"),
  key: "text",
  icon: "icon-wenben",
  body: [],
  props: {
    text: createInputProp("输入文本内容"),
    color: createColorProp("字体颜色"),
    size: createSelectProp("字体大小", [
      { label: "14px", value: "14px" },
      { label: "20px", value: "20px" },
      { label: "24px", value: "24px" },
    ]),
  },
});
// 按钮
registerConfig.register({
  label: "按钮",
  preview: () => h(ElButton, {}, "预览按钮"),
  render: () => h(ElButton, {}, "渲染按钮"),
  key: "button",
  icon: "icon-anniu",
  body: [],
  props: {
    text: createInputProp("按钮内容"),
    type: createSelectProp("按钮类型", [
      { label: "基础", value: "primary" },
      { label: "成功", value: "success" },
      { label: "警告", value: "warning" },
      { label: "危险", value: "danger" },
      { label: "文本", value: "text" },
    ]),
    size: createSelectProp("按钮尺寸", [
      { label: "默认", value: "" },
      { label: "中等", value: "medium" },
      { label: "小", value: "small" },
    ]),
  },
});
// 输入框
registerConfig.register({
  label: "输入框",
  preview: () => h(ElInput, { placeholder: "预览输入框" }, ""),
  render: () => h(ElInput, { placeholder: "渲染输入框" }, ""),
  key: "input",
  icon: "icon-m-xialakuang",
  body: [],
  props: {
    // text: createInputProp("输入框文本"),
    color: createColorProp("颜色"),
    model: {
      label: "输入框内容",
      model: {
        default: "绑定字段",
      },
    },
  },
});
// 按钮组件
registerConfig.register({
  label: "按钮组件",
  render: () =>
    h("div", { class: "container" }, [
      h(ElButtonGroup, null, [
        h(ElButton, { type: "primary" }, "按钮"),
        h(ElButton, { type: "primary" }, "按钮"),
      ]),
    ]),
  key: "buttonGroup",
  icon: "icon-button-group",
  body: [],
  props: {
    text: createInputProp("按钮内容"),
    type: createSelectProp("按钮类型", [
      { label: "基础", value: "primary" },
      { label: "成功", value: "success" },
      { label: "警告", value: "warning" },
      { label: "危险", value: "danger" },
      { label: "文本", value: "text" },
    ]),
    size: createSelectProp("按钮尺寸", [
      { label: "默认", value: "" },
      { label: "中等", value: "medium" },
      { label: "小", value: "small" },
    ]),
  },
});

// 单选框
registerConfig.register({
  label: "单选框",
  render: () =>
    h("div", { class: "mb-2 flex items-center text-sm" }, [
      h(
        ElRadioGroup,
        {
          class: "ml-4",
        },
        [
          h(ElRadio, { value: "1", size: "large" }, "选择1"),
          h(ElRadio, { value: "2", size: "large" }, "选择2"),
        ]
      ),
    ]),
  key: "radio",
  icon: "icon-danxuankuang",
  body: [],
  props: {
    text: createInputProp("单选框文本"),
    color: createColorProp("颜色"),
  },
});
