import { ContractInteractionService } from "@app/services/contract_interaction/contract_interaction.service";
import { KittyTokenContractManagerService } from "@app/services/kitty_token_contract_manager/kitty_token_contract_manager.service";
import { KittyTokenMarketContractManagerService } from "@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service";
import { Controller, Get, Param } from "@nestjs/common";


@Controller("tokens")
export class KittyTokenController {
  constructor(
    private kittyTokenContractManagerService: KittyTokenContractManagerService,
    private kittyTokenMarketContractManagerService: KittyTokenMarketContractManagerService
  ) {}
  
  @Get("/")
  async tokens() {
    await this.kittyTokenMarketContractManagerService.infos();
    return await Promise.all(this.kittyTokenMarketContractManagerService.tokens.map(async (token) =>
      await this.kittyTokenContractManagerService.getInfo(token.tokenAddress)
    ));
  }

  @Get('/:address')
  async token(@Param('address') address: string) {
    return await this.kittyTokenContractManagerService.getInfo(address);
  }

  @Get('/contract/:address')
    async contract(@Param('address') address: string) {
        return await this.kittyTokenContractManagerService.setContract(address);
  }
}
