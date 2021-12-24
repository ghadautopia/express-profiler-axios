import { createStream } from '@ghadautopia/express-profiler';
import { RequestHandler } from 'express';
import { AxiosInstance } from 'axios';
import onFinished from 'on-finished';

export const STR_AXIOS = 'axios';

const axiosStream = createStream(STR_AXIOS);

export const axiosStreamMiddleware: (axios: AxiosInstance) => RequestHandler = (axios: AxiosInstance) => {
    return (req, res, next) => {

        const intercept = axios.interceptors.response.use(async function (response) {
            await axiosStream.presist(res, response);
            return response;
        }, async function (error) {
            await axiosStream.presist(res, { ...error.response, error });
            return Promise.reject(error);
        });

        onFinished(res, () => axios.interceptors.response.eject(intercept));

        next();
    }
}
