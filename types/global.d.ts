// import {VNode, RendererNode, RendererElement} from "vue"

// export interface Block {
//     top?: number;
//     left?: number;
//     zIndex?: number;
//     key?: string;
//     alignCenter?:boolean;
//     focus:boolean;
//     props?: {
//       text?: string;
//       type?: string;
//       size?: string;
//       options?: any[];
//     };
//     model?: {
//       defalut?: string;
//     };
//   }
// export interface AppData {
//     exData: {
//       container: {
//         width: string;
//         height: string;
//       };
//       blocks: Block[];
//     };
//   }


// export interface componentProps {
//     type: 'input' | 'color' | 'select' | 'table';
//     label: string;
//     options?: { label: string, value: string }[];
//     table?: {
//         options: { label: string, field: string }[];
//         key: string
//     };
// }

// export interface componentConfig {
//     label: string;
//     preview: () => HTMLElement|VNode<RendererNode, RendererElement, { [key: string]: any }>;
//     render: (props: { props: Record<string, any>; model: Record<string, any> }) => HTMLElement|VNode<RendererNode, RendererElement, { [key: string]: any }>;
//     key: string;
//     icon:string;
//     props: Record<string, componentProps>;
//     model?: Record<string, string>
// }

// export interface RegisterConfig {
//   componentList: componentConfig[];
//   componentMap: Record<string, componentConfig>;
//   register: (component: componentConfig) => void;
// }


import {VNode, RendererNode, RendererElement} from "vue"
  // block的
  export interface Block {
    top?: number;
    left?: number;
    zIndex?: number;
    key?: string;
    alignCenter?:boolean;
    focus?:boolean;
    id?:string;
  style?:object;
    props?: {
      text?: string;
      type?: string;
      size?: string;
      options?: any[];
    };
    model?: {
      defalut?: string;
    };
    body?:any[],
  }
export interface AppData {
      container: {
        width: string;
        height: string;
      };
      blocks: Block[];
    };


export interface componentProps {
    type: 'input' | 'color' | 'select' | 'table';
    label: string;

    options?: { label: string, value: string }[];
    table?: {
        options: { label: string, field: string }[];
        key: string
    };
};
// 配置组件的
export interface componentConfig {
    label: string;
    preview?: () => HTMLElement|VNode<RendererNode, RendererElement, { [key: string]: any }>;
    render: (props: { props: Record<string, any>; model: Record<string, any> }) => HTMLElement|VNode<RendererNode, RendererElement, { [key: string]: any }>;
    key: string;
    icon:string;
    body?:any[];
    props: Record<string, any>;
    model?: Record<string, string>
}
// 集合
export interface RegisterConfig {
  componentList: componentConfig[];
  componentMap: Record<string, componentConfig>;
  register: (component: componentConfig) => void;
}