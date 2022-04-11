import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import { User } from "@/models/user/User";
import store from "@/store/index";
import { IM } from "@/vocabulary/IM";
import EntityService from "@/services/EntityService";
import { flushPromises } from "@vue/test-utils";
import LoggerService from "@/services/LoggerService";
import { SearchRequest } from "@/models/search/SearchRequest";
import AuthService from "@/services/AuthService";
import { CustomAlert } from "@/models/user/CustomAlert";

describe("state", () => {
  it("should start with the correct values", () => {
    const test = new Map<string, boolean>();
    expect(store.state.loading).toEqual(test);
    expect(store.state.conceptIri).toBe("http://endhealth.info/im#DiscoveryOntology");
    expect(store.state.history).toEqual([]);
    expect(store.state.searchResults).toEqual([]);
    expect(store.state.currentUser).toEqual({});
    expect(store.state.registeredUsername).toBe("");
    expect(store.state.isLoggedIn).toBeFalsy();
    expect(store.state.snomedLicenseAccepted).toBeNull();
    expect(store.state.historyCount).toBe(0);
    expect(store.state.focusTree).toBe(false);
    expect(store.state.treeLocked).toBe(true);
    expect(store.state.filters).toEqual({
      selectedStatus: ["Active", "Draft"],
      selectedSchemes: [
        {
          iri: IM.DISCOVERY_CODE,
          name: "Discovery code"
        },
        {
          iri: IM.CODE_SCHEME_SNOMED,
          name: "Snomed-CT code"
        },
        {
          iri: IM.CODE_SCHEME_TERMS,
          name: "Term based code"
        }
      ],
      selectedTypes: [
        "Class",
        "ObjectProperty",
        "DataProperty",
        "DataType",
        "Annotation",
        "Individual",
        "Record",
        "ValueSet",
        "Folder",
        "Legacy"
      ]
    })
  });
});

