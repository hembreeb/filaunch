<template>
  <div id="header">
    <div class="header_title" @click="home">
      <span>
        <img
          class="token_icon"
          src="@/assets/filecoin-logo.svg"
          width="30"
          height="30"
        />
      </span>
      <span>FILaunch</span>
    </div>
    <div class="header_connect">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        text-color="#0485c3"
        active-text-color="#0485c3"
      >
        <el-submenu index="1">
          <template v-slot:title>{{ network }}</template>
          <el-menu-item
            index="2-1"
            v-for="(item, index) in options"
            :key="index"
            @click="selectNetwork(item)"
            >{{ item.label }}</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click="connetWallet">
          {{ account }}
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import rpc from "../script/rpc";
import $ from "jquery";
export default {
  name: "headerView",
  data: function () {
    return {
      account: "Connect",
      network: "Mainnet",
      chainId: 1,
      activeIndex: 0,
      options: [
        {
          chainId: 314,
          label: "Mainnet",
        },
        {
          chainId: 314159,
          label: "Calibration",
        },

        {
          chainId: 3141,
          label: "Hyperspace",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "getAccount",
    }),
  },
  mounted() {
    this.setRpc(rpc[0].rpc);
    if (this.getAccount != null) {
      this.account = this.getAccount;
    }
    $(".network_input p").click(function () {
      let networkList = $(".network_list").css("display");
      if (networkList == "none") {
        $(".network_list").css({ display: "flex" });
      } else {
        $(".network_list").css({ display: "none" });
      }
    });
  },
  methods: {
    ...mapActions({
      setAccount: "setAccount",
      setRpc: "setRpc",
      setChainId: "setChainId",
    }),
    handleSelect() {},
    selectNetwork(item: any) {
      this.network = item.label;
      this.chainId = item.chainId;
      $(".network_list").css({ display: "none" });
      for (let i = 0; i < rpc.length; i++) {
        if (rpc[i].chainId == this.chainId) {
          this.setRpc(rpc[i].rpc);
          break;
        }
      }
      this.setChainId(this.chainId);
    },
    async connetWallet() {
      if (this.getAccount == null) {
        if (typeof (window as any).ethereum !== "undefined") {
          console.log("MetaMask is installed!");
        } else {
          alert("MetaMask not is installed!");
          return;
        }
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        const chainid = (window as any).ethereum.chainId;

        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        let rpcInfo: any;
        for (let i = 0; i < rpc.length; i++) {
          if (rpc[i].chainId == this.chainId) {
            rpcInfo = rpc[i];
            break;
          }
        }
        let network = "0x" + rpcInfo.chainId.toString(16);
        if (chainid !== network) {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network,
                chainName: rpcInfo.name,
                nativeCurrency: {
                  name: rpcInfo.symbol,
                  symbol: rpcInfo.symbol, // 2-6 characters long
                  decimals: 18,
                },
                rpcUrls: [rpcInfo.rpc],
                blockExplorerUrls: [rpcInfo.explore],
              },
            ],
          });
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: network }],
          });
        }
        this.setAccount(accounts[0]);
        this.account = accounts[0];
      }
    },
    disConnectWallet(account: string) {
      console.log("disConnectWallet", account);
    },
    home() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/header.css";
</style>
