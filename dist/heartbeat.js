"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heartbeat = void 0;
const axios_1 = __importDefault(require("axios"));
class Heartbeat {
    constructor() {
        this.token = process.env.BP_TOKEN || '';
        if (!this.token) {
            throw new Error('BP_TOKEN environment variable is required');
        }
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://backpack.tf/api/agent/status';
            const params = new URLSearchParams({
                token: this.token
            });
            const response = yield axios_1.default.post(url, params);
            return response.data.status;
        });
    }
    registerOrRefresh(userAgentName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://backpack.tf/api/agent/pulse';
            const params = new URLSearchParams({
                token: this.token
            });
            const headers = {
                'User-Agent': userAgentName
            };
            const response = yield axios_1.default.post(url, params, { headers });
            return response.data.status;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://backpack.tf/api/agent/stop';
            const params = new URLSearchParams({
                token: this.token
            });
            const response = yield axios_1.default.post(url, params);
            return response.data.status;
        });
    }
}
exports.Heartbeat = Heartbeat;
