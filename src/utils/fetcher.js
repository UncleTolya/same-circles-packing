define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetcher = exports.parseWithoutNulls = exports.stringifyWithUndefined = exports.parseStackTrace = void 0;
    const NO_CONTENT = 204;
    const INTERNAL_SERVER_ERROR = 500;
    function parseStackTrace(stackTrace) {
        try {
            const message = /<p><b>Message<\/b>([^<]*)/.exec(stackTrace);
            if (message) {
                return message[1];
            }
            const result = /Exception: (.*)/.exec(stackTrace);
            return result ? result[1] : '';
        }
        catch (_a) {
            return stackTrace;
        }
    }
    exports.parseStackTrace = parseStackTrace;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exports.stringifyWithUndefined = (obj) => {
        let item = obj;
        if (typeof obj === 'boolean') {
            item = JSON.stringify(obj);
        }
        // tslint:disable-next-line no-null-keyword
        return JSON.stringify(item, (k, v) => (v === undefined ? null : v));
    };
    // eslint-disable-next-line arrow-parens
    exports.parseWithoutNulls = (value) => {
        return JSON.parse(value, (k, v) => (v === null ? undefined : v));
    };
    class Fetcher {
        post(url, params = {}) {
            params.method = 'post';
            return this.query(url, params);
        }
        delete(url, params = {}) {
            params.method = 'delete';
            return this.query(url, params);
        }
        get(url, params = {}) {
            params.method = 'get';
            return this.query(url, params);
        }
        query(url, params = {}) {
            if (!url) {
                throw new Error('>>> CANNOT CALL FETCH() WITHOUT PASSED URL');
            }
            let encodedUrl = url;
            if (!params.method || ['get', 'delete'].includes(params.method)) {
                encodedUrl = this.encodeParamsInUrl(url, params.body);
                delete params.body;
                params.rawBody = true;
            }
            const computedParams = this.getParameters(params);
            return fetch(encodedUrl, computedParams)
                .then((response) => {
                var _a;
                if (response.status === NO_CONTENT) {
                    return;
                }
                if (response.status === INTERNAL_SERVER_ERROR) {
                    return response.text().then((text) => {
                        throw new Error(parseStackTrace(text));
                    });
                }
                const contentType = response.headers.get('content-type');
                if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
                    if (params.dataType && params.dataType !== 'json') {
                        return response[params.dataType]();
                    }
                    return response.text().then(exports.parseWithoutNulls);
                }
                return response[(_a = params.dataType) !== null && _a !== void 0 ? _a : 'text']();
            });
        }
        getParameters({ credentials, headers = {}, cors, body, method = 'get', rawBody, }) {
            const contentTypeHeader = 'content-type';
            if (!headers[contentTypeHeader] && !rawBody) {
                // eslint-disable-next-line no-param-reassign
                headers[contentTypeHeader] = 'application/json';
            }
            return {
                method,
                headers: new Headers(headers),
                mode: cors ? 'cors' : undefined,
                body: rawBody ? body : exports.stringifyWithUndefined(body),
                credentials,
            };
        }
        encodeParamsInUrl(url, body) {
            if (body) {
                const searchParams = new URLSearchParams(Object.entries(body));
                return `${url}?${searchParams}`;
            }
            return url;
        }
    }
    exports.fetcher = new Fetcher();
});
