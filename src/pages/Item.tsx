import React, { useState, useEffect } from "react";
//import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { getProvider, TokenContract, MarketContract } from "../utils/Web3Util";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import {
  Box, Container, Grid, Typography, FormControl, FormLabel,
  Radio, RadioGroup, FormControlLabel, CardContent,
  Card, Chip
} from '@mui/material';
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
import History from "../components/History";
import { TOKEN_ADDRESS, MARKET_ADDRESS } from "../constants/addressed";
import Token from "../../contract/artifacts/contracts/Token.sol/Token.json"
import Market from "../../contract/artifacts/contracts/Market.sol/Market.json"
import { ethers } from "ethers";

//import { selectedNft, removeSelectedNft } from "../../redux/actions/nftActions";
declare let window: any;

export enum TokenStatus {
  NORMAL,
  FIXED_PRICE,
  DUCTCH_AUCTION,
  ENGLISH_AUCTION,
  EXCHANGE_AUCTION,
  EXCHANGED
}

const Item = () => {
  //const classes = useStyles();

  //   const { nftId } = useParams();
  //   const marketplaceContract = useSelector(
  //     (state) => state.allNft.marketplaceContract
  //   );
  //   const account = useSelector((state) => state.allNft.account);
  //   let nft = useSelector((state) => state.nft);
  //   let nftItem = useSelector((state) =>
  //     state.allNft.nft.filter((nft) => nft.tokenId === nftId)
  //   );
  let account = "sdadad";
  let nft = {
    tokenId: "0",
    name: "ccc",
    image: "https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg",
    price: 20,
    owner: "mycccc",
    isForSale: true,
    description: "sada",
    creator: "cccsa",
    uri: "sdsad",
    saleId: 1222,
    isSold: null
  };

  const {
    image,
    name,
    price,
    owner,
    creator,
    description,
    tokenId,
    saleId,
    isForSale,
    isSold,
  } = nft;

  useEffect(() => {
    const init = async () => {
      const state = await MarketContract().getStatus(TOKEN_ADDRESS, tokenId);
      console.log(state);
    }

    init();
  })

  


  let isSelling = true;
  let status = TokenStatus.EXCHANGE_AUCTION;

  //const dispatch = useDispatch();

  //   useEffect(() => {
  //     if (nftId && nftId !== "" && nftItem) dispatch(selectedNft(nftItem[0]));
  //     return () => {
  //       dispatch(removeSelectedNft());
  //     };
  //   }, [nftId]);


  async function putForSale(id: string, price: number) {
    // try {
    //   // const itemIdex = getItemIndexBuyTokenId(id);

    //   // const marketAddress = ArtMarketplace.networks[1337].address;
    //   // await artTokenContract.methods.approve(marketAddress, items[itemIdex].tokenId).send({from: accounts[0]});

    //   const receipt = await marketplaceContract.methods
    //     .putItemForSale(id, price)
    //     .send({ gas: 210000, from: account });
    //   console.log(receipt);
    // } catch (error) {
    //   console.error("Error, puting for sale: ", error);
    //   alert("Error while puting for sale!");
    // }
  }

  async function buy(saleId: number, price: number) {
    const provider = await getProvider();
    provider.getBlockNumber().then((result) => {
      console.log(result)
    })
    // try {
    //   const receipt = await marketplaceContract.methods
    //     .buyItem(saleId)
    //     .send({ gas: 210000, value: price, from: account });
    //   console.log(receipt);
    //   const id = receipt.events.itemSold.id; ///saleId
    // } catch (error) {
    //   console.error("Error, buying: ", error);
    //   alert("Error while buying!");
    // }
  }

  const approveClick = async () => {
    const provider = await getProvider();
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ mt: 8 }}>

        <Grid container spacing={3}>

          <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
            <img src={image} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
          </Grid>

          <Grid item lg={7} md={6}>
            <Link to="/">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography gutterBottom variant="h4" display="block" component="div">
                  <b>Zomby #7373</b>

                  <Button variant="contained" onClick={approveClick} endIcon={<SwapHorizontalCircleIcon />} style={{ float: 'right', borderRadius: 10 }}>
                    Approve
                  </Button>
                </Typography>

                <Typography component="div" sx={{ display: 'inline', mr: '6%', }}>
                  Owned by CCSs2c11
                </Typography>

                <Chip icon={<VisibilityIcon />} label="146 views" size="small" />

                <br />
                <br />

                <Typography variant="body1" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000
                  species, ranging across all continents except Antarctica
                </Typography>

                <br />
              </CardContent>

              {
                isSelling ? <AuctionDetail tokenId={tokenId} status={status} /> : <Auction tokenId={tokenId} />
              }


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
