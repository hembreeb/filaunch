import { ethers } from "ethers";
import FairAuctionJSON from "./contract/FairAuction.json";
import ERC20JSON from "./contract/ERC20.json";
import BigNumber from "bignumber.js";
import { BigNumber as BN } from "ethers";
async function getFairAuctionState(rpc: string, fairAuctionAddress: string) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const fairAuction = await new ethers.Contract(
    fairAuctionAddress,
    FairAuctionJSON.abi,
    provider
  );
  const saleToken = fairAuction.SALE_TOKEN();
  const projectToken = fairAuction.PROJECT_TOKEN();
  const reqArr0 = [saleToken, projectToken];
  const res = await Promise.all(reqArr0);
  if (res.length === reqArr0.length) {
    if (res[0] !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
      const saleErc20 = await new ethers.Contract(
        res[0],
        ERC20JSON.abi,
        provider
      );
      const projectErc20 = await new ethers.Contract(
        res[1],
        ERC20JSON.abi,
        provider
      );

      const saleErc20Decimal = saleErc20.decimals();
      const saleErc20Symbol = saleErc20.symbol();
      const projectErc20Decimal = projectErc20.decimals();
      const projectErc20Symbol = projectErc20.symbol();
      const tokensToDistribute = fairAuction.tokensToDistribute();
      const totalAllocation = fairAuction.totalAllocation();
      const startTime = fairAuction.START_TIME();
      const endTime = fairAuction.END_TIME();
      const maxRaise = fairAuction.MAX_RAISE_AMOUNT();
      const maxDistribute = fairAuction.MAX_PROJECT_TOKENS_TO_DISTRIBUTE();
      const minRaise = fairAuction.MIN_TOTAL_RAISED_FOR_MAX_PROJECT_TOKEN();
      const reqArr1 = [
        saleErc20Decimal,
        saleErc20Symbol,
        projectErc20Decimal,
        projectErc20Symbol,
        tokensToDistribute,
        totalAllocation,
        startTime,
        endTime,
        maxRaise,
        maxDistribute,
        minRaise,
      ];
      const res2 = await Promise.all(reqArr1);
      if (res2.length === reqArr1.length) {
        return {
          saleToken: res[0],
          projectToken: res[1],
          saleErc20Decimal: res2[0],
          saleErc20Symbol: res2[1],
          projectErc20Decimal: res2[2],
          projectErc20Symbol: res2[3],
          tokensToDistribute: res2[4],
          totalAllocation: res2[5],
          startTime: res2[6].toNumber(),
          endTime: res2[7].toNumber(),
          maxRaise: res2[8],
          maxDistribute: res2[9],
          minRaise: res2[10],
        };
      }
    } else {
      const projectErc20 = await new ethers.Contract(
        res[1],
        ERC20JSON.abi,
        provider
      );

      const projectErc20Decimal = projectErc20.decimals();
      const projectErc20Symbol = projectErc20.symbol();
      const tokensToDistribute = fairAuction.tokensToDistribute();
      const totalAllocation = fairAuction.totalAllocation();
      const startTime = fairAuction.START_TIME();
      const endTime = fairAuction.END_TIME();
      const maxRaise = fairAuction.MAX_RAISE_AMOUNT();
      const maxDistribute = fairAuction.MAX_PROJECT_TOKENS_TO_DISTRIBUTE();
      const totalRaised = fairAuction.totalRaised();
      const minRaise = fairAuction.MIN_TOTAL_RAISED_FOR_MAX_PROJECT_TOKEN();
      const reqArr2 = [
        projectErc20Decimal,
        projectErc20Symbol,
        tokensToDistribute,
        totalAllocation,
        startTime,
        endTime,
        maxRaise,
        maxDistribute,
        totalRaised,
        minRaise,
      ];
      const res2 = await Promise.all(reqArr2);
      if (res2.length === reqArr2.length) {
        return {
          saleToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          projectToken: res[1],
          saleErc20Decimal: 18,
          saleErc20Symbol: "Fil",
          projectErc20Decimal: res2[0],
          projectErc20Symbol: res2[1],
          tokensToDistribute: res2[2],
          totalAllocation: res2[3],
          startTime: res2[4].toNumber(),
          endTime: res2[5].toNumber(),
          maxRaise: res2[6],
          maxDistribute: res2[7],
          totalRaised: res2[8],
          minRaise: res2[9],
        };
      }
    }
  }
  return null;
}

function getPrice(
  saleTokenDecimal: number,
  projectTokenDecimal: number,
  saleTokenAmount: BN,
  projectTokenAmount: BN
) {
  const decimals0 = new BigNumber(10).pow(saleTokenDecimal);
  const decimals1 = new BigNumber(10).pow(projectTokenDecimal);
  const saleTokenAmountFloat = new BigNumber(
    saleTokenAmount.toString(),
    10
  ).dividedBy(decimals0);
  const projectTokenAmountNumFloat = new BigNumber(
    projectTokenAmount.toString(),
    10
  ).dividedBy(decimals1);

  const price = saleTokenAmountFloat
    .dividedBy(projectTokenAmountNumFloat)
    .toFixed(6);
  return price;
}

async function getFdv(
  rpc: string,
  erc20Address: string,
  price: number,
  projectTokenDecimal: number
) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const erc20 = await new ethers.Contract(
    erc20Address,
    ERC20JSON.abi,
    provider
  );
  const res = await erc20.totalSupply();
  const decimals = new BigNumber(10).pow(projectTokenDecimal);
  const fdv = new BigNumber(res.toString(), 10)
    .dividedBy(decimals)
    .multipliedBy(price)
    .toFixed(6);
  return fdv;
}

function tokenFormat(saleTokenDecmal: number, saleTokenAmount: BN) {
  const decimals = new BigNumber(10).pow(saleTokenDecmal);
  const saleTokenAmountFloat = new BigNumber(saleTokenAmount.toString(), 10)
    .dividedBy(decimals)
    .toFixed(6);
  return saleTokenAmountFloat;
}

export { getFairAuctionState, getFdv, getPrice, tokenFormat };
