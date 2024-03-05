
import { mapStandardToBase64PNG } from "../icons";
import suffixList from "../testDeps/publicsuffixlist";
import punycode from "punycode";
import pslData from "../testDeps/pslData";
import { MatchAccuracyMethod } from "../MatchAccuracyMethod";
import * as kdbxweb from "kdbxweb";
import { EntryConfig } from "../EntryConfig";
import { DatabaseConfig } from "../DatabaseConfig";
import { MatchAccuracyEnum } from "../kfDataModel";
import ModelMasher from "../model";
import { KdbxPlaceholders } from "kdbx-placeholders";

let getDomain;
let model: ModelMasher;

beforeAll(() => {
    suffixList.parse(pslData.text, punycode.toASCII);
    getDomain = suffixList.getDomain;
    model = new ModelMasher(new KdbxPlaceholders(), getDomain, console);
});

describe("icons", () => {

    test("mapStandardToBase64PNG returns correct 12th icon", () => {
        // tslint:disable-next-line:max-line-length
        const b64 = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALfSURBVDhPfVJLTxNRGJ3ShAXS8GgBa6ImvDSxGphOO512pjNMW4ZSEyqhpU0gndIXtIqCpfKo0bSSUKjWlSRKF4qRGGPCwl/gxpUr4j9g58YEdi7GOW2DuPEkJzlzvnPu3LlzifNobW01hCgq85Smq8sMs52w2zfAJYej9ISm94IUlUamEf8Xpt5eqmSxHKAgWSzBaZZdCDocKTDMsmkvRU1jhgyyjVod1/v6zGWa/jhmNgfigvBoxevdiXk8uaAgpEKiOA8NDzMsjqzaIWvltra29i2a/uAxm6cWR0eLSUla9zDMVD4QqBTD4V0QGh5myOBFJZvtAF0iZLVmEhy3lnS7V6Nu90O/IEQqsrzPkaTU3d3dA0I/l+V3kzwvI5NwudaSTuc6ukSBZffGrNbAis+3IzKMvzI3t48Sdmc0Gq+A0PBeRqPvPTbbHWTxKUW7vUosC8L2NM8vxCQplw+HK8zwsAuFEZJMfLl29eRzS8sJNDwrSYrI4ExwsEscVyJSTudGkONSYVFMbcrybldX10WdTqd/Y+w5Vqz9ymmzVlk2GI7hYReF2dlXONyw05mWHY4sMc/z+Zrh8aQ2Y7Fdg8Fg1Ov1utzg4NcjglDeqpxRNTzMCpHI3wU4LktkRXE7LAjphM+XexyJvBhlWT+2OzAwQC+0t/+UVULDc3HcRH5mphLzenNY4AHPbxFFUaxKNltw1e8v41dFJibuIXypo+Mytn5XJTQ8zMZYNoAsDr4wMrJHhByOTFIQ1lNe79rc+HhWzWkQJk0m32ut9ndZJTQ8FZq4JK0gi06IYTK1i1R2uw+mOC5+Y3DQghCSAklGvnV2Kp80GoUbGorAU6FBZpLjYujULhJwS/3GRZfrWe2hgdtWa/YXRSnftVplnKKwszMsimLxZn+/rfF4hmaV2rokmuI8X1VcLuW0qUmJkmQVXn1UyyD7X1xYcjoPf9D0yZF6ke6bTIfw6qPzIIg/M/L20z2KoN4AAAAASUVORK5CYII=";
        const result = mapStandardToBase64PNG(12);
        expect(result).toEqual(b64);
    });
});

