import * as fs from 'fs';
import { Client, QueryResult } from 'pg';
import { valToSql } from '../sqlTools';

interface Row {
    [key: string]: any;
}

export class PostgreSQLInterface {
    private client: Client;

    constructor(dbName: string) {
        let data = fs.readFileSync("src/config/connections.conf", 'utf-8');
        let connectionConfig = JSON.parse(data)[dbName];
        this.client = new Client(connectionConfig);
        this.client.connect();
    }

    async addRow(tableName: string, data: Row): Promise<void> {
        const keys = Object.keys(data);
        const values = Object.values(data).map(valToSql);

        const query = `
      INSERT INTO ${tableName} (${keys.join(', ')})
      VALUES (${values.join(', ')})
    `;

        await this.client.query(query);
    }

    async deleteRows(tableName: string, conditions: Row): Promise<void> {
        const whereClause = Object.entries(conditions)
            .map(([key, value]) => `${key} = ${valToSql(value)}`)
            .join(' AND ');

        const query = `
      DELETE FROM ${tableName}
      WHERE ${whereClause}
    `;

        await this.client.query(query);
    }

    async editTable(tableName: string, whereData: Row, setData: Row): Promise<void> {
        const whereClause = Object.entries(whereData)
            .map(([key, value]) => `${key} = ${valToSql(value)}`)
            .join(' AND ');
        const setClause = Object.entries(setData)
            .map(([key, value]) => `${key} = ${valToSql(value)}`)
            .join(' AND ');

        const query = `
      UPDATE ${tableName}
      SET ${setClause}
      WHERE ${whereClause}
    `;

        await this.client.query(query);
    }

    async queryDB(query: string): Promise<QueryResult> {
        return this.client.query(query);
    }

    closeConnection(): void {
        this.client.end();
    }
}