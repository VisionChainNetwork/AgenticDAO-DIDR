import { Signer, Wallet } from 'ethers';
import { ethers } from 'hardhat'
import { DID_ADDR } from './listenForEvent'

async function main() {
  const [signer, _] = await ethers.getSigners()

  // console.log(signer.address, signer2.address);
  // console.log(await contract.identityOwner(signer.address))

  for (let i = 0; i < 5; i++) {
    const agent = Wallet.createRandom()
    const contract = (await ethers.getContractFactory("EthereumDIDRegistry", agent))
      .attach(DID_ADDR);
    console.log(agent.address)
    await signer.sendTransaction({
      to: agent.address,
    })
    await (await contract
      .changeOwner(
        agent.address,
        agent.address,
        { gasLimit: 1000_000 }
      )).wait()
    console.log("SCRIPT :: added agent")
  }
}

main()
  .then(v => console.log(v), e => console.error(e))
  .catch(e => console.error(e))
