import React from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";

import { Card as MuiCard } from "@mui/material";
import Chip from "@mui/material/Chip";
import SvgIcon from "@mui/material/SvgIcon";
import Divider from "@mui/material/Divider";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import {TokenStatus} from "../../pages/Item";

import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";

const Card = ({ 
  tokenId,
  owner,
  image, 
  status,
  price,
  endTime
} : {
  tokenId: string,
  owner: string,
  image: string, 
  status: number,
  price: string,
  endTime: string
}) => {
  console.log()
  return (
    <Link to={`/nft/${tokenId}`} style={{ textDecoration: 'none' }}>
      <MuiCard style={{width: "20rem",
    borderRadius: "0.6rem",
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)"}}>
        
        <CardActionArea>
          <CardMedia
            component="img"
            alt={tokenId}
            height="240"
            image={image}
            title={tokenId}
          />

          <CardContent>
            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
              <Typography variant={"h5"} gutterBottom>
                #{tokenId}
              </Typography>
              
              <Chip size="small" disabled={true} label={TokenStatus[status]}
                style={{fontSize: "0.9rem",
                height: "1.4rem",
                marginLeft: "auto",
                color: "white",
                backgroundColor: "green"}}
              />
            </div>

            <Typography variant="h6" style={{display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding:" 0.8rem 0 0.4rem"}}>
              
                <SvgIcon
                    component={EthereumLogo}
                    viewBox="0 0 400 426.6"
                    titleAccess="ETH"
                />
              <span>{price}</span>
            </Typography>

            <Divider light />

            <Typography
              variant={"body1"}
              align={"center"}
              style={{paddingTop: "0.1rem"}}
            >
              {owner}
              end in {endTime}
            </Typography>
          </CardContent>
        </CardActionArea>
      </MuiCard>
    </Link>
  );
};

export default Card;
