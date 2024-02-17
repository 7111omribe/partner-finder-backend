import { MongoClient, Db, ServerApiVersion } from "mongodb";

export class MongoInterface {
    private conn: Db;

    constructor(dbName: string) {
        const client = this.createClient();
        client.connect();
        this.conn = client.db(dbName)

    }

    public async aggregate(collectionName: string, query: Record<string, any>[]): Promise<Record<string, any>[]> {
        const collection = this.conn.collection(collectionName);
        const result = await collection.aggregate(query).toArray();
        return result;
    }

    private createClient() {
        const uri = "mongodb+srv://ebdu12:LiTfDEhq9W0ZeCw6@cluster0.frreqdt.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        return client;
    }


}