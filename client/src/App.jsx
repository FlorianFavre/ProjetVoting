import { useState, useEffect } from "react";
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3.js";
import "./App.css";
import {ethers} from 'ethers'

function App() {

  const [inputValue, setInputValue] = useState("");
  const [inputValueProposal, setInputValueProposal] = useState("");
  const [inputValueVote, setInputValueVote] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [addresses, setAddresses] = useState(null);
  // const [isOwner, setIsOwner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  let options = {
    filter: {
        value: ['1000', '1337']    //Only get events where transfer value was 1000 or 1337
    },
    fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
    toBlock: 'latest'
  };

  useEffect(() => {
    fetchData();
    async function fetchData() {
      try{
        const web3 = await getWeb3(true);
        const accounts = await web3.eth.getAccounts();
        const networkID = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkID];
        const instance = new web3.eth.Contract(
          Voting.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setContract(instance);
        setAddresses(accounts);

      }
      catch (err) {
        alert(err);
        console.error(err);
      }
    };

  },[]);

  const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

  // async function fetchOwner() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     try {
  //       const owner = await contrat.methods.owner().call({from: owner});
  //       console.log("isOwner");
  //       console.log(isOwner);
  //       setIsOwner(owner.toLowerCase() === addresses[0].toLowerCase());
  //     } catch (e) {
  //       console.log('error fetching owner: ', e);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (addresses) {
  //     fetchOwner();
  //   }
  //   // eslint-disable-next-line
  // }, [addresses]);

  async function addWhitelist () {
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    await contract.methods.addVoter(inputValue).send({from: addresses[0]});
    
    contract.getPastEvents('VoterRegistered', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
    
  };

  async function handleInputChange(e) {
    console.log(e.target.value);
    setInputValue(e.target.value);
  };

  async function handleInputProposalChange(e) {
    console.log(e.target.value);
    setInputValueProposal(e.target.value);
  };

  async function handleInputVoteChange(e) {
    console.log(e.target.value);
    setInputValueVote(e.target.value);
  };  

  async function startProposalsRegistering(){
    await contract.methods.startProposalsRegistering().send({from: addresses[0]});
    contract.getPastEvents('WorkflowStatusChange', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  }

  async function endProposalsRegistering(){
    await contract.methods.endProposalsRegistering().send({from: addresses[0]});
    contract.getPastEvents('WorkflowStatusChange', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  }

  async function addProposal () {
    if (inputValueProposal === "") {
      alert("Please enter a value to write.");
      return;
    }
    await contract.methods.addProposal(inputValueProposal).send({from: addresses[0]});
    contract.getPastEvents('ProposalRegistered', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  };

  async function startVotingSession () {
    await contract.methods.startVotingSession().send({from: addresses[0]});
    contract.getPastEvents('WorkflowStatusChange', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  };
  
  async function setVote () {
    await contract.methods.setVote(inputValueVote).send({from: addresses[0]});
    contract.getPastEvents('WorkflowStatusChange', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  };  

  async function endVotingSession () {
    await contract.methods.endVotingSession().send({from: addresses[0]});
    contract.getPastEvents('WorkflowStatusChange', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  };

  async function tallyVotes () {
    await contract.methods.tallyVotes().send({from: addresses[0]});
    contract.getPastEvents('WorkflowStatusChange', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  };

  async function resultFunc () {
    console.log("resultFunc");
    await contract.methods.winningProposalID().call(function(err, res){
      document.getElementById('amt').innerText = "La valeur gagnante est : ".res;
      console.log(res);
    });
  };
  
  // listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);

  if(!web3) {
    
    return (
      
      <div className="App-header">
        <button onClick={connectWalletHandler}>{connButtonText}</button>
        <br></br>
        Loading Web3, accounts, and contract...
      </div>
      
    );
  }

  return (
    
    <div className="App">

      <div className='walletCard'>
        <div className='accountDisplay'>
          <h3>Address: {defaultAccount}</h3>
        </div>
        <div className='balanceDisplay'>
          <h3>Balance: {userBalance}</h3>
        </div>
          {errorMessage}
        

        <div className="App-header whitelist">
          <h1>DApp de vote</h1> 
        </div>
      </div>
      
      {/* {isOwner ? ( */}
      <div className="App-header whitelist">
        <h1>Ajouter une addresse à la liste blanche</h1>        
        <div className="whitelist-div">

          <input
            type="text"
            value={inputValue}
            onChange={ (e) => handleInputChange(e) } />
          <button onClick={addWhitelist}>  Ajouter  </button>

        </div>
      </div>
      {/* ) : (null)}; */}

      <br></br>      <hr></hr>      <br></br>

      {/* {isOwner ? ( */}
      <div className="App-header StartProposal">
        <h1>Commencer la session d'enregistrement des propositions</h1>        
        <div className="whitelist-div">

          <button onClick={startProposalsRegistering}>  Valider  </button>
          
        </div>
      </div>
      {/* ) : (null)}; */}

      <br></br>      <hr></hr>      <br></br>

      <div className="App-header addProposal">
        <h1>Ajouter une proposition</h1>        
        <div className="addProposal-div">

          <input
            type="text"
            value={inputValueProposal}
            onChange={ (e) => handleInputProposalChange(e) } />
          <button onClick={addProposal}>  Ajouter  </button>

        </div>
      </div>

      <br></br>      <hr></hr>      <br></br>

      {/* {isOwner ? ( */}
      <div className="App-header endProposalsRegistering">
        <h1>Fin de la session d'enregistrement des propositions</h1>        
        <div className="endProposalsRegistering-div">

          <button onClick={endProposalsRegistering}>  Valider  </button>
          
        </div>
      </div>
      {/* ) : (null)}; */}
      
      <br></br>      <hr></hr>      <br></br>

      {/* {isOwner ? ( */}
      <div className="App-header startVotingSession">
        <h1>Commencer la session de vote</h1>        
        <div className="startVotingSession-div">

          <button onClick={startVotingSession}>  Valider  </button>
          
        </div>
      </div>
      {/* ) : (null)}; */}

      <br></br>      <hr></hr>      <br></br>

      <div className="App-header setVote">
        <h1>Voter pour les propositions </h1>        
        <div className="setVote-div">
        <input
            type="text"
            value={inputValueVote}
            onChange={ (e) => handleInputVoteChange(e) } />
          <button onClick={setVote}>  Valider  </button>
          
        </div>
      </div>

      <br></br>      <hr></hr>      <br></br>

      {/* {isOwner ? ( */}
      <div className="App-header endVotingSession">
        <h1>Finir la session de vote</h1>        
        <div className="endVotingSession-div">

          <button onClick={endVotingSession}>  Valider  </button>
          
        </div>
      </div>
      {/* ) : (null)}; */}

      <br></br>      <hr></hr>      <br></br>

      {/* {isOwner ? ( */}
      <div className="App-header tallyVotes">
        <h1>Comptabiliser les votes</h1>        
        <div className="tallyVotes-div">

          <button onClick={tallyVotes}>  Valider  </button>
          
        </div>
      </div>
      {/* ) : (null)}; */}

      <br></br>      <hr></hr>      <br></br>

      <div className="App-header result">
        <h1>Connaitre le résultat</h1>        
        <div className="result-div">
          <button onClick={resultFunc}>  Valider  </button>          
        </div>
        
        <div id="amt">

        </div>
      </div>
    
    </div>
  );
}

export default App;
