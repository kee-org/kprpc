
import suffixList from "../testDeps/publicsuffixlist";
import punycode from "punycode";
import pslData from "../testDeps/pslData";
import * as kdbxweb from "kdbxweb";
import ModelMasher from "../model";
import * as pl from "kdbx-placeholders";
import { IGuidService } from "../GuidService";

let getDomain;
let modelMasher: ModelMasher;

beforeAll(() => {
    suffixList.parse(pslData.text, punycode.toASCII);
    getDomain = suffixList.getDomain;
    modelMasher = new ModelMasher(new pl.KdbxPlaceholders(), getDomain, console);
});

class MockGuidService implements IGuidService
{
    public NewGuid(): string
    {
        return '00000000-0000-0000-0000-000000000000';
    }
}

describe("config", () => {

    function testCase (persistedV1: string, expectedResult: string) {
        const name = "" + expectedResult + persistedV1;
        test(name, () => {
            const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString("test"));
            const newDb = kdbxweb.Kdbx.create(credentials, "My new db");
            const group = newDb.createGroup(newDb.getDefaultGroup(), "subgroup");
            const pwe = newDb.createEntry(group);
            pwe.fields.set("KPRPC JSON", kdbxweb.ProtectedValue.fromString(persistedV1));
            const dbConfig = modelMasher.getDatabaseKPRPCConfig(newDb);
            const configV1 = modelMasher.getEntryConfigV1Only(pwe, dbConfig);

            const configV2 = configV1?.convertToV2(new MockGuidService());
            //modelMasher.setEntryConfig(pwe, configV2);
            var sut = JSON.stringify(configV2);

            expect(sut).toEqual(expectedResult);
        });
    }

    // testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTradio\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    // "{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"valuePath\":\"Password\",\"page\":1,\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"]}}]},{\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"valuePath\":\"UserName\",\"page\":1,\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"]}}]}]}");

    testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTradio\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":true,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    "{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"},{\"matcherType\":\"Hide\"}],\"fields\":[{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"]}}]},{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"]}}]}]}");

    // testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    // "{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"valuePath\":\"Password\",\"page\":1,\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"]}}]},{\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"valuePath\":\"UserName\",\"page\":1,\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"]}}]}]}");

    // [TestCase("","{\"version\":2,\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"valuePath\":\"UserName\",\"page\":1,\"type\":\"Text\",\"matcherConfigs\":[{\"matcherType\":\"UsernameDefaultHeuristic\"}]},{\"uuid\":\"00000000-0000-0000-0000-000000000000\",\"valuePath\":\"Password\",\"page\":1,\"type\":\"Password\",\"matcherConfigs\":[{\"matcherType\":\"PasswordDefaultHeuristic\"}]}]}")]

});
