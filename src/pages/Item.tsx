import React, { useState, useEffect, useMemo, useCallback } from "react";
//import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { getProvider, getAccount, TokenContract, MarketContract } from "../utils/Web3Util";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import {
  Box, Container, Grid, Typography, FormControl, FormLabel,
  Radio, RadioGroup, FormControlLabel, CardContent,
  Card, Chip, Skeleton, Alert
} from '@mui/material';

import LoadingButton from "@mui/lab/LoadingButton";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Badge, { BadgeProps } from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as EthereumLogo } from "../assets/ethereum_logo.svg";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Auction from '../components/Auction';
import AuctionDetail from "../components/AuctionDetail";
import FixedDetail from "../components/FixedDetail";
import DutchAuctionDetail from "../components/DutchAuctionDetail";
import EnglishAuctionDetail from "../components/EnglishAuctionDetail";
import ExchangeAuctionDetail from "../components/ExchangeAuctionDetail";
import History from "../components/History";
import { TOKEN_ADDRESS, MARKET_ADDRESS } from "../constants/addressed";
import { ethers } from "ethers";
import Token from "../../contract/artifacts/contracts/Token.sol/Token.json";
import Market from "../../contract/artifacts/contracts/Market.sol/Market.json";
import Image from 'material-ui-image'

export enum TokenStatus {
  NORMAL,
  FIXED_PRICE,
  DUCTCH_AUCTION,
  ENGLISH_AUCTION,
  EXCHANGE_AUCTION,
  EXCHANGED,
  TRANSITION
}

export interface FixedDetailData {
  owner: string,
  price: string,
  endTime: number
}

export interface DuDetailData {
  owner: string,
  price: string,
  floorPrice: string,
  endTime: number
}

export interface EnDetailData {
  owner: string,
  price: number,
  minimumAddPrice: number,
  bidList: string[],
  bidPriceList: number[],
  highestBid: string,
  highestPrice: number,
  endTime: number
}

export interface ExDetailData {
  owner: string,
  bidList: string[],
  bidTokenList: string[],
  endTime: number
}

