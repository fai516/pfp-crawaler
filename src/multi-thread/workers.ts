import { spawn, Thread, Worker as WorkerThread } from "threads";
import { createArray } from "@util/math";
import { performance } from "perf_hooks";
import Big from "big.js";
import ms from "pretty-ms";

var SegfaultHandler = require("segfault-handler");
SegfaultHandler.registerHandler("crash.log"); // With no argument, SegfaultHandler will generate a generic log file name

export interface IWorkersOpt {
  printLog?: boolean;
  printEvery?: number;
}

export default class Workers {
  protected workers: Awaited<ReturnType<typeof this.createWorker>>[];
  private defaultOpt: IWorkersOpt = {
    printLog: false,
    printEvery: 1,
  };

  public constructor(
    public sourcePath: string,
    public count = 1,
    public opt?: IWorkersOpt
  ) {
    this.opt = {
      ...this.defaultOpt,
      ...opt,
    };
  }
  public async init() {
    this.workers = await Promise.all(
      createArray(this.count).map(() => this.createWorker(this.sourcePath))
    );
    return this;
  }
  protected async createWorker(sourcePath: string) {
    return spawn(new WorkerThread(sourcePath));
  }
  public async terminate() {
    return Promise.all(this.workers.map((worker) => Thread.terminate(worker)));
  }
  public async execute<T>(
    queue: T[],
    func: (
      worker: Awaited<ReturnType<typeof this.createWorker>>,
      workerinput: T
    ) => Promise<string>
  ) {
    console.log(
      `Worker started (workers: ${this.workers.length}, queueLen: ${
        queue.length
      }, opt: ${JSON.stringify(this.opt)})`
    );
    const nQueue = queue.reverse();
    const total = nQueue.length;
    let finished = 0;
    // let totalElapsedInMs = 0;
    return Promise.all(
      this.workers.map(async (worker, workerIndex) => {
        while (nQueue.length > 0) {
          const param = nQueue.pop();
          const workerStart = performance.now();
          const log = await func(worker, param);
          const workerElapsed = performance.now() - workerStart;
          finished++;
          // totalElapsedInMs += workerElapsed;
          const { printLog, printEvery } = this.opt;
          if (printLog && finished % printEvery === 0) {
            const remainingElapsedInMs = new Big(workerElapsed).mul(
              total - finished
            );
            const percentage = new Big(finished).div(total).mul(100).toFixed(2);
            console.log(
              `[worker#${workerIndex}] ${log} - ` +
                `${ms(workerElapsed)} - ` +
                `(${percentage}% - ${finished}/${total} - Remaining: ${ms(
                  remainingElapsedInMs.toNumber()
                )})`
            );
          }
        }
      })
    );
  }
}
