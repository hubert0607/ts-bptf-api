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
exports.ClassifiedsClient = void 0;
const axios_1 = __importDefault(require("axios"));
const bottleneck_1 = __importDefault(require("bottleneck"));
const BATCH_LIMITER = new bottleneck_1.default({
    maxConcurrent: 1,
    minTime: 6000 // 10 requests/minute
});
const STANDARD_LIMITER = new bottleneck_1.default({
    maxConcurrent: 1,
    minTime: 1000 // 60 requests/minute
});
class ClassifiedsClient {
    constructor(token) {
        this.token = token;
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
    createBatchListings(listings) {
        return __awaiter(this, void 0, void 0, function* () {
            return BATCH_LIMITER.schedule(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.post('https://backpack.tf/api/classifieds/list/v1', {
                    token: this.token,
                    listings
                });
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
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new ClassifiedsClient(process.env.BP_TOKEN);
        // // Get snapshot
        // const snapshot = await client.getSnapshot('Burning Flames Team Captain');
        // console.log(snapshot)
        // const newListing: BatchListing = {
        //     intent: 1,
        //     currencies: { metal: 2, keys: 2 },
        //     item: {
        //       quality: "Strange",
        //       item_name: "Professional Killstreak Minigun",
        //     }
        //   };
        //   const batchResult = await client.createBatchListings([newListing]);
    });
}
