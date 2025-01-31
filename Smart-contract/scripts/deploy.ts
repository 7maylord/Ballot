import { ethers, run, network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    console.log("\n🚀 Starting deployment of Ballot contract...");
  
    // Define proposal names (convert to bytes32)
  const encodedProposals = ["Proposal1", "Proposal2"].map((prop) =>
    ethers.utils.formatBytes32String(prop)
  );

  console.log("📜 Proposal names encoded:", encodedProposals);
  // Get the contract factory and Deploy the contract
  const Ballot = await ethers.getContractFactory("Ballot");
  console.log("📡 Deploying contract...");
  
  const ballot = await Ballot.deploy(encodedProposals);

  // Wait for deployment to be confirmed
  await ballot.waitForDeployment();

  const contractAddress = await ballot.getAddress();

  console.log(`✅ Ballot contract deployed at: ${contractAddress}`);

  // Verify on Sepolia (optional)
  if (network.name === "sepolia") {
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: await ballot.getAddress(),
        constructorArguments: [encodedProposals],
      });
      console.log("Contract verified");
    } catch (error: any) {
      console.error("Verification failed:", error.message);
    }
  }
}

// Execute script and handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });