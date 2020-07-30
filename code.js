var DATA_UNION_CONTRACT_ADDRESS = '0x-FILL-ME-IN'
var SHARED_SECRET = 'FILL-ME-IN'
var STREAM_ID = 'FILL-ME-IN'

var playerWallet = StreamrClient.generateEthereumAccount()

var streamr = new StreamrClient({
  auth: {
    privateKey: playerWallet.privateKey,
  }
})

var provider = ethers.getDefaultProvider()
var wallet = new ethers.Wallet(playerWallet.privateKey)

// Join the DU with the player wallet just created
streamr.joinDataUnion(DATA_UNION_CONTRACT_ADDRESS, SHARED_SECRET)
  .then((memberDetails)=> {
    console.log('memberDetails: ', memberDetails)

    streamr.getMemberStats(DATA_UNION_CONTRACT_ADDRESS, memberDetails.memberAddress)
    .then((stats) => {
      console.log('stats: ', stats)
      document.getElementById("data-balance").innerHTML = ethers.utils.formatEther(stats.earnings);
      document.getElementById("data-available").innerHTML = ethers.utils.formatEther(stats.withdrawableEarnings);
    })
  })

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("player-wallet").innerHTML = playerWallet.address;
  document.getElementById("player-key").innerHTML = playerWallet.privateKey;
});

function pushDataToStream(userChoice) {
  console.log('enter pushDataToStream, ', userChoice)
  var dataPoint = {
      "move": userChoice,
  }

  streamr.publish(STREAM_ID, dataPoint)
    .then(() => {
      console.log('Sent successfully: ' + JSON.stringify(dataPoint))
    })
    .catch((err) => {
      console.log(err)
    })
}

function play() {
  // get the computer's random choice
  var compChoice = Math.random() * 3;
  compChoice= Math.floor(compChoice);
 
  var choices=["rock", "paper", "scissors"];
  document.getElementById("computer-choice").innerHTML = choices[compChoice];
  
  // get value user typed
  var userChoice = document.getElementById("moves").value;
  
  // set it to either 0,1,2 to make it easier to compare with compChoice
  if (userChoice === "rock"){
    userChoice = 0;
  } else if (userChoice === "paper") {
    userChoice = 1;
  } else {
    userChoice = 2;
  }
  
  if (compChoice === userChoice) {
    document.getElementById("result").innerHTML = choices[userChoice] + ' versus ' + choices[compChoice] + ', DRAW!';
  } else if ((compChoice === 0 && userChoice === 1) || 
           (compChoice === 1 && userChoice === 2) || 
           (compChoice === 2 && userChoice === 0) ) {
    document.getElementById("result").innerHTML = choices[userChoice] + ' beats ' + choices[compChoice] + ', YOU WON!';
  } else {
    document.getElementById("result").innerHTML = choices[compChoice] + ' beats ' + choices[userChoice] + ', YOU LOSE!';
  }

  pushDataToStream(choices[userChoice])
}

function withdraw() {
  streamr.withdraw(DATA_UNION_CONTRACT_ADDRESS)
}
