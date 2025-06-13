export declare class Heartbeat {
    private token;
    constructor();
    getStatus(): Promise<string>;
    registerOrRefresh(userAgentName: string): Promise<string>;
    stop(): Promise<string>;
}
//# sourceMappingURL=heartbeat.d.ts.map