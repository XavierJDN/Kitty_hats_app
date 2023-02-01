import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { FsManager } from "@app/services/fs_manager/fs_manager.service";
import { access, constants } from "fs";
import { KittyTokenMarketContractManagerService } from "@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service";

@Injectable()
export class KittyTokenContractManagerService {
  constructor(
    private contractInteractionService: ContractInteractionService,
    private kittyTokenMarketContractManagerService: KittyTokenMarketContractManagerService
  ) {
  }

  async setContract(address: string) {
    return this.contract = await this.contractInteractionService.web3.eth.Contract( await this.getContractABI(address), address);
  }

  private async info(token: string) {
    return await this.kittyTokenMarketContractManagerService
      .token(token)
  }

  async getInfo(address: string) {
    const token = await this.info(address)
    return {
      name: token.name,
      img: await this.getImage(address),
      artist: token.artist,
    };
  }

  async getContractABI(address: string) {
    if(!this.token) await this.info(address);
    return JSON.parse((await FsManager.readFile(`../contracts/build/contracts/${this.token.contract}.json`)).toString()).abi;
  }
  async getImage(address: string, isAsset: boolean = false) {
    const token = await this.info(address); 
    return access(
      `../kitty-hats-manifest/build/${isAsset ? "asset" : "preview"}/${
        token.assetUrl
      }.png`,
      constants.F_OK,
      async (err) => {
        return {
          address: token.tokenAddress,
          img: await FsManager.base64Encode(
            `../kitty-hats-manifest/build/${isAsset ? "asset" : "preview"}/${
              token.assetUrl
            }.${err ? "svg" : "png"}`
          ),
        };
      }
    );
  }
}
