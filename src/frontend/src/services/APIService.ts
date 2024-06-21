class APIService {
  private static instance: APIService;
  private baseUrl: string;
  public appVersion: string; // Make appVersion public to allow updates
  private setAppVersion?: (version: string) => void; // Make setAppVersion optional

  private constructor() {
    this.baseUrl = "http://localhost:3002";
    this.appVersion = "1.2.0"; 
  }

  public static getInstance(setAppVersion?: (version: string) => void): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    if (setAppVersion) {
      APIService.instance.setAppVersion = setAppVersion;
    }
    return APIService.instance;
  }


  public async request(
    endpoint: string,
    method: string,
    body?: any,
    auth: boolean = false
  ): Promise<any> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "app-version": this.appVersion,
    };

    if (auth) {
      const token = localStorage.getItem("access_token");
      console.log("Retrieved token:", token); // Debugging
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("Authorization header set:", headers["Authorization"]); // Debugging
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      if (response.status === 426) {
        const data = await response.json();
        if (this.setAppVersion) {
          this.setAppVersion("1.2.0"); // Mock updating the app version
        }
        throw new Error(data.message);
      } else {
        const errorText = await response.text();
        console.error("Network response was not ok:", errorText); // Debugging
        throw new Error(errorText);
      }
    }

    return response.json();
  }
}

export default APIService;
