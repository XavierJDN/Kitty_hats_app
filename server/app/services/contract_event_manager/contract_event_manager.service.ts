import { KittyTokenContractManagerService } from "@app/services/kitty_token_contract_manager/kitty_token_contract_manager.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ContractEventManagerService {
    events  = new Map<string, Map<string, any>>();

    setEvent(address: string, contract: any, types: string[] = [ 'Transfer', 'Apply', 'Remove']){
        if(this.events.has(address)){
            return;
        }
        this.events.set(address, new Map());
        types.forEach(type => this.pastEvent(type, address, contract));
        this.subscribe(address, contract);
    }

    getEvent(address: string, type: string){
        return this.events.get(address).get(type);
    }

    getAllEvents(address: string){
        return this.events.get(address);
    }

    private async pastEvent(type: string, address: string, contract: any){
        this.events.get(address).set(type, contract.getPastEvents(type, { fromBlock: 0, toBlock: "latest" }));
    }

    // function to subscribe to a blockchain event
    private async subscribe(address: string, contract: any){
        contract.events.allEvents({fromBlock: 0}, (error: any, event: any) => {
            if(error){
                return;
            }
            const pastEvent = this.events.get(address).get(event.event);
            if(pastEvent !== undefined){
                this.events.get(address).set(event.event, [...pastEvent, event]);
            }
        });
    }
}