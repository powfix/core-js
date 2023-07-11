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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const events_1 = __importDefault(require("events"));
const jose = __importStar(require("jose"));
const logWithTs = (...p) => {
    console.log(Date.now(), ...p);
};
class Session {
    constructor(options) {
        this.authorization = null;
        // Emitter
        this.emitter = new events_1.default({});
        this.on = this.emitter.on;
        this.off = this.emitter.off;
        this.emit = this.emitter.emit;
        this.getAuthorization = () => this.authorization;
        this.setAuthorization = (authorization) => {
            if (authorization) {
                this.authorization = authorization.replace(/^Bearer\s+/, '');
            }
            else {
                this.authorization = authorization;
            }
        };
        this.hasAuthorization = () => !!this.getAuthorization();
        this.setSession = (token) => __awaiter(this, void 0, void 0, function* () {
            token = token.replace(/^Bearer\s+/, '');
            const decoded = jose.decodeJwt(token);
            if (!decoded) {
                throw new Error('failed to decode');
            }
            logWithTs('decode successfully', decoded);
            // AsyncStorage 에 토큰 저장
            yield this.storageProvider.set(Session.STORAGE_KEY.SESSION_AUTHORIZATION, token);
            // API Instance header 설정
            this.api.setHeader("Authorization", token);
            // update authorization
            this.setAuthorization(token);
        });
        this.check = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.api.headers) === null || _a === void 0 ? void 0 : _a.Authorization)) {
                throw new Error('!this.api.headers?.Authorization');
            }
            if (!(yield this.api.get("/v1/auth/session")).ok) {
                throw new Error('unauthorized');
            }
        });
        // TODO 토큰 갱신
        this.update = () => __awaiter(this, void 0, void 0, function* () { });
        /**
         * 서버에서 토큰을 만료처리하고 로컬 API 인스턴스의 헤더에서 토큰을 제거한다.
         * 서버에서 토큰 만료에 실패해도 성공으로 반환될 수 있다.
         */
        this.deleteSession = () => __awaiter(this, void 0, void 0, function* () {
            // 서버에서 토큰 만료 처리
            yield this.api.delete("/v1/auth/session");
            // API Instance header 에서 토큰 제거
            this.api.deleteHeader("Authorization");
            // 스토리지에서 authorization 제거
            yield this.storageProvider.remove(Session.STORAGE_KEY.SESSION_AUTHORIZATION);
        });
        console.log("Session():initialized at", Date.now());
        // Init service parameters
        this.api = options.api;
        this.storageProvider = options.storageProvider;
    }
}
exports.Session = Session;
(function (Session) {
    let STORAGE_KEY;
    (function (STORAGE_KEY) {
        STORAGE_KEY["SESSION_AUTHORIZATION"] = "SESSION_AUTHORIZATION";
    })(STORAGE_KEY = Session.STORAGE_KEY || (Session.STORAGE_KEY = {}));
})(Session || (exports.Session = Session = {}));
