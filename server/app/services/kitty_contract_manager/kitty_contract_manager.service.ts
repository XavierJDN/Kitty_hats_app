import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Contract } from 'web3-eth-contract';


export class KittyContractManagerService {
  private contract: Contract;

    constructor(private contractInteractionService: ContractInteractionService) {}

  async setContract() {
    return this.contract = await this.contractInteractionService.getContractInstance("crypto_kitty");
  }

  async tokensOf(address: string): Promise<{kitty: any}[]> {
    return this.getAllTokens().then((tokens: {kitty: any, owner: string}[]) => {
      return tokens.filter((token: { kitty: any, owner: string}) => token.owner === address).map((token: {kitty: any, owner: string}) => token.kitty);
    });
  }

  async getAllTokens(){
    const tokens = [];
    const supply = await this.getAllSupply();
    for (let id = 0; id < supply; id++) {
      let kitty: any;
      let owner: string;
      try{
        kitty = await this.contract.methods.getKitty(id).call();
        owner = await this.contract.methods.ownerOf(id).call();
      }catch(e){
        return tokens;
      }
      tokens.push({ ...kitty, owner});
      }
    return tokens;
  }

  async getAllSupply(): Promise<any> {
    try{
      return await this.contract.methods.totalSupply().call();
    }catch(e){
      return null;
    }
  }
  checkBalance(address: string): Promise<any> {
    try{
      return this.contract.methods.balanceOf(address).call();
    }catch(e){
      return null;
    }
  }
}