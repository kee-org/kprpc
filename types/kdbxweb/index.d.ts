declare module 'kdbxweb' {

    export const Consts: {
        AutoTypeObfuscationOptions: {
            UseClipboard: number;
        };
        CipherId: {
            Aes: string;
            ChaCha20: string;
        };
        CompressionAlgorithm: {
            GZip: number;
        };
        CrsAlgorithm: {
            ArcFourVariant: number;
            ChaCha20: number;
            Salsa20: number;
        };
        Defaults: {
            HistoryMaxItems: number;
            HistoryMaxSize: number;
            KeyEncryptionRounds: number;
            MntncHistoryDays: number;
            RecycleBinName: string;
        };
        ErrorCodes: {
            BadSignature: string;
            FileCorrupt: string;
            InvalidArg: string;
            InvalidKey: string;
            InvalidVersion: string;
            MergeError: string;
            NotImplemented: string;
            Unsupported: string;
        };
        Icons: {
            Apple: number;
            Archive: number;
            BlackBerry: number;
            Book: number;
            CDRom: number;
            Certificate: number;
            Checked: number;
            ClipboardReady: number;
            Clock: number;
            Configuration: number;
            Console: number;
            Digicam: number;
            Disk: number;
            Drive: number;
            DriveWindows: number;
            EMail: number;
            EMailBox: number;
            EMailSearch: number;
            Energy: number;
            EnergyCareful: number;
            Expired: number;
            Feather: number;
            Folder: number;
            FolderOpen: number;
            FolderPackage: number;
            Home: number;
            Homebanking: number;
            IRCommunication: number;
            Identity: number;
            Info: number;
            Key: number;
            List: number;
            LockOpen: number;
            MarkedDirectory: number;
            Memory: number;
            Money: number;
            Monitor: number;
            MultiKeys: number;
            NetworkServer: number;
            Note: number;
            Notepad: number;
            Package: number;
            PaperFlag: number;
            PaperLocked: number;
            PaperNew: number;
            PaperQ: number;
            PaperReady: number;
            Parts: number;
            Pen: number;
            Printer: number;
            ProgramIcons: number;
            Run: number;
            Scanner: number;
            Screen: number;
            Settings: number;
            Star: number;
            TerminalEncrypted: number;
            Thumbnail: number;
            Tool: number;
            TrashBin: number;
            Tux: number;
            UserCommunication: number;
            UserKey: number;
            Warning: number;
            Wiki: number;
            World: number;
            WorldComputer: number;
            WorldSocket: number;
            WorldStar: number;
        };
        KdfId: {
            Aes: string;
            Argon2: string;
        };
        Signatures: {
            FileMagic: number;
            Sig2Kdb: number;
            Sig2Kdbx: number;
        };
    };

    export class KdbxError {
        name: 'KdbxError';
        code: any;
        message: string;
        constructor (code, message);
    }

//     export const Random: {
//         getBytes: any;
//     };

    namespace CryptoEngine {
        // argon2: any;
        // chacha20: any;
        // configure: any;
        // createAesCbc: any;
        export const nodeCrypto: {
            Certificate: any;
            Cipher: any;
            Cipheriv: any;
            DEFAULT_ENCODING: string;
            Decipher: any;
            Decipheriv: any;
            DiffieHellman: any;
            DiffieHellmanGroup: any;
            ECDH: any;
            Hash: any;
            Hmac: any;
            Sign: Function;
            Verify: Function;
            constants: {
                ALPN_ENABLED: number;
                DH_CHECK_P_NOT_PRIME: number;
                DH_CHECK_P_NOT_SAFE_PRIME: number;
                DH_NOT_SUITABLE_GENERATOR: number;
                DH_UNABLE_TO_CHECK_GENERATOR: number;
                ENGINE_METHOD_ALL: number;
                ENGINE_METHOD_CIPHERS: number;
                ENGINE_METHOD_DH: number;
                ENGINE_METHOD_DIGESTS: number;
                ENGINE_METHOD_DSA: number;
                ENGINE_METHOD_ECDH: number;
                ENGINE_METHOD_ECDSA: number;
                ENGINE_METHOD_PKEY_ASN1_METHS: number;
                ENGINE_METHOD_PKEY_METHS: number;
                ENGINE_METHOD_RAND: number;
                ENGINE_METHOD_RSA: number;
                ENGINE_METHOD_STORE: number;
                NPN_ENABLED: number;
                OPENSSL_VERSION_NUMBER: number;
                POINT_CONVERSION_COMPRESSED: number;
                POINT_CONVERSION_HYBRID: number;
                POINT_CONVERSION_UNCOMPRESSED: number;
                RSA_NO_PADDING: number;
                RSA_PKCS1_OAEP_PADDING: number;
                RSA_PKCS1_PADDING: number;
                RSA_PKCS1_PSS_PADDING: number;
                RSA_PSS_SALTLEN_AUTO: number;
                RSA_PSS_SALTLEN_DIGEST: number;
                RSA_PSS_SALTLEN_MAX_SIGN: number;
                RSA_SSLV23_PADDING: number;
                RSA_X931_PADDING: number;
                SSL_OP_ALL: number;
                SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: number;
                SSL_OP_CIPHER_SERVER_PREFERENCE: number;
                SSL_OP_CISCO_ANYCONNECT: number;
                SSL_OP_COOKIE_EXCHANGE: number;
                SSL_OP_CRYPTOPRO_TLSEXT_BUG: number;
                SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: number;
                SSL_OP_LEGACY_SERVER_CONNECT: number;
                SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: number;
                SSL_OP_MICROSOFT_SESS_ID_BUG: number;
                SSL_OP_NETSCAPE_CA_DN_BUG: number;
                SSL_OP_NETSCAPE_CHALLENGE_BUG: number;
                SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: number;
                SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: number;
                SSL_OP_NO_COMPRESSION: number;
                SSL_OP_NO_QUERY_MTU: number;
                SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: number;
                SSL_OP_NO_SSLv2: number;
                SSL_OP_NO_SSLv3: number;
                SSL_OP_NO_TICKET: number;
                SSL_OP_NO_TLSv1: number;
                SSL_OP_NO_TLSv1_1: number;
                SSL_OP_NO_TLSv1_2: number;
                SSL_OP_SINGLE_DH_USE: number;
                SSL_OP_SINGLE_ECDH_USE: number;
                SSL_OP_SSLEAY_080_CLIENT_DH_BUG: number;
                SSL_OP_TLS_BLOCK_PADDING_BUG: number;
                SSL_OP_TLS_D5_BUG: number;
                SSL_OP_TLS_ROLLBACK_BUG: number;
                defaultCipherList: string;
                defaultCoreCipherList: string;
            }
            createCipher: any;
            createCipheriv: any;
            createDecipher: any;
            createDecipheriv: any;
            createDiffieHellman: any;
            createDiffieHellmanGroup: any;
            createECDH: any;
            createHash: any;
            createHmac: any;
            createSign: any;
            createVerify: any;
            getCiphers: any;
            getCurves: any;
            getDiffieHellman: any;
            getHashes: any;
            pbkdf2: any;
            pbkdf2Sync: any;
            privateDecrypt: any;
            privateEncrypt: any;
            prng: any;
            pseudoRandomBytes: any;
            publicDecrypt: any;
            publicEncrypt: any;
            randomBytes: any;
            randomFill: any;
            randomFillSync: any;
            rng: any;
            setEngine: any;
            timingSafeEqual: any;
        };
        // random: any;

/**
 * SHA-256 hash
 * @param {ArrayBuffer} data
 * @returns {Promise.<ArrayBuffer>}
 */
export function sha256(data: ArrayBuffer): any;

/**
 * SHA-512 hash
 * @param {ArrayBuffer} data
 * @returns {Promise.<ArrayBuffer>}
 */
export function sha512(data: ArrayBuffer): any;

/**
 * HMAC-SHA-256 hash
 * @param {ArrayBuffer} key
 * @param {ArrayBuffer} data
 * @returns {Promise.<ArrayBuffer>}
 */
export function hmacSha256(key: ArrayBuffer, data: ArrayBuffer): any;

/**
 * AES-CBC using WebCrypto
 * @constructor
 */
export class AesCbcSubtle {
    constructor();

}

/**
 * AES-CBC using node crypto
 * @constructor
 */
export class AesCbcNode {
    constructor();

}

/**
 * Creates AES-CBC implementation
 * @returns AesCbc
 */
export function createAesCbc(): any;

/**
 * Generates random bytes of specified length
 * @param {Number} len
 * @returns {Uint8Array}
 */
export function random(len: number): Uint8Array;

/**
 * Encrypts with ChaCha20
 * @param {ArrayBuffer} data
 * @param {ArrayBuffer} key
 * @param {ArrayBuffer} iv
 * @returns {Promise.<ArrayBuffer>}
 */
export function chacha20(data: ArrayBuffer, key: ArrayBuffer, iv: ArrayBuffer): any;

/**
 * Argon2 hash
 * @param {ArrayBuffer} password
 * @param {ArrayBuffer} salt
 * @param {Number} memory - memory in KiB
 * @param {Number} iterations - number of iterations
 * @param {Number} length - hash length
 * @param {Number} parallelism - threads count (threads will be emulated if they are not supported)
 * @param {Number} type - 0 = argon2d, 1 = argon2i
 * @param {Number} version - 0x10 or 0x13
 * @returns {Promise.<ArrayBuffer>}
 */
export function argon2(password: ArrayBuffer, salt: ArrayBuffer, memory: number, iterations: number, length: number, parallelism: number, type: number, version: number): any;

/**
 * Configures globals, for tests
 */
export function configure(newSubtle, newWebCrypto, newNodeCrypto): void;

}

// /**
//  * Decrypt buffer
//  * @param {ArrayBuffer} data
//  * @returns {Promise.<ArrayBuffer>}
//  */
// function decrypt(data: ArrayBuffer, key: ArrayBuffer): any;

// /**
//  * Encrypt buffer
//  * @param {ArrayBuffer} data
//  * @returns {Promise.<ArrayBuffer>}
//  */
// function encrypt(key: ArrayBuffer, kdfParams: VarDictionary): void;

// /**
//  * Computes HMAC-SHA key
//  * @param {ArrayBuffer} key
//  * @param {Int64} blockIndex
//  * @returns {Promise.<ArrayBuffer>}
//  */
// function getHmacKey(key: ArrayBuffer, blockIndex: Int64): any;

// /**
//  * Gets block HMAC
//  * @param {ArrayBuffer} key
//  * @param {number} blockIndex
//  * @param {number} blockLength
//  * @param {ArrayBuffer} blockData
//  * @returns {Promise.<ArrayBuffer>}
//  */
// function getBlockHmac(key: ArrayBuffer, blockIndex: number, blockLength: number, blockData: ArrayBuffer): any;

/**
 * Protect information used for decrypt and encrypt protected data fields
 * @constructor
 */
class ProtectSaltGenerator {
    constructor();

    /**
     * Get salt bytes
     * @param {number} len - bytes count
     * @return {ArrayBuffer} - salt bytes
     */
    getSalt(len: number): ArrayBuffer;

    /**
     * Creates protected salt generator
     * @param {ArrayBuffer|Uint8Array} key
     * @param {Number} crsAlgorithm
     * @return {Promise.<ProtectedSaltGenerator>}
     */
    static create(key: ArrayBuffer | Uint8Array, crsAlgorithm: number): any;

}

/**
 * Protected value, used for protected entry fields
 * @param {ArrayBuffer} value - encrypted value
 * @param {ArrayBuffer} salt - salt bytes
 * @constructor
 */
class ProtectedValue {
    constructor(value: ArrayBuffer, salt: ArrayBuffer);

    /**
     * Returns protected value as base64 string
     * @returns {string}
     */
    toString(): string;

    /**
     * Creates protected value from string with new random salt
     * @param {string} str
     */
    static fromString(str: string): ProtectedValue;

    /**
     * Creates protected value from binary with new random salt
     * @param {ArrayBuffer} binary
     */
    static fromBinary(binary: ArrayBuffer): ProtectedValue;

    /**
     * Determines whether the value is included as substring (safe check; doesn't decrypt full string)
     * @param {string} str
     * @return {boolean}
     */
    includes(str: string): boolean;

    /**
     * Calculates SHA256 hash of saved value
     * @return {Promise.<ArrayBuffer>}
     */
    getHash(): any;

    /**
     * Decrypted text
     * @returns {string}
     */
    getText(): string;

    /**
     * Decrypted binary. Don't forget to zero it after usage
     * @returns {Uint8Array}
     */
    getBinary(): Uint8Array;

    /**
     * Sets new salt
     * @param {ArrayBuffer} newSalt
     */
    setSalt(newSalt: ArrayBuffer): void;

    /**
     * Clones object
     * @return {ProtectedValue}
     */
    clone(): ProtectedValue;

}

/**
 * Gets random bytes
 * @param {number} len - bytes count
 * @return {Uint8Array} - random bytes
 */
function getBytes(node: Node): ArrayBuffer;

/**
 * Context with helper methods for load/save
 * @param {Kdbx} opts.kdbx - kdbx file
 * @param {boolean} [opts.exportXml=false] - whether we are exporting as xml
 * @constructor
 */
class KdbxContext {
    constructor(UNKNOWNPROPERTYNAME: any);

    /**
     * Sets XML date, respecting date saving settings
     * @param {Node} node
     * @param {Date} dt
     */
    setXmlDate(node: Node, dt: Date): void;

}

/**
 * Credentials
 * @param {ProtectedValue} password
 * @param {String|ArrayBuffer|Uint8Array} [keyFile]
 * @constructor
 */
class Credentials {
    constructor(password: ProtectedValue, keyFile?: string | ArrayBuffer | Uint8Array);

    /**
     * Set password
     * @param {ProtectedValue|null} password
     */
    setPassword(password: ProtectedValue | null): void;

    /**
     * Set keyfile
     * @param {ArrayBuffer|Uint8Array} [keyFile]
     */
    setKeyFile(keyFile?: ArrayBuffer | Uint8Array): void;

    /**
     * Get credentials hash
     * @returns {Promise.<ArrayBuffer>}
     */
    getHash(): any;

    /**
     * Creates random keyfile
     * @returns {Uint8Array}
     */
    static createRandomKeyFile(): Uint8Array;

    /**
     * Creates keyfile by given hash
     * @param {string} hash base64-encoded hash
     * @returns {Uint8Array}
     */
    static createKeyFileWithHash(hash: string): Uint8Array;

}

/**
 * Deleted object
 * @constructor
 */
class KdbxDeletedObject {
    constructor();

    /**
     * Write to stream
     * @param {Node} parentNode - xml document node
     * @param {KdbxContext} ctx
     */
    write(parentNode: Node, ctx: KdbxContext): void;

    /**
     * Read deleted object from xml
     * @param {Node} xmlNode
     * @return {KdbxTimes}
     */
    static read(xmlNode: Node): KdbxTimes;

}

export class KdbxEntry {

    /**
     * Entry
     * @constructor
     */
    public constructor();

    uuid;
    icon;
    customIcon;
    fgColor;
    bgColor;
    overrideUrl;
    tags: any[];
    times: KdbxTimes;
    fields: any;
    binaries: any;
    autoType: {
    enabled: boolean, obfuscation: any, defaultSequence: any, items: any[]
    };
    history: any[];
    parentGroup;
    customData;

    /**
     * Write to stream
     * @param {Node} parentNode - xml document node
     * @param {KdbxContext} ctx
     */
    write(parentNode: Node, ctx: KdbxContext): void;

    /**
     * Push current entry state to the top of history
     */
    pushHistory(): void;

    /**
     * Remove some entry history states at index
     * @param {number} index - history state start index
     * @param {number} [count=1] - deleted states count
     */
    removeHistory(index: number, count?: number): void;

    /**
     * Clone entry state from another entry, or history entry
     */
    copyFrom(): void;

    /**
     * Merge entry with remote entry
     * @param {{objects, remote, deleted}} objectMap
     */
    merge(objectMap: any): void;

    /**
     * Creates new entry
     * @param {KdbxMeta} meta - db metadata
     * @param {KdbxGroup} parentGroup - parent group
     * @returns {KdbxEntry}
     */
    static create(meta: KdbxMeta, parentGroup: KdbxGroup): KdbxEntry;

    /**
     * Read entry from xml
     * @param {Node} xmlNode
     * @param {KdbxContext} ctx
     * @param {KdbxGroup} [parentGroup]
     * @return {KdbxEntry}
     */
    static read(xmlNode: Node, ctx: KdbxContext, parentGroup?: KdbxGroup): KdbxEntry;

}

/**
 * Entries group
 * @constructor
 */
class KdbxGroup {
    uuid: any;
    name: string;
    notes: any;
    icon: any;
    customIcon: any;
    times: KdbxTimes;
    expanded: any;
    defaultAutoTypeSeq: any;
    enableAutoType: any;
    enableSearching: any;
    lastTopVisibleEntry: any;
    groups: any[];
    entries: any[];
    parentGroup: any;
    customData: any;

    constructor();

    /**
     * Write to stream
     * @param {Node} parentNode - xml document node
     * @param {KdbxContext} ctx
     */
    write(parentNode: Node, ctx: KdbxContext): void;

    /**
     * Invokes callback for each entry in recursive way
     * @param {function} callback - will be invoked with entry or group argument
     * @param {function} [thisArg] - callback context
     */
    forEach(callback: (entry?: KdbxEntry, group?: KdbxGroup) => void, thisArg?: ()=>any): void;

    /**
     * Merge group with remote group
     * @param {{objects, remote, deleted}} objectMap
     */
    merge(objectMap: any): void;

    /**
     * Clone group state from another group
     */
    copyFrom(): void;

    /**
     * Creates new group
     * @param {string} name
     * @param {KdbxGroup} [parentGroup]
     * @returns {KdbxGroup}
     */
    static create(name: string, parentGroup?: KdbxGroup): KdbxGroup;

    /**
     * Read group from xml
     * @param {Node} xmlNode
     * @param {KdbxContext} ctx
     * @param {KdbxGroup} [parentGroup]
     * @return {KdbxGroup}
     */
    static read(xmlNode: Node, ctx: KdbxContext, parentGroup?: KdbxGroup): KdbxGroup;

}

/**
 * Binary file header reader/writer
 * @constructor
 */
class KdbxHeader {
    constructor();

    /**
     * Saves header to stream
     * @param {BinaryStream} stm
     */
    write(stm: BinaryStream): void;

    /**
     * Saves inner header to stream
     * @param {BinaryStream} stm
     * @param {KdbxContext} ctx
     */
    writeInnerHeader(stm: BinaryStream, ctx: KdbxContext): void;

    /**
     * Updates header random salts
     */
    generateSalts(): void;

    /**
     * Upgrade the header to latest version
     */
    upgrade(): void;

    /**
     * Read header from stream
     * @param {BinaryStream} stm
     * @param {KdbxContext} ctx
     * @return {KdbxHeader}
     * @static
     */
    static read(stm: BinaryStream, ctx: KdbxContext): KdbxHeader;

    /**
     * Reads inner header from stream
     * @param {BinaryStream} stm
     * @param {KdbxContext} ctx
     */
    readInnerHeader(stm: BinaryStream, ctx: KdbxContext): void;

    /**
     * Creates new header
     * @param {Kdbx} kdbx
     * @return {KdbxHeader}
     * @static
     */
    static create(kdbx: Kdbx): KdbxHeader;

}

/**
 * Db metadata
 * @constructor
 */
class KdbxMeta {
    name: string;
    desc: string;
    defaultUser: any;
    mntncHistoryDays: any;
    color: any;
    keyChangeRec: any;
    keyChangeForce: any;
    recycleBinEnabled: boolean;
    recycleBinUuid: any;
    entryTemplatesGroup: any;
    historyMaxItems: any;
    historyMaxSize: any;
    lastSelectedGroup: any;
    lastTopVisibleGroup: any;
    memoryProtection: any;
    customData: any;
    customIcons: any;

    constructor();

    /**
     * Write to stream
     * @param {Node} parentNode - xml document node
     * @param {KdbxContext} ctx
     */
    write(parentNode: Node, ctx: KdbxContext): void;

    /**
     * Merge meta with another db
     * @param {KdbxMeta} remote
     * @param {{objects, remote, deleted}} objectMap
     */
    merge(remote: KdbxMeta, objectMap: any): void;

    /**
     * Creates new meta
     * @returns {KdbxMeta}
     */
    static create(): KdbxMeta;

    /**
     * Read KdbxMeta from stream
     * @param {Node} xmlNode - xml Meta node
     * @param {KdbxContext} ctx
     * @return {KdbxMeta}
     */
    static read(xmlNode: Node, ctx: KdbxContext): KdbxMeta;

}

/**
 * Kdbx times
 * @constructor
 */
class KdbxTimes {
    constructor();

    /**
     * Clones object
     * @returns {KdbxTimes}
     */
    clone(): KdbxTimes;

    /**
     * Write to stream
     * @param {Node} parentNode - xml document node
     * @param {KdbxContext} ctx
     */
    write(parentNode: Node, ctx: KdbxContext): void;

    update(): void;

    /**
     * Creates new times
     * @return {KdbxTimes}
     */
    static create(): KdbxTimes;

    /**
     * Read times from xml
     * @param {Node} xmlNode
     * @return {KdbxTimes}
     */
    static read(xmlNode: Node): KdbxTimes;

}

/**
 * Uuid for passwords
 * @param {ArrayBuffer|string} ab - ArrayBuffer with data
 * @constructor
 */
class KdbxUuid {
    constructor(ab: ArrayBuffer | string);

    static random(): KdbxUuid;

    id: string;
    empty: boolean;

    equals(other: KdbxUuid): boolean;

    toBytes(): Uint8Array | undefined;

    toString(): string;

    valueOf(): string | undefined;

}

/**
 * Kdbx file (KeePass database v2)
 * @constructor
 */
class Kdbx {
    header: KdbxHeader;
    credentials: Credentials;
    meta: KdbxMeta;
    xml: any;
    binaries: any;
    groups: any[];
    deletedObjects: any[];

    constructor();

    /**
     * Creates new database
     * @return {Kdbx}
     */
    static create(credentials: Credentials, name: string): Kdbx;

    /**
     * Load kdbx file
     * If there was an error loading file, throws an exception
     * @param {ArrayBuffer} data - database file contents
     * @param {Credentials} credentials
     * @return {Promise.<Kdbx>}
     */
    static load(data: ArrayBuffer, credentials: Credentials): any;

    /**
     * Import database from xml file
     * If there was an error loading xml file, throws an exception
     * @param {String} data - xml file contents
     * @param {Credentials} credentials
     * @return {Promise.<Kdbx>}
     */
    static loadXml(data: string, credentials: Credentials): any;

    /**
     * Save db to ArrayBuffer
     * @return {Promise.<ArrayBuffer>}
     */
    save(): any;

    /**
     * Save db to XML
     * @return {Promise.<String>}
     */
    saveXml(): any;

    /**
     * Creates default group, if it's not yet created
     */
    createDefaultGroup(): void;

    /**
     * Creates recycle bin, if it's not yet created
     */
    createRecycleBin(): void;

    /**
     * Adds new group to group
     * @param {string} name - new group name
     * @param {KdbxGroup} group - parent group
     * @return {KdbxGroup}
     */
    createGroup(group: KdbxGroup, name: string): KdbxGroup;

    /**
     * Adds new entry to group
     * @param {KdbxGroup} group - parent group
     * @return {KdbxEntry}
     */
    createEntry(group: KdbxGroup): KdbxEntry;

    /**
     * Gets default group
     * @return {KdbxGroup}
     */
    getDefaultGroup(): KdbxGroup;

    /**
     * Get group by uuid
     * @param {KdbxUuid|string} uuid
     * @param {KdbxGroup} [parentGroup]
     * @return {KdbxGroup|undefined}
     */
    getGroup(uuid: KdbxUuid | string, parentGroup?: KdbxGroup): KdbxGroup | undefined;

    /**
     * Move object from one group to another
     * @param {KdbxEntry|KdbxGroup} object - object to be moved
     * @param {KdbxGroup} toGroup - target parent group
     * @param {Number} [atIndex] - index in target group (by default, insert to the end of the group)
     */
    move(object: KdbxEntry | KdbxGroup, toGroup: KdbxGroup|null, atIndex?: number): void;

    /**
     * Adds deleted object
     * @param {KdbxUuid} uuid - object uuid
     * @param {Date} dt - deletion date
     */
    addDeletedObject(uuid: KdbxUuid, dt: Date): void;

    /**
     * Delete entry or group
     * Depending on settings, removes either to trash, or completely
     * @param {KdbxEntry|KdbxGroup} object - object to be deleted
     */
    remove(object: KdbxEntry | KdbxGroup): void;

    /**
     * Creates a binary in the db and returns a reference to it
     * @param {ProtectedValue|ArrayBuffer} value
     * @return {Promise}
     */
    createBinary(value: ProtectedValue | ArrayBuffer): Promise<any>;

    /**
     * Perform database cleanup
     * @param {object} settings - cleanup settings
     * @param {boolean} [settings.historyRules=false] - remove extra history, it it doesn't match defined rules, e.g. records number
     * @param {boolean} [settings.customIcons=false] - remove unused custom icons
     * @param {boolean} [settings.binaries=false] - remove unused binaries
     */
    cleanup(settings: {
        historyRules?: boolean;
        customIcons?: boolean;
        binaries?: boolean;
    }): void;

    /**
     * Merge db with another db
     * Some parts of remote DB are copied by reference, so it should NOT be modified after merge
     * Suggested use case:
     * - open local db
     * - get remote db somehow and open in
     * - merge remote into local: local.merge(remote)
     * - close remote db
     * @param {Kdbx} remote - database to merge in
     */
    merge(remote: Kdbx): void;

    /**
     * Gets editing state tombstones (for successful merge)
     * Replica must save this state with the db, assign in on db open and call removeLocalEditState on successful upstream push
     * This state is JSON serializable
     */
    getLocalEditState(): void;

    /**
     * Sets editing state tombstones returned previously by getLocalEditState
     * Replica must call this method on db open with state returned previously on getLocalEditState
     * @param editingState - result of getLocalEditState invoked before db save
     */
    setLocalEditState(editingState: any): void;

    /**
     * Removes editing state tombstones
     * Immediately after successful upstream push replica must:
     * - call this method
     * - discard previous state obtained by getLocalEditState call
     */
    removeLocalEditState(): void;

    /**
     * Upgrade the file to latest version
     */
    upgrade(): void;

}

/**
 * Stream for accessing array buffer with auto-advanced position
 * @param {ArrayBuffer} [arrayBuffer]
 * @constructor
 */
class BinaryStream {
    constructor(arrayBuffer?: ArrayBuffer);

}

namespace ByteUtils {

/**
 * Checks if two ArrayBuffers are equal
 * @param {ArrayBuffer} ab1
 * @param {ArrayBuffer} ab2
 * @returns {boolean}
 */
function arrayBufferEquals(ab1: ArrayBuffer, ab2: ArrayBuffer): boolean;

/**
 * Converts Array or ArrayBuffer to string
 * @param {Array|Uint8Array|ArrayBuffer} arr
 * @return {string}
 */
function bytesToString(arr: any[] | Uint8Array | ArrayBuffer): string;

/**
 * Converts string to byte array
 * @param {string} str
 * @return {Uint8Array}
 */
function stringToBytes(str: string): Uint8Array;

/**
 * Converts base64 string to array
 * @param {string} str
 * @return {Uint8Array}
 */
function base64ToBytes(str: string): Uint8Array;

/**
 * Converts Array or ArrayBuffer to base64-string
 * @param {Array|Uint8Array|ArrayBuffer} arr
 * @return {string}
 */
function bytesToBase64(arr: any[] | Uint8Array | ArrayBuffer): string;

/**
 * Convert hex-string to byte array
 * @param {string} hex
 * @return Uint8Array
 */
function hexToBytes(hex: string): any;

/**
 * Convert hex-string to byte array
 * @param {Array|Uint8Array|ArrayBuffer} arr
 * @return {string}
 */
function bytesToHex(arr: any[] | Uint8Array | ArrayBuffer): string;

/**
 * Converts byte array to array buffer
 * @param {Uint8Array|ArrayBuffer} arr
 * @returns {ArrayBuffer}
 */
function arrayToBuffer(arr: Uint8Array | ArrayBuffer): ArrayBuffer;

/**
 * Fills array or arrybuffer with zeroes
 * @param {Uint8Array|ArrayBuffer} buffer
 */
function zeroBuffer(buffer: Uint8Array | ArrayBuffer): void;
}

/**
 * Represents 64-bit number
 * @param {number} [lo=0]
 * @param {number} [hi=0]
 * @constructor
 */
class Int64 {
    constructor(lo?: number, hi?: number);

    /**
     * Gets number value
     * @returns {Number}
     */
    valueOf(): number;

    /**
     * Creates int64 from number
     * @param {number} value
     * @returns {Int64}
     * @static
     */
    static from(value: number): Int64;

}

/**
 * Value type
 * @enum
 */
enum ValueType {
    UInt32,
    UInt64,
    Bool,
    Int32,
    Int64,
    String,
    Bytes,
}

/**
 * Variant dictionary, capable to store/load different values from byte array
 * @constructor
 */
class VarDictionary {
    constructor();


    /**
     * Gets value or undefined
     * @param {string} key
     * @returns {*}
     */
    get(key: string): any;

    /**
     * Get all keys
     * @return {string[]} keys array
     */
    keys(): string[];

    /**
     * Sets or replaces existing item
     * @param {String} key
     * @param {VarDictionary.ValueType|Number} type
     * @param {*} value
     */
    set(key: string, type:  | number, value: any): void;

    /**
     * Removes key from dictionary
     * @param {string} key
     */
    remove(key: string): void;

    /**
     * Reads dictionary from stream
     * @param {BinaryStream} stm
     * @returns {VarDictionary}
     * @static
     */
    static read(stm: BinaryStream): VarDictionary;

    /**
     * Writes self to binary stream
     * @param {BinaryStream} stm
     */
    write(stm: BinaryStream): void;

}

/**
 * Parses XML document
 * Throws an error in case of invalid XML
 * @param {string} xml - xml document
 * @returns {Document}
 */
function parse(xml: string): Document;

/**
 * Serializes document to XML string
 * @param {Document} doc - source document
 * @returns {string} - xml content
 */
function serialize(doc: Document): string;

/**
 * Creates a document with specified root node name
 * @param {string} rootNode - root node name
 * @returns {Document} - created XML document
 */
function create(rootNode: string): Document;

/**
 * Gets first child node from xml
 * @param {Node} node - parent node for search
 * @param {string} tagName - child node tag name
 * @param {string} [errorMsgIfAbsent] - if set, error will be thrown if node is absent
 * @returns {Node} - first found node, or null, if there's no such node
 */
function getChildNode(node: Node, tagName: string, errorMsgIfAbsent?: string): Node;

/**
 * Adds child node to xml
 * @param {Node} node - parent node
 * @param {string} tagName - child node tag name
 * @returns {Node} - created node
 */
function addChildNode(node: Node, tagName: string): Node;

/**
 * Gets node inner text
 * @param {Node} node - xml node
 * @return {string|undefined} - node inner text or undefined, if the node is empty
 */
function getText(node: Node): string | undefined;

/**
 * Sets node inner text
 * @param {Node} node
 * @param {string} text
 */
function setText(node: Node, text: string): void;

/**
 * Sets bytes for node
 * @param {Node} node
 * @param {ArrayBuffer|Uint8Array|string|undefined} bytes
 */
function setBytes(node: Node, bytes: ArrayBuffer | Uint8Array | string | undefined): void;

/**
 * Parses date saved by KeePass from XML
 * @param {Node} node - xml node with date saved by KeePass (ISO format or base64-uint64) format
 * @return {Date} - date or undefined, if the tag is empty
 */
function getDate(node: Node): Date;

/**
 * Sets node date as string or binary
 * @param {Node} node
 * @param {Date|undefined} date
 * @param {boolean} [binary=false]
 */
function setDate(node: Node, date: Date | undefined, binary?: boolean): void;

/**
 * Parses number saved by KeePass from XML
 * @param {Node} node - xml node with number saved by KeePass
 * @return {Number|undefined} - number or undefined, if the tag is empty
 */
function getNumber(node: Node): number | undefined;

/**
 * Sets node number
 * @param {Node} node
 * @return {Number|undefined} number
 */
function setNumber(node: Node): number | undefined;

/**
 * Parses boolean saved by KeePass from XML
 * @param {Node} node - xml node with boolean saved by KeePass
 * @return {boolean|undefined} - boolean or undefined, if the tag is empty
 */
function getBoolean(node: Node): boolean | undefined;

/**
 * Sets node boolean
 * @param {Node} node
 * @param {boolean|undefined} boolean
 */
function setBoolean(node: Node, boolean: boolean | undefined): void;

/**
 * Converts saved string to boolean
 * @param {string} str
 * @returns {boolean}
 */
function strToBoolean(str: string): boolean;

/**
 * Parses Uuid saved by KeePass from XML
 * @param {Node} node - xml node with Uuid saved by KeePass
 * @return {KdbxUuid} - Uuid or undefined, if the tag is empty
 */
function getUuid(node: Node): KdbxUuid;

/**
 * Sets node uuid
 * @param {Node} node
 * @param {KdbxUuid} uuid
 */
function setUuid(node: Node, uuid: KdbxUuid): void;

/**
 * Gets node protected text from inner text
 * @param {Node} node
 * @return {ProtectedValue|string}
 */
function getProtectedText(node: Node): ProtectedValue | string;

/**
 * Sets node protected text
 * @param {Node} node
 * @param {ProtectedValue|string} text
 */
function setProtectedText(node: Node, text: ProtectedValue | string): void;

/**
 * Gets node protected text from inner text
 * @param {Node} node
 * @return {ProtectedValue|ArrayBuffer|{ref: string}} - protected value, or array buffer, or reference to binary
 */
function getProtectedBinary(node: Node): ProtectedValue | ArrayBuffer | any;

/**
 * Sets node protected binary
 * @param {Node} node
 * @param {ProtectedValue|ArrayBuffer|{ref: string}|string} binary
 */
function setProtectedBinary(node: Node, binary: ProtectedValue | ArrayBuffer | any | string): void;

/**
 * Traversed XML tree with depth-first preorder search
 * @param {Node} node
 * @param {function} callback
 */
function traverse(node: Node, callback: ()=>any): void;

/**
 * Reads protected values for all nodes in tree
 * @param {Node} node
 * @param {ProtectSaltGenerator} protectSaltGenerator
 */
function setProtectedValues(node: Node, protectSaltGenerator: ProtectSaltGenerator): void;

/**
 * Updates protected values salt for all nodes in tree which have protected values assigned
 * @param {Node} node
 * @param {ProtectSaltGenerator} protectSaltGenerator
 */
function updateProtectedValuesSalt(node: Node, protectSaltGenerator: ProtectSaltGenerator): void;

/**
 * Unprotect protected values for all nodes in tree which have protected values assigned
 * @param {Node} node
 */
function unprotectValues(node: Node): void;

/**
 * Protect protected values back for all nodes in tree which have been unprotected
 * @param {Node} node
 */
function protectUnprotectedValues(node: Node): void;

/**
 * Protect plain values in xml for all nodes in tree which should be protected
 * @param {Node} node
 */
function protectPlainValues(node: Node): void;

}
