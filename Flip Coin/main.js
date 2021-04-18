  
Moralis.initialize("Zz4AXvfNWsSmCRb04NdUnRewYVKYUcTWfq1KVKmm"); // Application id from moralis.io
Moralis.serverURL = "https://plrp70s8jxv4.moralis.io:2053/server"; //Server url from moralis.io

async function login() {
    try {
        user = await Moralis.User.current();
        if(!user){
            user = await Moralis.Web3.authenticate();
        }

        user = await Moralis.Web3.authenticate();
        console.log(user);
        let email = document.getElementById("email_input").value;
        user.set("email", email);
        await user.save();
        alert("User logged in")
        document.getElementById("login_button").style.display = "none";
        document.getElementById("game").style.display = "block";
    } catch (error) {
        console.log(error);
    }
}

async function flip(side){
    let amount = document.getElementById("amount").value;
     alert(side + '  ' + amount)
     let contractInstance = new web3.eth.Contract(contractAbi, contractAddress)

}

document.getElementById("login_button").onclick = login;
document.getElementById("heads_button").onclick = function(){flip("heads")};
document.getElementById("tails_button").onclick = function(){flip("tails")};