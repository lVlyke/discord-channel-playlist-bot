import * as fs from "fs";
import * as path from "path";
import { Config } from "./models/config";

const config: Config = require("../config.json");

export interface DataStore {
    set<T>(key: string, value: T): void;
    mutate<T>(key: string, mutator: DataStore.Mutator<T>);
    get<T>(key: string): T;
    has(key: string): boolean;
    remove(key: string): void;
}

export namespace DataStore {
    export type Mutator<T> = (value: T | undefined) => T;
}

export class LocalDataStore implements DataStore {

    constructor (private path: string) {}

    public set<T>(key: string, value: T): void {
        const store = this.loadStore();

        store[key] = value;

        this.saveStore(store);
    }

    public mutate<T>(key: string, mutator: DataStore.Mutator<T>) {
        const store = this.loadStore();

        store[key] = mutator(store[key]);

        this.saveStore(store);
    }

    public get<T>(key: string): T {
        const store = this.loadStore();

        return store[key];
    }

    public has(key: string): boolean {
        const store = this.loadStore();

        return Object.getOwnPropertyNames(store).some(propName => key === propName);
    }

    public remove(key: string): void {
        const store = this.loadStore();

        delete store[key];

        this.saveStore(store);
    }

    private loadStore(): any {
        if (fs.existsSync(this.path)) {
            return JSON.parse(fs.readFileSync(this.path, { encoding: "utf-8" }));
        } else {
            return {};
        }
    }

    private saveStore(store: any): void {
        const mkdirp = (fpath: string): void => {
            const dirname = path.dirname(fpath);

            if (fs.existsSync(dirname)) {
                return;
            } else {
                mkdirp(dirname), fs.mkdirSync(dirname);
            }
        };

        mkdirp(this.path);
        fs.writeFileSync(this.path, JSON.stringify(store), { encoding: "utf-8" });
    }
}

export const store: DataStore = new LocalDataStore(config.dataStoreLocation);