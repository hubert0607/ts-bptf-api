import { SnapshotResponse } from './interfaces/snapshots';
export declare class SnapshotsClient {
    private readonly token;
    constructor();
    getSnapshot(sku: string): Promise<SnapshotResponse>;
}
//# sourceMappingURL=snapshots.d.ts.map