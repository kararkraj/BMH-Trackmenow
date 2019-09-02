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
    getVehicles: "Vehicle/GetAll",
    getUserProfile: "UserProfile/Get",
    getVehicleTypes: "VehicleType/Get",
    getGPSDevices: "Device/Get",
    addVehicle: "Vehicle/Create",
    speedReport: "SpeedReport/Get",
    distanceReport: "DistanceReport/Get",
    fuelReport: "FuelReport/Get"
  },
  messages: {
    credentialsMismatch: "Please enter valid credentials.",
    noInternet: "Please make sure you have internet connectivity",
    somethingWrong: "Something went wrong. Please try again after some time.",
    reportDataUnavailable: "The noun data of the vehicle is unavailable in the selected date range.",
    noDevices: "There are no new devices to add."
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
