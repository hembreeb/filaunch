<template>
  <div id="factor">
    <div class="time_info">
      <div>Remaining time</div>
      <div class="count_down">
        <span>
          <p>{{ day }}</p>
          <p>day</p>
        </span>
        :
        <span>
          <p>{{ hour }}</p>
          <p>hour</p>
        </span>
        :
        <span>
          <p>{{ minute }}</p>
          <p>minute</p>
        </span>
        :
        <span>
          <p>{{ second }}</p>
          <p>second</p>
        </span>
      </div>
    </div>
    <div class="launchpad_info">
      <div class="launchpad_info_show">
        <span
          ><img
            class="token_icon"
            src="@/assets/bank.svg"
            width="30"
            height="30"
        /></span>
        <span>
          <p>Total raised</p>
          <p>{{ raised }}</p>
        </span>
      </div>
      <div class="launchpad_info_show">
        <span
          ><img
            class="token_icon"
            src="@/assets/price.svg"
            width="30"
            height="30"
        /></span>
        <span>
          <p>${{ fairAuctionState.projectTokenSymbol }} price</p>
          <p>${{ price }}</p>
        </span>
      </div>
    </div>
    <div class="launchpad_content">
      <div class="launchAction">
        <span>Auction Address:</span>
        <span
          >{{ ido }}<i class="el-icon-copy-document" @click="copyContract"></i
        ></span>
        <span>Max Price:</span>
        <span>{{ maxPrice }}</span>
        <span>Min Price:</span>
        <span>{{ minPrice }}</span>
        <span>Max Raise:</span>
        <span>{{ maxRaise }}</span>
        <span>Min Raise:</span>
        <span>{{ minRaise }}</span>
        <span>Max Distribute:</span>
        <span>{{ maxDistribute }}</span>
        <span>Start Time:</span>
        <span>{{ startTimeFormat }}</span>
        <span>End Time:</span>
        <span>{{ endTimeFormat }}</span>
      </div>
      <div class="launchpad_buy">
        <div class="launchpad_content_chart">
          <div id="main"></div>
        </div>

        <div class="launchpad_content_input">
          <div class="buy">Buy</div>
          <div class="buy_input">
            <el-input
              placeholder="0"
              v-model="value"
              type="number"
              class="value"
            >
              <template v-slot:append>max</template>
            </el-input>
            <p>Fil: {{ balanceFormat }}</p>
          </div>
          <div class="price_info">
            <p>
              <span> Contribution</span>
              <span> <hr class="hr2" /></span>
              <span
                >{{ contribution }} {{ fairAuctionState.saleTokenSymbol }}</span
              >
            </p>
            <p>
              <span> Your share</span>
              <span> <hr class="hr2" /></span>
              <span>
                {{ allocation }} {{ fairAuctionState.projectTokenSymbol }}</span
              >
            </p>
            <p>
              <span> Pending share</span>
              <span><hr class="hr2" /></span>
              <span
                >{{ pendingReferral }}
                {{ fairAuctionState.projectTokenSymbol }}</span
              >
            </p>
          </div>
          <div class="click_buy" @click="buyToken">
            {{ buy.content }}
          </div>
          <div class="click_claim" @click="claimToken">
            {{ claim.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import * as echarts from "echarts";
import { mapGetters } from "vuex";
import { ethers, BigNumber as BN } from "ethers";
import FairAuctionJSON from "../script/contract/FairAuction.json";
import BigNumber from "bignumber.js";
import {
  getFairAuctionState,
  getFdv,
  getPrice,
  tokenFormat,
} from "../script/util";
import { type LaunchpadPriceResponse, HttpRequest } from "../script/request";
import $ from "jquery";
import { ElLoading } from "element3";
export default {
  name: "launchpadView",
  data: function () {
    return {
      fairAuctionState: {
        saleTokenSymbol: "",
        projectTokenSymbol: "",
        saleErc20Decimal: 0,
        projectErc20Decimal: 0,
        tokensToDistribute: "",
        totalAllocation: "",
        startTime: 0,
        endTime: 0,
        blockTime: 0,
        totalRaised: "",
      },
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      balance: "",
      balanceFormat: "",
      value: "",
      contribution: "0",
      allocation: "0",
      pendingReferral: "0",
      ido: "",
      projectToken: "",
      saleToken: "",
      raised: "0",
      price: 0,
      marketcap: "0",
      fdv: "0",
      status: "",
      maxPrice: "0",
      minPrice: "0",
      maxRaise: "0",
      minRaise: "0",
      maxDistribute: "0",
      startTimeFormat: "0",
      endTimeFormat: "0",
      buy: {
        content: "Buy",
      },
      claim: {
        content: "Claim",
      },
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "getAccount",
      getRpc: "getRpc",
    }),
  },
  watch: {
    "$store.state.account": function (newVal) {
      if (newVal !== null) {
        this.getAccountBalance(newVal);
        this.initButtonState();
      }
    },
  },

  async mounted() {
    this.status = <string>this.$route.query.status;
    this.initButtonState();
    console.log("this.getAccount", this.getAccount);

    this.ido = <string>this.$route.query.ido;
    if (this.$route.query.ido == undefined) {
      return;
    }

    await this.getFairAuctionState();
    if (this.getAccount != null) {
      this.getAccountBalance(<string>this.getAccount);
    }
    this.initEcharts();
    let startTime = this.fairAuctionState.startTime;
    let day = 24 * 3600;
    let hour = 3600;
    let minute = 60;
    let bTime = this.fairAuctionState.blockTime;
    if (this.fairAuctionState.blockTime < startTime) {
      let self = this;
      setInterval(function () {
        bTime = bTime + 1;
        let sub = startTime - bTime;
        if (sub < 0) {
          self.initButtonState();
          return;
        }
        if (sub >= day) {
          self.day = Math.floor(sub / day);
          sub = sub - self.day * day;
        }
        if (sub >= hour) {
          self.hour = Math.floor(sub / hour);
          sub = sub - self.hour * hour;
        }
        if (sub >= minute) {
          self.minute = Math.floor(sub / minute);
          sub = sub - self.minute * minute;
        }
        self.second = sub;
      }, 1000);
    }
    let provider = new ethers.providers.JsonRpcProvider(this.getRpc);
    let fairAuction = await new ethers.Contract(
      this.ido,
      FairAuctionJSON.abi,
      provider
    );

    this.raised = tokenFormat(
      this.fairAuctionState.saleErc20Decimal,
      await fairAuction.totalRaised()
    );
    if (
      BN.from(this.fairAuctionState.totalAllocation).eq(
        ethers.BigNumber.from(0)
      )
    ) {
      return;
    }

    this.price = Number(
      getPrice(
        this.fairAuctionState.saleErc20Decimal,
        this.fairAuctionState.projectErc20Decimal,
        BN.from(this.fairAuctionState.totalRaised),
        BN.from(this.fairAuctionState.tokensToDistribute)
      )
    );
    this.fdv = await getFdv(
      this.getRpc,
      this.projectToken,
      Number(this.price),
      this.fairAuctionState.projectErc20Decimal
    );
  },

  methods: {
    maxInput() {
      this.value = this.balance;
    },
    copyContract() {
      navigator.clipboard.writeText(this.ido);
    },
    async getAccountBalance(account: string) {
      let provider = new ethers.providers.JsonRpcProvider(this.getRpc);
      let fairAuction = await new ethers.Contract(
        this.ido,
        FairAuctionJSON.abi,
        provider
      );

      let balance = await provider.getBalance(account);
      this.balance = balance.toString();
      this.balanceFormat = new BigNumber(this.balance, 10)
        .dividedBy(
          new BigNumber(10).pow(
            new BigNumber(this.fairAuctionState.saleErc20Decimal)
          )
        )
        .toFixed(6);
      let userInfo = await fairAuction.userInfo(account);
      if (userInfo != null) {
        this.contribution = new BigNumber(userInfo[1].toString(), 10)
          .dividedBy(
            new BigNumber(10).pow(this.fairAuctionState.saleErc20Decimal)
          )
          .toFixed(6);
        if (userInfo[2]) {
          if (
            BN.from(this.fairAuctionState.totalAllocation).gt(
              ethers.BigNumber.from(0)
            )
          ) {
            this.allocation = userInfo[0]
              .mul(this.fairAuctionState.tokensToDistribute)
              .div(this.fairAuctionState.totalAllocation);
            this.allocation = new BigNumber(this.allocation.toString(), 10)
              .dividedBy(
                new BigNumber(10).pow(this.fairAuctionState.projectErc20Decimal)
              )
              .toFixed(6);
          }
        } else {
          if (
            BN.from(this.fairAuctionState.totalAllocation).gt(
              ethers.BigNumber.from(0)
            )
          ) {
            this.pendingReferral = userInfo[0]
              .mul(this.fairAuctionState.tokensToDistribute)
              .div(this.fairAuctionState.totalAllocation);
            this.pendingReferral = new BigNumber(
              this.pendingReferral.toString(),
              10
            )
              .dividedBy(
                new BigNumber(10).pow(this.fairAuctionState.projectErc20Decimal)
              )
              .toFixed(6);
          }
        }
      }
    },
    async getFairAuctionState() {
      const loading = ElLoading.service({
        text: "Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let provider = new ethers.providers.JsonRpcProvider(this.getRpc);
      let blockNumber = await provider.getBlockNumber();
      let block = await provider.getBlock(blockNumber);
      let res = await getFairAuctionState(this.getRpc, this.ido);

      if (res != null) {
        this.projectToken = res.projectToken;
        this.saleToken = res.saleToken;
        this.fairAuctionState.saleTokenSymbol = res.saleErc20Symbol;
        this.fairAuctionState.projectTokenSymbol = res.projectErc20Symbol;
        this.fairAuctionState.saleErc20Decimal = res.saleErc20Decimal;
        this.fairAuctionState.projectErc20Decimal = res.projectErc20Decimal;
        this.fairAuctionState.tokensToDistribute = res.tokensToDistribute;
        this.fairAuctionState.totalAllocation = res.totalAllocation;
        this.fairAuctionState.startTime = res.startTime;
        this.fairAuctionState.endTime = res.endTime;
        this.fairAuctionState.blockTime = block.timestamp;
        this.fairAuctionState.totalRaised = res.totalRaised;
        this.maxRaise = res.maxRaise
          .div(ethers.BigNumber.from(10).pow(res.saleErc20Decimal))
          .toString();
        this.minRaise = res.minRaise
          .div(ethers.BigNumber.from(10).pow(res.saleErc20Decimal))
          .toString();

        this.maxDistribute = res.maxDistribute
          .div(ethers.BigNumber.from(10).pow(res.projectErc20Decimal))
          .toString();

        this.startTimeFormat = new Date(res.startTime * 1000).toLocaleString();
        this.endTimeFormat = new Date(res.endTime * 1000).toLocaleString();
        this.maxPrice = getPrice(
          res.saleErc20Decimal,
          res.projectErc20Decimal,
          res.maxRaise,
          res.maxDistribute
        );
        this.minPrice = getPrice(
          res.saleErc20Decimal,
          res.projectErc20Decimal,
          res.minRaise,
          res.maxDistribute
        );
      }
      loading.close();
    },
    async buyToken() {
      if (this.getAccount === null) {
        alert("connect wallet");
        return;
      }
      if (this.status === "pending" || this.status === "ended") {
        alert("no start");
        return;
      }
      if (this.getAccount !== null && this.ido !== "") {
        let abi = new ethers.utils.AbiCoder();
        let data = abi.encode(["address"], [this.getAccount]);
        data = "0x3ac597da" + data.slice(2);
        let value = ethers.BigNumber.from(this.value);
        let provider = new ethers.providers.JsonRpcProvider(this.getRpc);

        let nonce = provider.getTransactionCount(this.getAccount);
        let gasPrice = provider.getGasPrice();
        let chainId = provider.getNetwork();
        let res = await Promise.all([nonce, gasPrice, chainId]);
        if (res.length !== 3) {
          alert("get network info failed");
          return;
        }
        let nonceHex = ethers.BigNumber.from(res[0]).toHexString();
        let gasPriceHex = ethers.BigNumber.from(res[1]).toHexString();
        let chainIdHex = ethers.BigNumber.from(res[2].chainId).toHexString();
        let gasLimit = ethers.BigNumber.from(200000 * 220).toHexString();
        const transactionParameters = {
          nonce: nonceHex,
          gasPrice: gasPriceHex,
          gas: gasLimit,
          to: this.ido,
          from: this.getAccount,
          value: value.toHexString(),
          data: data,
          chainId: chainIdHex,
        };
        const txHash = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
        console.log("txHash", txHash);
      }
    },
    async claimToken() {
      if (this.getAccount === null) {
        alert("connect wallet");
        return;
      }
      if (this.status === "pending" || this.status === "started") {
        alert("no start");
        return;
      }
      let data = "0x4e71d92d";
      let provider = new ethers.providers.JsonRpcProvider(this.getRpc);
      let nonce = await provider.getTransactionCount(this.getAccount);
      let gasPrice = await provider.getGasPrice();
      let chainId = await provider.getNetwork();
      let nonceHex = ethers.BigNumber.from(nonce).toHexString();
      let gasPriceHex = ethers.BigNumber.from(gasPrice).toHexString();
      let chainIdHex = ethers.BigNumber.from(chainId.chainId).toHexString();
      let gasLimit = ethers.BigNumber.from(200000 * 220).toHexString();
      const transactionParameters = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gas: gasLimit,
        to: this.ido,
        from: this.getAccount,
        data: data,
        chainId: chainIdHex,
      };
      const txHash = await (window as any).ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      console.log("txHash", txHash);
    },
    initButtonState() {
      if (this.getAccount == null) {
        $(".click_buy").addClass("claim2");
        $(".click_claim").addClass("claim2");
      } else {
        if (this.status === "pending") {
          $(".click_buy").addClass("claim2");
          $(".click_claim").addClass("claim2");
        } else if (this.status === "started") {
          $(".click_buy").removeClass("claim2");
          $(".click_claim").addClass("claim2");
        } else {
          $(".click_buy").addClass("claim2");
          $(".click_claim").removeClass("claim2");
        }
      }
    },
    async initEcharts() {
      let self = this;
      $(".el-input-group__append").click(function () {
        self.value = self.balance.toString();
      });
      // $('.el-input-group__append').css({
      //   cursor: 'pointer',
      //   background: '#0485c3',
      //   color: 'white',
      //   'font-family': 'var(--bs-btn-font-family)',
      //   'font-weight': '500'
      // })
      var chartDom = <HTMLElement>document.getElementById("main");
      var myChart = echarts.init(chartDom);
      var option;
      let httpRequest = new HttpRequest();
      let response = await httpRequest.getLaunchpadPrice(this.ido);

      response = <[LaunchpadPriceResponse]>response;
      let data = [[this.fairAuctionState.startTime * 1000, 0]];

      for (let i = 1; i < response.length; i++) {
        data.push([response[i].time * 1000, response[i].price]);
      }
      option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          left: "center",
          text: `${self.fairAuctionState.projectTokenSymbol} Price ( ${self.fairAuctionState.saleTokenSymbol} )`,
          textStyle: {
            color: "#bfbfbf",
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          splitLine: false,
          splitNumber: 5,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: false,
        },
        grid: {},
        series: [
          {
            name: "",
            type: "line",
            smooth: true,
            symbol: "none",
            data: data,
            areaStyle: {
              color: "#64b6de",
            },
            lineStyle: {
              color: "#0485c3",
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>
<style scoped>
@import "@/assets/css/launchpad.css";
</style>

<style >
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.el-input__inner {
  display: flex;
  border: none !important;
  flex: 5;
  background-color: #eaf0f6;
  color: black !important;
}

.el-input-group__append {
  border: none !important;
  background: #0485c3 !important;
  color: white !important;
  font-size: 1rem;
  cursor: pointer;
  justify-content: center;
  font-family: var(--bs-btn-font-family);
}
</style>