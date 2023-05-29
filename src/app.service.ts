import { Injectable } from '@nestjs/common';
import { Contract, Signer, ethers } from 'ethers';
import * as tokenJson from './assets/MyERC20Token.json';
import * as BallotJson from './assets/Ballot.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  contract: Contract;
  signer: Signer;
  ballot: Contract;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    this.provider = new ethers.providers.AlchemyProvider('maticmum', apiKey);
    this.signer = new ethers.Wallet(pKey, this.provider);
    this.contract = new Contract(
      this.getTokenAddress(),
      tokenJson.abi,
      this.provider,
    );
    this.ballot = new Contract(
      this.getBallotAddress(),
      BallotJson.abi,
      this.provider,
    );
  }

  getTokenAddress() {
    const address = this.configService.get<string>('TOKEN_ADDRESS');
    return address;
  }

  getBallotAddress() {
    const address = this.configService.get<string>('BALLOT_ADDRESS');
    return address;
  }

  async getTotalSupply() {
    const totalSupplyBN = await this.contract.totalSupply();
    return ethers.utils.formatEther(totalSupplyBN);
  }

  async getBalanceOf(address: string) {
    const balanceBN = await this.contract.balanceOf(address);
    return balanceBN.toString();
  }

  async getTransactionReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await this.getReceipt(tx);
    return receipt;
  }

  async getReceipt(tx: ethers.providers.TransactionResponse) {
    return await tx.wait();
  }

  async requestTokens(address: string, amount: string) {
    return await this.contract.connect(this.signer).mint(address, amount);
  }

  async delegateVotes(address: string) {
    return await this.contract.connect(this.signer).delegate(address);
  }

  async getVotingPower(address: string) {
    const votePowerBN = await this.contract.getVotes(address);
    return votePowerBN.toString();
  }

  async getLatestBlock() {
    return await this.provider.getBlockNumber();
  }

  async vote(proposal: number, amount: number) {
    return await this.ballot.connect(this.signer).vote(proposal, amount);
  }

  async getProposals() {
    //  *** failed to get a loop to fill an array with any data
    // for (let i = 0; i < this.ballot.proposalsLength(); i++) {
    //   proposal = await this.ballot.proposals(i);
    //   proposalName = ethers.utils.parseBytes32String(proposal.name);
    //   proposalCount = proposal.voteCount.toNumber();
    //   proposalArray.push(`${proposalName} : ${proposalCount}`);
    // }
    const proposalArray = [];
    let proposal = await this.ballot.proposals(0);
    let proposalName = ethers.utils.parseBytes32String(proposal.name);
    let proposalCount = proposal.voteCount.toNumber();
    proposalArray.push(`${proposalName} : ${proposalCount}`);
    proposal = await this.ballot.proposals(1);
    proposalName = ethers.utils.parseBytes32String(proposal.name);
    proposalCount = proposal.voteCount.toNumber();
    proposalArray.push(`${proposalName} : ${proposalCount}`);
    proposal = await this.ballot.proposals(2);
    proposalName = ethers.utils.parseBytes32String(proposal.name);
    proposalCount = proposal.voteCount.toNumber();
    proposalArray.push(`${proposalName} : ${proposalCount}`);

    return proposalArray;
  }
}
