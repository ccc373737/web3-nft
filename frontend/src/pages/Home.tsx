import { Button, Grid, Stack, Pagination, Divider } from '@mui/material';
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getList, getMylist } from '../api/tokenApi';
import modeling3d from "../assets/arts/alan-linssen-alanlinssen-kitbashkitrender2.jpg";
import woman from "../assets/arts/ashline-sketch-brushes-3-2.jpg";
import comic from "../assets/arts/daniel-taylor-black-and-white-2019-2.jpg";
import wale from "../assets/arts/luzhan-liu-1-1500.jpg";
import dreaming from "../assets/arts/phuongvp-maybe-i-m-dreaming-by-pvpgk-deggyli.jpg";
import stones from "../assets/arts/rentao_-22-10-.jpg";
import veterans from "../assets/arts/Sparse-Ahmed-Mostafa-vetarans-2.jpg";
import lionKing from "../assets/arts/suresh-pydikondala-lion.jpg";
import galerie from "../assets/galerie.svg";
import Card from "../components/Card";
import { TokenStatus } from "../pages/Item";
import '../style/Global.css';
import { getProvider, getAccount, TokenContract, MarketContract } from "../utils/Web3Util";


export interface TokenCard {
  tokenId: string,
  owner: string,
  image: string,
  status: number,
  price: string,
  endTime: string
}

export default function Home() {
  const { address } = useParams();
  const [loading, setLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsList, setItemsList] = useState<TokenCard[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const init = address == null ? getList({ pageIndex: pageIndex }): getMylist({ owner: address })
    
    init.then((result: any) => {
      let list = [];
      for (let token of result) {
        let detail = {
          tokenId: token.tokenId,
          owner: token.owner,
          image: token.url,
          status: token.status,
          price: '',
          endTime: ''
        }

        if (token.endTime && new Date().getTime() < token.endTime) {
          switch (token.status) {
            case TokenStatus.FIXED_PRICE: 
              detail.price = (token.fixedPrice + "0000").slice(0, 4);
              detail.endTime = new Date(token.endTime).toLocaleString();
              break;
            case TokenStatus.DUCTCH_AUCTION:
              let start = token.startPrice;
              let end = token.floorPrice;
              let interval = 10 * 60 * 1000;
  
              let rate = (start - end) / (token.endTime - token.startTime) * interval;
              let step = Math.floor((new Date().getTime() - token.startTime) / interval);
              let nowPrice = start - (step * rate);
  
              detail.price = nowPrice.toString().slice(0, 4);
              detail.endTime = new Date(token.endTime).toLocaleString();
              break;
            case TokenStatus.ENGLISH_AUCTION:
              detail.price = (token.nowPirce + "0000").slice(0, 4);
              detail.endTime = new Date(token.endTime).toLocaleString();
              break;
            case TokenStatus.EXCHANGE_AUCTION:
              detail.endTime = new Date(token.endTime).toLocaleString();
              break;
          }
        }
        

        list.push(detail);
      }

      setItemsList(list);
      setLoad(true)
    })
  }, [address, pageIndex]);

  const myntfPage = async () => {
    const provider = await getProvider();
    const acc = await getAccount();

    if (acc != null) {
      navigate('/mynft/' + acc);
    }
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageIndex(value);
  };

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

          <Grid item xs={6} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "space-around", padding: "0 1rem"
          }} >
            <img src={galerie} alt="galerie" style={{ width: "55%" }} />

            <Typography style={{ fontSize: "1.2rem", textAlign: "center" }}>A decentralized NFT marketplace where you can expose your art.</Typography>

            <Stack spacing={2} direction="row">
              <Button variant="contained" color="primary" onClick={myntfPage}
                disableElevation className="main-button">
                My NFT
              </Button>

              <Button variant="contained" color="primary" href="/create-nft"
                disableElevation className="main-button">
                Mint your art
              </Button>
            </Stack>


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

      <section style={{ marginTop: "2rem", padding: "0 2rem", justifyContent: "center" }}>

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

        <br/>
        <Divider light />
        <br/>

        <Stack spacing={2}>
          <Pagination count={totalPage} color="primary" size="large" onChange={handlePageChange}
          sx={{ justifyContent: 'center', display: 'flex' }}/>
        </Stack>

        <br/>
        <br/>
      </section>
    </div>
  );
}