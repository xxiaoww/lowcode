import { defineStore } from "pinia";
import data from "../data.json";
import {
  AppData,
} from "../../types/global";

const useData = defineStore("containerRef", {
  state: () => ({
    state: data as AppData, //数据
  }),

  getters: {},

  actions: {},
});

//暴露这个useContainerRef模块
export default useData;
