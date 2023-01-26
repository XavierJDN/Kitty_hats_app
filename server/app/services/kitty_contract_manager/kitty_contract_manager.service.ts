import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Contract } from 'web3-eth-contract';


export class KittyContractManagerService {
  private contract: Contract;

    constructor(private contractInteractionService: ContractInteractionService) {}

  async setContract() {
    this.contract = await this.contractInteractionService.getContractInstance("crypto_kitty");
  }
}