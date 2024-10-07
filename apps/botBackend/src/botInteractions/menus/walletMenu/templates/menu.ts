const generateTemplate = (
  walletAddress: string,
  ethBalance: string
) => `<strong>Wallet Details</strong>
<pre>Wallet address: ${walletAddress}</pre>
<pre>ETH balance: ${ethBalance}</pre>
`;

export default generateTemplate;
