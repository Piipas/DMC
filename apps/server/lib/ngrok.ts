import ngrok from "@ngrok/ngrok";

export const ngrokClient = async () => {
  const listener = await ngrok.forward({ addr: 4000, authtoken_from_env: true });
  console.log(`Ingress established at: ${listener.url()}`);
};
