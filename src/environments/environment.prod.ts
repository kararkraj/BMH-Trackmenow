export const environment = {
  production: true,
  apis: {
    apisActive: true,
    baseApiUrl: "http://trackmeservice.cloudapp.net/api/",
    authToken: "auth-token",
    login: "Account/Login",
    getVehicles: "Vehicle/GetAll",
    getUserProfile: "UserProfile/Get",
    getVehicleTypes: "VehicleType/Get",
    getGPSDevices: "Device/Get",
    addVehicle: "Vehicle/Create"
  },
  messages: {
    credentialsMismatch: "Please enter valid credentials.",
    noInternet: "Please make sure you have internet connectivity",
    somethingWrong: "Something went wrong. Please try again after some time."
  }
};