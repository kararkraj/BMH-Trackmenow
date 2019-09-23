export const environment = {
  production: true,
  apis: {
    apisActive: true,
    baseApiUrl: "http://trackmeservice.cloudapp.net/api/",
    authToken: "auth-token",
    login: "Account/Login",
    getAssets: "Vehicle/GetAll",
    getUserProfile: "UserProfile/Get",
    updateUserProfile: "UserProfile/Update",
    getAssetTypes: "VehicleType/Get",
    getGPSDevices: "Device/Get",
    addAsset: "Vehicle/Create",
    speedReport: "SpeedReport/Get",
    distanceReport: "DistanceReport/Get",
    fuelReport: "FuelReport/Get",
    contactUs: "ContactUs/SendMessage"
  },
  messages: {
    credentialsMismatch: "Please enter valid credentials.",
    noInternet: "Please make sure you have internet connectivity",
    somethingWrong: "Something went wrong. Please try again after some time.",
    reportDataUnavailable: "The noun data of the vehicle is unavailable in the selected date range.",
    noDevices: "There are no new devices to add.",
    userProfileUpdated: "Thanks for updating your profile",
    contactUs: "Your message is sent successfully."
  }
};