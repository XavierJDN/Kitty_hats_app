import { Injectable } from "@nestjs/common";

@Injectable()
export class ContractEventManagerService {
  events = new Map<string, Map<string, any>>();

  async setEvent(
    contract: any,
    types: string[] = ["Transfer", "Apply", "Remove"]
  ) {
    if (this.events.has(contract.options.address)) {
      return;
    }
    console.log(contract.options.address + " should be called only before get");
    this.events.set(contract.options.address, new Map());
    const events = await Promise.all(types.map(async (type: string) => await this.pastEvent(type, contract)));
    types.forEach((type: string, i: number) => this.events.get(contract.options.address).set(type, events[i]));
    await this.subscribe(contract);
  }

  getEvent(address: string, type: string) {
    console.log(this.events.get(address));
    console.log(
      address +
        " should be called only after set " +
        this.events.get(address).get(type)
    );
    return this.events.get(address).get(type);
  }

  getAllEvents(address: string) {
    return this.events.get(address);
  }

  private async pastEvent(type: string, contract: any) {
    return contract
      .getPastEvents(type, { fromBlock: 0, toBlock: "latest" })
      .then((events: any) => {
        console.log(contract.options.address + ' should cal to set the result of past event ' + events)
        events === undefined ? [] : events;
      });
  }

  private async subscribe(contract: any) {
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
