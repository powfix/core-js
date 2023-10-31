"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const jose = __importStar(require("jose"));
const logWithTs = (...p) => {
    console.log(Date.now(), ...p);
};
class Session {
    // Emitter
    // private emitter = new EventEmitter({});
    // public on = this.emitter.on;
    // public off = this.emitter.off;
    // private emit = this.emitter.emit;
    constructor(options) {
        // Init service parameters
        console.log('Session initialized', Date.now(), options.api);
        this.api = options.api;
        this.storageProvider = options.storageProvider;
    }
    getKey() {
        try {
            if (this.storageProvider.key) {
                return this.storageProvider.key();
            }
        }
        catch (e) {
            console.error(e);
        }
        return Session.STORAGE_KEY.SESSION_AUTHORIZATION;
    }
    hasAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.getAuthorization());
        });
    }
    getAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storageProvider.get(this.getKey());
        });
    }
    setAuthorization(authorization) {
        return __awaiter(this, void 0, void 0, function* () {
            if (authorization === null) {
                yield this.removeAuthorization();
                return null;
            }
            let nextAuthorization = yield (() => __awaiter(this, void 0, void 0, function* () {
                if (authorization === undefined) {
                    return yield this.getAuthorization();
                }
                return authorization;
            }))();
            if (!nextAuthorization) {
                console.log('nextAuthorization is null or undefined');
                return null;
            }
            try {
                // Replace Bearer prefix
                nextAuthorization = nextAuthorization.replace(/^Bearer\s+/, '');
                const decoded = jose.decodeJwt(nextAuthorization);
                if (!decoded) {
                    console.warn('decode failed');
                    return null;
                }
                logWithTs('decode successfully', decoded);
                // AsyncStorage 에 토큰 저장
                yield this.storageProvider.set(this.getKey(), nextAuthorization);
                // API Instance header 설정
                this.api.defaults.headers.common.Authorization = `Bearer ${nextAuthorization}`;
                // Return
                return nextAuthorization;
            }
            catch (e) {
                console.error(e);
            }
            return null;
        });
    }
    removeAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            // API Instance header 에서 토큰 제거
            delete this.api.defaults.headers.common.Authorization;
            // 스토리지에서 authorization 제거
            yield this.storageProvider.remove(this.getKey());
        });
    }
}
exports.Session = Session;
(function (Session) {
    let STORAGE_KEY;
    (function (STORAGE_KEY) {
        STORAGE_KEY["SESSION_AUTHORIZATION"] = "SESSION_AUTHORIZATION";
    })(STORAGE_KEY = Session.STORAGE_KEY || (Session.STORAGE_KEY = {}));
})(Session || (exports.Session = Session = {}));
