
require ('@nomiclabs/hardhat-waffle');


module.exports = {
  solidity: "0.8.10",

  defaultNetwork: "Edu",
  networks:{
    hardhat:{},
    Edu: {
      url: "https://rpc.open-campus-codex.gelato.digital/",
      chainId: 656476,
      accounts: ['a77637fc7905e02b1ec4b9e913cc895b627be58053f2fdd774911623004c3285'],
    },
  }
};
