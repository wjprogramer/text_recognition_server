import Database from 'better-sqlite3';
import path, { dirname } from 'path';
import { setGlobal } from './global';
import { runServer } from '@src/server';
import { initEnv } from './app';

const main = async () => {
    const env = initEnv();

    const mainFileName = require.main?.filename;
    if (mainFileName == undefined) {
        console.error('Get path failed');
        return;
    }

    const projectRoot = dirname(dirname(mainFileName));
    const dbPath = path.join(projectRoot, 'data', 'database.db');
    const db = Database(dbPath);

    setGlobal({
        projectRoot,
        db,
        env,
    });

    runServer();
}

main();