/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  async getLogs() {
    const logFilePath = path.join(process.env.LOG_A);

  return new Promise((resolve, reject) => {
    fs.readFile(logFilePath, (err, data) => {
      if (err) {
        console.error(err);
        return reject(new Error('Не удалось прочитать лог-файл'));
      }
      resolve({ text: data.toString() });
    });
  });
  }
}
