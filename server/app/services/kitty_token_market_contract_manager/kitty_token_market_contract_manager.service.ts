import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { Contract } from 'web3-eth-contract';

@Injectable()
export class KittyTokenMarketContractManagerService {
  private contract: Contract;

    constructor(private contractInteractionService: ContractInteractionService) {}

  async setContract() {
    return this.contract = await this.contractInteractionService.getContractInstance("kitty_token_market");
  }
}