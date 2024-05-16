<template>
  <div class="app">
    <Editor v-model="datas"></Editor>
  </div>
</template>
<script lang="ts">
import { defineComponent, provide, ref,Ref,watch } from "vue";
import Editor from "./components/Editor.vue";
import data from "./data.json";
import { registerConfig as config } from "./utils/MaterialConfig";
import { AppData } from "../types/global";


export default defineComponent({
  name: "App",
  components: {
    Editor,
  },
  setup(){
    // 将组件的配置直接传入
    provide('config', config)
    const datas: Ref<AppData> = ref({
      exData: data
    });
    watch(() => datas.value, (newValue, oldValue) => {
  console.log('datas updated:', newValue, oldValue);
}, { deep: true });
    // console.log(datas.value)
    provide('config', config);
    return {
      datas
    }
    
  }
});
</script>
<style lang="less">
.app{
  position: fixed;
// width: 100%;
left: 0;
right: 0;
top: 0;
bottom: 0;
  // height: 100%;
}
</style>