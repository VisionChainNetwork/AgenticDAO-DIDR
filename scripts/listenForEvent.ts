import { Wallet } from 'ethers';
import { ethers } from 'hardhat'

export const DAO_ADDR = "0x428C486c78B0D58EFB98C3Fd523b28C00C71910a"
export const DID_ADDR = "0x4cD9ED8B463f61ECE4f63184dEC62fDdCD98A506"
export const VCN_ADDR = "0x08F51C31aa19234f4Af8b755bFa9b369554e0ec4"

async function listenDID(ADDRESS: string, agentDelegates: Wallet[]) {
  const [signer] = await ethers.getSigners()
  const contract = (await ethers.getContractFactory("EthereumDIDRegistry"))
    .attach(ADDRESS);

  contract.on("DIDOwnerChanged", async (_from, _to, _value, event) => {
    // Get identity corresponding to event
    const eventFragment = contract.interface.events['DIDOwnerChanged(address,address,uint256)']
    const decodedEvent = contract.interface
      .decodeEventLog(eventFragment, event.data)
    const identity = decodedEvent[1]

    // Add new keypair as delegate of identity
    const delegate = Wallet.createRandom()
    const tx = await contract.connect(signer)
      .addDelegate(identity, "dao-vote-relayer", delegate.address, 172800);
    await tx.wait()
    console.log("DID :: Added delegate to identity...")

    // Send VCN to delegate
    {
      const contract = (await ethers.getContractFactory("VCNToken")).attach(VCN_ADDR)
      await (await contract.connect(signer).transfer(delegate.address, 100)).wait()
      console.log("DID :: Sent VCN to delegate...")
    }

    // Verify it worked
    // const owner = await contract.delegates("dao-vote-relayer", identity)
    // if (owner !== delegate.address) {
    //   throw new Error("unexpected owner")
    // }

    // Store the delegate
    agentDelegates.push(delegate)
    console.log("DID :: Added 1 delegate...")
  })
}

async function listenDAO(ADDRESS: string, agentDelegates: readonly Wallet[]) {
  const [signer] = await ethers.getSigners()
  const contract = (await ethers.getContractFactory("VCNDao"))
    .attach(ADDRESS);

  contract.on("ProposalCreated", async (_from, _to, _value, event) => {
    // Get identity corresponding to event
    const eventFragment = contract.interface.events['ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)']
    const decodedEvent = contract.interface
      .decodeEventLog(eventFragment, event.data)
    console.log(JSON.stringify(decodedEvent))
    const proposalId = decodedEvent[1]

    // Add new keypair as delegate of identity
    for (let delegate of agentDelegates) {
      const tx = await contract.connect(delegate).castVote(delegate.address, 1);
      await tx.wait()
    }
    console.log("DAO :: Casted all votes...")
  })
}

async function main() {
  const agentDelegates: Wallet[] = []

  console.log("DID :: listening for events on the DID Contract...")
  await listenDID(DID_ADDR, agentDelegates)

  console.log("DAO :: listening for events on the DAO Contract...")
  await listenDAO(DAO_ADDR, agentDelegates)
}

// main()
//   .then(v => console.log(v), e => console.error(e))
//   .catch(e => console.error(e))

