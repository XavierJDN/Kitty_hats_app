import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { FsManager } from "@app/services/fs_manager/fs_manager.service";
import { access, constants, existsSync } from "fs";
import { KittyTokenMarketContractManagerService } from "@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service";
import { ContractEventManagerService } from "@app/services/contract_event_manager/contract_event_manager.service";


@Injectable()
export class KittyTokenContractManagerService {
  constructor(
    private contractInteractionService: ContractInteractionService,
    private kittyTokenMarketContractManagerService: KittyTokenMarketContractManagerService,
    private contractEventManagerService: ContractEventManagerService
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
    //TODO: get the holders domaine name
    const token = await this.info(address);
    return {
      address: token.tokenAddress,
      name: token.name,
      img: await this.getImage(address),
      artist: token.artist,
      owners: await this.allOwners(address),
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

  async kitties(token: string): Promise<string[]> {
    const events = await this.getKittiesEvents(token);
    return events.applied
      .filter(
        (appliedEvent: any) =>
          events.remove.find(
            (removeEvent: any) =>
              removeEvent.returnValues.kittyId ===
              appliedEvent.returnValues.kittyId
          ) === undefined
      )
      .map((event: any) => event.returnValues.kittyId);
  }

  async getKittiesEvents(token: string) {
    await this.contractEventManagerService.setEvent(
      await this.tokenContract(token)
    );
    return {
      applied: this.contractEventManagerService.getEvent(token, "Apply"),
      remove: this.contractEventManagerService.getEvent(token, "Remove"),
    };
  }

  async allOwners(token: string) {
    return (await this.getOwnersBalance(token)).filter(
      (owner) => owner.quantity > 0
    );
  }

  async getOwnersBalance(token: string) {
    const contract = await this.tokenContract(token);
    return (await this.getTransferEvents(token)).map(async (address: string) => {
      return {
        address,
        quantity: parseInt(
          await contract.methods.balanceOf(address).call({ from: 0 })
        ),
      };
    });
  }

  async getTransferEvents(token: string) {
    await this.contractEventManagerService.setEvent(await this.tokenContract(token));
    const events = this.contractEventManagerService.getEvent(token, 'Transfer');
    if(events === undefined) return [];
    return events
      .map((event: any) => [event.returnValues._from, event.returnValues._to])
      .flat()
      .reduce(
        (prev: string[], curr: string) =>
          prev.includes(curr) ? prev : [...prev, curr],
        []
      );
  }

  async getImage(address: string, isAsset: boolean = false) {
    const token = await this.info(address);
    const path = `../kitty-hats-manifest/build/${
      isAsset ? "asset" : "preview"
    }/`;
    const file = await FsManager.find(path, token.assetUrl);
    return {
      src: await FsManager.base64Encode(path + file),
      format:
        FsManager.getType(file) === "svg" ? "svg+xml" : FsManager.getType(file),
    };
  }
}
