import { Test } from '@nestjs/testing';
import { FsManager } from '@app/services/fs_manager/fs_manager.service';
import { promises, constants, Dirent } from 'fs';

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
    jest.spyOn(promises, 'access').mockImplementation(() => Promise.resolve());
    await service.checkFile(filePath);
    expect(promises.access).toHaveBeenCalledWith(filePath, constants.R_OK);
  });

  it('throws an error if file does not exist', async () => {
    await expect(new FsManager().checkFile('non-existent-file.txt')).rejects.toThrow();
  });

  it('readFile should read the contents of a file', async () => {
    const filePath = path.join(__dirname, 'file.txt');
    const fileContents = 'Hello World';
      jest.spyOn(promises, 'readFile').mockImplementation(() => Promise.resolve(fileContents));
        const result = await FsManager.readFile(filePath);
    expect(promises.readFile).toHaveBeenCalledWith(filePath);
    expect(result.toString()).toEqual(fileContents);
  });
  // create a test fort base64Encode to have Buffer as input and return a string
  it('should encode a file to base64', async () => {
    const filePath = path.join(__dirname, 'file.txt');
    const fileContents = 'Hello World';
    const expectedBase64 = 'SGVsbG8gV29ybGQ='
    jest.spyOn(promises, 'readFile').mockImplementation(() => Promise.resolve(fileContents));
    const result = await FsManager.base64Encode(filePath);
    expect(result).toEqual(expectedBase64);
  });

  it('should find the base name of a file', () => {
    const expectedFileName = 'test.txt';
    const result = FsManager.fileBaseName(expectedFileName);
    expect(result).toEqual('test');
  });

  it('should find the type of a file', () => {
    const expectedFileName = 'test.txt';
    const result = FsManager.getType(expectedFileName);
    expect(result).toEqual('txt');
  });
});