const Item = () => {
  const { tokenId } = useParams();

  const [status, setStatus] = useState(TokenStatus.NORMAL);
  const [fixedDetailData, setFixedDetailData] = useState<FixedDetailData>({owner:'', price:'', endTime:0});
  const [duDetailData, setDuDetailData] = useState<DuDetailData>({owner:'', price:'', floorPrice:'', endTime:0});
  const [enDetailData, setEnDetailData] = useState<EnDetailData>({owner:'', price:0, minimumAddPrice:0, bidList:[], bidPriceList:[], highestBid:'', highestPrice:0, endTime:0});
  const [exDetailData, setExDetailData] = useState<ExDetailData>({owner:'', bidList:[], bidTokenList:[], endTime:0});
  const [login, setLogin] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const [tokenData, setTokenData] = useState({
    image: '',
    owner: '',
    description: '',
    isLoad: false,
    isOwner: false,
    isApproved: false,
    sellText: '',
    //image: "https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg",
  });

  useEffect(() => {
    const init = async () => {
      console.log("init111111")
      let status = await MarketContract().getStatus(TOKEN_ADDRESS, tokenId);
      let owner = tokenData.owner
      let sellText = '';
      if (status == TokenStatus.NORMAL) {
        owner = await TokenContract().ownerOf(tokenId);
      } else if (status == TokenStatus.FIXED_PRICE) {
        let detail  = await MarketContract().getFixed(TOKEN_ADDRESS, tokenId);
        owner = detail[0];
        setFixedDetailData({owner: owner, price: ethers.utils.formatEther(detail[1]), endTime: detail[2].toNumber() * 1000});
        sellText = "Selling..."

      } else if (status == TokenStatus.DUCTCH_AUCTION) {
        let detail  = await MarketContract().getDuAuction(TOKEN_ADDRESS, tokenId);
        owner = detail.owner;
        setDuDetailData({owner: owner, price: ethers.utils.formatEther(detail.nowPrice), floorPrice: ethers.utils.formatEther(detail.floorPrice), endTime: detail.endTime.toNumber() * 1000});
        sellText = "Dutch Auction... Droped every ten minutes"

      } else if (status == TokenStatus.ENGLISH_AUCTION) {
        let detail  = await MarketContract().getEnAuction(TOKEN_ADDRESS, tokenId);
        owner = detail.owner;
        setEnDetailData({
          owner: owner, 
          price: parseFloat(ethers.utils.formatEther(detail.nowPirce)), 
          minimumAddPrice: parseFloat(ethers.utils.formatEther(detail.minimumAddPrice)), 
          bidList: detail.bidList,
          bidPriceList: detail.bidPriceList,
          highestBid: detail.highestBid,
          highestPrice: parseFloat(ethers.utils.formatEther(detail.highestPrice)), 
          endTime: detail.endTime.toNumber() * 1000});
        sellText = "English Auction..."
      } else if (status == TokenStatus.EXCHANGE_AUCTION) {
        let detail  = await MarketContract().getExchange(TOKEN_ADDRESS, tokenId);
        console.log(detail);
        owner = detail.owner;
        setExDetailData({
          owner: owner, 
          bidList: detail.bidList,
          bidTokenList: detail.bidTokenList,
          endTime: detail.endTime.toNumber() * 1000});
        sellText = "Exchange Auction...";
      } else if (status == TokenStatus.EXCHANGED) {
        sellText = "Already Exchanged...";
      }

      let url = await TokenContract().tokenURI(tokenId);
      let description = "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica";

      let currentAccount = await getAccount();
      let isLogin = currentAccount != null;
      let isOwner = isLogin ? currentAccount == owner : false;
      let isApproved = isLogin ? (await TokenContract().getApproved(tokenId)) == MARKET_ADDRESS : false;

      setStatus(status);
      setLogin(isLogin);
      setTokenData({
        ...tokenData,
        image: url,
        owner: owner,
        description: description,
        isOwner: isOwner,
        isApproved: isApproved,
        sellText: sellText,
        isLoad: true
      })
    }
    init();
  }, [login, status]);

  const logIn = async () => {
    if (!login) {
      setLogin(await getAccount() != null);
    }
  }

  const changeStatus = (status: TokenStatus) => {
    setStatus(status)
  }

  const approveClick = async () => {
    const provider = await getProvider();
    await logIn();

    let app = await TokenContract().getApproved(tokenId) == MARKET_ADDRESS;
    if (app) {
      return;
    }

    setTokenData({
      ...tokenData,
      isApproved: app
    })
    
    const signer = provider.getSigner();
    const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, signer);

    contract.approve(MARKET_ADDRESS, tokenId).then((resolve: any) => {
      setApproveLoading(true);
    }).catch((err: any) => {
      alert(err.reason.split(":")[1])
    })

    contract.on("Approval", (owner, approved, tokenId, event) => {
      console.log(event);
      setApproveLoading(false);
      changeStatus(TokenStatus.TRANSITION);
    });
  }

  const AuctionCom = () => {
    if (status == TokenStatus.NORMAL) {
      return (tokenData.isOwner ? <Auction tokenId={tokenId as string} isApproved={tokenData.isApproved} changeStatus={changeStatus}/> : <></>)
    } else if (status == TokenStatus.FIXED_PRICE) {
      return<FixedDetail tokenId={tokenId as string} detail={fixedDetailData} isOwner={tokenData.isOwner} setLogin={logIn} changeStatus={changeStatus}/>
    } else if (status == TokenStatus.DUCTCH_AUCTION) {
      return<DutchAuctionDetail tokenId={tokenId as string} detail={duDetailData} isOwner={tokenData.isOwner} setLogin={logIn} changeStatus={changeStatus}/>
    } else if (status == TokenStatus.ENGLISH_AUCTION) {
      return<EnglishAuctionDetail tokenId={tokenId as string} detail={enDetailData} isOwner={tokenData.isOwner} setLogin={logIn} changeStatus={changeStatus}/>
    } else if (status == TokenStatus.EXCHANGE_AUCTION) {
      return<ExchangeAuctionDetail tokenId={tokenId as string} detail={exDetailData} isOwner={tokenData.isOwner} setLogin={logIn} changeStatus={changeStatus}/>
    }

    return <></>
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ mt: 8 }}>

        <Grid container spacing={3}>

          <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
            {
              tokenData.isLoad ?
                <img src={tokenData.image} style={{ width: "100%", height: "100%", borderRadius: 10 }} /> :
                <Skeleton variant="rectangular" width={520} height={520} />
            }
          </Grid>

          <Grid item lg={7} md={6} sx={{ display: (tokenData.isLoad ? "true" : "none" )}}>
            <Link to="/">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography gutterBottom variant="h4" display="block" component="div">
                  <b>Odyssey #{tokenId}</b>

                  <LoadingButton variant="contained"
                    onClick={approveClick}
                    endIcon={<SwapHorizontalCircleIcon />}
                    style={{ float: 'right', borderRadius: 10 }}
                    sx={{ display: (status == TokenStatus.NORMAL && (tokenData.isOwner || !login)) ? "true" : "none" }}
                    disabled={tokenData.isApproved}
                    loading={approveLoading}
                    loadingPosition="end"
                  >
                    Approve
                  </LoadingButton>
                </Typography>

                <Typography component="div" sx={{ display: 'inline', mr: '6%', }}>
                  Owned by {tokenData.owner}
                </Typography>

                <Chip icon={<VisibilityIcon />} label="146 views" size="small" />

                <br />
                <br />

                <Typography variant="body1" color="text.secondary">
                  {tokenData.description}
                </Typography>

                <br />

                <Alert icon={false} sx={{ display: (status == TokenStatus.NORMAL ? "none" : "true" )}}>{tokenData.sellText}</Alert>

              </CardContent>

              <AuctionCom/>

            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                {/* <History tokenId={tokenId} /> */}
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </React.Fragment>


  );
};

export default Item;
