import React, { useState, useEffect, useMemo } from "react";
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
import { ethers } from "ethers";
import Token from "../../contract/artifacts/contracts/Token.sol/Token.json";
import Market from "../../contract/artifacts/contracts/Market.sol/Market.json";

//import { selectedNft, removeSelectedNft } from "../../redux/actions/nftActions";

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

  const { tokenId } = useParams();

  const [tokenData, setTokenData] = useState({
    tokenId: tokenId,
    status: TokenStatus.NORMAL,
    image: '',
    owner: '',
    description: '',
    isLogin: true,
    isOwner: false,
    isApproved: false
    //image: "https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg",
  });

  useEffect(() => {
    const init = async () => {
      let status = await MarketContract().getStatus(TOKEN_ADDRESS, tokenId);
      let owner = await TokenContract().ownerOf(tokenId);
      let url = await TokenContract().tokenURI(tokenId);
      //let url = "sss";
      let description = "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica";

      let currentAccount = await getAccount();
      let isLogin = currentAccount != null;
      let isOwner = isLogin ? currentAccount == owner : false;
      let isApproved = isLogin ? (await TokenContract().getApproved(tokenId)) == MARKET_ADDRESS : false;
      
      setTokenData({
        ...tokenData,
        status: status,
        image: url,
        owner: owner,
        description: description,
        isLogin: isLogin,
        isOwner: isOwner,
        isApproved: isApproved
      })
    }
    init();
  }, [tokenData.status, tokenData.isLogin, tokenData.isApproved]);


  let isSelling = true;

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

    if (getAccount() == null) {
      return;
    }

    if (!tokenData.isLogin) {
      setTokenData({
        ...tokenData, 
        isLogin: true,
        isOwner: (await getAccount()) == tokenData.owner,
        isApproved: (await TokenContract().getApproved(tokenId)) == MARKET_ADDRESS
      })
    }

    if (tokenData.isApproved) {
      return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, signer);

    contract.approve(MARKET_ADDRESS, tokenData.tokenId).then((resolve: any) => {
      console.log(resolve)
    }).catch((err: any)=>{
      console.log(err)
    })
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ mt: 8 }}>

        <Grid container spacing={3}>

          <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
            <img src={tokenData.image} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
          </Grid>

          <Grid item lg={7} md={6}>
            <Link to="/">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography gutterBottom variant="h4" display="block" component="div">
                  <b>Odyssey #{tokenId}</b>

                  <Button variant="contained"
                    onClick={approveClick}
                    endIcon={<SwapHorizontalCircleIcon />}
                    style={{ float: 'right', borderRadius: 10}}
                    sx={{display: (tokenData.status == TokenStatus.NORMAL && (tokenData.isOwner || !tokenData.isLogin)) ? "true" : "none"}}
                    disabled={tokenData.isApproved}
                    >
                    Approve
                  </Button>
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

              {
                (tokenData.status == TokenStatus.NORMAL && tokenData.isOwner) ? <Auction tokenId={tokenId as string} isApproved={tokenData.isApproved} /> : <AuctionDetail tokenId={tokenId as string} status={tokenData.status} />
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
