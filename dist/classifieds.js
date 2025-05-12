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
exports.BatchClient = exports.ClassifiedsClient = void 0;
const axios_1 = __importDefault(require("axios"));
const bottleneck_1 = __importDefault(require("bottleneck"));
const STANDARD_LIMITER = new bottleneck_1.default({
    maxConcurrent: 1,
    minTime: 1000 // 60 requests/minute
});
const BATCH_LIMITER = new bottleneck_1.default({
    maxConcurrent: 1,
    minTime: 6000 // 10 requests/minute
});
class ClassifiedsClient {
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
    updateListing(listingId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return STANDARD_LIMITER.schedule(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.patch(`https://backpack.tf/api/v2/classifieds/listings/${listingId}`, update, { params: { token: this.token } });
                return response.data;
            }));
        });
    }
    deleteListing(listingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return STANDARD_LIMITER.schedule(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.delete(`https://backpack.tf/api/v2/classifieds/listings/${listingId}`, { params: { token: this.token } });
                return response.data;
            }));
        });
    }
}
exports.ClassifiedsClient = ClassifiedsClient;
class BatchClient {
    constructor() {
        this.listings = [];
        this.timer = null;
        this.token = process.env.BP_TOKEN;
        this.startAutoSend();
    }
    startAutoSend() {
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (this.listings.length > 0) {
                yield this.sendBatch();
            }
        }), 5 * 60 * 1000); // 5 minut
    }
    addListing(listing) {
        this.listings.push(listing);
        this.checkBatchSize();
    }
    checkBatchSize() {
        if (this.listings.length >= 100) {
            this.sendBatch();
        }
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.listings.length === 0)
                return;
            yield this.sendBatch();
        });
    }
    sendBatch() {
        return __awaiter(this, void 0, void 0, function* () {
            const batchToSend = [...this.listings];
            this.listings = [];
            try {
                yield BATCH_LIMITER.schedule(() => __awaiter(this, void 0, void 0, function* () {
                    yield axios_1.default.post('https://backpack.tf/api/classifieds/list/v1', {
                        token: this.token,
                        listings: batchToSend
                    });
                }));
            }
            catch (error) {
                this.listings.unshift(...batchToSend);
                console.error('Batch send failed:', error);
                throw error;
            }
        });
    }
}
exports.BatchClient = BatchClient;
