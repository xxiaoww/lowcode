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

//默认选择列表数组
//字体大小选择的数组
let fontSizeOpt = [
  { label: "14px", value: "14px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
];
//行高选择数组
let lineHeightOpt = [
  { label: "1.3", value: "1.3" },
  { label: "1.5", value: "1.5" },
  { label: "1.7", value: "1.7" },
  { label: "1.9", value: "1.9" },
  { label: "2.1", value: "2.1" },
  { label: "2.3", value: "2.3" },
  { label: "2.5", value: "2.5" },
];
//字重
let fontWeightOpt = [
  { label: "Ultra bold(heavy)(900)", value: "900" },
  { label: "Extra bold(800)", value: "800" },
  { label: "Blod(700)", value: "700" },
  { label: "Semi bold(600)", value: "600" },
  { label: "Medium(500)", value: "500" },
  { label: "Regular(400)", value: "400" },
  { label: "Light(300)", value: "300" },
  { label: "Extra light(thin)(200)", value: "200" },
  { label: "Uitra light(100)", value: "100" },
];
//圆角
let borderRadiusOpt = [
  { label: "无(0px)", value: "0px" },
  { label: "圆角1(2px)", value: "2px" },
  { label: "圆角2(4px)", value: "4px" },
  { label: "圆角3(6px)", value: "6px" },
  { label: "圆角4(8px)", value: "8px" },
  { label: "圆角5(10px)", value: "10px" },
  { label: "圆角6(50%)", value: "50%" },
];
//输入类型
let inputTyepOpt = [
  { label: "文本", value: "text" },
  { label: "密码", value: "password" },
  { label: "邮箱", value: "email" },
  { label: "URL", value: "url" },
];
//按钮类型
let buttonTypeOpt = [
  { label: "基础", value: "primary" },
  { label: "成功", value: "success" },
  { label: "警告", value: "warning" },
  { label: "危险", value: "danger" },
  { label: "文本", value: "text" },
];
//按钮尺寸
let buttonSizeOpt = [
  { label: "默认", value: "" },
  { label: "中等", value: "medium" },
  { label: "小", value: "small" },
];

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
  render: ({ props = {} }) => h("div", { style: { display: "flex" } }),
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
  render: ({ props = {} }) => h("div", { class: "contain " }, "内容区"),
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
  render: ({ props = {} }) => h("div"),
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
  // render: () => h("span", { class: "text" }, "渲染文本"),
  // render: ({ props = {} }) =>
  //   h(
  //     "span",
  //     {
  //       style: { color: (props.color = ""), fontSize: (props.size = "") },
  //       class: "text",
  //     },
  //     props.text || "渲染文本"
  //   ),
  render: ({ props = {} }) => {
    // if (props.color) {
    //   alert(props.color);
    // }
    const { color = "", size = "", text = "渲染文本" } = props;
    return h(
      "span",
      {
        style: {
          color,
          fontSize: size,
          "line-height": props.lineHeight,
          "font-weight": props.fontWeight,
        },
        class: "text",
      },
      text
    );
  },
  // render: ({
  //   props = {} as { color?: string; size?: string; text?: string },
  // }) => {
  //   const { color = "", size = "", text = "渲染文本" } = props;
  //   return h(
  //     "span",
  //     {
  //       style: { color, fontSize: size },
  //       class: "text",
  //     },
  //     text
  //   );
  // },

  key: "text",
  icon: "icon-wenben",
  body: [],
  props: {
    text: createInputProp("输入文本内容"),
    color: createColorProp("字体颜色"),
    size: createSelectProp("字体大小", fontSizeOpt),
    lineHeight: createSelectProp("文本行高", lineHeightOpt),
    fontWeight: createSelectProp("文本字重", fontWeightOpt),
  },
});
// 按钮
registerConfig.register({
  label: "按钮",
  preview: () => h(ElButton, {}, "预览按钮"),
  render: ({ props = {} }) =>
    h(
      ElButton,
      {
        type: props.type,
        size: props.size,
        style: {
          "line-height": props.lineHeight,
          "font-weight": props.fontWeight,
          "border-radius": props.borderRadius,
        },
      },
      props.text || "渲染按钮"
    ),
  key: "button",
  icon: "icon-anniu",
  body: [],
  props: {
    text: createInputProp("按钮内容"),
    type: createSelectProp("按钮类型", buttonTypeOpt),
    size: createSelectProp("按钮尺寸", buttonSizeOpt),
    lineHeight: createSelectProp("按钮行高", lineHeightOpt),
    fontWeight: createSelectProp("按钮字重", fontWeightOpt),
    borderRadius: createSelectProp("圆角", borderRadiusOpt),
  },
});
// 输入框
registerConfig.register({
  label: "输入框",
  preview: () => h(ElInput, { placeholder: "预览输入框" }, ""),
  render: ({ props = {} }) =>
    h("div", { style: { display: props.display } }, [
      h(
        "div",
        {
          style: {
            fontSize: props.titSize,
            fontWeight: props.titWeight,
            color: props.titColor,
            lineHeight: props.titLineHeight,
            whiteSpace: "nowrap",
            justifyContent: "space-around",
          },
        },
        props.title || props.title
      ),
      h(
        ElInput,
        {
          placeholder: "渲染输入框",
          type: props.inputTyep,
          value: props.model || "绑定字段",
          "max-length": props.maxlength || 1000000,
          style: {
            color: props.color,
            borderRadius: props.borderRadius || "0px",
          },
        },
        "wrwq"
      ),
    ]),

  key: "input",
  icon: "icon-m-xialakuang",
  body: [],
  props: {
    display: createSelectProp("布局", [
      { label: "水平", value: "flex" },
      { label: "垂直", value: "block" },
      { label: "内联", value: "inline" },
    ]),
    title: createInputProp("输入框标题"),
    titSize: createSelectProp("标题大小", fontSizeOpt),
    titWeight: createSelectProp("标题字重", fontWeightOpt),
    titLineHeight: createSelectProp("标题行高", lineHeightOpt),
    titColor: createColorProp("标题颜色"),
    // text: createInputProp("输入框文本"),
    color: createColorProp("颜色"),
    maxLength: createInputProp("最大字数"),
    borderRadius: createSelectProp("圆角", borderRadiusOpt),
    model: {
      type: "model",
      label: "输入框内容",
      // default: "绑定字段",
      // model: {
      // default: "绑定字段",
      // },
    },
    inputTyep: createSelectProp("输入类型", inputTyepOpt),
  },
});
// 按钮组件
registerConfig.register({
  label: "按钮组件",
  render: ({ props = {} }) =>
    h("div", { class: "container" }, [
      h("div", {}, props.title),
      h(ElButtonGroup, null, [
        h(ElButton, { type: props.type1 || "primary" }, props.val1 || "按钮1"),
        h(ElButton, { type: props.type2 || "primary" }, props.val2 || "按钮2"),
      ]),
    ]),
  key: "buttonGroup",
  icon: "icon-button-group",
  body: [],
  props: {
    title: createInputProp("按钮标题"),
    val1: createInputProp("按钮1内容"),
    val2: createInputProp("按钮2内容"),
    type1: createSelectProp("按钮1类型", buttonTypeOpt),
    type2: createSelectProp("按钮2类型", buttonTypeOpt),
    size: createSelectProp("按钮尺寸", buttonSizeOpt),
  },
});

