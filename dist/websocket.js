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
exports.default = initializeWebsocket;
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const ws_1 = __importDefault(require("ws"));
const WS_URL = 'wss://ws.backpack.tf/events';
function initializeWebsocket(wsEventsHandler) {
    return __awaiter(this, void 0, void 0, function* () {
        const ws = new reconnecting_websocket_1.default(WS_URL, [], {
            WebSocket: ws_1.default,
            connectionTimeout: 5000,
            maxRetries: Infinity,
            maxReconnectionDelay: 30000,
            minReconnectionDelay: 1000,
        });
        ws.addEventListener('open', () => console.log('🔌 Connected to WebSocket server'));
        ws.addEventListener('close', (e) => console.log(`🔌 WebSocket closed: ${e.code} ${e.reason}`));
        ws.addEventListener('error', (err) => console.error('❌ WebSocket error:', err));
        ws.addEventListener('message', (event) => {
            try {
                let events = JSON.parse(event.data.toString());
                events = events.filter(e => e.payload.appid === 440);
                events = events.filter(e => e.payload.steamid === process.env.MY_STEAM_ID);
                if (events.length === 0) {
                    return;
                }
                console.log(JSON.stringify(events[0], null, 2));
                wsEventsHandler(events);
            }
            catch (err) {
                console.error('❌ Failed to parse or save event:', err);
            }
        });
    });
}
