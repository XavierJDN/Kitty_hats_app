import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { Contract } from 'web3-eth-contract';
import { FsManager } from "../fs_manager/fs_manager.service";

@Injectable()
export class KittyTokenMarketContractManagerService {
  private contract: Contract;
  tokens: any[];
    constructor(private contractInteractionService: ContractInteractionService) {
    }

  async setContract() {
    return this.contract = await this.contractInteractionService.getContractInstance("kitty_token_market");
  }

  private async infos() {
    const listing = JSON.parse((await FsManager.readFile(`../kitty-hats-manifest/build/listing_1.json`)).toString());
    this.tokens = Object.values(Object.values(listing.categories).map((category: any) => category.item)).reduce((prev, cur) => prev.push(cur));
  }

  async token(address: string) {
    if(!this.tokens) await this.infos();
    return this.tokens.find((token: any) => token.address === address);
  }
}