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
      return Buffer.from(await this.readFile(file)).toString('base64')
    }

    static async find(path: string, filename: string): Promise<string | undefined>{
      return promises.readdir(path).then(files => {
        return files.find(file => this.fileBaseName(file) === filename);
      })
    }