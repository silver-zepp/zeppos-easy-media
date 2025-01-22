export class SoundPlayer {
    static SetLogLevel(level: any): void;
    constructor(options?: {});
    get get(): any;
    get set(): any;
    onComplete(callback: any): void;
    play(path: any): void;
    pause(): void;
    resume(): void;
    stop(): void;
    changeFile(path: any): void;
    destroy(): void;
    #private;
}
