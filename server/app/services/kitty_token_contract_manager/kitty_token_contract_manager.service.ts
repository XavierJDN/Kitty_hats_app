import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { FsManager } from "@app/services/fs_manager/fs_manager.service";
import { access, constants, existsSync } from "fs";
import { KittyTokenMarketContractManagerService } from "@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service";

@Injectable()
export class KittyTokenContractManagerService {
  constructor(
    private contractInteractionService: ContractInteractionService,
    private kittyTokenMarketContractManagerService: KittyTokenMarketContractManagerService
  ) {}

  async tokenContract(address: string) {
    return new this.contractInteractionService.web3.eth.Contract(
      await this.getContractABI((await this.info(address)).contract),
      address
    );
  }

  private async info(token: string) {
    return await this.kittyTokenMarketContractManagerService.token(token);
  }

  async getInfo(address: string) {
    const token = await this.info(address);
    return {
      address: token.tokenAddress,
      name: token.name,
      img: await this.getImage(address),
      artist: token.artist,
      isApply: await this.isTokenApply(address),
    };
  }

  async getContractABI(contractName: string) {
    return JSON.parse(
      (
        await FsManager.readFile(
          `../contracts/build/contracts/${contractName}.json`
        )
      ).toString()
    ).abi;
  }

  async isTokenApply(token: string) {
    const applyEvents = await (await this.tokenContract(token)).getPastEvents("Apply", { fromBlock: 0, toBlock: "latest" });
    const removeEvents = await (await this.tokenContract(token)).getPastEvents("Remove", { fromBlock: 0, toBlock: "latest" });
    return applyEvents.filter((applyEvent) => removeEvents.find((removeEvent) => removeEvent.returnValues.kittyId === applyEvent.returnValues.kittyId) === undefined).length > 0;
  }

  async getImage(address: string, isAsset: boolean = false) {
    const token = await this.info(address);
    const path = `../kitty-hats-manifest/build/${
      isAsset ? "asset" : "preview"
    }/`;
    const file = await FsManager.find(path, token.assetUrl);
    return {
      src: await FsManager.base64Encode(path + file),
      format: FsManager.getType(file) === 'svg' ? 'svg+xml' : FsManager.getType(file),
    };
  }
}
