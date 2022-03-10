serverUrl = "https://lat7f1odxoyv.usemoralis.com:2053/server";
appId =  "SbqHIgqrav1tBh2r8faedz5Hg37FxyZrZpi1Y36A";
Moralis.start({ serverUrl, appId});

const CONTRACT_ADDRESS = "0x9293ff61533aedf0fac360947af7bd68121870dc"

let web3;

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.Web3.enable();

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);

    const options = {type: "erc1155",
                     receiver: address,
                     contract_address: CONTRACT_ADDRESS,
                     token_id: tokenId,
                     amount: amount}
    let result = await Moralis.transfer(options);
    console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

init();