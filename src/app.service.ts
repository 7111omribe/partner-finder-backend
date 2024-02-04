import { Injectable } from '@nestjs/common';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon'




@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!2';
  }
  addUser(): void {
    const db = new PostgreSQLInterface("postresql");
    db.addRow("users_data", { name: "daniel vered", email: "7111danielv@gmail.com",password:"gguunnrrhh44"});
  }
}
