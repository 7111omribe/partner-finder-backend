import { MongoClient, Db, ServerApiVersion, InsertOneResult, Collection } from "mongodb";

export class MongoInterface {
    private conn: Db;

    constructor(dbName: string) {
        const client = this.createClient();
        client.connect();
        this.conn = client.db(dbName)

    }

    public getRawCollection(collectionName: string): Collection {
        return this.conn.collection(collectionName);
    }

    public async update(collectionName: string, whereQuery: Record<string, any>, setQuery: Record<string, any>) {
        const collection: Collection = this.conn.collection(collectionName);
        const result = await collection.updateOne(whereQuery, setQuery);
        return result;
    }

    public async aggregate(collectionName: string, query: Record<string, any>[]): Promise<Record<string, any>[]> {
        const collection: Collection = this.conn.collection(collectionName);
        const result = await collection.aggregate(query).toArray();
        return result;
    }

    public async insert(collectionName: string, document: Record<string, any>): Promise<InsertOneResult> {
        const collection = this.conn.collection(collectionName);
        const result = await collection.insertOne(document);
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