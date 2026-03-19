export class WebHook_Handler {
  private uri: string;
  constructor(url: string) {
    this.uri = url;
  }

  public async handler(obj: any, secretKey: string) {
    try {
      const response = await fetch(this.uri, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
          "Secret-Key": secretKey,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}