describe("getURLSummary", () => {
    test("standardHttpWithPath", async () => {
        const result = model.getURLSummary("http://www.google.com/any/path", getDomain);
        expect(result.hostAndPort).toEqual("www.google.com");
        expect(result.port).toEqual("");
        expect(result.domain).toEqual("google.com");
    });
    test("standardLocalFile", async () => {
        const result = model.getURLSummary("file://c/any/path/file.ext", getDomain);
        expect(result.port).toEqual("");
        expect(result.domain).toEqual(null);
    });
    test("malformedLocalFileWithoutExtension", async () => {
        const result = model.getURLSummary("c:\\any\\path\\file", getDomain);
        expect(result.hostAndPort).toEqual("c:\\any\\path\\file");
        expect(result.port).toEqual("");
        expect(result.domain).toEqual("");
    });
    test("malformedLocalFileWithExtension", async () => {
        const result = model.getURLSummary("c:\\any\\path\\file.ext", getDomain);
        expect(result.hostAndPort).toEqual("c:\\any\\path\\file.ext");
        expect(result.port).toEqual("");
        expect(result.domain).toEqual("c:\\any\\path\\file.ext"); //Assert.AreEqual("ext", summary.Domain.TLD);
    });
    test("standardHttpsWithPortAndPath", async () => {
        const result = model.getURLSummary("http://www.google.com:12345/any/path", getDomain);
        expect(result.hostAndPort).toEqual("www.google.com:12345");
        expect(result.port).toEqual("12345");
        expect(result.domain).toEqual("google.com");
    });

    test("standardData", async () => {
        const result = model.getURLSummary("data:,_www.google.com", getDomain);
        expect(result.hostAndPort).toEqual("");
        expect(result.port).toEqual("");
        expect(result.domain).toEqual(null);
    });
    test("dataEndingWithQSAndFile", async () => {
        const result = model.getURLSummary("data:,_www.google.com?anything.file://", getDomain);
        expect(result.hostAndPort).toEqual("");
        expect(result.port).toEqual("");
        expect(result.domain).toEqual(null);
    });
    test("dataEndingWithFile", async () => {
        const result = model.getURLSummary("data:,_www.google.com.file://", getDomain);
        expect(result.hostAndPort).toEqual("");
        expect(result.port).toEqual("");
        expect(result.domain).toEqual(null);
    });
    test("dataEndingWithQSAndHttps", async () => {
        const result = model.getURLSummary("data:,_www.google.com?anything.https://", getDomain);
        expect(result.hostAndPort).toEqual("");
        expect(result.port).toEqual("");
        expect(result.domain).toEqual(null);
    });
});

