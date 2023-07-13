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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
// import EventEmitter from 'events';
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
        this.hasAuthorization = () => !!this.getAuthorization();
        this.getAuthorization = () => {
            return this.storageProvider.get(Session.STORAGE_KEY.SESSION_AUTHORIZATION);
        };
        this.setAuthorization = (authorization) => {
            if (authorization === null) {
                this.removeAuthorization();
                return;
            }
            if (authorization === undefined) {
                authorization = this.getAuthorization();
            }
            if (!authorization) {
                console.log('authorization is null or undefined');
                return;
            }
            authorization = authorization.replace(/^Bearer\s+/, '');
            const decoded = jose.decodeJwt(authorization);
            if (!decoded) {
                throw new Error('failed to decode');
            }
            logWithTs('decode successfully', decoded);
            // AsyncStorage 에 토큰 저장
            this.storageProvider.set(Session.STORAGE_KEY.SESSION_AUTHORIZATION, authorization);
            // API Instance header 설정
            this.api.defaults.headers.common.Authorization = `Bearer ${authorization}`;
        };
        this.removeAuthorization = () => {
            // API Instance header 에서 토큰 제거
            delete this.api.defaults.headers.common.Authorization;
            // 스토리지에서 authorization 제거
            this.storageProvider.remove(Session.STORAGE_KEY.SESSION_AUTHORIZATION);
        };
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
