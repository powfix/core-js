/// <reference types="node" />
import EventEmitter from 'events';
export interface Sequence {
    key: string;
    required?: boolean;
    minimumExecutionTime?: number;
    task: Function;
    description?: string;
}
export declare enum SequencerStatus {
    IDLE = 0,
    RUNNING = 1,
    ERROR = 2,
    DONE = 3
}
export interface SequencerOption {
    sequences?: Sequence[];
    minimumExecutionTime?: number;
}
export declare enum SequencerEvent {
    START = "START",
    END = "END",
    SEQUENCE_START = "SEQUENCE_START",
    SEQUENCE_END = "SEQUENCE_END"
}
export declare class Sequencer {
    protected readonly sequences: Sequence[];
    protected status: SequencerStatus;
    protected minimumExecutionTime: number;
    currentSequence: Sequence | null;
    startTimestamp: number | null;
    endTimestamp: number | null;
    eventEmitter: EventEmitter;
    constructor(option?: SequencerOption);
    get getCurrentTimeStamp(): number;
    get executionTime(): number | null;
    pushSequence: (sequence: Sequence) => void;
    start: () => Promise<undefined>;
}
