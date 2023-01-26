import { Injectable } from '@nestjs/common';
import { AbiItem } from 'web3-utils';
import { FsManager } from '@app/services/fs_manager/fs_manager.service';
const Web3 = require('web3')
const Contract = require('web3-eth-contract');

@Injectable()
export class ContractInteractionService {
  web3: typeof Web3;

  constructor() {
    if(!this.web3){
      this.web3 = new Web3('https://mainnet.infura.io/v3/971ed22e4e2e4276b37166adebf4b1ac');
    }
    if(!Contract.currentProvider){
      Contract.setProvider(this.web3.currentProvider);
    }
  }
  public async getContractInstance(
    contractName: string,
  ): Promise<typeof Contract> {
    return new Contract(
      await this.getContractAbi(contractName),
      await this.getContractAddress(contractName),
    );
  }

    private async getContractAbi(contractName: string): Promise<AbiItem> {
        return JSON.parse(((await FsManager.readFile(`./assets/contracts/${contractName}/abi.json`))).toString());
    }

    private async getContractAddress(contractName: string): Promise<string> {
        return JSON.parse(((await FsManager.readFile(`./assets/contracts/${contractName}/index.json`))).toString())['address'];
    }
}