// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apis: {
    apisActive: true,
    baseApiUrl: "http://trackmeservice.cloudapp.net/api/",
    authToken: "auth-token",
    login: "Account/Login",
    getAssets: "Vehicle/GetAll",
    getUserProfile: "UserProfile/Get",
    updateUserProfile: "UserProfile/Update",
    getAssetType: "VehicleType/Get",
    getGPSDevices: "Device/Get",
    addAsset: "Vehicle/Create",
    speedReport: "SpeedReport/Get",
    distanceReport: "DistanceReport/Get",
    fuelReport: "FuelReport/Get",
    contactUs: "ContactUs/SendMessage"
  },
  messages: {
    credentialsMismatch: "Please enter valid credentials.",
    networkIssues: "Please check your internet connectivity.",
    networkIssuesOnStart: "Please check your internet connectivity and restart the application.",
    dataLoading: "Data is loading. Please wait...",
    somethingWrong: "Something went wrong. Please try again after some time.",
    reportDataUnavailable: "The noun data of the vehicle is unavailable in the selected date range.",
    noDevices: "There are no new devices to add.",
    userProfileUpdated: "Thanks for updating your profile",
    contactUs: "Your message is sent successfully.",
    assetAdded: "{{asset}} added successfully.",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
