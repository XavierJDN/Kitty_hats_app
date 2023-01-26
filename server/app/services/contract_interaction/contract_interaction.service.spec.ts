import { Test, TestingModule } from "@nestjs/testing";
import { ContractInteractionService } from "./contract_interaction.service";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import Web3 from "web3";
import { FsManager } from "../fs_manager/fs_manager.service";

describe("ContractInteractionService", () => {
  let service: ContractInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FsManager, ContractInteractionService],
    }).compile();
    service = module.get<ContractInteractionService>(
      ContractInteractionService
    );
  });

  it("getContractInstance should return a contract instance", async () => {
    const contractName = "crypto_kitty";
    const contractAbi = [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ];
    const contractAddress = "0x1234567890abcdef";

    jest
      .spyOn(Object.getPrototypeOf(service), "getContractAbi")
      .mockReturnValue(Promise.resolve(contractAbi));
    jest
      .spyOn(Object.getPrototypeOf(service), "getContractAddress")
      .mockReturnValue(Promise.resolve(contractAddress));
    jest.spyOn(service["web3"].eth, 'Contract').mockReturnValue({} as Contract);
    expect(await service.getContractInstance(contractName)).toEqual(
      {} as Contract
    );
  });

  // create a jest test for getContractAbi
  it("getContractAbi should return the contract abi", async () => {
    const contractName = "crypto_kitty";
    const contractAbi = [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ];
    jest
      .spyOn(FsManager, "readFile")
      .mockReturnValue(Promise.resolve({} as Buffer));
    jest.spyOn(JSON, "parse").mockReturnValue(contractAbi);
    expect(await service["getContractAbi"](contractName)).toEqual(contractAbi);
  });

  // create a jest test for getContractAddress
  it("getContractAddress should return the contract address", async () => {
    const contractName = "crypto_kitty";
    const contractAddress = "0x1234567890abcdef";
    jest
      .spyOn(FsManager, "readFile")
      .mockReturnValue(Promise.resolve({} as Buffer));
    jest.spyOn(JSON, "parse").mockReturnValue(contractAddress);
    expect(await service["getContractAddress"](contractName)).toEqual(
      contractAddress
    );
  });
});
