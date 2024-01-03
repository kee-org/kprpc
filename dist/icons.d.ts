export declare function toDataUrl(iconData: any): string | null;
export declare function toBase64PNG(iconData: any): string | null;
export declare function mapStandardToBase64PNG(id?: number): string;
export declare function fromDataUrl(dataUrl: string): string | null;
export declare function fromBase64PNG(base64Data: string): Uint8Array | null;
export declare function searchBase64PNGToStandard(dataUrl: string): number | null;
export declare const iconMap: string[];
