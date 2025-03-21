import { Dirent, readdirSync, statSync } from "fs";
import { parse, resolve } from "path";

class ExtendedDirent extends Dirent {
    creationTime: number = 0
}

export function GetContentDirFullPath () {
    if (!process.env.PWD) throw new Error('process.env.PWD is not set');

    return resolve(process.env.PWD, 'content');
}

export function PrintContentReadableCreationTime (filename: string) : string {
    const postsDir = GetContentDirFullPath();
    const fp = resolve(postsDir, filename);
    const stats = statSync(fp);
    const creationDate = (new Date(stats.birthtimeMs))
    const creationDateString = `${creationDate.getMonth()}-${creationDate.getDate()}-${creationDate.getFullYear()}`;

    return creationDateString;
}

export async function ReadContentDirectory(): Promise<ExtendedDirent[]> {
    let initialValue: ExtendedDirent[] = []

    const postsDir = GetContentDirFullPath();
    const files = readdirSync(postsDir, { withFileTypes: true });
    if (!files) return initialValue;

    const mdFiles = files.reduce((total, curr) => {
        if (!curr) return total;
        if (curr.isDirectory()) return total;

        const d: ExtendedDirent = Object.create(curr, { 'creationTime': {
            writable: false,
            configurable: false,
            value: PrintContentReadableCreationTime(curr.name)
        }});

        total.push(d)
        
        return total;
    }, initialValue);

    return mdFiles;
}

export async function GetLinksDataFromContent () {
    const files = await ReadContentDirectory();
    const data = files
        .sort((a,b) => a.creationTime - b.creationTime)
        .map(f => {
            const filename = parse(f.name).name;
            const creationDateString = PrintContentReadableCreationTime(f.name);

            return ({
                filename,
                creationDateString
            });
        });

    return data;
}
