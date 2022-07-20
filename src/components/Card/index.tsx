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

const Card = ({ tokenId, name, image, price, owner, isForSale }) => {
  const classes = useStyles();
  console.log("image: ", image);
  return (
    <Link to={`/nft/${tokenId}`}>
      <MuiCard className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt={name}
            height="240"
            image={image}
            title={name}
          />
          <CardContent className={classes.content}>
            <div className={classes.title}>
              <Typography
                className={"MuiTypography--heading"}
                variant={"h5"}
                gutterBottom
              >
                {name}
              </Typography>
              <Chip 
                size="small"
                disabled={true}
                label="Selling"
                className={classes.badge}
              />
            </div>
            <Typography variant="h6" className={classes.price}>
              <SvgIcon
                component={EthereumLogo}
                viewBox="0 0 400 426.6"
                titleAccess="ETH"
              />
              <span>{Web3.utils.fromWei(String(price), "ether")}.120000</span>
            </Typography>
            <Divider className={classes.divider} light />
            <Typography
              variant={"body1"}
              align={"center"}
              className={classes.seller}
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
