const NEAR_MAINNET_RPC: string = "https://rpc.mainnet.near.org/";

export class RpcManager {
    id: Number = 0;

    send(request): Promise<object> {
        return fetch(NEAR_MAINNET_RPC, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });
    }

    async getWidget(accountId, widgetPath): Promise<Array<object>> {
        return this.getWidgets(accountId, [widgetPath]);
    }

    async getWidgets(accountId, widgetsPath): Promise<Array<object>> {
        const keys = await this.getAccountWidgetKeys(accountId, widgetsPath);
        const chunks = this.chunkinize(keys);

        const widgets = chunks.map(async (chunk) => {
            const request = {
                keys: chunk.map((path) => this.getWidgetPath(accountId, path))
            };

            const result = await this.send(
                this.createRequest(request)
            );

            const response = await result.json();

            const { [accountId]: { widget } } = this.parseResponse(response);

            return widget;
        })

        return await Promise.all(widgets).then((result: Array<any>) => result.reduce((acc, obj) => ({...acc, ...obj}), {}));
    }

    async getAccountWidgetKeys(accountId: string, widgetsPath: Array<string>): Promise<Array<string>> {
        const request = {
            keys: widgetsPath.map((path: string) => this.getWidgetPath(accountId, path))
        };

        const result = await this.send(
            this.createRequest(request, "keys")
        );

        const response = await result.json();

        const { [accountId]: { widget: keys } } = this.parseResponse(response);

        return Object.keys(keys || []);
    }

    createRequest(args: object = {}, method: string = "get"): object {
        return {
            "method": "query",
            "params": {
                "request_type": "call_function",
                "account_id": "social.near",
                "method_name": method,
                "args_base64": btoa(JSON.stringify(args)),
                "finality": "optimistic"
            },
            "id": ++this.id,
            "jsonrpc": "2.0"
        };
    }

    getWidgetPath(accountId: string, widgetPath: string): string {
        return `${accountId}/widget/${widgetPath}`;
    }

    parseResponse(response: object): object {
        const encodedData = this.processData(response.result.result);
        return JSON.parse(decodeURIComponent(escape(encodedData)));
    }

    processData(data: Array<any>): string {
        let result = '';
        const chunkSize = 10000;

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            result += String.fromCharCode(...chunk);
        }

        return result;
    }

    chunkinize(data: Array<any>, size: Number): Array<any> {
        return [...this.chunk(data, size || 100)];
    }

    *chunk<T>(data: T[], size: number): Generator<T[], void> {
        for (let i = 0; i < data.length; i += size) {
            yield data.slice(i, i + size);
        }
    }
}