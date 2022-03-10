serverUrl = "https://lat7f1odxoyv.usemoralis.com:2053/server";
appId =  "SbqHIgqrav1tBh2r8faedz5Hg37FxyZrZpi1Y36A";
Moralis.start({ serverUrl, appId});

const CONTRACT_ADDRESS = "0x9293ff61533aedf0fac360947af7bd68121870dc"
let currentUser;

function fetchNFTMetadata(NFTs) {
    let promises = [];

    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        promises.push(fetch("https://lat7f1odxoyv.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=SbqHIgqrav1tBh2r8faedz5Hg37FxyZrZpi1Y36A&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = {address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby"};
            return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then( (res) => {
            nft.owners  = [];
            res.result.forEach(element => {
                nft.owners.push(element.ownerOf);
            })
            return nft;
        }))
    }
    return Promise.all(promises);
}

function drawInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
         let htmlString = `
            <div class="card">
                <img src="${nft.metadata.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nft.metadata.name}</h5>
                    <p class="card-text">${nft.metadata.description}</p>
                    <p class="card-text">Total in circulation: ${nft.amount}</p>
                    <p class="card-text">Count of happy customers who bought this: ${nft.owners.length}</p>
                    <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                    <a href="/dashboard/mint.html?nftId=${nft.token_id}" class="btn btn-primary">mint</a>
                    <a href="/dashboard/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
                </div>
            </div>
         `

         let col = document.createElement("div");
         col.className = "col col-md-3"
         col.innerHTML = htmlString;
         parent.appendChild(col);
    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts");
    const options = {chain: "rinkeby", address: accounts[0], token_address: CONTRACT_ADDRESS};
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object, currentElement) => {
            object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {})
        return result
    });
}

async function initialize() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        try {
            currentUser = await Moralis.Web3.authenticate();
            console.log(user);
            alert("User logged in")
        } catch (error) {
            console.log(error);
        }
    }

    const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"}
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();

    drawInventory(NFTWithMetadata, ownerData);
}

initialize();