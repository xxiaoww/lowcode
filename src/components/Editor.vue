<template>
  <div class="all">
    <div class="header">可视化编辑器</div>
    <div class="editor">
      <div class="editor-left">
        <div>组件</div>
        <!-- 根据注册的组件进行渲染 -->
        <div>
          <div
            draggable="true"
            class="editor-left-item"
            v-for="(item, index) in config?.componentList"
            @click="editorClick(item,focusData)"
            :key="index"
            @dragstart="dragStart($event, item)"
            @dragend="dragEnd($event, item)"
          >
            <span class="iconfont" :class="item.icon">{{ item.label }}</span>
            <!-- <component :is="item.preview()"></component> -->
          </div>
        </div>
      </div>
      <!-- <div class="editor-top">菜单栏</div> -->
      <Menu></Menu>
      <div class="editor-right">属性控制栏</div>
      <div class="editor-container">
        <!-- 负责产生滚动条 -->
        <div class="editor-container-block">
          <!-- 内容 -->
          <div
            class="editor-container-content"
            :style="containerStyle"
            ref="containerRef"
            @mousedown="clearBlockFocus()"
          >
            <!-- 渲染内容 -->
            <EditorBlock
              v-for="(block, index) in state.blocks"
              :key="index"
              :block="block"
              :keys="block.key"
              draggable="true"
              :data-id="block.id"
              @mousedown="onmousedown($event, block,block.id ?? '')"
              :class="block.focus ? 'editor-block-focus' : ''"></EditorBlock>
          
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { CSSProperties, inject, watch } from "vue";
import { computed, ComputedRef, defineComponent, ref } from "vue";
import {
  AppData,
  Block,
  componentConfig,
  RegisterConfig,
} from "../../types/global";
import EditorBlock from "./EditorBlock.vue";
import deepcopy from "deepcopy";

// 引进样式
import "./editor.less";
import { useFocus } from "./useFocus";
// 引入
import { v4 as uuid } from "uuid";

//引入菜单组件
import Menu from "./Menu.vue";
// console.log(AppData)

//引入data
import useData from "../stores/data"; //useData().state就是data.json的内容

