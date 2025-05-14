import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["test/**/*.test.ts"],
        exclude: ["node_modules", "dist"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/**/*.ts"],
            exclude: [
                "node_modules/",
                "dist/",
                "test/",
                "types/",
                "*.config.ts",
                "*.config.js",
                "*.util.ts",
                "*.plugins.ts",
            ],
        },
    },
    resolve: {
        alias: {
            "~": resolve(__dirname, "./src"),
            "!": resolve(__dirname, "./test"),
        },
    },
});
