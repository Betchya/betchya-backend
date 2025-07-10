import { Hono, Context, TypedResponse } from 'hono';

enum SupportedHttpMethod {
    POST = 'POST'
};

class RouterBuilder {
    private app: Hono;
    
    constructor(basePath: string) {
        if (!basePath.startsWith('/')) {
            throw new Error('Base path must start with a forward slash (/)');
        }

        this.app = new Hono().basePath(basePath);
    }
    
    public getApp(): Hono {
        return this.app;
    }
    
    public addRoute(method: SupportedHttpMethod, path: string, requestHandler: (context: Context) => Promise<TypedResponse>): void {
        if (method === SupportedHttpMethod.POST) {
            this.app.post(path, requestHandler);
            this.app.all(path, (c) => c.text('Method Not Allowed', 405));
        }
    }
};

export { RouterBuilder, SupportedHttpMethod };