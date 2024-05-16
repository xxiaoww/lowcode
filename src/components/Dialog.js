import { ElDialog, ElInput, ElButton } from "element-plus";
import { createVNode, defineComponent, reactive, render } from "vue";

//定义这个组件，之后点击调用函数渲染
const DialogComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, ctx) {
    const state = reactive({
      option: props.option, //用户给组件的属性  //会更新一下（每次传的可能不同
      isShow: false, //控制显示隐藏
    });

    //通过这个ctx直接调一个方法叫expose，表示组件要暴露哪个方法
    ctx.expose({
      //这里暴露一个对象
      //让外界可以调用组件的方法
      showDialog(option) {
        state.option = option; //会更新一下（每次传的可能不同
        state.isShow = true;
      },
    });

    // 点击取消
    const onCancel = () => {
      state.isShow = false;
    };
    // 点击确定
    const onConfirm = () => {
      state.isShow = false;
      //看看有没有onConfirm,有的话就调用这个方法，调用的时候再把当前输的内容(state.option.content)转化出来就好了
      state.option.onConfirm && state.option.onConfirm(state.option.content);
    };

    return () => {
      return (
        <ElDialog v-model={state.isShow} title={state.option.title}>
          {{
            default: () => (
              <ElInput
                type="textarea"
                v-model={state.option.content}
                // 行数
                rows={10}
              ></ElInput>
            ),
            footer: () =>
              // footer有的话就渲染一个div
              state.option.footer && (
                <div>
                  <ElButton onClick={onCancel}>取消</ElButton>
                  <ElButton type="primary" onClick={onConfirm}>
                    确定
                  </ElButton>
                </div>
              ),
          }}
        </ElDialog>
      );
    };
  },
});

let vm;
export default function $dialog(option) {
  //手动挂载组件  new SubComponent.$mount()
  if (!vm) {
    // //这里需要将el渲染到我们的页面中
    // document.body.appendChild(render(vm, el), el); //渲染到真实结点扔到页面中

    let el = document.createElement("div");
    //创建虚拟节点的时候可以放一个类组件DialogComponent，传递属性{ option }
    vm = createVNode(DialogComponent, { option }); //将组件渲染成虚拟节点

    //（在vue3里面，想要把一个组件渲染到某个节点上，我们可以先创建一个组件的虚拟节点，然后把虚拟节点挂载到真实节点）

    //render作用：把虚拟节点变成真实节点  （render方法返回的可能不是一个dom元素？
    // 将虚拟节点渲染成真实的 DOM 元素
    // const domElement = ;
    // 将真实的 DOM 元素添加到页面中
    document.body.appendChild((render(vm, el), el)); //这里 里面要加括号！！！☆
    //上面这句 相当于第一步把虚拟节点渲染到el里去，最后呢插入的是一个el元素
  }

  //将组件渲染到这个el元素上
  let { showDialog } = vm.component.exposed; //通过当前的虚拟节点，拿到vm.component.exposed里面的showDialog方法
  showDialog(option); //加个判断，没有vm才需要做上面那些，不然会重复
  //其他说明组件已经有了只需要显示出来即可
}
