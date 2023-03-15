import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      account: null,
      rpc: "http://localhost:8545",
      chainId: 314,
    };
  },
  getters: {
    getAccount: (state) => {
      return state.account;
    },
    getRpc: (state) => {
      return state.rpc;
    },
    getChainId: (state) => {
      return state.chainId;
    },
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setRpc(state, rpc) {
      state.rpc = rpc;
    },
    setChainId(state, chainid) {
      state.chainId = chainid;
    },
  },
  actions: {
    setAccount({ commit }, account) {
      commit("setAccount", account);
    },
    setRpc({ commit }, rpc) {
      commit("setRpc", rpc);
    },
    setChainId({ commit }, chainId) {
      commit("setChainId", chainId);
    },
  },
});
export default store;
