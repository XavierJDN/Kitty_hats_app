import { Injectable } from "@nestjs/common";
import { Contract } from "web3-eth-contract";
import { operation } from "retry";
@Injectable()
export class ContractEventManagerService {
  events = new Map<string, Map<string, any>>();

  async setEvent(
    address: string,
    contract: Contract,
    types: string[] = ["Transfer", "Apply", "Remove"]
  ) {
    if (this.events.has(address)) {
      return Promise.resolve();
    }
    this.events.set(address, new Map());
    await this.retryRequest(this.getAllPastsEvents.bind(this), contract, address, types);
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
    return contract.getPastEvents('allEvents',{ fromBlock: 0, toBlock: "latest" }).then(
      (events: any) => {
        types.forEach((type) => {
          this.events.get(address).set(type, events.filter((event: any) => event.event === type));
        });
        return events;
      })
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
  private get operation() {
    return operation({
      retries: 3,
      factor: 3,
      minTimeout: 1 * 1000,
      maxTimeout: 15 * 1000,
      randomize: true,
    })
  }

  //create a retry request
  private async retryRequest(request: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      const operation = this.operation;
      operation.attempt(function (currentAttempt: number) {
        request(...args).then((result: any) => {
          resolve(result);
        }).catch((error: any) => {
          if (!operation.retry(error)) {
            reject(error);
          }
        });
      });
    }).then((response) => {
      this.operation.reset();
      return response;
    });
  }
}
