import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { FsManager } from "@app/services/fs_manager/fs_manager.service";
import { KittyTokenContractManagerService } from "./kitty_token_contract_manager.service";
import { KittyTokenMarketContractManagerService } from "@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("KittyTokenContractManagerService", () => {
  let service: KittyTokenContractManagerService;
  let contractInteractionService: ContractInteractionService;
  let kittyTokenMarketContractManagerService: KittyTokenMarketContractManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KittyTokenContractManagerService,
        ContractInteractionService,
        KittyTokenMarketContractManagerService,
      ],
    }).compile();

    service = module.get<KittyTokenContractManagerService>(
      KittyTokenContractManagerService
    );
    contractInteractionService = module.get<ContractInteractionService>(
      ContractInteractionService
    );
    kittyTokenMarketContractManagerService =
      module.get<KittyTokenMarketContractManagerService>(
        KittyTokenMarketContractManagerService
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("tokenContract", () => {
    it("should create a new token contract with the given address", async () => {
      const tokenAddress = "0x123";
      const expectedContractName = "KittyToken";
      const contractABI = [
        {
          constant: true,
          inputs: [],
          name: "name",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ];
      const expectedContract = {
        methods: {
          name: () => ({ call: () => expectedContractName }),
        },
      } as any;

      jest
        .spyOn(kittyTokenMarketContractManagerService, "token")
        .mockResolvedValueOnce({
          contract: expectedContractName,
          tokenAddress,
        });
      jest
        .spyOn(service["contractInteractionService"].web3.eth, "Contract")
        .mockReturnValueOnce(expectedContract);
      jest.spyOn(service, "getContractABI").mockResolvedValueOnce(contractABI);

      const result = await service.tokenContract(tokenAddress);

      expect(result).toBe(expectedContract);
    });
  });

  describe("getInfo", () => {
    it("should return the correct info for a token", async () => {
      const mockAddress = "0x123";
      const mockToken = {
        tokenAddress: mockAddress,
        name: "My Token",
        artist: "John Smith",
        assetUrl: "my-asset.svg",
      };
      const mockImage = {
        src: "data:image/svg+xml;base64,PHN...",
        format: "svg+xml",
      };
      const mockIsApplied = true;
      jest
        .spyOn(Object.getPrototypeOf(service), "info")
        .mockResolvedValue(mockToken);
      jest.spyOn(service, "getImage").mockResolvedValue(mockImage);
      jest.spyOn(service, "isTokenApplied").mockResolvedValue(mockIsApplied);

      const info = await service.getInfo(mockAddress);

      expect(info).toEqual({
        address: mockToken.tokenAddress,
        name: mockToken.name,
        img: mockImage,
        artist: mockToken.artist,
        isApply: mockIsApplied,
      });
      expect(service["info"]).toHaveBeenCalledWith(mockAddress);
    });
  });
});
