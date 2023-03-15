export default [
  {
    name: "Calibration testnet",
    chainId: 314159,
    rpc: 'https://api.calibration.node.glif.io/rpc/v1',
    explore: "https://calibration.filfox.info/zh",
    symbol:"TFIL"
  },
  {
    name: 'Hyperspace testnet',
    chainId: 3141,
    rpc: 'https://filecoin-hyperspace-testnet.rpc.thirdweb.com',
    explore: "https://hyperspace.filfox.info/zh",
    symbol:"TFIL"
  },
  {
    name: "mainnet",
    chainId: 1,
    explore: "https://filfox.info/zh",
    rpc: 'https://filecoin-hyperspace-testnet.rpc.thirdweb.com',
    symbol:"FIL"
  },
  {
    name: 'localnet',
    chainId: 1,
    rpc: 'http://localhost:8545'
  }
]
