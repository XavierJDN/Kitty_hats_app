import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { FsManager } from "@app/services/fs_manager/fs_manager.service";
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
      await this.getContractABI(this.info(address).contract),
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
    let addresses = [];
    if (category === undefined) {
      addresses = tokens;
    } else {
      const categoryList =
        await this.kittyTokenMarketContractManagerService.categoryTokens(
          category
        );
      addresses = tokens.filter((token) =>
        categoryList.includes(token.address)
      );
    }
    const result = new Map<string, any[]>();
    for (const address of addresses) {
      for (const kitty of address.kitties) {
        const lastAppliedEvent = (
          await this.getKittiesEvents(address.address)
        ).applied
          .filter((event: any) => event.returnValues.kittyId === kitty)
          .at(-1);
        if (result.has(kitty)) {
          result.get(kitty).push({
            block: lastAppliedEvent.blockNumber,
            address: address.address,
          });
        } else {
          result.set(kitty, [
            { block: lastAppliedEvent.blockNumber, address: address.address },
          ]);
        }
      }
    }
    return result;
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
    const pattern = { index: "dada", file: "easel.svg" };
    const file = await FsManager.find(path, token.assetUrl);
    const placard = {
      index: "placard",
      file: "dada-placard-" + file.split("-").at(-1).split(".")[0] + ".svg",
    };
    const data = await FsManager.base64Encode(path + file);
    const type = FsManager.getType(file);
    if (isAsset) {
      return token.assetUrl.toLowerCase().includes(pattern.index)
        ? [
            {
              src: await FsManager.base64Encode(path + pattern.file),
              format:
                FsManager.getType(pattern.file) === "svg"
                  ? "svg+xml"
                  : FsManager.getType(pattern.file),
              class: [],
            },
            {
              src: await FsManager.base64Encode(path + placard.file),
              format:
                FsManager.getType(placard.file) === "svg"
                  ? "svg+xml"
                  : FsManager.getType(placard.file),
              class: [],
            },
            {
              // all spec are in pixel
              src: data,
              format: type === "svg" ? "svg+xml" : type,
              style: {
                type: 'position',
                dimension: 'px',
                ref: 300,
                spec: { width: 110, height: 85, top: 115, left: 1 },
              },
            },
          ]
        : [{ src: data, format: type === "svg" ? "svg+xml" : type, class: [] }];
    }
    return {
      src: data,
      format: type === "svg" ? "svg+xml" : type,
    };
  }
}
