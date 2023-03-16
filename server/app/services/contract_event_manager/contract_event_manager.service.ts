import { Injectable } from "@nestjs/common";
import { Contract } from "web3-eth-contract";
@Injectable()
export class ContractEventManagerService {
  events = new Map<string, Map<string, any>>();

  async setEvent(
    address: string,
    contract: Contract,
    types: string[] = ["Transfer", "Apply", "Remove"]
  ) {
    if (this.events.has(address)) {
      return;
    }
    this.events.set(address, new Map());
    await this.getAllPastsEvents(contract, address, types);
    await this.subscribe(contract);
  }

  getEvent(address: string, type: string) {
    const event = this.events.get(address)?.get(type);
    return event === undefined ? [] : event;
  }

  getAllEvents(address: string) {
    return this.events.get(address);
  }

  private async getAllPastsEvents(contract: Contract, address: string, types:string[] = ["Transfer", "Apply", "Remove"]) {
    return await contract.getPastEvents('allEvents',{ fromBlock: 0, toBlock: "latest" }, (error: any, events: any) => {
      if (error) {
        return;
      }
      types.forEach((type) => {
        this.events.get(address).set(type, events.filter((event: any) => event.event === type));
      });
      return events;
    }).catch((error: any) => {});
  }

  private async subscribe(contract: Contract) {
    contract.events.allEvents({ fromBlock: "latest" }, (error: any, event: any) => {
      if (error) {
        return;
      }
      const pastEvent = this.events.get(contract.options.address).get(event.event);
      if (pastEvent !== undefined) {
          this.events.get(contract.options.address).set(event.event, [...pastEvent, event]);
        }
    });
  }
}
