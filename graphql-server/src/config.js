"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: 4000,
    graphql_playground: process.env.GRAPHQL_PLAYGROUND === 'true' || true,
    cors_origin: process.env.CORS_ORIGIN || 'http://localhost', // Add CORS origin configuration
};
