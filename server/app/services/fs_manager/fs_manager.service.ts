import { Injectable } from '@nestjs/common';
import { promises, constants } from 'fs';
@Injectable()
export class FsManager{
    constructor() {}

    async checkFile(file: string): Promise<void> {
      return await promises.access(file, constants.R_OK);
    }
  
    static async readFile(path: string): Promise<Buffer> {
      return await promises.readFile(path);
    }

    static async base64Encode(file: string): Promise<string> {
      return (await this.readFile(file)).toString('base64')
    }
}