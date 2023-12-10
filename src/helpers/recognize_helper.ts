import { createWorker } from 'tesseract.js';

class RecognizeHelper {
    static process = async (filePath: string): Promise<string> => {
        const worker = await createWorker('eng');
        // const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
        const ret = await worker.recognize(filePath);
        const result = ret.data.text;
        await worker.terminate();
        return result.replace(/[ \n\-*+()_]/g, '');
    }
}

export default RecognizeHelper;