export namespace __SPExtra {
    export { Get };
    export { Set };
}
declare class Get {
    constructor(player: any, get_IsPlaying: any);
    volume(): any;
    duration(): any;
    title(): any;
    artist(): any;
    mediaInfo(): any;
    status(): any;
    statusName(): any;
    isPlaying(): any;
    isPaused(): boolean;
    isStopped(): boolean;
    #private;
}
declare class Set {
    constructor(player: any);
    volume(vol: any): any;
    #private;
}
export {};
