<template>
  <div class="editor-block" :style="blockStyles" draggable="true">
    <!-- 组件渲染（使用组件的render函数来渲染） -->
    <!-- :is="componentRender"是将组件的render绑定 -->
    <div class="editor-block-contain" :keys="component?.key">
      <component
        v-if="component?.body?.length <= 0 && block?.body <= 0"
        :is="componentRender"
        :key="component?.key"
        class="editor-in"
      >
      </component>
      <!-- 此处把component.key改为comKey了 -->
      <!-- <div class="editor-block-contain" :keys="comKey">
      <component
        v-if="comBodyLen <= 0 && bloBodyLen <= 0"
        :is="componentRender"
        :key="comKey"
        class="editor-in"
      >
      </component> -->
      <div
        v-else
        :style="{ display: component?.key === 'flex' ? 'flex' : 'block' }"
      >
        <!-- <div v-else :style="{ display: comKey === 'flex' ? 'flex' : 'block' }"> -->
        <!-- 这里的block是block.body -->
        <EditorBlock
          v-for="(block, index) in blockBody"
          :key="index"
          :block="block"
          :class="block.focus ? 'editor-block-focus' : ''"
          :style="{ flex: '1' }"
          :data-id="block.id"
          @mousedown.stop="onmousedown($event, block, block.id ?? '')"
        ></EditorBlock>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  ComputedRef,
  CSSProperties,
  defineComponent,
  inject,
  Ref,
} from "vue";
import { Block, AppData } from "../../types/global";
import "./editor.less";
import { RegisterConfig, componentConfig } from "../../types/global";
import { useFocus } from "./useFocus";
import useData from "../stores/data"; //useData().state就是data.json的内容
import { colProps } from "element-plus";

export default defineComponent({
  name: "EditorBlock",

  props: {
    block: {
      type: Object as () => Block,
    },
    // dataId: { type: String as () => string },
    // datas:{
    //   type: Object as () => AppData
    // }
  },
  setup(props, context) {
    // let datas = props.datas
    // console.log(props.datas);
    console.log(props.block!.id);
    console.log(useData().state);
    // 获取组件
    const config = inject<RegisterConfig>("config");
    if (!config) {
      throw new Error("Config is null or undefined.");
    }

    // console.log(config);
    // const component:Block = config?.componentMap[props.block?.key]
    // const component:Block = (config?.componentMap as Record<string, any>)[props.block!.key] || null;

    const block = computed(() => {
      console.log(props.block?.key);
      return props.block;
    });
    console.log(block.value!.body);
    let blockBody = computed(() => {
      return block.value!.body;
    });
    // let blockBody: Block[];
    // blockBody = block.value!.body || [];
    console.log(blockBody);

    let component = computed(() => {
      const componentKeys = Object.keys(config!.componentMap);
      // console.log(componentKeys);
      for (const key of componentKeys) {
        // console.log(key)
        if (key === block.value!.key) {
          return config!.componentMap[key];
        }
      }
    });
    // let comKey = block.value!.key;
    // let comBodyLen = component!.value?.body!.length!; //？？？
    // let bloBodyLen = block.value?.body!.length!;
    //拖进来的时候，把block的props传到配置的render里面动态设置样式等配置
    //这里要拿到block的props,该组件config的render，进行传值
    console.log(component.value);
    console.log(block.value!.props);

    // let componentRender = computed(() => {
    //   if (component!.value && block.value!.props) {
    //     let props = block.value!.props || {};
    //     return component!.value.render({
    //       props: props,
    //     });
    //   }
    // });
    let componentRender = computed(() => {
      if (component.value && block.value?.props) {
        let props = block.value.props || {};
        return component.value.render({
          props: props,
        });
      }
    });

    //这里需要给render传个props，但是有bug
    // const RenderComponent = component._value.render({
    //   props: block.props,
    // });

    console.log(component);
    console.log(props.block);
    const data: string = props.block!.key ?? " ";
    console.log(data);
    const blockStyles: ComputedRef<CSSProperties> = computed(() => {
      if (!props.block) {
        return {} as CSSProperties;
      }
      // return {
      //   top: `${props.block.top}px`,
      //   left: `${props.block.left}px`,
      //   zIndex: `${props.block.zIndex}`,
      //   width: `22px`,
      //   // ...Object.values(props.block.style),
      // };
      // console.log(
      // useData().state.blocks.forEach((block) => {
      //   if (block.id === props.dataId) {
      //     alert(1);
      //   }
      // })
      // props.dataId,
      //   useData().state.blocks
      // );
      return props.block.style as CSSProperties;
      // let blockStyles = computed(() => {
      //   if (!props.block) {
      //     return {};
      //   }
      //   // 拿到blocks里面对应这个id的block的style、，

      //   // useData().state.blocks.filter(block=>block.id === props.dataId)[0]是拿到渲染区中这个元素
      //   return useData().state.blocks.filter(
      //     (block) => block.id === props.dataId
      //   )[0].style;
      // });
    });
    // console.log(props.block.style);

    // const blockStyles = computed(() => {
    //   if (!props.block) {
    //     return {};
    //   }
    //   return props.block.style;
    // });

    // 焦点

    let { onmousedown, focusData } = useFocus((e: any) => {
      console.log(focusData);
      console.log(useData().state);
    });

    return {
      block,
      blockBody,
      data,
      useData,
      blockStyles,
      component,
      onmousedown,
      componentRender,
      // comKey,
      // comBodyLen,
      // bloBodyLen,
    };
  },
});
</script>

<style lang="less"></style>
