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
exports.Sequencer = exports.SequencerEvent = exports.SequencerStatus = void 0;
const moment_1 = __importDefault(require("moment/moment"));
const eventemitter3_1 = __importDefault(require("eventemitter3"));
var SequencerStatus;
(function (SequencerStatus) {
    SequencerStatus[SequencerStatus["IDLE"] = 0] = "IDLE";
    SequencerStatus[SequencerStatus["RUNNING"] = 1] = "RUNNING";
    SequencerStatus[SequencerStatus["ERROR"] = 2] = "ERROR";
    SequencerStatus[SequencerStatus["DONE"] = 3] = "DONE";
})(SequencerStatus || (exports.SequencerStatus = SequencerStatus = {}));
var SequencerEvent;
(function (SequencerEvent) {
    SequencerEvent["START"] = "START";
    SequencerEvent["END"] = "END";
    SequencerEvent["SEQUENCE_START"] = "SEQUENCE_START";
    SequencerEvent["SEQUENCE_END"] = "SEQUENCE_END";
})(SequencerEvent || (exports.SequencerEvent = SequencerEvent = {}));
class Sequencer {
    constructor(option) {
        this.sequences = [];
        this.status = SequencerStatus.IDLE;
        this.minimumExecutionTime = 0;
        // Reset variables task is done
        this.currentSequence = null;
        this.startTimestamp = null;
        this.endTimestamp = null;
        // Emitter
        this.eventEmitter = new eventemitter3_1.default();
        this.pushSequence = (sequence) => {
            this.sequences.push(sequence);
        };
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            if (this.status === SequencerStatus.RUNNING) {
                console.warn('Sequencer status is', this.status);
                return;
            }
            this.status = SequencerStatus.RUNNING;
            this.currentSequence = null;
            this.startTimestamp = this.getCurrentTimeStamp;
            this.endTimestamp = null;
            console.log(`Sequence started, started at ${this.startTimestamp}, MINIMUM_EXECUTION_TIME is ${this.minimumExecutionTime}`);
            for (let sequence of this.sequences) {
                console.log('Currently total execution time', this.executionTime);
                const sequenceStartTimeStamp = this.getCurrentTimeStamp;
                this.currentSequence = sequence;
                // Emitter
                this.eventEmitter.emit(SequencerEvent.SEQUENCE_START, sequence);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        try {
                            console.log(`Sequence ${sequence.key} start`);
                            yield ((_a = sequence.task) === null || _a === void 0 ? void 0 : _a.call(sequence));
                            const sequenceEndTimeStamp = this.getCurrentTimeStamp;
                            const sequenceExecutionTime = sequenceEndTimeStamp - sequenceStartTimeStamp;
                            console.log(`✅ Sequence ${sequence.key} done at`, sequenceEndTimeStamp);
                            console.log('Sequence execution time', sequenceExecutionTime, 'ms');
                            if (sequence.minimumExecutionTime) {
                                console.log(`Sequence has minimumExecutionTime`, sequence.minimumExecutionTime, 'ms');
                                if (sequenceExecutionTime < sequence.minimumExecutionTime) {
                                    const delay = sequence.minimumExecutionTime - sequenceExecutionTime;
                                    console.log(`Sequence will delay`, delay, 'ms');
                                    let dotInterpreterBlocked = false;
                                    const dotInterpreter = setInterval(() => {
                                        if (dotInterpreterBlocked) {
                                            console.log('!');
                                            return;
                                        }
                                        console.log('.');
                                    }, 100);
                                    setTimeout(() => {
                                        dotInterpreterBlocked = true;
                                        clearInterval(dotInterpreter);
                                        console.log('done');
                                        resolve();
                                    }, delay);
                                    return;
                                }
                                console.log('Sequence execution time is greater than minimum execution time');
                                resolve();
                                return;
                            }
                            resolve();
                        }
                        catch (e) {
                            reject(e);
                        }
                    }));
                    console.log('Out of Promise');
                    // Emitter
                    this.eventEmitter.emit(SequencerEvent.SEQUENCE_END, sequence);
                }
                catch (e) {
                    if (sequence.required) {
                        console.error(`🚫 Sequence ${sequence.key} failed`, e);
                        this.status = SequencerStatus.ERROR;
                        this.currentSequence = null;
                        this.endTimestamp = this.currentSequence;
                        // IMPORTANT
                        return Promise.reject({
                            sequence,
                            reason: e,
                        });
                    }
                    console.log(`Sequence ${sequence.key} failed`, e);
                    // Emitter
                    this.eventEmitter.emit(SequencerEvent.SEQUENCE_END, sequence);
                }
            }
            this.status = SequencerStatus.DONE;
            this.currentSequence = null;
            this.endTimestamp = this.currentSequence;
        });
        if (option === null || option === void 0 ? void 0 : option.sequences) {
            this.sequences.push(...option.sequences);
        }
    }
    get getCurrentTimeStamp() {
        return parseInt((0, moment_1.default)().format('x'), 10);
    }
    get executionTime() {
        if (this.status === SequencerStatus.IDLE) {
            return null;
        }
        if (!this.startTimestamp) {
            return null;
        }
        if (this.startTimestamp && this.endTimestamp) {
            return this.endTimestamp - this.startTimestamp;
        }
        return this.getCurrentTimeStamp - this.startTimestamp;
    }
}
exports.Sequencer = Sequencer;
