import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import '../style/Global.css';


//import getWeb3 from "../../utils/getWeb3";
//import { api } from "../../services/api";

//import ArtMarketplace from "../../contracts/ArtMarketplace.json";
//import ArtToken from "../../contracts/ArtToken.json";

// import {
//   setNft,
//   setAccount,
//   setTokenContract,
//   setMarketContract,
// } from "../../redux/actions/nftActions";
// import Card from "../../components/Card";

// import { useStyles } from "./styles.js";

import veterans from "../assets/arts/Sparse-Ahmed-Mostafa-vetarans-2.jpg";
import lionKing from "../assets/arts/suresh-pydikondala-lion.jpg";
import dreaming from "../assets/arts/phuongvp-maybe-i-m-dreaming-by-pvpgk-deggyli.jpg";
import modeling3d from "../assets/arts/alan-linssen-alanlinssen-kitbashkitrender2.jpg";
import woman from "../assets/arts/ashline-sketch-brushes-3-2.jpg";
import stones from "../assets/arts/rentao_-22-10-.jpg";
import wale from "../assets/arts/luzhan-liu-1-1500.jpg";
import comic from "../assets/arts/daniel-taylor-black-and-white-2019-2.jpg";
import galerie from "../assets/galerie.svg";


export default function Home() {
//   const classes = useStyles();
//   const nft = useSelector((state) => state.allNft.nft);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     let itemsList = [];
//     const init = async () => {
//       try {
//         const web3 = await getWeb3();
//         const accounts = await web3.eth.getAccounts();

//         if (typeof accounts === undefined) {
//           alert("Please login with Metamask!");
//           console.log("login to metamask");
//         }

//         const networkId = await web3.eth.net.getId();
//         try {
//           const artTokenContract = new web3.eth.Contract(
//             ArtToken.abi,
//             ArtToken.networks[networkId].address
//           );
//           // console.log("Contract: ", artTokenContract);
//           const marketplaceContract = new web3.eth.Contract(
//             ArtMarketplace.abi,
//             ArtMarketplace.networks[networkId].address
//           );
//           const totalSupply = await artTokenContract.methods
//             .totalSupply()
//             .call();
//           const totalItemsForSale = await marketplaceContract.methods
//             .totalItemsForSale()
//             .call();

//           for (var tokenId = 1; tokenId <= totalSupply; tokenId++) {
//             let item = await artTokenContract.methods.Items(tokenId).call();
//             let owner = await artTokenContract.methods.ownerOf(tokenId).call();

//             const response = await api
//               .get(`/tokens/${tokenId}`)
//               .catch((err) => {
//                 console.log("Err: ", err);
//               });
//             console.log("response: ", response);

//             itemsList.push({
//               name: response.data.name,
//               description: response.data.description,
//               image: response.data.image,
//               tokenId: item.id,
//               creator: item.creator,
//               owner: owner,
//               uri: item.uri,
//               isForSale: false,
//               saleId: null,
//               price: 0,
//               isSold: null,
//             });
//           }
//           if (totalItemsForSale > 0) {
//             for (var saleId = 0; saleId < totalItemsForSale; saleId++) {
//               let item = await marketplaceContract.methods
//                 .itemsForSale(saleId)
//                 .call();
//               let active = await marketplaceContract.methods
//                 .activeItems(item.tokenId)
//                 .call();

//               let itemListIndex = itemsList.findIndex(
//                 (i) => i.tokenId === item.tokenId
//               );

//               itemsList[itemListIndex] = {
//                 ...itemsList[itemListIndex],
//                 isForSale: active,
//                 saleId: item.id,
//                 price: item.price,
//                 isSold: item.isSold,
//               };
//             }
//           }

//           dispatch(setAccount(accounts[0]));
//           dispatch(setTokenContract(artTokenContract));
//           dispatch(setMarketContract(marketplaceContract));
//           dispatch(setNft(itemsList));
//         } catch (error) {
//           console.error("Error", error);
//           alert(
//             "Contracts not deployed to the current network " +
//               networkId.toString()
//           );
//         }
//       } catch (error) {
//         alert(
//           `Failed to load web3, accounts, or contract. Check console for details.` +
//             error
//         );
//         console.error(error);
//       }
//     };
//     init();
//   }, [dispatch]);

//   console.log("Nft :", nft);

//   const nftItem = useSelector((state) => state.allNft.nft);

  return (
    <div>
      <section>
        <Grid container spacing={0} xs={12}>
          <Grid item xs={3}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <img src={dreaming} alt="dreaming" className="images" />
              </Grid>
              <Grid item xs={4}>
                <img src={veterans} alt="veterans" className="images" />
              </Grid>
              <Grid item xs={7}>
                <img src={modeling3d} alt="modeling3d" className="images" />
              </Grid>
              <Grid item xs={5}>
                <img src={lionKing} alt="lionKing" className="images" />
              </Grid>
            </Grid>
          </Grid>
          
          {/* <Grid item xs={6} className="main" > */}
          <Grid item xs={6} style={{display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "space-around", padding: "0 1rem"}} >
            <img src={galerie} alt="galerie" style={{width: "55%"}}/>

            <Typography style={{fontSize: "1.2rem", textAlign: "center"}}>A decentralized NFT marketplace where you can expose your art.</Typography>

            <Button variant="contained" color="primary" href="/create-nft"
            disableElevation className="main-button">
                Mint your art
            </Button>
            
          </Grid>

          <Grid item xs={3}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <img src={stones} alt="dreaming" className="images" />
              </Grid>
              <Grid item xs={4}>
                <img src={woman} alt="veterans" className="images" />
              </Grid>
              <Grid item xs={7}>
                <img src={wale} alt="modeling3d" className="images" />
              </Grid>
              <Grid item xs={5}>
                <img src={comic} alt="lionKing" className="images" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </section>
      
      <section style={{ marginTop: "2rem", padding: "0 2rem"}}>
        <Typography style={{fontFamily: "sans-serif", fontSize: "1.8rem", 
        fontWeight: "600", marginBottom: "1rem"}}>Latest artwork</Typography>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {/* {nftItem.map((nft) => (
            <Grid item key={nft.tokenId}>
              <Card {...nft} />
            </Grid>
          ))} */}
        </Grid>
      </section>
    </div>
  );
}