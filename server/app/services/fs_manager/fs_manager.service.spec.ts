import { Test } from '@nestjs/testing';
import { FsManager } from '@app/services/fs_manager/fs_manager.service';
import * as fs from 'fs';
import * as path from 'path';

describe('FsManager', () => {
  let service: FsManager;

  beforeEach(async () => {
    service = new FsManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('checkFile should check if a file exists', async () => {
    const filePath = path.join(__dirname, 'file.txt');
    jest.spyOn(fs.promises, 'access').mockImplementation(() => Promise.resolve());
    await service.checkFile(filePath);
    expect(fs.promises.access).toHaveBeenCalledWith(filePath, fs.constants.R_OK);
  });

  it('readFile should read the contents of a file', async () => {
    const filePath = path.join(__dirname, 'file.txt');
    const fileContents = 'Hello World';
    jest.spyOn(fs.promises, 'readFile').mockImplementation(() => Promise.resolve(fileContents));
    const result = await FsManager.readFile(filePath);
    expect(fs.promises.readFile).toHaveBeenCalledWith(filePath);
    expect(result.toString()).toEqual(fileContents);
  });
});