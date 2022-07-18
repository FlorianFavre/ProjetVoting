import { useRef, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Welcome() {

  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");

  const addWhitelist = async () => {
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const value = await Voting.methods.addVoter(inputValue).send({from: accounts[0]});
  };

  const handleInputChange = e => {
      setInputValue(e.target.value);
  };

  return (
    <div className="welcome">
      <h1>Ajouter une addresse à la liste blanche</h1>
      
      <div className="input-btn">
        <input
          type="text"
          placeholder="address"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={addWhitelist}>
          Ajouter
        </button>
    </div>

    </div>

  );
}

export default Welcome;
