import { KittyTokenContractManagerService } from "@app/services/kitty_token_contract_manager/kitty_token_contract_manager.service";
import { KittyTokenMarketContractManagerService } from "@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service";
import { PageManagerService } from "@app/services/page_manager/page_manager.service";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";

@Controller("tokens")
export class KittyTokenController {
  constructor(
    private kittyTokenContractManagerService: KittyTokenContractManagerService,
    private kittyTokenMarketContractManagerService: KittyTokenMarketContractManagerService,
    private pageManager: PageManagerService
  ) {}

  @Post("/")
  async tokens(@Res() response: Response, @Body() body: any) {
    await this.kittyTokenMarketContractManagerService.infos();
    if (body.id === undefined) {
      if (body.limit === undefined || body.state === undefined)
        return response.status(HttpStatus.BAD_REQUEST).send();
      return response.status(HttpStatus.OK).send(
        this.pageManager.insert(
          body.limit,
          body.state,
          (
            await Promise.all(
              this.kittyTokenMarketContractManagerService.tokens.map(
                async (token) =>
                  await this.kittyTokenContractManagerService.getInfo(
                    token.tokenAddress
                  )
              )
            )
          ).filter((token) => !token.isApply)
        )
      );
    }
    const page = this.pageManager.next(
      body.id,
      body.isNext !== undefined ? body.isNext : true
    );
    return response
      .status(!page ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
      .send(!page ? null : page);
  }

  @Get("/:address")
  async token(@Param("address") address: string) {
    return await this.kittyTokenContractManagerService.getInfo(address);
  }

  @Get("/contract/:address")
  async contract(@Param("address") address: string) {
    return await this.kittyTokenContractManagerService.tokenContract(address);
  }
}
