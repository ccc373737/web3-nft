import { ethers } from "ethers";
import store from '../state';
import { setAccount } from "../state/action";


declare let window:any;

const getProvider = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const accounts = await provider.listAccounts(); 
    // console.log(accounts)
    // store.dispatch(setAccount({ account: accounts[0] }))
    let account;
    if (accounts.length ==  0) {
        await provider.send("eth_requestAccounts", []).then((result) => {
            account = result[0];
        })
    } else {
        account = accounts[0];
    }

    store.dispatch(setAccount({ account: accounts[0] }))
    
    return provider;
}

export default getProvider;