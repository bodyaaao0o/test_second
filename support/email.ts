import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, './generated-email.txt');

export function setGeneratedEmail(email: string) {
    fs.writeFileSync(filePath, email, { encoding: 'utf-8' });
}

export function getGeneratedEmail(): string {
    if (!fs.existsSync(filePath)) {
        throw new Error('❌ Email file not found! Make sure login test runs first.');
    }
    return fs.readFileSync(filePath, { encoding: 'utf-8' }).trim();
}
