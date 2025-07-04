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
exports.BatchClientV2 = void 0;
const axios_1 = __importDefault(require("axios"));
const bottleneck_1 = __importDefault(require("bottleneck"));
const BATCH_LIMITER = new bottleneck_1.default({
    maxConcurrent: 1,
    minTime: 6000 // 10 requests/minute
});
class BatchClientV2 {
    constructor(autoSendTimeInterval = 5 * 60 * 1000) {
        this.listings = [];
        this.timer = null;
        this.token = process.env.BP_TOKEN;
        this.startAutoSend(autoSendTimeInterval);
    }
    startAutoSend(autoSendTimeInterval) {
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (this.listings.length > 0) {
                yield this.sendBatch();
            }
        }), autoSendTimeInterval);
    }
    addListing(listing) {
        this.listings.push(listing);
        this.checkBatchSize();
    }
    addBuyListing(item, currencies, details) {
        const listing = {
            item: item,
            currencies: currencies,
            offers: 1,
            buyout: 1,
            details: details
        };
        this.addListing(listing);
    }
    addSellListing(itemId, currencies, details) {
        const listing = {
            id: itemId,
            offers: 1,
            buyout: 1,
            currencies: currencies,
            details: details
        };
        this.addListing(listing);
    }
    checkBatchSize() {
        if (this.listings.length >= 100) {
            this.sendBatch();
        }
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.listings.length === 0)
                return [];
            const result = yield this.sendBatch();
            return result;
        });
    }
    sendBatch() {
        return __awaiter(this, void 0, void 0, function* () {
            const batchToSend = [...this.listings];
            this.listings = [];
            try {
                const result = yield BATCH_LIMITER.schedule(() => __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.post('https://backpack.tf/api/v2/classifieds/listings/batch', batchToSend, { params: { token: this.token } });
                    return response.data;
                }));
                return result;
            }
            catch (error) {
                this.listings.unshift(...batchToSend);
                console.error('Batch send failed:', error);
                throw error;
            }
        });
    }
    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
exports.BatchClientV2 = BatchClientV2;
// Example usage
if (require.main === module) {
    const batchClient = new BatchClientV2();
    let itemNew = {
        baseName: 'Rocket Launcher',
        quality: { id: 11 },
        killstreakTier: 3,
        tradable: true,
        craftable: true,
        australium: true,
        festivized: true,
        sheen: { id: 1, name: 'Team Shine' },
        spells: [
            {
                spellId: 'SPELL: Halloween death ghosts',
                type: 'weapon'
            },
            {
                spellId: 'SPELL: Halloween pumpkin explosions',
                type: 'weapon'
            }
        ],
    };
    batchClient.addBuyListing(itemNew, { metal: 0.11, keys: 1 }, 'hello world');
    batchClient.flush();
}
