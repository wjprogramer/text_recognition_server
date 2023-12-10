import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { asyncHandler } from '@src/utils';
import multer from "multer";
import UploadHelper from "@src/helpers/upload_helper";
import RecognizeHelper from "@src/helpers/recognize_helper";
import path from "path";
import svg2img from "svg2img";
import {PromiseWrapper} from "@src/models";
import * as fs from "fs";

export const getMainRouter = () => {
    const mainRouter = express.Router();

    mainRouter.route('/hello')
        .get((_, res) => {
            res.json({ msg: 'hello world' });
        })

    mainRouter.route('/redirect')
        .get((_, res) => {
            res.redirect('https://www.google.com');
        })

    mainRouter.route('/send-html')
        .get((_, res) => {
            res.set('Content-Type', 'text/html');
            res.send(Buffer.from('<h2>Hello ~</h2>'));
        })

    mainRouter.route('/order')
        .get(asyncHandler(async (_, res) => {
            // const { env } = getGlobal();
            // const form = new FormData();
            // form.append('MerchantID', env.M_MERCHANT_ID);
            // form.append('file', fs.createReadStream('/pictures/avatar.png'))
            // const ecPayRes = await axios.post(`${env.EC_PAY_DOMAIN}/Cashier/AioCheckOut/V5`);
            res.json({ msg: 'Hi' });
        }));

    mainRouter.route('/recognize')
        .post(UploadHelper.getStorage().single('image'), asyncHandler(async (req, res,) => {
            const file = req.file;
            if (!file) {
                res.status(400).send('No image');
                return;
            }
            const fileExt = path.extname(file.originalname);
            let newFilePath = file.path;
            if (fileExt == '.svg') {
                const completer = PromiseWrapper.completer<string>();
                svg2img(
                    file.path,
                    // @ts-ignore
                    { format: 'jpg', quality: 100 },
                    (err, buffer) => {
                        // fs.writeSync();
                        if (err) {
                            completer.reject(err);
                        } else {
                            console.log(`buffer.length ${buffer.length}`);
                            const fileDir = path.dirname(file.path);
                            const newFilePath = path.join(fileDir, `${path.basename(file.path, fileExt)}.jpg`);
                            fs.writeFileSync(newFilePath, buffer);
                            completer.resolve(newFilePath);
                        }
                    },
                );
                newFilePath = await completer.promise;
            }
            const result = await RecognizeHelper.process(newFilePath);
            res.json({ success: true, result });
        }));

    return mainRouter;
}