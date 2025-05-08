import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'Welcome to the Kanban Backend API!';
  }

  @Get('hello')
  getHello(): string {
    return 'Hello World!';
  }
}
