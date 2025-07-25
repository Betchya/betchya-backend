import { Hono, Context, TypedResponse } from 'hono';

enum SupportedHttpMethod {
    POST = 'POST'
};

class RouterBuilder {
    private app: Hono = new Hono();
    private basePath: string = '';
    private routes: Array<{ method: SupportedHttpMethod; path: string; }> = [];

    static builder(): RouterBuilder {
        return new RouterBuilder();
    }

    withBasePath(basePath: string): RouterBuilder {
        if (!basePath.startsWith('/')) {
            throw new Error('Base path must start with a forward slash (/)');
        }
        
        this.basePath = basePath;
        this.app = new Hono().basePath(basePath);
        return this;
    }

    withRoute(method: SupportedHttpMethod, path: string, requestHandler: (context: Context) => Promise<TypedResponse>): RouterBuilder {
        if (this.routes.some(route => route.method === method && route.path === path)) {
            throw new Error(`Route ${method} ${path} already exists`);
        };
        
        this.routes.push({ method, path });
        
        if (method === SupportedHttpMethod.POST) {
            this.app.post(path, requestHandler);
            this.app.all(path, (c) => c.text('Method Not Allowed', 405));
        }

        return this;
    }

    build(): Hono {
        if (this.basePath === '') throw new Error("Base path is required and must be set using withBasePath");

        return this.app;
    }
}

export { RouterBuilder, SupportedHttpMethod };