// 单选框
registerConfig.register({
  label: "单选框",
  render: ({ props = {} }) =>
    h(
      "div",
      {
        class: "mb-2 flex items-center text-sm",
        size: props.size,
        //disabled不确定是否写在外面，需要等导出页面后验证~
        disabled: props.disabled,
        style: {
          display: props.mode,
        },
      },
      [
        h("div", {}, props.title),
        h(
          ElRadioGroup,
          {
            class: "ml-4",
          },
          [
            h(
              ElRadio,
              { value: "1", size: "large", style: { color: props.color1 } },
              props.text1 || "选项A"
            ),
            h(
              ElRadio,
              { value: "2", size: "large", style: { color: props.color2 } },
              props.text2 || "选项B"
            ),
          ]
        ),
      ]
    ),
  key: "radio",
  icon: "icon-danxuankuang",
  body: [],
  props: {
    title: createInputProp("单选框标题"),
    text1: createInputProp("单选框1文本"),
    text2: createInputProp("单选框2文本"),
    color1: createColorProp("文本1颜色"),
    color2: createColorProp("文本2颜色"),

    //BUg:
    mode: createSelectProp("布局", [
      { label: "内联", value: "inline" },
      { label: "水平", value: "horizontal" },
      { label: "垂直", value: "normal" },
      { label: "继承", value: "" },
    ]),
    size: createSelectProp("单选框尺寸", [
      { label: "默认", value: "" },
      { label: "中等", value: "medium" },
      { label: "小", value: "small" },
    ]),
    disabled: createSelectProp("是否禁用", [
      { label: "是", value: "true" },
      { label: "否", value: "false" },
    ]),
  },
});
