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

import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";

//import { useStyles } from "./styles.js";

const Card = ({ 
    tokenId, name, image, price, owner, isForSale 
} : {
    tokenId:string, name:string, image:string, price:number, owner:string, isForSale:boolean
}) => {
  console.log("image: ", image);

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
            alt={name}
            height="240"
            image={image}
            title="{name}"
          />

          <CardContent>
            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
              <Typography variant={"h5"} gutterBottom>
                {name}
              </Typography>
              
              <Chip size="small" disabled={true} label="Selling"
                style={{fontSize: "0.9rem",
                height: "1.4rem",
                marginLeft: "auto",
                color: "white",
                backgroundColor: "red"}}
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
              {/* <span>{Web3.utils.fromWei(String(price), "ether")}.120000</span> */}
            </Typography>

            <Divider light />

            <Typography
              variant={"body1"}
              align={"center"}
              style={{paddingTop: "0.1rem"}}
            >
              {owner.slice(0, 7)}...{owner.slice(-4)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </MuiCard>
    </Link>
  );
};

export default Card;
