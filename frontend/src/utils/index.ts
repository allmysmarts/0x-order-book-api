export function minimizeAddress(address: string | undefined) {
  return address ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "";
}
