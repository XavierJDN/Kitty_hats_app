import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Injectable } from "@nestjs/common";
import { Contract } from 'web3-eth-contract';
import { FsManager } from "../fs_manager/fs_manager.service";
import { access, constants } from 'fs';



export class KittyTokenContractManagerService {
    private contract: Contract;
    private token: any;
    constructor(private contractInteractionService: ContractInteractionService,private kittyTokenMarketContractManagerService: KittyTokenContractManagerService) {
    }

  async setContract(address: string) {
    return this.contract = await this.contractInteractionService.web3.eth.Contract( await this.getContractABI(address), address);
  }

  private async info(token: string){
    this.kittyTokenMarketContractManagerService.token(token).then((token: any) => this.token = token);
  }

  async getContractABI(address: string) {
    if(!this.token) await this.info(address);
    return JSON.parse((await FsManager.readFile(`../contracts/build/contracts/${this.token.contract}.json`)).toString()).abi;
  }
  async getImage(address: string, isAsset: boolean = false) {
    if(!this.token) await this.info(address);
    return access(`../kitty-hats-manifest/build/${isAsset ? 'asset': 'preview' }/${this.token.assetUrl}.png`, constants.F_OK, async (err) =>
      { return {
        img: await FsManager.readFile(`../kitty-hats-manifest/build/${isAsset ? 'asset': 'preview' }/${this.token.assetUrl}.${err ? 'svg': 'png'}`),
        isPng: !err
      }
    });
  }
}