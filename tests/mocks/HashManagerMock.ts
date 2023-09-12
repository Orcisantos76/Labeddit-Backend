export class HashManagerMock {
  public hash = async (plaintext: string): Promise<string> => {
    return "hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    switch (plaintext) {
      case "fulano123":
        return hash === "hash-mock-fulano";

      case "astrodev99":
        return hash === "hash-mock-astrodev";

      case "beltrana555":
        return hash === "hash-mock-beltrana";
      default:
        return false;
    }
  };
}
