import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { FsManager } from "@app/services/fs_manager/fs_manager.service";
import { KittyTokenMarketContractManagerService } from "@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service";
import { ContractEventManagerService } from "@app/services/contract_event_manager/contract_event_manager.service";
import { get } from "http";

@Injectable()
export class KittyTokenContractManagerService {
  constructor(
    private contractInteractionService: ContractInteractionService,
    private kittyTokenMarketContractManagerService: KittyTokenMarketContractManagerService,
    private contractEventManagerService: ContractEventManagerService,
    private fs: FsManager
  ) {}

  private tokens: Map<string, any> = new Map();

  async tokenContract(address: string) {
    if (!this.tokens.has(address)) {
      this.tokens.set(
        address,
        await this.getContractABI(this.info(address).contract)
      );
    }
    return new this.contractInteractionService.web3.eth.Contract(
      this.tokens.get(address),
      address
    );
  }

  private info(token: string) {
    return this.kittyTokenMarketContractManagerService.token(token);
  }

  async getInfo(address: string, isAsset: boolean = false) {
    //TODO: get the holders domaine name
    const token = this.info(address);
    return {
      address: token.tokenAddress,
      name: token.name,
      img: await this.getImage(address, isAsset),
      artist: token.artist,
      owners: await this.allOwners(address),
    };
  }

  async getContractABI(contractName: string) {
    return JSON.parse(
      (
        await this.fs.readFile(
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

  async allKitties() {
    return await Promise.all(
      this.kittyTokenMarketContractManagerService.tokens.map(async (token) => {
        return {
          address: token.tokenAddress,
          kitties: await this.kitties(token.tokenAddress),
        };
      })
    );
  }

  async getAllKitties(category?: string) {
    const tokens = await this.allKitties();
    const addresses = await this.getAllAddresses(category, tokens);
    const result = new Map<string, any[]>();
    for (const address of addresses) {
      for (const kitty of address.kitties) {
        await this.addKitties(address, kitty, result);
      }
    }
    return result;
  }

  private async getAllAddresses(category?: string, tokens?: any[]) {
    return category === undefined
      ? tokens
      : this.getCategoryAddresses(category, tokens);
  }

  private async getCategoryAddresses(category: string, tokens: any[]) {
    const categoryList =
      await this.kittyTokenMarketContractManagerService.categoryTokens(
        category
      );
    return tokens.filter((token) => categoryList.includes(token.address));
  }

  private async addKitties(
    address: any,
    kitty: any,
    result: Map<string, any[]>
  ) {
    const lastAppliedEvent = (
      await this.getKittiesEvents(address.address)
    ).applied
      .filter((event: any) => event.returnValues.kittyId === kitty)
      .at(-1);
    this.addKitty(kitty, result, {
      block: lastAppliedEvent.blockNumber,
      address: address.address,
    });
  }

  private addKitty(
    kitty: string,
    result: Map<string, any[]>,
    data: { block: number; address: string }
  ) {
    if (result.has(kitty)) {
      result.get(kitty).push({
        block: data.block,
        address: data.address,
      });
    } else {
      result.set(kitty, [{ block: data.block, address: data.address }]);
    }
  }

  async getKitty(kitty: string) {
    return (await this.getAllKitties(undefined)).get(kitty);
  }

  async getKittiesEvents(token: string) {
    await this.contractEventManagerService.setEvent(
      token,
      await this.tokenContract(token)
    );
    return {
      applied: this.contractEventManagerService.getEvent(token, "Apply"),
      remove: this.contractEventManagerService.getEvent(token, "Remove"),
    };
  }

  async allOwners(token: string) {
    return (await this.getOwnersBalance(token)).filter(
      (owner: { address: string; quantity: number }) => owner.quantity > 0
    );
  }

  async getOwnersBalance(token: string) {
    this.contractEventManagerService.setEvent(
      token,
      await this.tokenContract(token)
    );
    const events = this.contractEventManagerService.getEvent(token, "Transfer");
    const owners = await this.getTransferEvents(token);
    return owners.map((address: string) => {
      const quantity = events
        .filter(
          (event: any) =>
            event.returnValues._from === address ||
            event.returnValues._to === address
        )
        .reduce(
          (prev: number, curr: any) =>
            prev +
            (curr.returnValues._to === address ? 1 : -1) *
              parseInt(curr.returnValues._value),
          0
        );
      return { address, quantity };
    });
  }

  async getTransferEvents(token: string) {
    await this.contractEventManagerService.setEvent(
      token,
      await this.tokenContract(token)
    );
    const events = this.contractEventManagerService.getEvent(token, "Transfer");
    if (events === undefined) return [];
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
    const file = await this.fs.find(path, token.assetUrl);
    const pattern = { index: "dada", file: "easel.svg" };
    const data = await this.fs.base64Encode(path + file);
    const type = this.fs.getType(file);
    return isAsset
      ? await this.getAssetImage(path, file, {
          src: data,
          type,
          isPattern: token.assetUrl.toLowerCase().includes(pattern.index),
        })
      : this.getPreviewImage(data, type);
  }

  private getPreviewImage(src: any, type: string) {
    return {
      src,
      format: type === "svg" ? "svg+xml" : type,
    };
  }

  private async getAssetImage(
    path: string,
    file: string,
    data: { src: any; type: string; isPattern: boolean }
  ) {
    return data.isPattern
      ? this.getDadaDecorator(path, file, data)
      : [this.getMainImage(data, false, false)];
  }

  private async getDadaDecorator(
    path: string,
    file: string,
    data: { src: any; type: string; isPattern: boolean }
  ) {
    return [
      await this.getEaselDada(path, file),
      await this.getBorderDada(path, file),
      this.getMainImage(data, true, true),
    ];
  }

  private getMainImage(
    data: { src: any; type: string; isPattern: boolean },
    isAsset: boolean,
    isDada: boolean
  ) {
    return {
      src: data.src,
      format: data.type === "svg" ? "svg+xml" : data.type,
      id: "main",
      style: isAsset && !isDada
        ? undefined
        : {
              size: { width: 3000, height: 3000 },
              dimension: { width: 1073, height: 807 },
              position: { left: 8, top: 1165 },
          },
    };
  }

  private async getEaselDada(path: string, file: string) {
    const pattern = { index: "dada", file: "easel.svg" };
    return {
      src: await this.fs.base64Encode(path + pattern.file),
      format:
        this.fs.getType(pattern.file) === "svg"
          ? "svg+xml"
          : this.fs.getType(pattern.file),
      class: [],
    };
  }

  private async getBorderDada(path: string, file: string) {
    const placard = {
      index: "placard",
      file: "dada-placard-" + file.split("-").at(-1).split(".")[0] + ".svg",
    };
    return {
      src: await this.fs.base64Encode(path + placard.file),
      format:
        this.fs.getType(placard.file) === "svg"
          ? "svg+xml"
          : this.fs.getType(placard.file),
      class: [],
    };
  }
}
