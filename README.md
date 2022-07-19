# dApp de Vote 
## Système de vote

L'utilisation de React avec Node et truffle nous permet de construire une dApp qui interagit avec Metamask, que ce soit sur le réseau de test Ropsten ou en localhost avec Ganache.

Lien de la vidéo de démonstration
https://www.loom.com/share/916a44700ef74207be87fa68207f389e

Le projet est scindé en deux dossiers principaux

- client
- truffle

# Le dossier truffle

Il contient principalement le contract, ici *Voting.sol* dans le dossier **contracts** et dans le dossier **migrations**
```js
const Voting = artifacts.require("Voting");
module.exports = function (deployer) {
  deployer.deploy(Voting);
};
```
le code nécessaire à son déploiement.

# Le dossier client est plus intéressant

Dans le dossier **public** j'ai changé le titre de l'application. On peut aussi y changer son logo.

Le fichier package.json a demandé des modifications pour déployer sur Github Pages. Voici le lien pour voir l'application ainsi déployé :
https://florianfavre.github.io/ProjetVoting/

Le code est situé dans le fichier App.js

```js
import React, { useState, useEffect, useRef } from "react";
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3.js";
import "./App.css";
import {ethers} from 'ethers';
```
Les imports permettent d'utiliser les différentes propriétés de React, les propriétés du contract Voting.sol à travers ici son json déployé.

```js
const [connButtonText, setConnButtonText] = useState('Connect Wallet');
const amt = useRef(null);
```
Voici deux exemples de variables de la fonction App, une en useState et l'autre en useRef.

```js
useEffect(() => {
    fetchData();
    ... }
```

useEffect sert à initialiser la connexion avec la fonction asynchrone fetchData.


Regardons une fonction plus en détail
```js
async function addWhitelist () {
    whitelistDiv.current.style.backgroundColor = "grey";
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    console.log(inputValue);
    await contract.methods.addVoter(inputValue).send({from: addresses[0]});
    let optionEve = {
      filter: {
          value: [],
      },
      fromBlock: 0
  };
    contract.events.VoterRegistered(optionEve)
      .on('data', event => console.log(event))
      .on('changed', changed => console.log(changed))
      .on('connected', str => console.log(str));
  };
  ```
  
  Lorsque cette fonction est appellé elle commence par changer le fond du div concerné pour notifier à l'utilisateur que l'on a déja interagit avec cette zone. A terme on pourrait même cacher certaines zones selon notre volonté.
  
  Ensuite on teste si la valeur rentrer dans l'input n'est pas nulle. Voici la partie html de cet input :
```html
  <div className="App-header whitelist" ref={whitelistDiv}>
        <h1>Ajouter une addresse à la liste blanche</h1>
        <div className="whitelist-div">
          <input
            type="text"
            value={inputValue}
            onChange={ (e) => handleInputChange(e) } />
          <button onClick={addWhitelist}>  Ajouter  </button>
        </div>
      </div>
```
Elle fait appel à cette fonction qui permet de mettre à jour inputValue lorsque l'utilisateur écrit
```js
async function handleInputChange(e) {
    setInputValue(e.target.value);
  };
```

Revenons à addWhitelist qui ensuite fait appel à la fonction du contrat addVoter en lui donnant en paramètre la valeur de cet input.

Nous avons pour finir un event **VoterRegistered** qui permet de voir dans la console que le votant a été correctement enregistré sur la blockchain une fois que la transaction a été validé sur Metamask.


# Gestion d'events avec getPastEvents

Dans cet exemple de fonction nous voyons une autre utilisation de la gestion d'évènement.
```js
async function startVotingSession () {
    startVotingSessionDiv.current.style.backgroundColor = "grey";
    await contract.methods.startVotingSession().send({from: addresses[0]});
    contract.getPastEvents('WorkflowStatusChange', options)
        .then(results => console.log(results))
        .catch(err => "throw err");
  };
  ```
