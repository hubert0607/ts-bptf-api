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
exports.SnapshotsClient = void 0;
const axios_1 = __importDefault(require("axios"));
const bottleneck_1 = __importDefault(require("bottleneck"));
const STANDARD_LIMITER = new bottleneck_1.default({
    maxConcurrent: 1,
    minTime: 10000 // 6 requests/minute
});
class SnapshotsClient {
    constructor() {
        this.token = process.env.BP_TOKEN;
    }
    getSnapshot(sku) {
        return __awaiter(this, void 0, void 0, function* () {
            return STANDARD_LIMITER.schedule(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get('https://backpack.tf/api/classifieds/listings/snapshot', {
                    params: {
                        token: this.token,
                        appid: 440,
                        sku
                    }
                });
                return response.data;
            }));
        });
    }
}
exports.SnapshotsClient = SnapshotsClient;
