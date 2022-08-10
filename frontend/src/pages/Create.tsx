import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";
import { ethers } from "ethers";
import { getProvider } from "../utils/Web3Util";
import store from '../state';
import Temp from "../contracts/Temp.json";
import Image from 'mui-image';


import DropZone from "../components/UploadZone";

//import { api } from "../../services/api";

const CreateNFT = () => {

  //   const account = useSelector((state) => state.allNft.account);
  //   const artTokenContract = useSelector(
  //     (state) => state.allNft.artTokenContract
  //   );

  const [selectedFile, setSelectedFile] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const contractProvider = ethers.providers.getDefaultProvider('ropsten');
  const address = Temp.address;
  const abi = Temp.abi;

  const contract = new ethers.Contract(address, abi, contractProvider);


  function handleInputChange(event: any) {
    let { name, value } = event.target;
    // if(name === 'image'){
    //   value = event.target.files[0];
    // }
    setFormData({ ...formData, [name]: value });
  }

  async function getTest(event: any) {
    console.log("0909087");

    let temp = await contract.getTemp()
    console.log(temp.toNumber());
    console.log(contract.getTemp());

    const estimatedGasLimit = await contract.estimateGas.setTemp(22222);
    console.log(estimatedGasLimit.toNumber());
  }

  async function create(event: any) {
    const provider = await getProvider();
    let currentAccount = store.getState().state.account;

    const signer = provider.getSigner();

    const contract1 = new ethers.Contract(address, abi, signer);

    console.log(signer);

    const estimatedGasLimit = await contract1.estimateGas.setTemp(22222);
    console.log(estimatedGasLimit.toNumber());
    //contract1.setTemp(1100);

    // // Send 1 DAI to "ricmoo.firefly.eth"
    // tx = daiWithSigner.transfer("ricmoo.firefly.eth", dai);

    // provider.getBalance(currentAccount as string).then((result)=>{
    //   console.log(ethers.utils.formatEther(result));
    // })
    // console.log(formData);
    // event.preventDefault();
    // const { title, description } = formData;

    // console.log("title: " + title);

    // const data = new FormData();
    // data.append("name", title);
    // data.append("description", description);

    // if(selectedFile){
    //   data.append('img', selectedFile);
    //   console.log("slectedFile: ", selectedFile);
    // }

    // try {
    //   const totalSupply = await artTokenContract.methods.totalSupply().call();
    //   data.append("tokenId", Number(totalSupply) + 1);

    //   const response = await api.post("/tokens", data, {
    //     headers: {
    //       "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    //     },
    //   });
    //   console.log(response);

    //   mint(response.data.message);
    // } catch (error) {
    //   console.log(error);
    //   // error.response.data
    // }
  }

  async function mint(tokenMetadataURL: string) {
    // try {
    //   const receipt = await artTokenContract.methods
    //     .mint(tokenMetadataURL)
    //     .send({ from: account });
    //   console.log(receipt);
    //   console.log(receipt.events.Transfer.returnValues.tokenId);
    //   // setItems(items => [...items, {
    //   //   tokenId: receipt.events.Transfer.returnValues.tokenId,
    //   //   creator: accounts[0],
    //   //   owner: accounts[0],
    //   //   uri: tokenMetadataURL,
    //   //   isForSale: false,
    //   //   saleId: null,
    //   //   price: 0,
    //   //   isSold: null
    //   // }]);
    //   history.push('/');
    // } catch (error) {
    //   console.error("Error, minting: ", error);
    //   alert("Error while minting!");
    // }
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
          <Image src="https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f4.png" style={{ width: "50%", borderRadius: 10 }} />

          <br />
          <br />
          <Button variant="contained" color="primary" href="/create-nft"
            disableElevation className="main-button">
            Mint
          </Button>

          <br />
          <br />
        </Stack>


      </div>
    </div>
  );
};

export default CreateNFT;