describe("URLMatchTest", () => {

    function testCase (expectedResult: MatchAccuracyMethod, urlSearch: string, entryMam: MatchAccuracyMethod, defaultMam: MatchAccuracyMethod, overrideURLs: string[] = [], overrideMethods: MatchAccuracyMethod[] = []) {
        const name = "" + expectedResult + urlSearch + entryMam + defaultMam + overrideURLs + overrideMethods;
        test(name, () => {
            const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString("test"));
            const newDb = kdbxweb.Kdbx.create(credentials, "My new db");
            const group = newDb.createGroup(newDb.getDefaultGroup(), "subgroup");
            const pwe = newDb.createEntry(group);

            const conf = new EntryConfig(undefined, entryMam);
            ModelMasher.setEntryConfig(pwe, conf);
            const urlSummary = model.getURLSummary(urlSearch, getDomain);
            const dbConf = new DatabaseConfig();
            dbConf.defaultMatchAccuracy = defaultMam;

            if (overrideURLs.length > 0) {
                for (let i = 0; i < overrideURLs.length; i++) {
                    dbConf.matchedURLAccuracyOverrides[overrideURLs[i]] = overrideMethods[i];
                }
            }

            const result = model.getMatchAccuracyMethod(pwe, urlSummary, dbConf);
            expect(result).toEqual(expectedResult);
        });
    }

    testCase(MatchAccuracyMethod.Domain, "https://www.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyMethod.Hostname, "https://www.kee.pm", MatchAccuracyMethod.Hostname, MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyMethod.Exact, "https://www.kee.pm", MatchAccuracyMethod.Exact, MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyMethod.Domain, "https://www.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyMethod.Domain, "https://subdom1.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Hostname, ["kee.pm"], [MatchAccuracyMethod.Domain]);
    testCase(MatchAccuracyMethod.Hostname, "https://subdom2.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Hostname, [ "kee.pm" ], [MatchAccuracyMethod.Hostname]);
    testCase(MatchAccuracyMethod.Domain, "https://www1.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Hostname, [ "keeeeeee.pm" ], [MatchAccuracyMethod.Hostname ]);
    testCase(MatchAccuracyMethod.Hostname, "https://www1.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Hostname, [ "kee.pm", "notkee.pm"], [MatchAccuracyMethod.Hostname, MatchAccuracyMethod.Hostname]);
    testCase(MatchAccuracyMethod.Hostname, "https://www2.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Domain, [ "kee.pm", "notkee.pm" ], [MatchAccuracyMethod.Hostname, MatchAccuracyMethod.Hostname]);
    testCase(MatchAccuracyMethod.Hostname, "https://www2.kee.pm", MatchAccuracyMethod.Domain, MatchAccuracyMethod.Domain, [ "kee.pm", "notkee.pm"], [MatchAccuracyMethod.Hostname, MatchAccuracyMethod.Domain ]);

});


describe("URLMatchTestWithNoConfig", () => {

    function testCase (expectedResult: MatchAccuracyMethod, urlSearch: string, defaultMam: MatchAccuracyMethod, overrideURLs: string[] = [], overrideMethods: MatchAccuracyMethod[] = []) {
        const name = "" + expectedResult + urlSearch + defaultMam + overrideURLs + overrideMethods;
        test(name, () => {
            const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString("test"));
            const newDb = kdbxweb.Kdbx.create(credentials, "My new db");
            const group = newDb.createGroup(newDb.getDefaultGroup(), "subgroup");
            const pwe = newDb.createEntry(group);

            const urlSummary = model.getURLSummary(urlSearch, getDomain);
            const dbConf = new DatabaseConfig();
            dbConf.defaultMatchAccuracy = defaultMam;

            if (overrideURLs.length > 0) {
                for (let i = 0; i < overrideURLs.length; i++) {
                    dbConf.matchedURLAccuracyOverrides[overrideURLs[i]] = overrideMethods[i];
                }
            }

            const result = model.getMatchAccuracyMethod(pwe, urlSummary, dbConf);
            expect(result).toEqual(expectedResult);
        });
    }

    testCase(MatchAccuracyMethod.Domain, "https://www.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyMethod.Hostname, "https://www.kee.pm", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyMethod.Exact, "https://www.kee.pm", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyMethod.Domain, "https://www.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyMethod.Domain, "https://subdom1.kee.pm", MatchAccuracyMethod.Hostname, ["kee.pm"], [MatchAccuracyMethod.Domain]);
    testCase(MatchAccuracyMethod.Hostname, "https://subdom2.kee.pm", MatchAccuracyMethod.Hostname, [ "kee.pm" ], [MatchAccuracyMethod.Hostname]);
    testCase(MatchAccuracyMethod.Domain, "https://www1.kee.pm", MatchAccuracyMethod.Domain, [ "keeeeeee.pm" ], [MatchAccuracyMethod.Hostname ]);
    testCase(MatchAccuracyMethod.Hostname, "https://www1.kee.pm", MatchAccuracyMethod.Hostname, [ "keeeeeee.pm" ], [MatchAccuracyMethod.Hostname ]);
    testCase(MatchAccuracyMethod.Exact, "https://www1.kee.pm", MatchAccuracyMethod.Exact, [ "keeeeeee.pm" ], [MatchAccuracyMethod.Hostname ]);
    testCase(MatchAccuracyMethod.Hostname, "https://www1.kee.pm", MatchAccuracyMethod.Hostname, [ "kee.pm", "notkee.pm"], [MatchAccuracyMethod.Hostname, MatchAccuracyMethod.Hostname]);
    testCase(MatchAccuracyMethod.Hostname, "https://www2.kee.pm", MatchAccuracyMethod.Domain, [ "kee.pm", "notkee.pm" ], [MatchAccuracyMethod.Hostname, MatchAccuracyMethod.Hostname]);
    testCase(MatchAccuracyMethod.Hostname, "https://www2.kee.pm", MatchAccuracyMethod.Domain, [ "kee.pm", "notkee.pm"], [MatchAccuracyMethod.Hostname, MatchAccuracyMethod.Domain ]);

});

describe("CalculatesCorrectMatchAccuracyScore", () => {

    function testCase (expectedResult: MatchAccuracyEnum, urlEntry: string, urlSearch: string, entryMam: MatchAccuracyMethod) {
        const name = "" + expectedResult + urlEntry + urlSearch + entryMam;
        test(name, () => {

            const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString("test"));
            const newDb = kdbxweb.Kdbx.create(credentials, "My new db");
            const group = newDb.createGroup(newDb.getDefaultGroup(), "subgroup");
            const pwe = newDb.createEntry(group);
            pwe.fields.set("URL", urlEntry);
            const conf = new EntryConfig(undefined, entryMam);
            ModelMasher.setEntryConfig(pwe, conf);
            const urlSummary = model.getURLSummary(urlSearch, getDomain);

            const result = model.bestMatchAccuracyForAnyURL(pwe, conf, urlSearch, urlSummary, entryMam, newDb);
            expect(result).toEqual(expectedResult);
        });
    }


        // IPv4
    testCase(MatchAccuracyEnum.Best, "https://1.2.3.4:1234/path", "https://1.2.3.4:1234/path", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://1.2.3.4:1234/path", "https://1.2.3.4:1234", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://1.2.3.4:1234/path", "https://1.2.3.4:1234", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://1.2.3.4:1234/path", "https://1.2.3.4:1234", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://1.2.3.4:1234", "https://1.2.3.4:1234/path", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://1.2.3.4:1234", "https://1.2.3.4:1234/path", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://1.2.3.4:1234", "https://1.2.3.4:1234/path", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.Best, "https://1.2.3.4:1234", "https://1.2.3.4:1234", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Best, "https://1.2.3.4:1234", "https://1.2.3.4:1234", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.Best, "https://1.2.3.4:1234", "https://1.2.3.4:1234", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.None, "https://1.2.3.4:1234", "https://1.2.3.4", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Hostname, "https://1.2.3.4:1234", "https://1.2.3.4", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://1.2.3.4:1234", "https://1.2.3.4", MatchAccuracyMethod.Exact);

        // IPv6
    testCase(MatchAccuracyEnum.Best, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234/path", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.Best, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Best, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.Best, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.None, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Hostname, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:1234", "https://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]", MatchAccuracyMethod.Exact);


    testCase(MatchAccuracyEnum.Best, "https://www.kee.pm:1234/path", "https://www.kee.pm:1234/path", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://www.kee.pm:1234/path", "https://www.kee.pm:1234", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://www.kee.pm:1234/path", "https://www.kee.pm:1234", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234/path", "https://www.kee.pm:1234", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://www.kee.pm:1234", "https://www.kee.pm:1234/path", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://www.kee.pm:1234", "https://www.kee.pm:1234/path", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234", "https://www.kee.pm:1234/path", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.Best, "https://www.kee.pm:1234", "https://www.kee.pm:1234", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Best, "https://www.kee.pm:1234", "https://www.kee.pm:1234", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.Best, "https://www.kee.pm:1234", "https://www.kee.pm:1234", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234", "https://www.kee.pm", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Hostname, "https://www.kee.pm:1234", "https://www.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234", "https://www.kee.pm", MatchAccuracyMethod.Exact);


    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234", "https://other.kee.pm:1234", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Domain, "https://www.kee.pm:1234", "https://other.kee.pm:1234", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234", "https://other.kee.pm:1234", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234", "https://other.kee.pm", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Domain, "https://www.kee.pm:1234", "https://other.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm:1234", "https://other.kee.pm", MatchAccuracyMethod.Exact);


    testCase(MatchAccuracyEnum.Best, "https://www.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.Best, "https://www.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Best, "https://www.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "http://www.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.HostnameAndPort, "http://www.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.None, "http://www.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://www.kee.pm", "http://www.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://www.kee.pm", "http://www.kee.pm", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.None, "https://www.kee.pm", "http://www.kee.pm", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.Domain, "https://subdom.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://subdom.kee.pm", "https://www.kee.pm", MatchAccuracyMethod.Hostname);

    testCase(MatchAccuracyEnum.HostnameAndPort, "http://twitter.com", "https://twitter.com", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.HostnameAndPort, "http://twitter.com", "https://twitter.com", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.None, "http://twitter.com", "https://twitter.com", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://twitter.com", "http://twitter.com", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.HostnameAndPort, "https://twitter.com", "http://twitter.com", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.None, "https://twitter.com", "http://twitter.com", MatchAccuracyMethod.Exact);

    testCase(MatchAccuracyEnum.None, "http://download:80", "http://docker:9000/#/auth", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "http://download:80", "http://docker:9000/#/auth", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.None, "http://download:80", "http://docker:9000/#/auth", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.Best, "http://docker:9000/#/auth", "http://docker:9000/#/auth", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.Best, "http://docker:9000/#/auth", "http://docker:9000/#/auth", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.Best, "http://docker:9000/#/auth", "http://docker:9000/#/auth", MatchAccuracyMethod.Exact);
    testCase(MatchAccuracyEnum.HostnameAndPort, "http://docker:9000", "http://docker:9000/#/auth", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.HostnameAndPort, "http://docker:9000", "http://docker:9000/#/auth", MatchAccuracyMethod.Hostname);
    testCase(MatchAccuracyEnum.None, "http://docker:9000", "http://docker:9000/#/auth", MatchAccuracyMethod.Exact);

    testCase(MatchAccuracyEnum.None, "chrome://keefox", "https://blah/account/", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "http://octopi.local", "https://blah/account/", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https:/booking.com", "https://blah/account/", MatchAccuracyMethod.Domain);
    testCase(MatchAccuracyEnum.None, "https://.homedepot.com", "https://blah/account/", MatchAccuracyMethod.Domain);

});
