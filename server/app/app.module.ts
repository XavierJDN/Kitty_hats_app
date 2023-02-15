import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FsManager } from '@app/services/fs_manager/fs_manager.service';
import { ContractInteractionService } from '@app/services/contract_interaction/contract_interaction.service';
import { KittyContractManagerService } from '@app/services/kitty_contract_manager/kitty_contract_manager.service';
import { KittyTokenController } from './controllers/kitty_token/kitty_token.controller';
import { KittyTokenContractManagerService } from '@app/services/kitty_token_contract_manager/kitty_token_contract_manager.service';
import { KittyTokenMarketContractManagerService } from '@app/services/kitty_token_market_contract_manager/kitty_token_market_contract_manager.service';
import { PageManagerService } from "@app/services/page_manager/page_manager.service";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        // MongooseModule.forRootAsync({
        //     imports: [ConfigModule],
        //     inject: [ConfigService],
        //     useFactory: async (config: ConfigService) => ({
        //         uri: config.get<string>('DATABASE_CONNECTION_STRING'), // Loaded from .env
        //     }),
        // }),
        // MongooseModule.forFeature([]), // create the mogoDB database (shema = { name: string, schema:  <service>})
    ],
    controllers: [KittyTokenController], // all controllers are imported here
    providers: [PageManagerService, FsManager, ContractInteractionService, KittyContractManagerService, KittyTokenContractManagerService, KittyTokenMarketContractManagerService,Logger],
})
export class AppModule {}
