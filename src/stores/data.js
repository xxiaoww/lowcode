import { defineStore } from "pinia";
import data from "../data.json";

const useData = defineStore("containerRef", {
  state: () => ({
    state: data, //数据
  }),

  getters: {},

  actions: {},
});

//暴露这个useContainerRef模块
export default useData;
