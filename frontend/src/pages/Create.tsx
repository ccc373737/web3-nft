import BuildIcon from '@mui/icons-material/Build';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Grid, Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import Image from 'mui-image';
import { useState } from "react";
import { Link } from "react-router-dom";
import { TOKEN_LIST } from "../constants/newtoken";
import { getProvider, getAccount, TokenContract, MarketContract } from "../utils/Web3Util";
import { TOKEN_ADDRESS, MARKET_ADDRESS } from "../constants/addressed";
import Token from "../contracts/Token.sol/Token.json";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { getList, change } from '../api/tokenApi';

const CreateNFT = () => {
  const [image, setImage] = useState(TOKEN_LIST[Math.floor(Math.random() * 12)]);
  const [mintLoading, setMintLoading] = useState(false);
  const navigate = useNavigate();

  const refreshClick = async () => {
    const res = await getList({ pageIndex: 1 });
    console.log(res);
    setImage(TOKEN_LIST[Math.floor(Math.random() * 22)]);
  }

  const mintClick = async () => {
    const provider = await getProvider();

    const signer = provider.getSigner();
    const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, signer);

    contract.safeMint(signer.getAddress(), image.url).then((resolve: any) => {
      setMintLoading(true);
    }).catch((err: any) => {
      alert(err.reason.split(":")[1])
    })

    contract.on("Transfer", (from, to, tokenId, event) => {
      console.log(tokenId);
      change(tokenId.toNumber())
      setMintLoading(false);
    });
  }

  return (
    <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>

        <h1>Create collectible</h1>

        <Link to="/" style={{ marginLeft: "auto", marginRight: "1.5rem" }}>
          <CancelOutlinedIcon fontSize="large" />
        </Link>

      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Stack>
          <Image src={image.url} style={{ width: "50%", borderRadius: 10 }} />

          <br />

          <Grid container>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="text.secondary">
                {image.desc}
              </Typography>
            </Grid>
            <Grid item xs={3}>
            </Grid>
          </Grid>

          <br />
          <Grid container>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="secondary" sx={{ borderRadius: 2, ml: '20px' }} style={{ width: 220, height: 40 }}
                startIcon={<RefreshIcon />} onClick={refreshClick}>
                Refresh
              </Button>
            </Grid>
            <Grid item xs={3}>
              <LoadingButton variant="contained" color="primary" sx={{ borderRadius: 2 }} style={{ width: 220, height: 40 }}
                startIcon={<BuildIcon />} onClick={mintClick} loading={mintLoading} loadingPosition="start">
                Mint
              </LoadingButton>
            </Grid>
            <Grid item xs={3}>
            </Grid>
          </Grid>

          <br />
          <br />
        </Stack>
      </div>
    </div>
  );
};

export default CreateNFT;
