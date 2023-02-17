import { KittyContractManagerService } from "./kitty_contract_manager.service";
import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Contract } from 'web3-eth-contract';


describe("KittyCOntractManagerService", () => {
    let service: KittyContractManagerService;

    beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KittyContractManagerService, ContractInteractionService],
    }).compile();
    service = module.get<KittyContractManagerService>(KittyContractManagerService);
    service['contractInteractionService'] = module.get<ContractInteractionService>(ContractInteractionService);
  });

  it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('setContract should set contract property', async () => {
        const expectedContract = {} as Contract;
        jest.spyOn(service['contractInteractionService'], 'getContractInstance').mockReturnValue(Promise.resolve(expectedContract));
        await service.setContract();
        expect(service['contractInteractionService'].getContractInstance).toHaveBeenCalledWith("crypto_kitty");
        expect(service['contract']).toBeDefined();
    });

    it('tokensof should get all kitty tokens of a address', () => {
        const expectedTokens = 'kitty';
        const expectedOwner = '0x123';
        jest.spyOn(service, 'getAllTokens').mockReturnValue(Promise.resolve([{ kitty: expectedTokens, owner: expectedOwner}]));
        service.tokensOf(expectedOwner).then((tokens) => {
            expect(tokens).toEqual([expectedTokens]);
        }
        );
    });

    it('should get all supply', () => {
        const expectedSupply = 100;
        service['contract'] = {methods: {totalSupply: () => ({call: async () => new Promise(() => expectedSupply)})}} as unknown as Contract;
        service.getAllSupply().then((supply) => {
            expect(supply).toEqual(expectedSupply);
        });
    });

    it('should check the balance', () => {
        const expectedBalance = 100;
        const expectedAddress = '0x123';
        service['contract'] = { methods: {balanceOf: () => ({ call: async () => new Promise(() => expectedBalance) }) }} as unknown as Contract;
        service.checkBalance(expectedAddress).then((balance) => {
            expect(balance).toEqual(expectedBalance);
        }
        );
    });

    it('should get all tokens', () => {
        const expectedTokens = [{kitty: 'kitty', owner: '0x123'}];
        const expectedSupply = 1;
        jest.spyOn(service, 'getAllSupply').mockReturnValue(Promise.resolve(expectedSupply));
        service['contract'] = { methods: {getKitty: () => ({call: async () => new Promise(() => expectedTokens[0].kitty)}), ownerOf: () => ({ call: async () => new Promise(() => expectedTokens[0].owner)})}} as unknown as Contract;
        service.getAllTokens().then((tokens) => {
            expect(tokens).toEqual(expectedTokens);
            }
        );
    });
  });
