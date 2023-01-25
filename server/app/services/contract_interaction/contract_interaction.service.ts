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
    contractAddress: string,
    web3: Web3,
  ): Promise<Contract> {
    const contract = new web3.eth.Contract(
      await this.getContractAbi(contractName),
      contractAddress,
    );
    return contract;
  }

  // create a method to get the contract ABI from the contract name
    private async getContractAbi(contractName: string): Promise<AbiItem> {
        // get the contract ABI from the contract name
        return JSON.parse(((await FsManager.readFile(`@app/assets/${contractName}/abi.json`))).toString());
    }

    // get the contract addresss from the contract name
    public getContractAddress(contractName: string): string {
        return JSON.parse(((FsManager.readFile(`@app/assets/${contractName}/index.json`))).toString())['address'];
    }
}