import SellIcon from '@mui/icons-material/Sell';
import LoadingButton from "@mui/lab/LoadingButton";
import { Grid, Stack, Typography } from '@mui/material';
import SvgIcon from "@mui/material/SvgIcon";
import { ethers } from "ethers";
import React, { useState } from "react";
import { change } from '../../api/tokenApi';
import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";
import { MARKET_ADDRESS, TOKEN_ADDRESS } from "../../constants/addressed";
import Market from "../../contracts/Market.sol/Market.json";
import { FixedDetailData, TokenStatus } from "../../pages/Item";
import { getProvider } from "../../utils/Web3Util";
import CountdownTimer from '../CountTimer';


const FixedDetail = (
    { tokenId, detail, isOwner, setLogin, changeStatus }:
    { tokenId: string, detail: FixedDetailData, isOwner: boolean, setLogin: () => void, changeStatus: (status: TokenStatus) => void }) => {

    const [loading, setLoad] = useState(false);

    const fixedCancel = async () => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.fixedRevoke(TOKEN_ADDRESS, tokenId).then((resolve: any) => {
            setLoad(true)
        }).catch((err: any) => {
            alert(err.reason.split(":")[1])
        })

        contract.on("FixedRevoke", (nftAddr, seller, tokenId, event) => {
            console.log(event);
            change(tokenId.toNumber());
            changeStatus(TokenStatus.NORMAL);
        });
    }

    const fixedBuy = async () => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.fixedPurchase(TOKEN_ADDRESS, tokenId, { value: ethers.utils.parseEther(detail.price) }).then((resolve: any) => {
            setLoad(true)
        }).catch((err: any) => {
            console.log(err)
            alert(err.reason.split(":")[1])
        })

        contract.on("FixedPurchase", (nftAddr, buyer, tokenId, price, event) => {
            console.log(event);
            change(tokenId.toNumber());
            changeStatus(TokenStatus.NORMAL);
        });
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}>
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'flex-start', display: 'flex' }}>
                        <Stack sx={{ ml: '10px' }}>
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
                        </Stack>
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <Stack alignItems="flex-start">
                            <Typography variant="subtitle1" noWrap>
                                AUCTION ENDS IN
                            </Typography>
                            <Typography variant="h4" color="secondary" noWrap>
                                <CountdownTimer targetDate={detail.endTime} />
                            </Typography>
                        </Stack>
                    </Grid>
                    {
                        (isOwner || new Date().getTime() > detail.endTime ?
                            (<Grid item lg={4} md={4}>
                                <LoadingButton variant="contained" type="submit" color="primary" onClick={fixedCancel}
                                    startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}
                                    loading={loading}
                                    loadingPosition="start">
                                    Cancel
                                </LoadingButton>
                            </Grid>) :
                            (<Grid item lg={4} md={4}>
                                <LoadingButton variant="contained" type="submit" color="primary" onClick={fixedBuy}
                                    startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}
                                    loading={loading}
                                    loadingPosition="start">
                                    Buy
                                </LoadingButton>
                            </Grid>))
                    }
                </React.Fragment>
            </Grid>
        </React.Fragment>
    );
};

export default FixedDetail;