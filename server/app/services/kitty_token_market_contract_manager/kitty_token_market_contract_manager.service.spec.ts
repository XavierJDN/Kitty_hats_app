import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { KittyTokenMarketContractManagerService } from "./kitty_token_market_contract_manager.service";
import { FsManager } from "../fs_manager/fs_manager.service";
import { Contract } from "web3-eth-contract";

describe("KittyTokenMarketContractManagerService", () => {
  let service: KittyTokenMarketContractManagerService;
  let contractInteractionService: ContractInteractionService;

  beforeEach(async () => {
    contractInteractionService = {
      getContractInstance: jest.fn(),
    } as unknown as ContractInteractionService;

    service = new KittyTokenMarketContractManagerService(
      contractInteractionService
    );
  });

  describe("setContract", () => {
    it("should set the contract", async () => {
      const contract = {
        methods: {
          foo: jest.fn(),
        },
      } as unknown as Contract;

      (
        contractInteractionService.getContractInstance as jest.Mock
      ).mockResolvedValue(contract);

      await service.setContract();

      expect(
        contractInteractionService.getContractInstance
      ).toHaveBeenCalledWith("kitty_token_market");
      expect(service["contract"]).toEqual(contract);
    });
  });

  describe("infos", () => {
    it("should set the tokens property with the list of tokens", async () => {
      const expectedTokens = {
        categories: [
          { items: [{ address: "0x1" }, { address: "0x2" }] },
          {
            items: [{ address: "0x3" }, { address: "0x4" }],
          },
        ],
      };
      const readFileSpy = jest.spyOn(FsManager, "readFile").mockResolvedValue({
        toString: () => JSON.stringify(expectedTokens),
      } as Buffer);

      await service.infos();

      expect(readFileSpy).toHaveBeenCalledWith(
        "../kitty-hats-manifest/build/listing_1.json"
      );
      expect(service.tokens).toEqual([
        { address: "0x1" },
        { address: "0x2" },
        { address: "0x3" },
        { address: "0x4" }
      ]);

      readFileSpy.mockRestore();
    });
  });

  describe("token", () => {
    beforeEach(async () => {
      service.tokens = [
        { tokenAddress: "0x1", name: "token1" },
        { tokenAddress: "0x2", name: "token2" },
        { tokenAddress: "0x3", name: "token3" },
      ];
    });

    it("should return the token with the given address", async () => {
      const result = await service.token("0x2");

      expect(result).toEqual({ tokenAddress: "0x2", name: "token2" });
    });

    it("should return undefined if the token is not found", async () => {
      const result = await service.token("0x4");

      expect(result).toBeUndefined();
    });

    it("should call infos if tokens property is not set", async () => {
        const expectedTokens = [];
        const infosSpy = jest.spyOn(service, "infos").mockImplementation(async () => {
        service.tokens = expectedTokens;
      });
      service.tokens = undefined;

      await service.token("0x1");

      expect(infosSpy).toHaveBeenCalled();

      infosSpy.mockRestore();
    });
  });
});
