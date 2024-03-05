
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
    public NewGuidAsBase64(): string
    {
        return 'AAAAAAAAAAAAAAAAAAAAAA==';
    }
}

describe("config v1->v2", () => {

    function testCase (persistedV1: string, expectedResult: string) {
        const name = "" + expectedResult + persistedV1;
        test(name, () => {
            const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString("test"));
            const newDb = kdbxweb.Kdbx.create(credentials, "My new db");
            const group = newDb.createGroup(newDb.getDefaultGroup(), "subgroup");
            const pwe = newDb.createEntry(group);
            pwe.fields.set("KPRPC JSON", kdbxweb.ProtectedValue.fromString(persistedV1));
            const dbConfig = modelMasher.getDatabaseKPRPCConfig(newDb);
            const configV1 = ModelMasher.getEntryConfig(pwe, dbConfig);

            const configV2 = configV1?.convertToV2(new MockGuidService());
            var sut = JSON.stringify(configV2);

            expect(sut).toEqual(expectedResult);
        });
    }

    testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTradio\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":true,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    "{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"},{\"matcherType\":\"Hide\"}],\"fields\":[{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]}]}");

    testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTradio\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    "{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]}]}");

    testCase("{\"version\":1,\"hTTPRealm\":\"re\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    "{\"version\":2,\"httpRealm\":\"re\",\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]}]}");

    testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[\"http://test.com\"],\"blockedURLs\":[\"http://test.com\"],\"regExURLs\":[\"http://test.com\"],\"regExBlockedURLs\":[\"http://test.com\"],\"hide\":false,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    "{\"version\":2,\"blockedUrls\":[\"http://test.com\"],\"altUrls\":[\"http://test.com\"],\"regExUrls\":[\"http://test.com\"],\"regExBlockedUrls\":[\"http://test.com\"],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]}]}");

    testCase("","{\"version\":2,\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"matcherType\":\"UsernameDefaultHeuristic\"}]},{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"matcherType\":\"PasswordDefaultHeuristic\"}]}]}");

    testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"rrr\",\"displayName\":\"dis Name\",\"value\":\"KEEFOX_CHECKED_FLAG_TRUE\",\"type\":\"FFTcheckbox\",\"id\":\"www\",\"page\":3,\"placeholderHandling\":\"Disabled\"},{\"name\":\"radname\",\"displayName\":\"\",\"value\":\"RadioValue\",\"type\":\"FFTradio\",\"id\":\"radid\",\"page\":1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    "{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]},{\"page\":3,\"name\":\"dis Name\",\"valuePath\":\".\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Toggle\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"www\"],\"names\":[\"rrr\"],\"types\":[\"checkbox\"],\"queries\":[]}}],\"value\":\"KEEFOX_CHECKED_FLAG_TRUE\",\"placeholderHandling\":\"Disabled\"},{\"page\":1,\"name\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"valuePath\":\".\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Existing\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"radid\"],\"names\":[\"radname\"],\"types\":[\"radio\"],\"queries\":[]}}],\"value\":\"RadioValue\"}]}");

    testCase("{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockHostnameOnlyMatch\":false,\"blockDomainOnlyMatch\":false}",

    "{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[],\"types\":[\"text\"],\"queries\":[]}}]}]}");

});

