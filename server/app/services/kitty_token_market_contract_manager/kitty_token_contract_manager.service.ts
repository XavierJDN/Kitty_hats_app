import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Contract } from 'web3-eth-contract';


export class KittyTokenContractManagerService {
  private contract: Contract;

    constructor(private contractInteractionService: ContractInteractionService) {}

  async setContract() {
    return this.contract = await this.contractInteractionService.getContractInstance("kitty_token");
  }
}