import { Injectable } from '@nestjs/common';
import { promises, constants } from 'fs';
@Injectable()
export class FsManager{
    constructor() {}

    /**
     * Vérifie si un fichier existe avec fs
     * @param file: le fichier à vérifier
     * @returns rien si le fichier existe. Sinon, lancer une erreur
     */
    async checkFile(file: string): Promise<void> {
      return await promises.access(file, constants.R_OK);
    }
  
    /**
     * Lit et retourne le contenu d'un fichier
     * @param {string} path : le chemin qui correspond au fichier JSON
     * @returns {Promise<Buffer>} le cotenu du fichier sous la forme de Buffer
     */
    static async readFile(path: string): Promise<Buffer> {
      return await promises.readFile(path);
    }
}