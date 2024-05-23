<template>
  <div class="editor-block" :style="blockStyles" draggable="true">
    <!-- 组件渲染（使用组件的render函数来渲染） -->
    <div class="editor-block-contain" :keys="component.key">
      <component
      v-if="component.body.length <= 0 && block.body <= 0"
        :is="component.render"
        :key="component.key"
        class="editor-in"
      >
      </component>
      <div v-else :style="{display: component.key==='flex' ? 'flex' : 'block'}">
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
import { RegisterConfig,componentConfig } from "../../types/global";
import { useFocus } from "./useFocus";
import useData from "../stores/data"; //useData().state就是data.json的内容

export default defineComponent({
  name: "EditorBlock",

  props: {
    block: {
      type: Object as () => Block,
    },
    // datas:{
    //   type: Object as () => AppData
    // }
  },
  setup(props, context) {
    // let datas = props.datas
    // console.log(props.datas);
    console.log(useData().state);
    // 获取组件
    const config = inject<RegisterConfig>("config");
    // console.log(config);
    // const component:Block = config?.componentMap[props.block?.key]
    // const component:Block = (config?.componentMap as Record<string, any>)[props.block!.key] || null;
     
    const block = computed(() => {
      console.log(props.block?.key);
      return props.block;
    });
    console.log(block.value!.body);
    let blockBody = computed(() => {
      return block.value!.body
    })
    // let blockBody: Block[];
    // blockBody = block.value!.body || [];
    console.log(blockBody);
    let component= computed(()=>{
      const componentKeys = Object.keys(config!.componentMap);
      // console.log(componentKeys)
      for (const key of componentKeys) {
        // console.log(key)
        if (key === block.value!.key) {
          return config!.componentMap[key];
        }
     
      }
    });
    console.log(component);
    console.log(props.block);
    const data: string = props.block!.key ?? " ";
    console.log(data);
    const blockStyles: ComputedRef<CSSProperties> = computed(() => {
      if (!props.block) {
        return {};
      }
      return {
        top: `${props.block.top}px`,
        left: `${props.block.left}px`,
        zIndex: `${props.block.zIndex}`,
      };
    });

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
    };
  },
});
</script>

<style lang="less"></style>
