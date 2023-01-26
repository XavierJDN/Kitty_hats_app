import { Injectable } from '@nestjs/common';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { FsManager } from '@app/services/fs_manager/fs_manager.service';
import Web3 from 'web3';

@Injectable()
export class ContractInteractionService {
  // ...
  public async getContractInstance(
    contractName: string,
    web3: Web3,
  ): Promise<Contract> {
    return new web3.eth.Contract(
      await this.getContractAbi(contractName),
      await this.getContractAddress(contractName),
    );
  }

    private async getContractAbi(contractName: string): Promise<AbiItem> {
        return JSON.parse(((await FsManager.readFile(`@app/assets/${contractName}/abi.json`))).toString());
    }

    private async getContractAddress(contractName: string): Promise<string> {
        return JSON.parse(((await FsManager.readFile(`@app/assets/${contractName}/index.json`))).toString())['address'];
    }
}