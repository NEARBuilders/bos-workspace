// Sourced from
// https://github.com/petersalomonsen/near-openai/blob/main/boswidgets/askchatgpt/main.js

const NETWORK_ID = "mainnet";

// what does near-api-js use these for?
// and how can people discover other options
const NODE_URL = "https://rpc.mainnet.near.org";
const WALLET_URL = `https://wallet.${NETWORK_ID}.near.org`; // what should this be defaulting to?
const HELPER_URL = `https://helper.${NETWORK_ID}.near.org`;
const EXPLORER_URL = `https://explorer.${NETWORK_ID}.near.org`; // and this?

const API_URL = "https://near-openai.vercel.app/api/openai";

const code = `
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8">
    </head>
    <body>
    </body>
    <script type="module">

import 'https://cdn.jsdelivr.net/npm/near-api-js@2.1.3/dist/near-api-js.min.js';
import 'https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/src/sha256.min.js';

const keyStore = new nearApi.keyStores.InMemoryKeyStore();
let account;
const networkId = "mainnet";

const config = {
    keyStore, // instance of UnencryptedFileSystemKeyStore
    networkId: networkId,
    nodeUrl:  "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org"
};


async function createAccount() {
    const keypair = nearApi.utils.KeyPairEd25519.fromRandom();
    const accountId = Buffer.from(keypair.publicKey.data).toString('hex');
    await keyStore.setKey(networkId, accountId, keypair);
    const near = await nearApi.connect(config);
    account = await near.account(accountId);
    return { secretKey: keypair.secretKey, accountId };
}

async function useAccount(secretKey) {
    const keypair = nearApi.utils.KeyPair.fromString(secretKey);
    const accountId = Buffer.from(keypair.publicKey.data).toString('hex');
    await keyStore.setKey(networkId, accountId, keypair);
    const near = await nearApi.connect(config);
    account = await near.account(accountId);
    return accountId;
}

async function create_ask_ai_request_body(messages, model) {
    const accountId = account.accountId;

    const messagesStringified = JSON.stringify(messages);
    const deposit = 50_00000_00000_00000_00000n;

    const message_hash = sha256(messagesStringified);

    const receiverId = 'jsinrust.near';
    const method_name = 'ask_ai';
    const gas = '30000000000000';
    const publicKey = await account.connection.signer.getPublicKey(account.accountId, account.connection.networkId);

    let accessKey;
    
    try {
      accessKey = (await account.findAccessKey()).accessKey;
    } catch (e) {
      throw new Error(JSON.stringify("Balance is empty.", null, 1));
    }

    const nonce = ++accessKey.nonce;
    const recentBlockHash = nearApi.utils.serialize.base_decode(
        accessKey.block_hash
    );

    const transaction = nearApi.transactions.createTransaction(
        account.accountId,
        publicKey,
        receiverId,
        nonce,
        [nearApi.transactions.functionCall(method_name, {
            message_hash
        }, gas, deposit)],
        recentBlockHash
    );
    const [txHash, signedTx] = await nearApi.transactions.signTransaction(transaction, account.connection.signer, account.accountId, account.connection.networkId);

    return JSON.stringify({
        signed_transaction: Buffer.from(signedTx.encode()).toString('base64'),
        transaction_hash: nearApi.utils.serialize.base_encode(txHash),
        sender_account_id: accountId,
        messages: messages,
        model: model
    });
}

async function create_and_send_ask_ai_request(messages, model) {
    console.log("model", model);
    try {
        const requestbody = await create_ask_ai_request_body(messages, model);
        const airesponse = await fetch(
            "https://near-openai-50jjawxtf-petersalomonsen.vercel.app/api/openai",
            {
                method: 'POST',
                body: requestbody
            }).then(r => r.json());
        if (airesponse.error) {
            throw new Error(JSON.stringify(airesponse.error, null, 1));
        }
        return airesponse.choices[0].message.content;
    } catch (e) {
        console.log(e.message)
        window.parent.postMessage({ command: "error", error: e.message }, '*');
    }
}

window.onmessage = async (msg) => {
    globalThis.parentOrigin = msg.origin;

    console.log('iframe got message', msg.data);
    switch (msg.data.command) {
        case 'createaccount':
            const { secretKey, accountId } = await createAccount();
            window.parent.postMessage({ command: 'accountcreated', secretKey, accountId }, globalThis.parentOrigin);
            break;
        case 'useaccount':
            window.parent.postMessage({ command: 'usingaccount', accountId: await useAccount(msg.data.secretKey) }, globalThis.parentOrigin);
            break;
        case 'ask_ai':
            const response = await create_and_send_ask_ai_request([{ role: 'user', content: msg.data.aiquestion }], msg.data.model);            
            window.parent.postMessage({ command: 'airesponse', airesponse: response }, globalThis.parentOrigin);
            break;
    }
};

window.parent.postMessage({ command: 'ready' }, '*');
    </script>
</html>
`;

