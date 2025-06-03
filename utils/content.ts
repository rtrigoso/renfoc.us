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
    const creationTimestamp = parseInt(filename.split('-')[0]);
    const creationDate = new Date(creationTimestamp * 1000);
    const creationDateString = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    }).format(creationDate);

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
        .map(f => {
            const filename = parse(f.name).name
            const title = f.name.split('-')[1].replaceAll('_', ' ').replace('.md', '')
            const creationDate = parseInt(f.name.split('-')[0]);
            const creationDateString = PrintContentReadableCreationTime(f.name);

            return ({
                filename,
                title: title,
                creationDateString,
                creationDate
            });
        })
        .sort((a, b) => b.creationDate - a.creationDate)

    return data;
}
