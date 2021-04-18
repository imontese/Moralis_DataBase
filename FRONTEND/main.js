Moralis.initialize("ACSSBbPaftGDvSW44UDgawnVxYKyjbiBDA4oS2Cv");
Moralis.serverURL = 'https://wlmtp9dqtvir.moralis.io:2053/server'

init = async () =>{         
    hideElement(userInfo);
    hideElement(createItemForm);
    window.web3 = await Moralis.Web3.enable();      //Enable Moralis
    initUser();
}

initUser = async () => {                            //Check if the user log in
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);
        
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(openCreateItemButton);
    }
}

login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (error) {
        alert(error)
    }
}

logout = async () => {
    await Moralis.User.logOut();
    hideElement(userInfo);
    initUser();
}

openUserInfor = async () => {
    user = await Moralis.User.current();
    if (user){
        const email = user.get('email');
        if(email){
            userEmailField.value = email;
        }else{
            userEmailField.value = '';
        }

        userUsernameField.value = user.get('username');

        const userAvatar = user.get('avatar');
        if(userAvatar){
            userAvatarImg.src = userAvatar.url();
            showElement(userAvatarImg);
        }else{
            hideElement(userAvatarImg);       
        }


        showElement(userInfo);
    }else{
        login()
    }
}


saveUserInfo = async () => {
    user.set('email', userEmailField.value);
    user.set('username', userUsernameField.value);

    if (userAvatarFile.files.length > 0) {      
        const avatar = new Moralis.File("avatar.jpg", userAvatarFile.files[0]);
        user.set('avatar', avatar);  
      }

      await user.save(),
      alert("User info saved successfully!");
      openUserInfo();

    
}

createItem = async () => {
    if (createItemFile.files.length == 0){
        alert("Please select a file!");
        return;
    }else if (createItemNameFile.value.length == 0){
        alert("Please give the item a name!");
        return;
    }

    const nftFile = new Moralis.File("nftFile.jpg", createItemFile.file[0]);
    await nftFile.saveIPFS();

    const nftFilePath = nftFile.ipfs();
    const nftFileHash = nftFile.hash();

    const metadata = {
        name: createItemDescriptionField.value,
        description = createItemDescriptionField.value,
        nftFilePath = nftFilePath,
        nftFileHash = nftFileHash
    };

    const nftFileMetadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await file.saveIPFS();

    const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
    const nftFileMetadataFileHash = nftFileMetadataFile.hash();

    const Item = Moralis.Object.extend("Item");

    // Create a new instance of that class.
    const item = new Item();
    item.set('name', createItemNameField.value);
    item.set('description', createItemDescriptionField.value);
    item.set('nftFilePath', nftFilePath);
    item.set('nftFileHash', nftFileHash);
    item.set('metadataFilePath', nftFileMetadataFilePath);
    item.set('metadataFileHash', nftFileMetadataFileHash);

}

hideElement = (elemnt) => elemnt.style.display = "none";
showElement = (elemnt) => elemnt.style.display = "block";

// NavBar
const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfor;

const openCreateItemButton = document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick = () => showElement(createItemForm);


// User Profile
const userInfo = document.getElementById("userInfo");
const userUsernameField = document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");


document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btnLogout").onclick = logout;
document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;

// Item Creation
const createItemForm = document.getElementById("createItem");

const createItemNameFile = document.getElementById("txtCreateItemName");
const createItemDescriptionField = document.getElementById("txtCreateItemDescription");
const createItemPriceField = document.getElementById("numCreateItemPrice");
const createItemStautsField = document.getElementById("selectCreateItemStatus");
const createItemFile = document.getElementById("fileCreateItemFile");


document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);


init();