import { Hono, Context, TypedResponse } from 'hono';

enum SupportedHttpMethod {
    POST = 'POST'
};

class RouterBuilder {
    private app: Hono;
    private routes: Array<{ method: SupportedHttpMethod; path: string; handler: (context: Context) => Promise<TypedResponse> }> = [];

    private constructor() {
        this.app = new Hono();
    }

    static builder(): RouterBuilder {
        return new RouterBuilder();
    }

    withBasePath(basePath: string): RouterBuilder {
        if (!basePath.startsWith('/')) {
            throw new Error('Base path must start with a forward slash (/)');
        }
        
        this.app = new Hono().basePath(basePath);
        return this;
    }

    addRoute(method: SupportedHttpMethod, path: string, requestHandler: (context: Context) => Promise<TypedResponse>): RouterBuilder {
        this.routes.push({ method, path, handler: requestHandler });
        return this;
    }

    build(): Hono {
        for (const route of this.routes) {
            if (route.method === SupportedHttpMethod.POST) {
                this.app.post(route.path, route.handler);
                this.app.all(route.path, (c) => c.text('Method Not Allowed', 405));
            }
        }
        return this.app;
    }
}

export { RouterBuilder, SupportedHttpMethod };