export default defineComponent({
  name: "Editor",
  components: {
    EditorBlock,
    Menu,
  },
  props: {
    modelValue: {
      type: Object as () => AppData,
      required: true,
    },
  },

  setup(props, context) {
    const config = inject<RegisterConfig>("config");
    // console.log(props.modelValue);
    // const data = ref<AppData>(props.modelValue);
    // console.log(data.value)
    //data
    // let data = useData().state;
    // console.log(data);
    // 计算属性
    // const data = computed<AppData>({
    //   get() {
    //     return props.modelValue;
    //   },
    //   set(newValue) {
    //     context.emit("update:modelValue", deepcopy(newValue));
    //   },
    // });
    // const data = ref(props.modelValue);
    // console.log(data);

    // watch(
    //   () => data,
    //   (newValue, oldValue) => {
    //     // console.log("data updated:", newValue, oldValue);
    //   },
    //   { deep: true }
    // );

    // 内容的样式
    const containerStyle: ComputedRef<CSSProperties> = computed(() => {
      const { container } = useData().state;
      console.log(container);
      return {
        width: `${container.width}px`,
        height: `${container.height}px`,
      };
    });
    console.log(containerStyle.value);
    console.log(useData().state.blocks);
    console.log(useData().state);


    // state替换useData().state，防止报错
    let state = computed<AppData>({
      get() {
        return useData().state;
      },
      set(newValue) {
        context.emit("update:modelValue", deepcopy(newValue));
      },
    });
    // 获取内容的dom元素
    let containerRef = ref<null | HTMLElement>(null);
    // 拖拽事件
    const dragenter = (e: DragEvent) => {
      // 改变拖拽的效果
      e.dataTransfer!.dropEffect = "move";
    };

    const dragover = (e: DragEvent) => {
      // 阻止默认事件
      e.preventDefault();
    };
    // 当拖拽元素离开容器时
    const dragleave = (e: DragEvent) => {
      e.dataTransfer!.dropEffect = "none";
    };
    // 记住当前的组件
    let currentComponent = ref<null | componentConfig>(null);

    // 松手的时候

    const drop = (e: DragEvent) => {
      // 阻止默认事件
      e.preventDefault();
      // console.log(currentComponent);
      let blockBody: Block[] = [];
      if (currentComponent.value!.body!.length >= 1) {
        for (let i = 0; i < currentComponent.value!.body!.length; i++) {
          let r: string = uuid();
          // console.log(currentComponent.value!.body![i].key)
          // console.log(r)
          blockBody = [
            ...blockBody,
            {
              zIndex: 1,
              id: r,
              key: currentComponent.value!.body![i].key,
              alignCenter: true,
              focus: false,
              body: [],
              props: {},
            },
          ];
        }
        console.log(blockBody)
      }

      //随机生成id
      const random: string = uuid();
      // console.log(random);
      // 置空
      let blocks = useData().state.blocks as Block[];
      console.log(useData().state);
      console.log(useData().state.blocks);
      console.log(typeof blocks); //object

      useData().state = {
        ...useData().state,
        blocks: [
          ...blocks,
          {
            zIndex: 1,
            id: random,
            key: currentComponent.value!.key,
            alignCenter: true,
            focus: false,
            body: blockBody,
            props: {},
          },
        ],
      };
      currentComponent.value = null;
      console.log(useData().state);
      // console.log(useData().state);
    };
    // 拖拽开始事件
    const dragStart = (e: DragEvent, component: componentConfig | null) => {
      // console.log(containerRef.value);
      // console.log(component);
      containerRef.value?.addEventListener("dragenter", dragenter);
      containerRef.value?.addEventListener("dragover", dragover);
      containerRef.value?.addEventListener("dragleave", dragleave);
      containerRef.value?.addEventListener("drop", drop);
      currentComponent.value = component;
      // console.log(currentComponent.value);
      // 还要再松手的时候，根据所拖拽的组件，添加一个组件
    };

    // 拖拽结束事件
    const dragEnd = (e: DragEvent, component: componentConfig) => {
      debugger;
      // console.log(containerRef.value);
      containerRef.value?.removeEventListener("dragenter", dragenter);
      containerRef.value?.removeEventListener("dragover", dragover);
      containerRef.value?.removeEventListener("dragleave", dragleave);
      containerRef.value?.removeEventListener("drop", drop);
      // console.log(data);
    };

    // 2.实现获取焦点，选中功能
    // console.log(data);
    let { onmousedown, focusData, clearBlockFocus } = useFocus(
      (e: any) => {
        console.log(e);
        let fid = e.target.parentNode.getAttribute("data-id");
        console.log(fid);
        console.log(useData().state)
        console.log(state)
        useData().state.blocks.forEach(element => {
          if(element.id === fid){
            element.focus = true
            // let children = element.body!
            // children.forEach(e=>e.focus=true)
          }
        });
        console.log(focusData);
        // console.log(e);
        // console.log(e.target)
        //   let event:HTMLElement = e.target as HTMLElement;
        //   //获取鼠标位置
        // let pageX = e.pageX;
        // let pageY = e.pageY;
        // //获取鼠标按下时鼠标在盒子中的位置
        // let boxX = pageX - event!.offsetLeft;
        // let boxY = pageY - event!.offsetTop;
        // document.onmousemove = function (e) {
        //   //获取鼠标拖拽式在页面上的位置
        //   let pageXs = e.pageX;
        //   let pageYs = e.pageY;
        //   event.style.left = pageXs - boxX + "px";
        //   event.style.top = pageYs - boxY + "px";
        // };

        // document.onmouseup = function () {
        //   document.onmousemove = null;  //删除拖拽事件
        // };

        // mousedown(e);
        // console.log(focusData.value.focus);
        // let focus: Block[] = focusData.value.focus;
        // let focusid = focus[0].id;
        // console.log(focus);
        // const elements = document.querySelectorAll(".editor-block");
        // elements.forEach((block) => {
        // 获取自定义属性的值
        // console.log(block);
        // block.removeEventListener("dragstart");
        // let dataid: string = block.getAttribute("data-id")!;
        // block.setAttribute("draggable", "true"); // 启用元素拖动
        // console.log(dataid);
        // console.log(typeof block);
        // if (focusid === dataid) {
        // console.log(block)
        // console.log(dataid);
        //   //           block.addEventListener("dragstart", function($Event) {
        //   // // // 处理拖动开始时的逻辑
        //   // //           // e.dataTransfer.setData("text/plain", dataid);
        //   // $Event.dataTransfer.dropEffect = 'move'
        //   //           },true);
        //   //
        //   // block.addEventListener("dragstart", (event: any) => {
        //   //   // 设置拖动数据
        //   console.log(event);
        //   console.log(block);
        //   //   debugger;
        //   console.log(111);
        //   //   event.dataTransfer.setData("text/plain", "Hello, World!");

        //   //   // 设置拖动效果为移动
        //   //   event.dataTransfer.effectAllowed = "move";
        //   // });

        //   // block.addEventListener("drag", (event) => {
        //   //   // 拖拽过程中的逻辑
        //   // });

        //   // block.addEventListener("dragend", (event) => {
        //   //   // 拖拽结束时的逻辑
        //   // });
        // }
        // });
      }
    );
    
    
    // 给左侧组件添加点击事件，
    // 具体表现为 如果有选中的盒子，则在点击左侧组件后添加在选中盒子添加一个EditorBlock
    // 如果没有选中的盒子，则在最大的盒子里默认添加组件
    const editorClick = (component:componentConfig,focusData:any)=>{
      const focus:Block[] = focusData.focus
      console.log(focus)
      if(focus.length!== 0){
        // 要分为内容盒子，flex盒子，和普通已知具体标签的盒子


        // 1.如果选中的为内容组件
        if(focus[0].key === "container"){
          console.log(focus[0].id)

          useData().state.blocks.forEach(block=>{
            console.log(block.id)
            lookforContainer(state,block,focus,component)
          })
          console.log(useData().state)
        }
        // 2.如果选中的为flex组件，自动在flex盒子添加
        else if(focus[0].key === "flex"){
          useData().state.blocks.forEach(block=>{
            lookforFlex(state,block,focus,component)
          })
          
        }
      }else{
        let blockBody: Block[] = [];
      if (component.body!.length >= 1) {
        for (let i = 0; i < component!.body!.length; i++) {
          let r: string = uuid();
          // console.log(currentComponent.value!.body![i].key)
          // console.log(r)
          blockBody = [
            ...blockBody,
            {
              zIndex: 1,
              id: r,
              key: component!.body![i].key,
              alignCenter: true,
              focus: false,
              body: [],
              props: {},
            },
          ];
        }
      }

        //随机生成id
      const random: string = uuid();
      console.log(random);
      // 置空
      let blocks = useData().state.blocks as Block[];
        useData().state = {
        ...useData().state,
        blocks: [
          ...blocks,
          {
            zIndex: 1,
            id: random,
            key: component!.key,
            alignCenter: true,
            focus: false,
            body: blockBody,
            props: {},
          },
        ],
      };
      console.log(useData().state); 
      }

    }
    // 寻找内容盒子
    const lookforContainer = function(state:any,block:any,focus:any,component:any){
      if(Array.isArray(block)){
        block.forEach(b=>{
          if(b.id === focus[0].id){
            b.key = component.key
              // 更新 state.blocks
              state.value = { ...state.value };
              console.log(state.value)
             
          }else if(b.body && b.body.length > 0){
        lookforContainer(state,b.body!,focus,component)
      }
        })
      }
      else if(block.id === focus[0].id){
        let blockBody: Block[] = [];
              console.log(component.body)
      if (component.body!.length >= 1) {
        for (let i = 0; i <component.body!.length; i++) {
          let r: string = uuid();
          // console.log(currentComponent.value!.body![i].key)
          // console.log(r)
          blockBody = [
            ...blockBody,
            {
              zIndex: 1,
              id: r,
              key: component.body![i].key,
              alignCenter: true,
              focus: false,
              body: [],
              props: {},
            },
          ];
        }
        console.log(blockBody)
      }
              block.key = component.key
        
      block.body = [...blockBody];
      // 使用 Vue.set
               // 更新 state.blocks
              state.value = { ...state.value };
              console.log(useData().state)
              console.log(state.value)
              console.log(block.body) 
      }else if(block.body && block.body.length > 0){
        lookforContainer(state,block.body!,focus,component)
      }
    }
    //寻找flex盒子
    const lookforFlex = function(state:any,block:any,focus:any,component:any){
      if(Array.isArray(block)){
        block.forEach(b=>{
          if(b.id === focus[0].id){
            // b.key = component.key
            addbox(b,component)
              // 更新 state.blocks
              state.value = { ...state.value };
              console.log(state.value)
          }else if(b.body && b.body.length > 0){
        lookforContainer(state,b.body!,focus,component)
      }
        })
      }
      else if(block.id === focus[0].id){
              addbox(block,component)

              // block.key = component.key
               // 更新 state.blocks
              state.value = { ...state.value };
              console.log(state.value)
              console.log(block.body) 
      }else if(block.body && block.body.length > 0){
        lookforFlex(state,block.body!,focus,component)
      }
    }
    // 添加盒子的函数
    const addbox = function(block:any,component:any){
      let blockBody: Block[] = [];
      if (component.body!.length >= 1) {
        for (let i = 0; i <component.body!.length; i++) {
          let r: string = uuid();
          // console.log(currentComponent.value!.body![i].key)
          // console.log(r)
          blockBody = [
            ...blockBody,
            {
              zIndex: 1,
              id: r,
              key: component.body![i].key,
              alignCenter: true,
              focus: false,
              body: [],
              props: {},
            },
          ];
        }
        console.log(blockBody)
      }
      let random = uuid()
      block.body.push({
        zIndex: 1,
              id: random,
              key: component.key,
              alignCenter: true,
              focus: false,
              body: blockBody,
              props: {},
      })
    }


    // 移动信息
    type dragState = {
      startX: number;
      startY: number;
      startPos: any[];
    };
    let drags: dragState;
    // function findTargetElement(x:number, y:number) {
    //     const elements = Array.from(container.getElementsByClassName("draggable"));
    //     return elements.find((element:HTMLElement) => {
    //         const rect = element.getBoundingClientRect();
    //         return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    //     });
    // }
    // 移动的时候
    const mousemove = (e: DragEvent) => {
      // let {clientX:moveX,clientY:moveY} = e
      // let durX = moveX - drags.startX
      // let durY = moveY - drags.startY
      // focusData.value.focus.forEach((block,idx)=>{
      // console.log(drags.startPos[idx])
      //   block.top = drags.startPos[idx].top+durY
      //   block.left  = drags.startPos[idx].left+durX
      // })
      e.preventDefault();
      // const targetElement = findTargetElement(e.clientX, e.clientY);
      // if (targetElement && targetElement !== draggedElement) {
      //     const rect = targetElement.getBoundingClientRect();
      //     const targetIndex = Array.from(container.children).indexOf(targetElement);

      //     if (e.clientY < rect.top + rect.height / 2) {
      //         container.insertBefore(draggedElement, targetElement);
      //     } else {
      //         container.insertBefore(draggedElement, targetElement.nextElementSibling);
      //     }
      // }
      // console.log(focusData.value);
    };

    // 组件拖拽

    const mouseup = (e: DragEvent) => {
      document.removeEventListener("dragover", mousemove);
      document.removeEventListener("dragend", mouseup);
    };

    const mousedown = (e: DragEvent) => {
      // console.log(e);
      e.dataTransfer!.setData("text/plain", "");
      e.dataTransfer!.effectAllowed = "move";
      //      drags={
      //   startX:e.clientX,
      //   startY:e.clientY,//记录每一个选中的位置
      //   startPos:focusData.value.focus.map(({top,left}:Block)=>({top,left}))
      // }
      document.addEventListener("dragover", mousemove);
      document.addEventListener("dragend", mouseup);
    };

    // 3.实现容器内元素的拖拽功能

    return {
      state,
      useData,//把useData放到return里，才可以在template的dom元素中使用
      containerStyle,
      config,
      containerRef,
      dragStart,
      dragEnd,
      onmousedown,
      clearBlockFocus,
      editorClick,
      focusData
    };
  },
});
</script>

<style lang="less"></style>
