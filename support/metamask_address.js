// wallet-generator.js
import { ethers } from "ethers";

function generateWallet() {
    const wallet = ethers.Wallet.createRandom();

    console.log("📌 Адреса:", wallet.address);
    console.log("🔑 Приватний ключ:", wallet.privateKey);
    console.log("🧠 Сід-фраза:", wallet.mnemonic.phrase);
}

generateWallet();
