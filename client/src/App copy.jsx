import { EthProvider } from "./contexts/EthContext";
import Whitelist from "./components/Whitelist/";
import StartProposal from "./components/StartProposal";
import WriteProposal  from "./components/WriteProposal";
import StopProposal  from "./components/StopProposal";
import StartVoting  from "./components/StartVoting";
import VoterVoting  from "./components/VoterVoting";
import StopVoting  from "./components/StopVoting";
import CountVote  from "./components/CountVote";
import SeeResult  from "./components/SeeResult";
import "./App.css";
import Voting from "./contracts/Voting.json";
import Whitelist from "./contracts/Whitelist.json";
import { useState } from "react";

function App() {

  const [whitelistedValue, setWhitelistedValue] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [addresses, setAddresses] = useState(null);

  useEffect(() => {
    fetchData();
    async function fetchData() {
      try{
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkID = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkID];
        const instance = new web3.eth.Contract(
          Voting.abi,
          deployedNetwork && deployedNetwork.address,
        );
        const { abi } = Voting;
        let address, contract;
        try {
          address = Voting.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
        } catch (err) {
          console.error(err);
        }
        setWeb3(web3);
        setContractInstance(contract);
        setAddresses(accounts);
      }
      catch (err) {
        console.error(err);
      }
    }
  },[]);

  return (
    <EthProvider>
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Whitelist />
            </div>
            <div className="col-md-6">
              <StartProposal />
              <WriteProposal />
              <StopProposal />
              <StartVoting />
              <VoterVoting />
              <StopVoting />
              <CountVote />
              <SeeResult />
            </div>
          </div>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