describe("mutations", () => {
  it("can updateConceptIri", () => {
    const testConceptIri = "http://www.endhealth.info/im#test";
    store.commit("updateConceptIri", testConceptIri);
    expect(store.state.conceptIri).toEqual(testConceptIri);
  });

  it("can updateHistory", () => {
    const testHistory = { url: "testUrl", conceptName: "testName", view: "testVuew" };
    store.commit("updateHistory", testHistory);
    expect(store.state.history).toEqual([testHistory]);
  });

  it("can updateHistory ___ duplicate", () => {
    const testHistory = { url: "testUrl", conceptName: "testName", view: "testVuew" };
    store.commit("updateHistory", testHistory);
    store.commit("updateHistory", testHistory);
    expect(store.state.history).toEqual([testHistory]);
  });

  it("can updateSearchResults", () => {
    const testResult = {
      name: "testConcept",
      iri: "testIri",
      scheme: {
        name: "testScheme",
        iri: "testSchemeIri"
      },
      code: "testCode",
      conceptType: {
        elements: [{ iri: "testType", name: "testType" }]
      },
      isDescendantOf: [],
      match: "testMatch",
      weighting: 0,
      status: { iri: "testStatus", name: "testStatus" }
    };
    store.commit("updateSearchResults", testResult);
    expect(store.state.searchResults).toEqual(testResult);
  });

  it("can updateCurrentUser", () => {
    const testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", { value: "colour/003-man.png" });
    store.commit("updateCurrentUser", testUser);
    expect(store.state.currentUser).toEqual(testUser);
  });

  it("can updateRegisteredUsername", () => {
    const testUsername = "devTest";
    store.commit("updateRegisteredUsername", "devTest");
    expect(store.state.registeredUsername).toBe(testUsername);
  });

  it("can updateIsLoggedIn", () => {
    const testBool = true;
    store.commit("updateIsLoggedIn", testBool);
    expect(store.state.isLoggedIn).toBe(true);
  });

  it("can updateSnomedLicenseAccepted", () => {
    const testBool = "true";
    store.commit("updateSnomedLicenseAccepted", testBool);
    expect(store.state.snomedLicenseAccepted).toBe("true");
  });

  it("can updateHistoryCount", () => {
    const testCount = 5;
    store.commit("updateHistoryCount", testCount);
    expect(store.state.historyCount).toBe(5);
  });

  it("can update focusTree", () => {
    const testBool = true;
    store.commit("updateFocusTree", testBool);
    expect(store.state.focusTree).toBe(true);
  });

  it("can update treeLocked", () => {
    const testBool = false;
    store.commit("updateTreeLocked", testBool);
    expect(store.state.treeLocked).toBe(false);
  });

  it("can updateFilters", () => {
    const testFilter = {
      selectedStatus: ["testActive", "testDraft"],
      selectedSchemes: [{ iri: "http://endhealth.info/im#test" }],
      selectedTypes: ["testClass", "testProperty"]
    };
    store.commit("updateFilters", testFilter);
    expect(store.state.filters).toEqual(testFilter);
  });

  it("can fetchSearchResults ___ pass", async() => {
    EntityService.advancedSearch = jest.fn().mockResolvedValue({ status: 200, data: { entities: [{ iri: "testResult" }] } });
    LoggerService.info = jest.fn();
    const testInput = { searchRequest: new SearchRequest, cancelToken: "testCancelToken" };
    let result = false;
    await store.dispatch("fetchSearchResults", testInput).then(res => result = res);
    await flushPromises();
    expect(EntityService.advancedSearch).toBeCalledTimes(1);
    expect(EntityService.advancedSearch).toBeCalledWith(testInput.searchRequest, testInput.cancelToken);
    await flushPromises();
    expect(store.state.searchResults).toEqual([{ iri: "testResult" }]);
    expect(result).toBe("true");
  });

  it("can fetchSearchResults ___ cancelled", async() => {
    EntityService.advancedSearch = jest.fn().mockRejectedValue({ status: 400 });
    LoggerService.info = jest.fn();
    const testInput = { searchRequest: new SearchRequest, cancelToken: "testCancelToken" };
    let result = false;
    await store.dispatch("fetchSearchResults", testInput).then(res => result = res);
    await flushPromises();
    expect(EntityService.advancedSearch).toBeCalledTimes(1);
    expect(EntityService.advancedSearch).toBeCalledWith(testInput.searchRequest, testInput.cancelToken);
    await flushPromises();
    expect(LoggerService.info).toBeCalledTimes(1);
    expect(LoggerService.info).toBeCalledWith(undefined, "axios request cancelled");
    expect(result).toBe("cancelled");
  });

  it("can fetchSearchResults ___ failed", async() => {
    EntityService.advancedSearch = jest.fn().mockRejectedValue({ status: 400, message: "test fail" });
    LoggerService.error = jest.fn();
    const testInput = { searchRequest: new SearchRequest, cancelToken: "testCancelToken" };
    let result = false;
    await store.dispatch("fetchSearchResults", testInput).then(res => result = res);
    await flushPromises();
    expect(EntityService.advancedSearch).toBeCalledTimes(1);
    expect(EntityService.advancedSearch).toBeCalledWith(testInput.searchRequest, testInput.cancelToken);
    await flushPromises();
    expect(LoggerService.error).toBeCalledTimes(1);
    expect(LoggerService.error).toBeCalledWith(undefined, { status: 400, message: "test fail" });
    expect(result).toBe("false");
  });

  it("can logoutCurrentUser ___ 200", async() => {
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(200, "logout successful"));
    LoggerService.error = jest.fn();
    let result = false;
    await store.dispatch("logoutCurrentUser").then(res => result = res);
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.currentUser).toBe(null);
    expect(store.state.isLoggedIn).toBe(false);
    expect(result).toEqual(new CustomAlert(200, "logout successful"));
  });

  it("can logoutCurrentUser ___ 400", async() => {
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(400, "logout failed 400"));
    LoggerService.error = jest.fn();
    let result = false;
    await store.dispatch("logoutCurrentUser").then(res => result = res);
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(result).toEqual(new CustomAlert(400, "logout failed 400"));
  });

  it("can authenticateCurrentUser___ 200 ___ avatar", async() => {
    let testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", { value: "colour/003-man.png" });
    testUser.setId("8901-test");
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(200, "user authenticated", undefined, testUser));
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => result = res);
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(true);
    expect(store.state.currentUser).toEqual(testUser);
    expect(result.authenticated).toBe(true);
  });

  it("can authenticateCurrentUser___ 200 ___ no avatar", async() => {
    let testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", { value: "http://testimage.jpg" });
    testUser.setId("8901-test");
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(200, "user authenticated", undefined, testUser));
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => result = res);
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(true);
    testUser.avatar.value = "colour/001-man.png";
    expect(store.state.currentUser).toEqual(testUser);
    expect(result.authenticated).toBe(true);
  });

  it("can authenticateCurrentUser___ 403 ___ logout 200", async() => {
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(403, "user authenticated"));
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(200, "logout successful"))
    LoggerService.info = jest.fn();
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => result = res);
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(false);
    expect(store.state.currentUser).toBe(null);
    expect(result.authenticated).toBe(false);
    expect(LoggerService.info).toBeCalledTimes(1);
    expect(LoggerService.info).toBeCalledWith(undefined, "Force logout successful");
  });

  it("can authenticateCurrentUser___ 403 ___ logout 200", async() => {
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(403, "user authenticated"));
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(400, "logout failed"))
    LoggerService.error = jest.fn();
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => result = res);
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(false);
    expect(store.state.currentUser).toBe(null);
    expect(result.authenticated).toBe(false);
    expect(LoggerService.error).toBeCalledTimes(1);
    expect(LoggerService.error).toBeCalledWith(undefined, "Force logout failed");
  });
});
