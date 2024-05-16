<template>
    
  </template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  CSSProperties,
  defineComponent,
  inject,
} from "vue";
import { Block } from "../../types/global";
import "./editor.less";
import { RegisterConfig } from "../../types/global";


export default defineComponent({
  name: "EditorBlock",
  props: {
    block: {
      type: Object as () => Block,
    },
  },
  setup(props) {
    // 获取组件
    const config = inject<RegisterConfig>("config");
    // console.log(config);
    // const component:Block = config?.componentMap[props.block?.key]
    // const component:Block = (config?.componentMap as Record<string, any>)[props.block!.key] || null;
      let component: any = null;
      let block = props.block
      console.log(block)
  if (config && props.block) {
    const componentKeys = Object.keys(config.componentMap);
    console.log(componentKeys)
    for (const key of componentKeys) {
      console.log(key)
      if (key === props.block.key) {
        component = config.componentMap[key];
        console.log(component.render())
        break;
      }
    }
  }
    console.log(component);
    console.log(props.block);
    const data: string = props.block!.key ?? " ";
    console.log(data)
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
    return {
      block,
      data,
      blockStyles,
      component
    };
  },
});
</script>