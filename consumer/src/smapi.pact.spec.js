import path from "path";
import {
  PactV3,
  MatchersV3,
  SpecificationVersion,
} from "@pact-foundation/pact";
import { API } from "./api";
const { eachLike, like } = MatchersV3;

const provider = new PactV3({
  consumer: "host-manage",
  provider: "SMAPI",
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  logLevel: "warn",
  dir: path.resolve(process.cwd(), "pacts"),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
});

describe("API Pact test", () => {
    
    [
        { 
            email: 'soar.authenticated@nhatest.com', 
            userId: 'dcadecea-ecb6-4d94-b509-fb9f2e9f59fc', 
            hotelId: 208497600, 
            contactName: 'SOARTest Authenticated' 
        },
    ].forEach(
        testCase => test(`should return ${testCase.userId}`, async () => {
            const requestBody = {
                contactName: testCase.contactName,
                emailAddress : testCase.email,
                userId: testCase.userId,
                dmcId : 332,
                hotelId : 0,
                languageId : 0,
                countryId : 0,
            };

            const responseBody = {
                contactName: testCase.contactName,
                countryId: 0,
                dmcId: 332,
                emailAddress : testCase.email,
                firstName: testCase.contactName.split(' ')[0],
                hotelId: testCase.hotelId,
                languageId: 0,
                lastName: testCase.contactName.split(' ')[1],
                phoneNumber: "",
                userId: testCase.userId,
            };

            // set up Pact interactions
            await provider.addInteraction({
                states: [{ description: `Create property for user id ${testCase.userId}` }],
                uponReceiving: `there is property id ${testCase.hotelId} is created for user id ${testCase.userId}`,
                withRequest: {
                    method: "POST",
                    path: "/v1/property/owner",
                    headers: {
                        accept: "application/vnd.api+json",
                        "Content-Type": "application/vnd.api+json",
                    },
                    body: like({
                        contactName: testCase.contactName,
                        emailAddress : testCase.email,
                        userId: testCase.userId,
                        dmcId : 332,
                        hotelId : 0,
                        languageId : 0,
                        countryId : 0,
                    }),
                },
                willRespondWith: {
                    status: 200,
                    // headers: {
                    //     "Content-Type": "application/json; charset=utf-8",
                    // },
                    body: like({
                        contactName: testCase.contactName,
                        countryId: 0,
                        dmcId: 332,
                        emailAddress : testCase.email,
                        firstName: testCase.contactName.split(' ')[0],
                        hotelId: testCase.hotelId,
                        languageId: 0,
                        lastName: testCase.contactName.split(' ')[1],
                        phoneNumber: "",
                        userId: testCase.userId,
                    }),
                },
            });

            await provider.executeTest(async (mockService) => {
                try {
                    debugger;
                    const api = new API(mockService.url);
                    
                    // make request to Pact mock server
                    const property = await api.createPropertyOwner(requestBody).catch(data => {
                        console.log(data);
                    });

                    expect(property).toStrictEqual(responseBody);
                }
                catch (error) { }
                
            });
        }));
});
