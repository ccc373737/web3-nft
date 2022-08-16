<div align="center">
  
![License](https://img.shields.io/badge/license-MIT-737CA1?style=flat-square) 
![Node_Badge](https://img.shields.io/badge/node-16.16.0-green?style=flat-square)
![Npm_Badge](https://img.shields.io/badge/npm-8.11.0-yellow?style=flat-square)
![React Badge](https://img.shields.io/badge/React-18.0.0-45b8d8?style=flat-square)
![Solidity_Badge](https://img.shields.io/badge/Solidity-%5E0.8.4-363636?style=flat-square)
![Hardhat](https://img.shields.io/badge/Hardhat-2.10.2-F0E8E0?style=flat-square)
![Npm_Badge](https://img.shields.io/badge/mongodb-4.8.1-yellow?style=flat-square)

</div>

- [介绍](#about)
- [总览](#preview)
- [架构](#architecture)
- [Build](#technologies)
- [How to Use](#how-to-use)
- [TODO](#todo)

<a id='about'/>

## 介绍

去中心化NFT交易市场，在此进行自由的铸造和交易，支持多种交易模式，包括拍卖，以物换物等。

此合约部署在goerli测试链上。


<a id='preview'/>

## 总览
![img.png](images/img.png)


<a id='architecture' />

## 交易

1. 铸造
![img.png](images/mint.png)

点击Mint Your Art，选择NFT并MINT

2. 交易

![img.png](images/exchange.png)
点击卡片进入详情页，授权并选择交易模式。

- Fixed: 固定价格交易。
- DutchAuction: 荷式拍卖交易，设置起始价和地板价，根据拍卖结束时间每10分钟固定衰减一次。
- EnglishAuction: 英式拍卖交易，设置起始价和最低加价，拍卖终止后，点击成交自动和最高出价者完成交易，其余出价者金额返还。拍卖过程中卖主可以选择取消拍卖，取消后拍卖金额立即返回，非最高出价者也可以撤回金额。
- ExchangeAuction：以物换物模式(测试)，出价者可以使用NFT出价交易，卖家从交换列表中选择，完成互换。拍卖过程中出价者可以随时撤回

<a id='technologies'/>

## Build

This project was developed with the following technologies:

#### **Frontend** <sub><sup>React + TypeScript</sup></sub>
  - [React](https://pt-br.reactjs.org/)
  - [Axios](https://github.com/axios/axios)
  - [ethers.js](https://docs.ethers.io/v5/)
  - [Material UI](https://material-ui.com/pt/)

#### **Backend** <sub><sup>Express</sup></sub>
  - [Express](https://expressjs.com/pt-br/)
  - [MongoDB](https://www.mongodb.com/)
 
#### **Blockchain and Smart Contracts** <sub><sup>Solidity</sup></sub>
  - [Solidity](https://docs.soliditylang.org/)
  - [Hardhat](https://hardhat.org/)


<a id='how-to-use'/>

## How to Use

### Requirements

To run the application you'll need:
* [Git](https://git-scm.com)
* [Node](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
* [Hardhat](https://hardhat.org/)
* Clone the repository:
  * ```$ git clone https://github.com/BravoNatalie/NFT-Marketplace.git ```


Now go to project folder and run:

- contract
```bash
$ cd contract

# install the dependencies
$ yarn


# deploy de contracts on the blockchain
# add TEST_URL and PRIVATE_KEY in hardhat.config.ts
$ npx hardhat run scripts/deploy.js --network goerli
```

- frontend
```bash
$ cd frontend
$ yarn
$ yarn start
```

- backend
```bash
$ cd backend
$ npm install
# add mongodb info 
$ node index.js
```

<a id='todo'/>

## TODO

1.首页list接口
2.首页card详情
3.item详情 从链端读取
4.多次链端请求合并
5.本地跑链
6.react hook
7.发送交易后定时器刷新
8.子组件重复渲染
9.过时取消buy按钮
10.渲染两次重置输入框
11.dutchAuciton 标志每10分钟降价多少
12.setState相同的值时不会刷新useeffect
13.See more 后端接口获取
14.exchange my tokenlist 后端获取
15.dutch写错
16.其他拍卖后端接口
17.mint之后跳转
18.card price和endtime调整
19.我的token页面
20.views 和 faviie

