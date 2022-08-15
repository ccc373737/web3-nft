const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const mongo = require('../mongo');
const AsyncLock = require('async-lock');

const contractProvider = ethers.providers.getDefaultProvider('goerli');
const lock = new AsyncLock();

const Token = require('../../contract/artifacts/contracts/Token.sol/Token.json');
const Market = require('../../contract/artifacts/contracts/Market.sol/Market.json');
const tokenAddress = "0xC3593B70380aF1a8166342851832f3561d012A00";
const marketAddress = "0xA56a24d7707232F39339192feE1f047a0718a567";
const tokenContract = new ethers.Contract(tokenAddress, Token.abi, contractProvider);
const marketContract = new ethers.Contract(marketAddress, Market.abi, contractProvider);

const TokenStatus = {
    NORMAL: 0,
    FIXED_PRICE: 1,
    DUCTCH_AUCTION: 2,
    ENGLISH_AUCTION: 3,
    EXCHANGE_AUCTION: 4,
    EXCHANGED: 5
}

//向路由对象上挂载具体的路由
router.post('/change', (req, res) => {
    if (!req.body.tokenId) {
        res.send("PARAM ERROR")
    }
  
    console.log(req.body)
    let tokenId = req.body.tokenId.toString();

    const change = async() => { 
        await tokenContract.ownerOf(tokenId);
        console.log("I'm coming");
        let param = {
            updateDate: new Date().getTime()
        };

        let status = await marketContract.getStatus(tokenAddress, tokenId);
        let old = await mongo.queryOne(tokenAddress, tokenId);

        if (old && old.status == status && old.status != TokenStatus.ENGLISH_AUCTION) {//same status just return
            return;
        }

        if (status == TokenStatus.NORMAL) {
            param.status = TokenStatus.NORMAL;
            param.tokenAddress = tokenAddress;
            param.tokenId = tokenId;
            param.owner = await tokenContract.ownerOf(tokenId);
            param.url = await tokenContract.tokenURI(tokenId);
        } else if (status == TokenStatus.FIXED_PRICE) {
            param.status = TokenStatus.FIXED_PRICE;
        
            let detail  = await marketContract.getFixed(tokenAddress, tokenId);
            param.fixedPrice = ethers.utils.formatEther(detail[1]);
            param.endTime = detail[2].toNumber() * 1000;

        } else if (status == TokenStatus.DUCTCH_AUCTION) {
            param.status = TokenStatus.DUCTCH_AUCTION;
            let detail  = await marketContract.getDuAuction(tokenAddress, tokenId);
            param.startTime = detail.startTime.toNumber() * 1000;
            param.endTime = detail.endTime.toNumber() * 1000;
            param.startPrice = ethers.utils.formatEther(detail.startPrice);
            param.floorPrice = ethers.utils.formatEther(detail.floorPrice);

        } else if (status == TokenStatus.ENGLISH_AUCTION) {
            param.status = TokenStatus.ENGLISH_AUCTION;
            let detail  = await marketContract.getEnAuction(tokenAddress, tokenId);
            param.reservePrice = ethers.utils.formatEther(detail.reservePrice);
            param.minimumAddPrice = ethers.utils.formatEther(detail.minimumAddPrice);
            param.nowPirce = ethers.utils.formatEther(detail.nowPirce);
            param.endTime = detail.endTime.toNumber() * 1000;

        } else if (status == TokenStatus.EXCHANGE_AUCTION) {
            param.status = TokenStatus.EXCHANGE_AUCTION;
            let detail  = await marketContract.getExchange(tokenAddress, tokenId);
            param.endTime = detail.endTime.toNumber() * 1000;

        } else if (status == TokenStatus.EXCHANGED) {
            param.status = TokenStatus.EXCHANGED; 
        } 

        console.log(param);
        mongo.insertOrUpdate(tokenAddress, tokenId, param);
    }

    if (!lock.isBusy(tokenId)) {
        lock.acquire(tokenId, async() => {
            await change();
        });
    } 
   
    res.send("ok")
});

router.get('/list', (req, res) => {
    if (!req.query.pageIndex) {
        res.send("PARAM ERROR")
    }
 
    mongo.queryAll(tokenAddress, req.query.pageIndex, 20).then(result => {
        res.json(result);
    })
});

router.get('/mylist', (req, res) => {
    if (!req.query.owner) {
        res.send("PARAM ERROR")
    }

    mongo.queryMyTokens(tokenAddress, req.query.owner, req.query.status).then(result => {
        res.json(result);
    })
});

//暴露路由
module.exports = router;
