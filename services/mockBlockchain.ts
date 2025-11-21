
import { ethers } from 'ethers';
import { BlindBox, BoxStatus, DaoVote, UserProfile, MedalType } from '../types';
import { MOCK_BOXES, MOCK_USERS } from '../constants';

// Storage Key for persistence
const STORAGE_KEY = 'TRUSTBOX_CHAIN_STATE_V3';

interface ChainState {
  users: Record<string, UserProfile>;
  boxes: BlindBox[];
  transactions: any[];
}

/**
 * Hybrid Service:
 * 1. Uses ethers.js for wallet connection.
 * 2. Uses localStorage to persist state (simulating a testnet node).
 */
class Web3Manager {
  private state: ChainState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): ChainState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Initial Seed
    const initialUsers: Record<string, UserProfile> = {};
    // Seed mock users just for data population
    MOCK_USERS.forEach(u => {
       initialUsers[u.address.toLowerCase()] = JSON.parse(JSON.stringify(u));
    });
    
    return {
      users: initialUsers,
      boxes: JSON.parse(JSON.stringify(MOCK_BOXES)),
      transactions: []
    };
  }

  private saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  public resetChain() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  // --- Wallet & User Logic ---

  public async connectWallet(): Promise<string> {
    let address = "";
    if ((window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        address = accounts[0].toLowerCase();
      } catch (err) {
        console.error("User rejected request", err);
        throw new Error("User rejected connection");
      }
    } else {
      // Fallback for non-web3 browsers (Preview Mode)
      // Use a consistent guest address based on session or random
      address = "0xguest" + Math.floor(Math.random() * 10000).toString(16);
    }

    this.ensureUserExists(address);
    return address;
  }

  private ensureUserExists(address: string) {
    if (!this.state.users[address]) {
      this.state.users[address] = {
        address: address,
        ethBalance: 2.0, // Airdrop some test ETH
        points: 100, // Welcome points
        medals: [],
        fulfillmentRate: 100,
        publishedCount: 0,
        openedCount: 0
      };
      this.saveState();
    }
  }

  public async getUserProfile(): Promise<UserProfile> {
    const address = await this.connectWallet();
    return this.state.users[address];
  }

  public async getTransactions(): Promise<any[]> {
     const address = await this.connectWallet();
     return this.state.transactions.filter(t => t.user === address).reverse();
  }

  // --- Box Logic ---

  public async getAllBoxes(): Promise<BlindBox[]> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    return [...this.state.boxes];
  }

  public async publishBox(data: Partial<BlindBox>): Promise<BlindBox> {
    const address = await this.connectWallet();
    const user = this.state.users[address];
    
    const cost = data.priceEth || 0.001;
    if (user.ethBalance < cost) throw new Error("Insufficient ETH Balance");

    // Update State
    user.ethBalance -= cost;
    user.points += 20;
    user.publishedCount++;

    const newBox: BlindBox = {
      id: "BOX-" + Date.now().toString().slice(-6),
      publisher: address,
      description: data.description || "No Description",
      promiseContent: data.promiseContent || "",
      priceEth: cost,
      pointsCost: Math.floor(Math.random() * 50) + 20,
      status: BoxStatus.WAITING,
      imageUrl: data.imageUrl || `https://picsum.photos/400/300?random=${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      surpriseScore: this.calculateSurpriseScore(user, cost),
      transactionHash: "0x" + Math.random().toString(16).slice(2)
    };

    this.state.boxes.unshift(newBox);
    this.recordTx(address, '发布质押', newBox.id, `-${cost} ETH`, '已上链');
    this.saveState();
    return newBox;
  }

  public async openBox(boxId: string): Promise<BlindBox> {
    const address = await this.connectWallet();
    const user = this.state.users[address];
    
    const boxIndex = this.state.boxes.findIndex(b => b.id === boxId);
    if (boxIndex === -1) throw new Error("Box not found");
    const box = this.state.boxes[boxIndex];

    if (box.publisher === address) throw new Error("无法拆开自己发布的盲盒");
    if (user.points < box.pointsCost) throw new Error("积分不足");

    // Logic
    user.points -= box.pointsCost;
    user.openedCount++;
    box.status = BoxStatus.OPENED;
    box.opener = address;

    // Publisher Reward
    if (this.state.users[box.publisher]) {
        this.state.users[box.publisher].points += 5;
    }

    this.recordTx(address, '拆开盲盒', boxId, `-${box.pointsCost} 积分`, '已确认');
    this.saveState();
    return box;
  }

  public async submitProof(boxId: string, file: File): Promise<BlindBox> {
    const address = await this.connectWallet();
    
    const boxIndex = this.state.boxes.findIndex(b => b.id === boxId);
    if (boxIndex === -1) throw new Error("Box not found");
    const box = this.state.boxes[boxIndex];

    if (box.publisher !== address) throw new Error("权限拒绝：你不是发布者");
    if (box.status !== BoxStatus.OPENED) throw new Error("状态错误：当前不可提交凭证");

    // Mock Upload
    const fakeUrl = URL.createObjectURL(file);

    box.status = BoxStatus.VOTING;
    box.fulfillmentProofUrl = fakeUrl;

    this.recordTx(address, '提交凭证', boxId, '等待审核', 'DAO投票中');
    this.saveState();
    return box;
  }

  // --- DAO Logic ---

  public async getDaoVotes(): Promise<DaoVote[]> {
    const address = await this.connectWallet();

    return this.state.boxes
      .filter(b => b.status === BoxStatus.VOTING)
      .map(b => ({
        id: `VOTE-${b.id}`,
        boxId: b.id,
        proofUrl: b.fulfillmentProofUrl || "",
        promiseContent: b.promiseContent,
        deadline: "24小时",
        votesFor: Math.floor(Math.random() * 10),
        votesAgainst: Math.floor(Math.random() * 2),
        status: '进行中' as const
      }));
  }

  public async voteOnFulfillment(boxId: string, approve: boolean): Promise<void> {
    const address = await this.connectWallet();
    const boxIndex = this.state.boxes.findIndex(b => b.id === boxId);
    if (boxIndex === -1) throw new Error("Box not found");
    const box = this.state.boxes[boxIndex];

    if (box.publisher === address) throw new Error("利益回避：无法对自己发布的盲盒进行投票");

    // Simple consensus logic for demo: Instant pass/fail
    if (approve) {
        box.status = BoxStatus.COMPLETED;
        // Release Stake Back to Publisher
        if (this.state.users[box.publisher]) {
            // Return stake (simplified)
            this.state.users[box.publisher].ethBalance += box.priceEth;
            // Check for Medal
            this.checkAndAwardMedals(box.publisher);
        }
        this.recordTx(address, 'DAO投票', boxId, '赞成', '已记录');
    } else {
        box.status = BoxStatus.FAILED;
        // Slash Stake (50% to opener, 50% burnt)
        if (box.opener && this.state.users[box.opener]) {
            this.state.users[box.opener].ethBalance += (box.priceEth * 0.5);
        }
        this.recordTx(address, 'DAO投票', boxId, '拒绝', '已记录');
    }
    
    this.saveState();
  }

  // --- Helpers ---

  private checkAndAwardMedals(userAddr: string) {
    const user = this.state.users[userAddr];
    const successCount = this.state.boxes.filter(b => b.publisher === userAddr && b.status === BoxStatus.COMPLETED).length;
    
    if (successCount >= 3 && !user.medals.some(m => m.type === MedalType.BRONZE)) {
        user.medals.push({ type: MedalType.BRONZE, earnedAt: new Date().toISOString().split('T')[0] });
    }
  }

  private calculateSurpriseScore(user: UserProfile, cost: number): number {
    let score = 50; // Base
    // Reputation weight
    score += (user.fulfillmentRate - 80); 
    // Cost weight
    score += (cost * 1000);
    return Math.min(100, Math.max(10, Math.floor(score)));
  }

  private recordTx(user: string, type: string, id: string, amount: string, status: string) {
    this.state.transactions.push({
        user, type, id, amount, status, timestamp: Date.now()
    });
  }
}

export const BlockchainService = new Web3Manager();
