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
});
