import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NoiseAwareSharpIcon from '@mui/icons-material/NoiseAwareSharp';
import SellIcon from '@mui/icons-material/Sell';
import LoadingButton from "@mui/lab/LoadingButton";
import { Dialog, DialogContent, Grid, InputAdornment, List, ListItemText, Stack, TextField, Typography } from '@mui/material';
import SvgIcon from "@mui/material/SvgIcon";
import { ethers } from "ethers";
import NP from 'number-precision';
import React, { useEffect, useState } from "react";
import Market from "../../contracts/Market.sol/Market.json";
import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";
import { MARKET_ADDRESS, TOKEN_ADDRESS } from "../../constants/addressed";
import { EnDetailData, TokenStatus } from "../../pages/Item";
import { getAccount, getProvider } from "../../utils/Web3Util";
import CountdownTimer from '../CountTimer';
import { change } from '../../api/tokenApi';


const EnglishAuctionDetail = (
    { tokenId, detail, isOwner, setLogin, changeStatus }:
    { tokenId: string, detail: EnDetailData, isOwner: boolean, setLogin: () => void, changeStatus: (status: TokenStatus) => void }) => {

    const [placeLoading, setPlaceLoading] = useState(false);
    const [withDrawLoading, setWithDrawLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [endLoading, setEndLoading] = useState(false);
    const [withDrawText, setWithDrawText] = useState("Your Last Bid: 0 ETH");
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        const init = async () => {
            let price = await getCurrentAccBid();
            setWithDrawText("Your Last Bid: " + price + " ETH")
        }

        init();
    }, []);

    const sellAllClick = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const getCurrentAccBid = async (): Promise<number> => {
        let acc = await getAccount();
        let price = 0;

        if (acc == null) {
            return price;
        }

        for (let i = 0; i < detail.bidList.length; i++) {
            if (acc == detail.bidList[i]) {
                price = parseFloat(ethers.utils.formatEther(detail.bidPriceList[i]))
                break;
            }
        }
        return price;
    }

    const auctionCancel = async () => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.enAuctionRevoke(TOKEN_ADDRESS, tokenId).then((resolve: any) => {
            setCancelLoading(true)
        }).catch((err: any) => {
            alert(err.reason.split(":")[1])
        })

        contract.on("EnglishAuctionRevoke", (nftAddr, seller, tokenId, event) => {
            console.log(event);
            change(tokenId.toNumber());
            changeStatus(TokenStatus.NORMAL);
        });
    }

    const auctionBuy = async (event: any) => {
        event.preventDefault();
        const provider = await getProvider();
        await setLogin();

        if (event.target.price.value < NP.plus(detail.price, detail.minimumAddPrice)) {
            alert("Bid must greater than minimum price!");
            return;
        }

        let price = await getCurrentAccBid();
        price = NP.minus(parseFloat(event.target.price.value), price);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.enAuctionBid(TOKEN_ADDRESS, tokenId, { value: ethers.utils.parseEther(price.toString()) }).then((resolve: any) => {
            setPlaceLoading(true)
        }).catch((err: any) => {
            console.log(err)
            alert(err.reason.split(":")[1])
        })

        contract.on("EnglishAuctionBid", (nftAddr, bider, tokenId, nowPrice, event) => {
            console.log(event);
            change(tokenId.toNumber());
            changeStatus(TokenStatus.TRANSITION);
        });
    }

    const withdraw = async () => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.enAuctionWithdraw(TOKEN_ADDRESS, tokenId).then((resolve: any) => {
            setWithDrawLoading(true)
        }).catch((err: any) => {
            console.log(err)
            alert(err.reason.split(":")[1])
        })

        contract.on("EnglishAuctionWithdraw", (nftAddr, bider, tokenId, balance, event) => {
            console.log(event);
            change(tokenId.toNumber());
            changeStatus(TokenStatus.NORMAL);
        });
    }

    const auctionEnd = async () => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.enAuctionEnd(TOKEN_ADDRESS, tokenId).then((resolve: any) => {
            setEndLoading(true)
        }).catch((err: any) => {
            console.log(err)
            alert(err.reason.split(":")[1])
        })

        contract.on("EnglishAuctionEnd", (nftAddr, buyer, tokenId, price, event) => {
            console.log(event);
            change(tokenId.toNumber());
            changeStatus(TokenStatus.TRANSITION);
        });
    }

    const ButtonGroup = () => {
        if (new Date().getTime() > detail.endTime) {
            return (<React.Fragment>
                <Grid item lg={4} md={4}>
                    <LoadingButton variant="contained" color="primary" onClick={auctionEnd}
                        startIcon={<CheckCircleOutlineIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}
                        loading={endLoading}
                        loadingPosition="start">
                        Finish
                    </LoadingButton>
                </Grid>
            </React.Fragment>);
        } else if (isOwner) {
            return  (<React.Fragment>
                <Grid item lg={4} md={4}>
                    <LoadingButton variant="contained" color="primary" onClick={auctionCancel}
                        startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}
                        loading={cancelLoading}
                        loadingPosition="start">
                        Cancel
                    </LoadingButton>
                </Grid>
            </React.Fragment>)
        } else {
            return  (<React.Fragment>
                <Grid item lg={4} md={4} >

                    <TextField
                        required
                        label="Price"
                        name="price"
                        type="number"
                        defaultValue={NP.plus(detail.price, detail.minimumAddPrice)}
                        inputProps={{
                            step: 0.01,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SvgIcon
                                        component={EthereumLogo}
                                        viewBox="0 0 400 426.6"
                                        titleAccess="ETH"
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>


                <Grid item lg={4} md={4}>
                    <LoadingButton variant="contained" type="submit" color="primary"
                        startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}
                        loading={placeLoading}
                        loadingPosition="start">
                        Place a bid
                    </LoadingButton>
                </Grid>

                <Grid item lg={3} md={3}>
                    <Stack>
                        <Typography variant="subtitle2" fontSize={12}>
                            {withDrawText}
                        </Typography>

                        <LoadingButton variant="contained" color="error" onClick={withdraw}
                            startIcon={<NoiseAwareSharpIcon />} style={{ width: 150, height: 32 }} sx={{ borderRadius: 2 }}
                            loading={withDrawLoading}
                            loadingPosition="start">
                            Withdraw
                        </LoadingButton>

                    </Stack>
                </Grid>
            </React.Fragment>);
        }
    }

    return (
        <React.Fragment>
            <form onSubmit={auctionBuy}>
                <Grid container spacing={2} sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'flex-start' }}>
                        <Stack>
                            <Typography variant="subtitle1" noWrap>
                                CURRENT PRICE
                            </Typography>
                            <Typography variant="h4" noWrap>
                                <SvgIcon
                                    component={EthereumLogo}
                                    viewBox="0 0 400 426.6"
                                    titleAccess="ETH"
                                /><span>{detail.price}</span>
                            </Typography>
                            <Typography variant="caption" noWrap>
                                Minimum bid: {NP.plus(detail.price, detail.minimumAddPrice)}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center' }}>
                        <Stack alignItems="flex-start">
                            <Typography variant="subtitle1" >
                                AUCTION ENDS IN
                            </Typography>
                            <Typography variant="h4" sx={{ mb: '20px' }}>
                                <CountdownTimer targetDate={detail.endTime} />
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item lg={12} md={12} sx={{ alignItems: 'center', display: (detail.highestPrice == 0 ? 'none' : 'flex') }}>
                        <Typography variant="body2" sx={{ display: 'inline' }}>
                            LAST BID BY {detail.highestBid}
                        </Typography>

                        <Typography variant="body2" onClick={sellAllClick} color="blue" sx={{ ml: '5%' }}>
                            See more
                        </Typography>
                    </Grid>

                    <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                        <DialogContent>
                            <List >
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                            </List>
                        </DialogContent>
                    </Dialog>

                    <ButtonGroup/>

                </Grid>
            </form>
        </React.Fragment>

    );
};

export default EnglishAuctionDetail;