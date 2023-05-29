import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokensDTO } from './dtos/requestTokens.dto';
import { VoteDTO } from './dtos/vote.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('contract-address')
  getAddress() {
    return this.appService.getTokenAddress();
  }

  @Get('total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('balance-of/:address')
  async getBalanceOf(@Param('address') address: string) {
    return await this.appService.getBalanceOf(address);
  }

  @Get('transaction-receipt/')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return await this.appService.getTransactionReceipt(hash);
  }

  @Post('request-tokens')
  async requestTokens(@Body() body: RequestTokensDTO) {
    return await this.appService.requestTokens(body.address, body.amount);
  }

  @Post('delegate-votes')
  async delegateVotes(@Query('address') address: string) {
    return await this.appService.delegateVotes(address);
  }

  @Get('voting-power/')
  async getVotingPower(@Query('address') address: string) {
    return await this.appService.getVotingPower(address);
  }

  @Get('latest-block')
  async getLatestBlock() {
    return this.appService.getLatestBlock();
  }

  @Post('vote')
  async vote(@Body() body: VoteDTO) {
    return await this.appService.vote(body.proposal, body.amount);
  }

  @Get('proposals')
  async getProposals() {
    return await this.appService.getProposals();
  }
}