const SECRET_KEY_STORAGE_KEY = "secretKey";
Storage.privateGet(SECRET_KEY_STORAGE_KEY);

State.init({
  secretKey: null,
  airesponse: "",
  aiquestion: "",
  accountId: "",
  iframeMessage: null,
  usingAccount: false,
});

function init_iframe() {
  const secretKey = Storage.privateGet(SECRET_KEY_STORAGE_KEY);

  State.update({
    secretKey,
    iframeMessage: secretKey
      ? {
          command: "useaccount",
          secretKey: secretKey,
        }
      : {
          command: "createaccount",
        },
  });
}

function ask_ai() {
  State.update({
    iframeMessage: {
      command: "ask_ai",
      aiquestion: state.aiquestion,
      model: "gpt-4",
      ts: new Date().getTime(),
    },
    progress: true,
  });
  console.log("state updated", state.iframeMessage);
}

function changeSecretKey(secretKey) {
  State.update({ secretKey });
  Storage.privateSet(SECRET_KEY_STORAGE_KEY, secretKey);
  init_iframe();
}

function handleMessage(msg) {
  switch (msg.command) {
    case "accountcreated":
      Storage.privateSet(SECRET_KEY_STORAGE_KEY, msg.secretKey);
      State.update({
        accountId: msg.accountId,
        secretKey: msg.secretKey,
      });
      break;
    case "airesponse":
      State.update({ airesponse: msg.airesponse, progress: false });
      break;
    case "usingaccount":
      State.update({ accountId: msg.accountId });
      break;
    case "error":
      console.log("error received in parent", msg.error);
      break;
    case "ready":
      console.log("ready");
      init_iframe();
      break;
  }
}

const iframe = (
  <iframe
    message={state.iframeMessage}
    onMessage={handleMessage}
    srcDoc={code}
    style={{ width: "0px", height: "0px", border: "none" }}
  ></iframe>
);

const secretKeyToggle = state.showSecretKey ? (
  <>
    <button onClick={() => State.update({ showSecretKey: false })}>Hide</button>
    <input
      type="text"
      value={state.secretKey}
      onChange={(e) => changeSecretKey(e.target.value)}
    ></input>
  </>
) : (
  <button onClick={() => State.update({ showSecretKey: true })}>Show</button>
);

return (
  <>
    <p>
      <b>NOTE:</b> Each request costs about 0.005 NEAR. Make sure the spending
      account below is funded, and you can also get full access to that account
      by using the secret key. Only you have the key to this account, so don't
      loose it.
    </p>
    {iframe}
    <textarea
      style={{ width: "100%" }}
      onChange={(e) => State.update({ aiquestion: e.target.value })}
      value={state.aiquestion}
    ></textarea>
    {state.progress ? (
      <Progress.Root>
        <Progress.Indicator state="indeterminate" />
      </Progress.Root>
    ) : (
      <button onClick={ask_ai}>Ask ChatGPT</button>
    )}

    <div
      style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f5f5f5" }}
    >
      <Markdown text={state.airesponse} />
    </div>

    <p>
      <br />
    </p>

    <p></p>
    <p>
      Spending account ID: <pre>{state.accountId}</pre>
    </p>
    <p>Spending account secret key: {secretKeyToggle}</p>
  </>
);
