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
  Card, Chip, Skeleton
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
  EXCHANGED
}

export interface FixedDetailData {
  owner: string,
  price: string,
  endTime: number
}

const Item = () => {
  const { tokenId } = useParams();

  const [status, setStatus] = useState(TokenStatus.NORMAL);
  const [fixedDetailData, setFixedDetailData] = useState<FixedDetailData>({owner:'', price:'', endTime:0});
  const [login, setLogin] = useState(false);

  const [tokenData, setTokenData] = useState({
    image: '',
    owner: '',
    description: '',
    isLoad: false,
    isOwner: false,
    isApproved: false
    //image: "https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg",
  });

  useEffect(() => {
    const init = async () => {
      console.log("init111111")
      let status = await MarketContract().getStatus(TOKEN_ADDRESS, tokenId);
      let owner = tokenData.owner
      if (status == TokenStatus.NORMAL) {
        owner = await TokenContract().ownerOf(tokenId);
      } else if (status == TokenStatus.FIXED_PRICE) {
        let detail  = await MarketContract().getFixed(TOKEN_ADDRESS, tokenId);
        owner = detail[0];
        setFixedDetailData({owner: owner, price: ethers.utils.formatEther(detail[1]), endTime: detail[2].toNumber()});

      } else if (status == TokenStatus.DUCTCH_AUCTION) {
      } else if (status == TokenStatus.ENGLISH_AUCTION) {
      } else if (status == TokenStatus.EXCHANGED) {
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
        isLoad: true
      })
    }
    init();
  }, [login]);

  const logIn = async () => {
    if (!login) {
      setLogin(await getAccount() != null);
    }
  }

  const approveClick = async () => {
    const provider = await getProvider();
    await logIn();

    let app = await TokenContract().getApproved(tokenId) == MARKET_ADDRESS;
    setTokenData({
      ...tokenData,
      isApproved: app
    })
    
    const signer = provider.getSigner();
    const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, signer);

    contract.approve(MARKET_ADDRESS, tokenId).then((resolve: any) => {
      console.log(resolve)
    }).catch((err: any) => {
      console.log(err)
    })
  }

  const AuctionCom = () => {
    if (status == TokenStatus.NORMAL) {
      return (tokenData.isOwner ? <Auction tokenId={tokenId as string} isApproved={tokenData.isApproved} /> : <></>)
    } else if (status == TokenStatus.FIXED_PRICE) {
      return<FixedDetail tokenId={tokenId as string} detail={fixedDetailData} isOwner={tokenData.isOwner} setLogin={logIn}/>
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
