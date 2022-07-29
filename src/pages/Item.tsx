import React, { useState, useEffect } from "react";
//import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import getProvider from "../utils/Web3Util";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { Box, Container, Grid, Typography, FormControl, FormLabel,
         Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



//import { selectedNft, removeSelectedNft } from "../../redux/actions/nftActions";
declare let window:any;

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
  let nft = {tokenId: "12123",
  name: "ccc",
  image: "https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg",
  price: 20,
  owner: "mycccc",
  isForSale: true,
  description: "sada", 
  creator: "cccsa",
  uri: "sdsad",
  saleId: 1222,
  isSold: null};

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

  const [value, setValue] = React.useState<Date | null>(new Date())

  const Fixed = () => {
    return (
      <div>
        fixed price 

        <TextField
          id="standard-number"
          type="number"
          label={'margin="normal"'}
        />
      <LocalizationProvider dateAdapter={AdapterDateFns}>

        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="DateTimePicker"
          value={value}
          ampm={false}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
        
      
      </LocalizationProvider>
    
      </div>
    )
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{mt:10, bgcolor: '#cfe8fc'}}>
        
        <Grid container spacing={3}>

          <Grid item lg={5} md={6} sx={{alignItems: 'center',display: 'flex'}}>
            <img src={image} style={{width: "100%",height: "100%", borderRadius: 10}}/>

          </Grid>

          <Grid item lg={7} md={6} >
            <Link to="/">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>

            <Typography variant="h6" gutterBottom component="div">
              h6. Heading
            </Typography>

            <Button variant="contained" disabled endIcon={<SwapHorizontalCircleIcon />}>
              Approve
            </Button>

            <Typography variant="h6" gutterBottom component="div">
              Sell Model
            </Typography>

            <FormControl>
              <RadioGroup
                defaultValue="fixed"
                name="radio-buttons-group"
              >
                <FormControlLabel value="fixed" control={<Radio />} label={<Fixed/>} />
                <FormControlLabel value="dutch" control={<Radio />} label="DutchAuction" />
                <FormControlLabel value="english" control={<Radio />} label="EnglishAuction" />
                <FormControlLabel value="exchange" control={<Radio />} label="ExchangeAuction" />
              </RadioGroup>
            </FormControl>

          </Grid>

        </Grid>
      </Container>



    </React.Fragment>
    
    
  );
};

export default Item;
