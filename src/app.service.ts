import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello nestJs';
  }

  postHello(){
    return "hola desde post en el service";
  }
}
