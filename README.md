## 系统版本

+ go: go version go1.10.2 darwin/amd64
+ npm: 6.1.0
+ node: 10.3.0
+ Truffle: 4.1.11 (core: 4.1.11)
+ Solidity: 0.4.24
+ geth: 1.8.10-stable
+ ganache-cli: v6.1.0 (ganache-core: 2.1.0)


## 使用方法

```
git clone https://github.com/orris27/dapp.git
cd dapp/
npm install

ganache-cli # 在另一个终端开启

truffle compile
truffle migrate --network develop 

npm run dev
```
