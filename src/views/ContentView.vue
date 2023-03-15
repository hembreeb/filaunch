<template>
  <div id="launchpad_list_content">
    <div class="launchpad_list_content_title">
      <p>Launchpad</p>
      <p>Custom-built infrastructure for FEVM native public sales</p>
    </div>
    <div class="launchpad_list_content_tokenList">
      <div class="launchpad_list_content_tokenList_type">
        <span>Name</span>
        <span>Status</span>
        <span>Total rasied</span>
        <span>Start time</span>
        <span>End time</span>
      </div>
      <table>
        <tr
          @click="factor(item.ido, item.status)"
          v-for="(item, index) in tokenList"
          :key="index"
        >
          <td>
            <span
              ><img class="token_icon" :src="item.img" width="30" height="30" />
            </span>
            <span>{{ item.name }}</span>
          </td>
          <td>{{ item.status }}</td>
          <td>{{ item.totalRasied }}</td>
          <td>{{ item.startTime }}</td>
          <td>{{ item.endTime }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import USDT from "../assets/USDT.svg";
// import ETH from '../assets/ETH.svg'
import { mapGetters } from "vuex";
import { getFairAuctionState, tokenFormat } from "../script/util";
import { ethers } from "ethers";
import ERC20JSON from "../script/contract/ERC20.json";
import { HttpRequest, type LaunchpadListResponse } from "../script/request";
import { ElLoading } from "element3";
export default {
  name: "ContentView",
  data: function () {
    return {
      tokenList: new Array<any>(),
    };
  },
  computed: {
    ...mapGetters({
      getRpc: "getRpc",
      getChainId: "getChainId",
    }),
  },
  watch: {
    "$store.state.chainId": function () {
      this.getActionList();
    },
  },
  async mounted() {
    await this.getActionList();
  },
  methods: {
    async getActionList() {
      const loading = ElLoading.service({
        text: "Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let httpRequest = new HttpRequest();
      let response = await httpRequest.getLaunchpadList();
      response = <[LaunchpadListResponse]>response;
      this.tokenList = [];
      for (let i = 0; i < response.length; i++) {
        if (response[i].chainId != this.getChainId) {
          continue;
        }
        let launchPad = {
          img: USDT,
          startTime: "unknow",
          endTime: "unknow",
          totalRasied: "0",
          status: "unknow",
          name: "",
          ido: response[i].contractAddress,
          projectToken: "",
          saleToken: "",
        };
        let res = await getFairAuctionState(this.getRpc, launchPad.ido);
        let provider = new ethers.providers.JsonRpcProvider(this.getRpc);
        if (res != null) {
          let erc20 = await new ethers.Contract(
            res.projectToken,
            ERC20JSON.abi,
            provider
          );
          let balance = await erc20.balanceOf(launchPad.ido);
          let blockNumber = await provider.getBlockNumber();
          let block = await provider.getBlock(blockNumber);
          launchPad.startTime = new Date(res.startTime * 1000).toLocaleString();
          launchPad.endTime = new Date(res.endTime * 1000).toLocaleString();
          launchPad.name = res.projectErc20Symbol;
          launchPad.totalRasied = tokenFormat(
            res.saleErc20Decimal,
            res.maxRaise
          );
          launchPad.projectToken = res.projectToken;
          launchPad.saleToken = res.saleToken;
          if (
            balance.gte(res.maxDistribute) &&
            res.startTime <= block.timestamp &&
            res.endTime > block.timestamp
          ) {
            launchPad.status = "started";
          } else if (res.endTime <= block.timestamp) {
            launchPad.status = "ended";
          } else {
            launchPad.status = "not started";
          }

          this.tokenList.push(launchPad);
        }
      }
      loading.close();
    },
    factor(ido: string, ss: string) {
      let status = "started";
      if (ss === "ended") {
        status = "ended";
      }
      if (ss === "not started") {
        status = "pending";
      }
      this.$router.push({
        name: "launchpad",
        query: {
          ido: ido,
          status: status,
        },
      });
    },
  },
};
</script>
<style scoped>
@import "@/assets/css/content.css";
</style>