describe("config v2->v1", () => {

    function testCase (persistedV2: string, expectedResult: string) {
        const name = "" + expectedResult + persistedV2;
        test(name, () => {
            const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString("test"));
            const newDb = kdbxweb.Kdbx.create(credentials, "My new db");
            const group = newDb.createGroup(newDb.getDefaultGroup(), "subgroup");
            const pwe = newDb.createEntry(group);
            pwe.setCustomData("KPRPC JSON", persistedV2);
            const configV2 = ModelMasher.getEntryConfigV2Only(pwe);

            const configV1 = configV2?.convertToV1();
            var sut = JSON.stringify(configV1);

            expect(sut).toEqual(expectedResult);
        });
    }

    testCase("{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"},{\"matcherType\":\"Hide\"}],\"fields\":[{\"page\":-1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"]}}]},{\"page\":-1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":null}}]}]}",

    "{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":true,\"blockDomainOnlyMatch\":false,\"blockHostnameOnlyMatch\":false}");

    testCase("{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":-1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":-1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]}]}",

    "{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockDomainOnlyMatch\":false,\"blockHostnameOnlyMatch\":false}");

    testCase("{\"version\":2,\"altUrls\":[],\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":-1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":-1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]}]}",

    "{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"altURLs\":[],\"hide\":false,\"blockDomainOnlyMatch\":false,\"blockHostnameOnlyMatch\":false}");

    testCase("{\"version\":2,\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":-1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"matcherType\":\"UsernameDefaultHeuristic\"}]},{\"page\":-1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"matcherType\":\"PasswordDefaultHeuristic\"}]}]}",

    "{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"hide\":false,\"blockDomainOnlyMatch\":false,\"blockHostnameOnlyMatch\":false}");

    testCase("{\"version\":2,\"altUrls\":[\"http://test.com\"],\"blockedUrls\":[\"http://test.com\"],\"regExBlockedUrls\":[\"http://test.com\"],\"regExUrls\":[\"http://test.com\"],\"httpRealm\":\"re\",\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":-1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"password\"],\"names\":[\"password\"],\"types\":[\"password\"],\"queries\":[]}}]},{\"page\":-1,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"username\"],\"names\":[\"username\"],\"types\":[\"text\"],\"queries\":[]}}]}]}",

    "{\"version\":1,\"hTTPRealm\":\"re\",\"formFieldList\":[{\"name\":\"password\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"password\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"username\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"username\",\"page\":-1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"blockedURLs\":[\"http://test.com\"],\"altURLs\":[\"http://test.com\"],\"regExURLs\":[\"http://test.com\"],\"regExBlockedURLs\":[\"http://test.com\"],\"hide\":false,\"blockDomainOnlyMatch\":false,\"blockHostnameOnlyMatch\":false}");

    testCase("{\"version\":2,\"authenticationMethods\":[\"password\"],\"matcherConfigs\":[{\"matcherType\":\"Url\"}],\"fields\":[{\"page\":0,\"valuePath\":\"UserName\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Text\",\"matcherConfigs\":[{\"matcherType\":\"UsernameDefaultHeuristic\"}]},{\"page\":-1,\"valuePath\":\"Password\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Password\",\"matcherConfigs\":[{\"matcherType\":\"PasswordDefaultHeuristic\"}]},{\"page\":3,\"name\":\"dis Name\",\"valuePath\":\".\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Toggle\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"www\"],\"names\":[\"rrr\"],\"types\":[\"checkbox\"],\"queries\":[]}}],\"value\":\"KEEFOX_CHECKED_FLAG_TRUE\",\"placeholderHandling\":\"Disabled\"},{\"page\":1,\"name\":\"\",\"valuePath\":\".\",\"uuid\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"type\":\"Existing\",\"matcherConfigs\":[{\"customMatcher\":{\"ids\":[\"radid\"],\"names\":[\"radname\"],\"types\":[\"radio\"],\"queries\":[]}}],\"value\":\"RadioValue\"}]}",

    "{\"version\":1,\"hTTPRealm\":\"\",\"formFieldList\":[{\"name\":\"\",\"displayName\":\"KeePass username\",\"value\":\"{USERNAME}\",\"type\":\"FFTusername\",\"id\":\"\",\"page\":0,\"placeholderHandling\":\"Default\"},{\"name\":\"\",\"displayName\":\"KeePass password\",\"value\":\"{PASSWORD}\",\"type\":\"FFTpassword\",\"id\":\"\",\"page\":-1,\"placeholderHandling\":\"Default\"},{\"name\":\"rrr\",\"displayName\":\"dis Name\",\"value\":\"KEEFOX_CHECKED_FLAG_TRUE\",\"type\":\"FFTcheckbox\",\"id\":\"www\",\"page\":3,\"placeholderHandling\":\"Disabled\"},{\"name\":\"radname\",\"displayName\":\"AAAAAAAAAAAAAAAAAAAAAA==\",\"value\":\"RadioValue\",\"type\":\"FFTradio\",\"id\":\"radid\",\"page\":1,\"placeholderHandling\":\"Default\"}],\"alwaysAutoFill\":false,\"neverAutoFill\":false,\"alwaysAutoSubmit\":false,\"neverAutoSubmit\":false,\"priority\":0,\"hide\":false,\"blockDomainOnlyMatch\":false,\"blockHostnameOnlyMatch\":false}");

});
