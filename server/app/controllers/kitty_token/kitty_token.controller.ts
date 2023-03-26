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
  async tokens(
    @Res() response: Response,
    @Body()
    body: {
      id?: string;
      limit?: number;
      state?: number;
      author?: string;
      owner?: string;
      isNext?: boolean;
    }
  ) {
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
          )
            .filter(
              (token) =>
                body.author === undefined ||
                token.artist === body.author ||
                body.owner === undefined ||
                token.owners.find((owner) => owner.address === body.owner) !==
                  undefined
            )
            .map((token) =>
              body.owner !== undefined
                ? {
                    ...token,
                    owners: [
                      token.owners.find(
                        (owner) => owner.address === body.owner
                      ),
                    ],
                  }
                : token
            )
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

  @Get("/artists")
  async artists(@Res() response: Response) {
    return response
      .status(HttpStatus.OK)
      .send(await this.kittyTokenMarketContractManagerService.artists());
  }

  @Get("/owners")
  async owners(@Res() response: Response) {
    await this.kittyTokenMarketContractManagerService.infos();
    const owners = await Promise.all(
      this.kittyTokenMarketContractManagerService.tokens.map(
        async (token) =>
          (
            await this.kittyTokenContractManagerService.getInfo(
              token.tokenAddress
            )
          ).owners
      )
    );
    return response.status(HttpStatus.OK).send(
      owners
        .flat()
        .reduce(
          (
            prev: { address: string; quantity: number }[],
            curr: { address: string; quantity: number }
          ) =>
            prev.find((owner) => owner.address === curr.address) !== undefined
              ? prev
              : [...prev, curr],
          []
        )
        .map((owner: any) => owner.address)
    );
  }

  @Get("/kitties")
  async kitties(@Res() response: Response) {
    await this.kittyTokenMarketContractManagerService.infos();
    const addresses = await Promise.all(
      this.kittyTokenMarketContractManagerService.tokens.map(async (token) => {
        return {
          address: token.tokenAddress,
          kitties: await this.kittyTokenContractManagerService.kitties(
            token.tokenAddress
          ),
        };
      })
    );
    const result = new Map<string, string[]>();
    addresses.forEach((address) => {
      address.kitties.forEach((kitty) => {
        if (result.has(kitty)) {
          result.get(kitty).push(address.address);
        } else {
          result.set(kitty, [address.address]);
        }
      });
    });
    return response.status(HttpStatus.OK).send(Object.fromEntries(result));
  }

  @Get("/:address")
  async token(@Param("address") address: string) {
    return await this.kittyTokenContractManagerService.getInfo(address);
  }

  @Get("/contract/:address")
  async contract(@Param("address") address: string) {
    return await this.kittyTokenContractManagerService.tokenContract(address);
  }
  @Get('kitties/:address')
  async kittiesOfToken(@Param('address') address: string) {
    const tokens = this.kittyTokenContractManagerService.kitties(address);
    return 
  }
}
