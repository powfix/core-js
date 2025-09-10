import moment from "moment";
import EventEmitter3 from 'eventemitter3';

export interface Sequence {
  key: string;                          // 고유키값
  required?: boolean;                    // 오류를 무시할건지
  minimumExecutionTime?: number;        // 최소실행 시간
  task: Function;                   // Promise 작업
  description?: string;                 // 설명
}

export enum SequencerStatus {
  IDLE,
  RUNNING,
  ERROR,
  DONE,
}

export interface SequencerOption {
  sequences?: Sequence[];
  minimumExecutionTime?: number;
}

export enum SequencerEvent {
  START = 'START',
  END = 'END',

  SEQUENCE_START = 'SEQUENCE_START',
  SEQUENCE_END = 'SEQUENCE_END',
}

export class Sequencer {
  protected readonly sequences: Sequence[] = [];
  protected status: SequencerStatus = SequencerStatus.IDLE;
  protected minimumExecutionTime: number = 0;

  // Reset variables task is done
  currentSequence: Sequence | null = null;
  startTimestamp: number | null = null;
  endTimestamp: number | null = null;

  // Emitter
  eventEmitter = new EventEmitter3();

  constructor(option?: SequencerOption) {
    if (option?.sequences) {
      this.sequences.push(...option.sequences);
    }
  }

  get getCurrentTimeStamp(): number {
    return parseInt(moment().format('x'), 10);
  }

  get executionTime(): number | null {
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

  pushSequence = (sequence: Sequence) => {
    this.sequences.push(sequence);
  }

  start = async () => {
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
        await new Promise<void>(async (resolve, reject) => {
          try {
            console.log(`Sequence ${sequence.key} start`);

            await sequence.task?.();

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
          } catch (e) {
            reject(e);
          }
        });

        console.log('Out of Promise');

        // Emitter
        this.eventEmitter.emit(SequencerEvent.SEQUENCE_END, sequence);
      } catch (e) {
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
  };
}
