export function setDebugLevel(level: any): void;
export function debugLog(level: any, msg?: string, ...msgs: any[]): void;
export function TimeIt(level: any, msg_or_func: any, func_or_null: any): any;
export namespace QuickJS {
    let now: () => number;
    function noop(): void;
}
