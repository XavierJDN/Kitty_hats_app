import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { resolve } from "path";
import { Contract } from "web3-eth-contract";
import { FsManager } from "../fs_manager/fs_manager.service";

@Injectable()
export class KittyTokenMarketContractManagerService {
  tokens: any[];
  constructor(private contractInteractionService: ContractInteractionService) {}

  async setContract() {
    return await this.contractInteractionService.getContractInstance(
      "kitty_token_market"
    );
  }

  async infos() {
    if (this.tokens !== undefined) {
      return Promise.resolve();
    }
    const listing = await this.listContract();
    this.tokens = Object.values(
      Object.values(listing.categories).map((category: any) => category.items)
    ).flat();
  }

  private async listContract() {
    return JSON.parse(
      (
        await FsManager.readFile(`../kitty-hats-manifest/build/listing_1.json`)
      ).toString()
    );
  }
  async categoryTokens(category: string) {
    const listing = await this.listContract();
      return (
      Object.entries(listing.categories)
        .find((contract: [string, any]) => category === contract[0])
        ?.at(-1) as any
    ).items.map((item: any) => item.tokenAddress);
  }

  token(address: string) {
    return this.tokens.find((token: any) => token.tokenAddress === address);
  }

  async artists() {
    await this.infos();
    return this.tokens
      .map((token: any) => token.artist)
      .reduce(
        (prev: string[], curr: string) =>
          prev.includes(curr) ? prev : [...prev, curr],
        [this.tokens[0].artist]
      );
  }
}
