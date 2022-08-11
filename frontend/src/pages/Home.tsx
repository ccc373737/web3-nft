import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import '../style/Global.css';
import Card from "../components/Card";
import veterans from "../assets/arts/Sparse-Ahmed-Mostafa-vetarans-2.jpg";
import lionKing from "../assets/arts/suresh-pydikondala-lion.jpg";
import dreaming from "../assets/arts/phuongvp-maybe-i-m-dreaming-by-pvpgk-deggyli.jpg";
import modeling3d from "../assets/arts/alan-linssen-alanlinssen-kitbashkitrender2.jpg";
import woman from "../assets/arts/ashline-sketch-brushes-3-2.jpg";
import stones from "../assets/arts/rentao_-22-10-.jpg";
import wale from "../assets/arts/luzhan-liu-1-1500.jpg";
import comic from "../assets/arts/daniel-taylor-black-and-white-2019-2.jpg";
import galerie from "../assets/galerie.svg";
import { getList, change } from '../api/tokenApi';
import {TokenStatus} from "../pages/Item";

export interface TokenCard {
  tokenId: string,
  owner: string,
  image: string,
  status: number,
  price: string,
  endTime: string
}

export default function Home() {

  const [loading, setLoad] = useState(false);
  const [itemsList, setItemsList] = useState<TokenCard[]>();

  useEffect(() => {
    getList({ pageIndex: 1 }).then((result: any) => {
      let list = [];
      for (let token of result) {
        let detail = {
          tokenId: token.tokenId,
          owner: token.owner,
          image: token.url,
          status: token.status,
          price: token.price,
          endTime: token.endTime
        }

        switch (token.status) {
          case TokenStatus.FIXED_PRICE: 
            detail.price = token.fixedPrice;
            break;
        }

        list.push(detail);
      }

      setItemsList(list);
      setLoad(true)
    })
  }, []);

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
          <Grid item xs={6} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "space-around", padding: "0 1rem"
          }} >
            <img src={galerie} alt="galerie" style={{ width: "55%" }} />

            <Typography style={{ fontSize: "1.2rem", textAlign: "center" }}>A decentralized NFT marketplace where you can expose your art.</Typography>

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

      <section style={{ marginTop: "2rem", padding: "0 2rem" }}>

        <Typography style={{
          fontFamily: "sans-serif", fontSize: "1.8rem",
          fontWeight: "600", marginBottom: "1rem"
        }}>Latest artwork</Typography>

        <Grid
          container
          direction="row"
          justifyContent="left"
          alignItems="center"
          spacing={2}
          sx={{ display: (loading ? "true" : "none") }}
        >
          {itemsList && itemsList.map((nft) => (
            <Grid item key={nft.tokenId}>
              <Card {...nft} />
            </Grid>
          ))}
        </Grid>
      </section>
    </div>
  );
}