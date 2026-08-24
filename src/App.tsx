import React, { useState, useEffect, useRef } from 'react';
import { AboutPage } from './components/AboutPage';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Wifi,
  WifiOff,
  Radio,
  Server,
  Building2,
  Smartphone,
  Cpu,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Activity,
  ArrowRight,
  Database,
  Key,
  Layers,
  HelpCircle,
  FileCode,
  BookOpen
} from 'lucide-react';

// --- TYPES ---
type NetworkMode = 'OFFLINE' | 'ONLINE';
type EngineType = 'ENGINE_1' | 'ENGINE_2'; // Engine 1: Direct-Debit Mule, Engine 2: Hardware Escrow

interface MeshPacket {
  packet_id: string;
  amount: number;
  merchant_vpa: string;
  sender_vpa: string;
  engine_type: EngineType;
  ttl: number;
  nonce: string;
  signature: string;
  encrypted_payload: string;
  auth_tag: string;
  timestamp: string;
  status: 'MINTED' | 'HOPPING' | 'SETTLED' | 'REJECTED' | 'TENTATIVE_HOLD';
  rejection_reason?: string;
  tampered?: boolean;
  current_hop: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  offsetMs: number;
  category: 'INFO' | 'CRYPTO' | 'ROUTING' | 'WARN' | 'ERROR' | 'ATTACK';
  message: string;
  payload?: any;
}

interface NodeInfo {
  id: number;
  name: string;
  type: string;
  role: string;
  device: string;
  battery: number;
  rssi: string;
  status: string;
  statusType: 'idle' | 'active' | 'success' | 'danger' | 'warning';
}

export default function App() {
  // --- STATE ---
  const [currentPage, setCurrentPage] = useState<'about' | 'demo'>('about');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('OFFLINE');
  const [selectedEngine, setSelectedEngine] = useState<EngineType>('ENGINE_2');
  
  // Financial State
  const [escrowBalance, setEscrowBalance] = useState<number>(1450);
  const [checkingBalance, setCheckingBalance] = useState<number>(10000);
  const [amountInput, setAmountInput] = useState<string>('450');
  const [merchantVpa, setMerchantVpa] = useState<string>('stadium_snacks@icici');

  // Simulator Execution State
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [activeHop, setActiveHop] = useState<number>(-1);
  const [currentPacket, setCurrentPacket] = useState<MeshPacket | null>(null);
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  
  // Redis Cache Simulation
  const [redisNonces, setRedisNonces] = useState<Set<string>>(
    new Set(['0x9f8b2a1c', '0x3e4d5c6b'])
  );

  // Terminal & Telemetry Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<'ALL' | 'CRYPTO' | 'ROUTING' | 'ATTACK'>('ALL');
  const [copiedLog, setCopiedLog] = useState<boolean>(false);
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);

  // Simulated Timer for 72h Lease
  const [leaseSeconds, setLeaseSeconds] = useState<number>(71 * 3600 + 58 * 60 + 42);

  const startTimeRef = useRef<number>(Date.now());
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Lease countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLeaseSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLeaseTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m}m ${s.toString().padStart(2, '0')}s`;
  };

  // Node Configuration
  const initialNodes: NodeInfo[] = [
    {
      id: 0,
      name: 'Buyer Node',
      type: 'INITIATOR',
      role: selectedEngine === 'ENGINE_2' ? 'Hardware Escrow Enclave' : 'Direct-Debit Client',
      device: 'iPhone 15 Pro (Secure Element)',
      battery: 88,
      rssi: '-42 dBm',
      status: 'Ready',
      statusType: 'idle'
    },
    {
      id: 1,
      name: 'Mule Node A',
      type: 'DTN_MULE',
      role: 'BLE Store-&-Forward Relay',
      device: 'Galaxy S24 (Passerby)',
      battery: 74,
      rssi: '-64 dBm',
      status: 'Listening (BLE 5.3)',
      statusType: 'idle'
    },
    {
      id: 2,
      name: 'Mule Node B',
      type: 'DTN_MULE',
      role: 'BLE Mesh Intermediate',
      device: 'Pixel 8 Pro (Turnstile)',
      battery: 92,
      rssi: '-78 dBm',
      status: 'Listening (BLE 5.3)',
      statusType: 'idle'
    },
    {
      id: 3,
      name: 'Bridge Node',
      type: 'GATEWAY_UPLINK',
      role: 'Cellular / Satellite Gateway',
      device: 'Metro Station AP #4',
      battery: 100,
      rssi: '-52 dBm',
      status: 'Connected (4G Backhaul)',
      statusType: 'idle'
    },
    {
      id: 4,
      name: 'Bank Gateway',
      type: 'NPCI_CBS',
      role: 'Core Settlement Engine',
      device: 'NPCI Core / HDFC CBS',
      battery: 100,
      rssi: 'Direct Fiber',
      status: 'Standing By',
      statusType: 'idle'
    }
  ];

  const [nodes, setNodes] = useState<NodeInfo[]>(initialNodes);

  // Helper to append log
  const addLog = (
    category: LogEntry['category'],
    message: string,
    payload?: any
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');
    const offsetMs = Date.now() - startTimeRef.current;
    
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: timeStr,
        offsetMs,
        category,
        message,
        payload
      }
    ]);
  };

  // Helper to generate UUIDv4
  const generateUUID = () => {
    return 'f47ac10b-58cc-4372-a567-' + Math.floor(100000000000 + Math.random() * 900000000000).toString(16).substring(0, 12);
  };

  // Helper to generate pseudo Cryptographic Signatures & Nonces
  const generateHex = (len: number) => {
    const chars = '0123456789abcdef';
    let res = '0x';
    for (let i = 0; i < len; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  };

  // Reset simulator view
  const resetSimulator = () => {
    setIsTransmitting(false);
    setActiveHop(-1);
    setCurrentPacket(null);
    setActiveAttack(null);
    setNodes(initialNodes);
  };

  // Clear Console Logs
  const clearLogs = () => {
    setLogs([]);
    addLog('INFO', 'Telemetry console log reset by operator.');
  };

  // Initiate Payment Execution Simulation
  const handleInitiatePayment = (attackType: string | null = null) => {
    if (isTransmitting) return;

    const amt = parseFloat(amountInput) || 0;
    if (amt <= 0) {
      addLog('WARN', 'Invalid amount specified. Enter a value greater than 0.');
      return;
    }

    // Engine 2 cap check
    if (selectedEngine === 'ENGINE_2' && amt > 2000) {
      addLog('ERROR', `Engine 2 (Hardware Escrow) hard limit is ₹2,000. Specified ₹${amt} exceeds limit.`);
      return;
    }

    resetSimulator();
    setIsTransmitting(true);
    setActiveAttack(attackType);

    // Generate Packet
    const packetNonce = attackType === 'REPLAY_ATTACK' ? '0x9f8b2a1c' : generateHex(16); // Replay attack reuses cached nonce
    const newPacket: MeshPacket = {
      packet_id: generateUUID(),
      amount: amt,
      merchant_vpa: merchantVpa,
      sender_vpa: selectedEngine === 'ENGINE_2' ? 'escrow_lite@npci' : 'user@bank',
      engine_type: selectedEngine,
      ttl: 5,
      nonce: packetNonce,
      signature: '30440220' + generateHex(30).substring(2) + '0220' + generateHex(30).substring(2),
      encrypted_payload: 'aes-256-gcm:' + generateHex(32).substring(2),
      auth_tag: 'tag_' + generateHex(16).substring(2),
      timestamp: new Date().toISOString(),
      status: 'MINTED',
      current_hop: 0
    };

    setCurrentPacket(newPacket);

    // Initial Logging
    addLog('INFO', `▶ Initializing ${selectedEngine} Payment transaction...`);
    addLog(
      'CRYPTO',
      `ECDSA secp256k1 Keypair loaded from ${
        selectedEngine === 'ENGINE_2' ? 'Hardware Escrow Enclave' : 'Secure Enclave'
      }. Signature generated.`,
      {
        packet_id: newPacket.packet_id,
        nonce: newPacket.nonce,
        signature: newPacket.signature,
        auth_tag: newPacket.auth_tag
      }
    );

    // Define hop flow depending on network mode
    const hopsToExecute = networkMode === 'OFFLINE' ? [0, 1, 2, 3, 4] : [0, 3, 4];
    executeHopSequence(newPacket, hopsToExecute, 0, attackType);
  };

  // Sequential Hop Execution with Timers
  const executeHopSequence = (
    packet: MeshPacket,
    hopSequence: number[],
    stepIndex: number,
    attackType: string | null
  ) => {
    const hopNodeId = hopSequence[stepIndex];
    setActiveHop(hopNodeId);

    // Calculate dynamic state at node
    const isLastHop = stepIndex === hopSequence.length - 1;
    const remainingTTL = 5 - stepIndex;

    // Update Packet State
    packet.ttl = remainingTTL;
    packet.current_hop = hopNodeId;
    setCurrentPacket({ ...packet });

    // Update Node visual status
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id === hopNodeId) {
          return {
            ...n,
            status: `Processing Hop (${stepIndex + 1}/${hopSequence.length})`,
            statusType: 'active'
          };
        }
        return n;
      })
    );

    // Node 0: Buyer Node (Minting & BLE Broadcast)
    if (hopNodeId === 0) {
      addLog(
        'ROUTING',
        `[Hop 0: Buyer Node] Minted mesh DTN packet. Advertising via BLE 5.3 Extended Advertising (0xFEAA). TTL: ${remainingTTL}`
      );
    } 
    // Hop 1: Mule Node A
    else if (hopNodeId === 1) {
      addLog(
        'ROUTING',
        `[Hop 1: Mule Node A] BLE RSSI -64dBm. Received 248-byte DTN payload. Added to SQLite Store-&-Forward queue. TTL: ${remainingTTL}`
      );
    } 
    // Hop 2: Mule Node B (Where attacks can manifest or pass-through)
    else if (hopNodeId === 2) {
      if (attackType === 'MITM_TAMPER') {
        packet.tampered = true;
        packet.encrypted_payload = 'aes-256-gcm:BIT_FLIPPED_CORRUPTED_BLOB_0x9999';
        packet.auth_tag = 'tag_BAD_CORRUPTED_TAG_0x0000';
        addLog(
          'ATTACK',
          `🚨 [ATTACK SIMULATION] MITM Tampered payload at Hop 2! Bits flipped in transit. Modified AES Auth Tag.`,
          { tampered_payload: packet.encrypted_payload }
        );
      } else {
        addLog(
          'ROUTING',
          `[Hop 2: Mule Node B] Relaying DTN packet via peer BLE mesh link. Checking deduplication cache. TTL: ${remainingTTL}`
        );
      }
    } 
    // Hop 3: Bridge Node (Cellular / Gateway Uplink)
    else if (hopNodeId === 3) {
      addLog(
        'ROUTING',
        `[Hop 3: Bridge Node] Acquired Cellular/Sat Gateway uplink! Transmitting packet to NPCI Core Bank Gateway.`
      );

      // Replay Attack validation at Gateway/Bridge
      if (attackType === 'REPLAY_ATTACK' || redisNonces.has(packet.nonce)) {
        setTimeout(() => {
          packet.status = 'REJECTED';
          packet.rejection_reason = 'STATUS 409 CONFLICT: SHA-256 Nonce collision in Redis cache';
          setCurrentPacket({ ...packet });
          setIsTransmitting(false);

          setNodes((prev) =>
            prev.map((n) => (n.id === 3 ? { ...n, status: 'REJECTED (409 Replay)', statusType: 'danger' } : n))
          );

          addLog(
            'ATTACK',
            `❌ [STATUS 409 CONFLICT] Replay attack detected at Bridge Node! SHA-256 Nonce ${packet.nonce} already exists in Redis Cache. Packet dropped immediately!`,
            { nonce: packet.nonce, redis_status: 'DUPLICATE_FOUND' }
          );
        }, 600);
        return;
      }

      // Tamper Verification Check
      if (packet.tampered || attackType === 'MITM_TAMPER') {
        setTimeout(() => {
          packet.status = 'REJECTED';
          packet.rejection_reason = 'AES-256-GCM Auth Tag Mismatch. Cryptographic integrity check failed!';
          setCurrentPacket({ ...packet });
          setIsTransmitting(false);

          setNodes((prev) =>
            prev.map((n) => (n.id === 3 ? { ...n, status: 'REJECTED (Auth Tag Fail)', statusType: 'danger' } : n))
          );

          addLog(
            'ERROR',
            `❌ [CRYPTO VERIFICATION FAILED] AES-256-GCM Auth Tag Mismatch at Bridge Node! Calculated auth tag does not match header tag_${packet.auth_tag}. Signature invalid!`,
            { expected_tag: packet.auth_tag, actual_tag: 'tag_BAD_CORRUPTED_TAG_0x0000' }
          );
        }, 600);
        return;
      }
    } 
    // Hop 4: Bank Gateway (Final Settlement)
    else if (hopNodeId === 4) {
      // Overdraft attack or balance verification for Engine 1
      if (selectedEngine === 'ENGINE_1' && (packet.amount > checkingBalance || attackType === 'OVERDRAFT')) {
        setTimeout(() => {
          packet.status = 'TENTATIVE_HOLD';
          packet.rejection_reason = 'Insufficient funds for instant debit. Placed on Tentative Hold (Awaiting Mule-Ack).';
          setCurrentPacket({ ...packet });
          setIsTransmitting(false);

          setNodes((prev) =>
            prev.map((n) => (n.id === 4 ? { ...n, status: 'TENTATIVE HOLD (Mule-Ack Required)', statusType: 'warning' } : n))
          );

          addLog(
            'WARN',
            `⚠️ [TENTATIVE HOLD] Engine 1 Direct-Debit transaction amount (₹${packet.amount}) exceeds main checking balance (₹${checkingBalance}). Lock held in Tentative Hold until Mule-Ack confirmation clears.`,
            { checking_balance: checkingBalance, transaction_amount: packet.amount }
          );
        }, 700);
        return;
      }

      // Standard Successful Settlement
      setTimeout(() => {
        packet.status = 'SETTLED';
        setCurrentPacket({ ...packet });
        setIsTransmitting(false);

        // Add nonce to Redis Cache
        setRedisNonces((prev) => new Set([...Array.from(prev), packet.nonce]));

        // Deduct balances
        if (selectedEngine === 'ENGINE_2') {
          setEscrowBalance((prev) => Math.max(0, prev - packet.amount));
        } else {
          setCheckingBalance((prev) => Math.max(0, prev - packet.amount));
        }

        setNodes((prev) =>
          prev.map((n) => (n.id === 4 ? { ...n, status: 'SETTLED (0% Merchant Risk)', statusType: 'success' } : n))
        );

        addLog(
          'INFO',
          `✅ [SETTLED] Mesh Pay Transaction SUCCESSFUL! Merchant VPA ${packet.merchant_vpa} credited ₹${packet.amount}. Mule-Ack cryptographically signed and broadcasted back.`,
          {
            packet_id: packet.packet_id,
            status: 'SETTLED',
            settlement_guarantee: selectedEngine === 'ENGINE_2' ? '100% ESCROW_GUARANTEED' : 'DIRECT_DEBIT_CLEARANCE'
          }
        );
      }, 700);
      return;
    }

    // Continue to next hop if not last and not halted
    if (!isLastHop) {
      setTimeout(() => {
        executeHopSequence(packet, hopSequence, stepIndex + 1, attackType);
      }, 850);
    }
  };

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'CRYPTO') return log.category === 'CRYPTO';
    if (logFilter === 'ROUTING') return log.category === 'ROUTING';
    if (logFilter === 'ATTACK') return log.category === 'ATTACK' || log.category === 'ERROR' || log.category === 'WARN';
    return true;
  });

  const copyLogJson = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* --- HEADER NAVBAR --- */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sticky top-0 z-50">
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => setCurrentPage('about')}>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-amber-500 p-[2px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-emerald-400 to-slate-100 bg-clip-text text-transparent">
                MeshPay UPI
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Offline-First Delay-Tolerant Network Protocol & Dual-Engine Simulator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 p-1 rounded-full border border-slate-800">
          <button
            onClick={() => setCurrentPage('about')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
              currentPage === 'about'
                ? 'bg-slate-800 text-white shadow border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-400" />
            <span>About<span className="hidden sm:inline"> & Guide</span></span>
          </button>
          <button
            onClick={() => setCurrentPage('demo')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
              currentPage === 'demo'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span><span className="hidden sm:inline">Interactive </span>Simulator</span>
          </button>
        </div>

        {/* Status Indicators & Reset in Navbar */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span>Redis:</span>
              <span className="font-mono text-cyan-300 font-semibold">{redisNonces.size} Nonces</span>
            </div>
          </div>

          {currentPage === 'demo' && (
            <button
              onClick={resetSimulator}
              className="flex items-center gap-1 text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* --- PAGE CONDITIONAL RENDER --- */}
      {currentPage === 'about' ? (
        <AboutPage onLaunchDemo={() => setCurrentPage('demo')} />
      ) : (
        /* --- DASHBOARD MAIN CONTENT (3 COLUMNS) --- */
        <main className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 max-w-[1800px] w-full mx-auto">
        
        {/* ======================================================== */}
        {/* COLUMN 1: TRANSACTION CONTROL & ENGINE SELECTOR (3 COLS)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          
          {/* Main Controls Card */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4">
            
            {/* Network Mode Switch */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Network Transport
              </span>
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setNetworkMode('OFFLINE');
                    addLog('ROUTING', 'Network switched to Offline BLE DTN Mesh');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                    networkMode === 'OFFLINE'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <WifiOff className="h-3.5 w-3.5 text-rose-400" />
                  Offline BLE DTN
                </button>
                <button
                  onClick={() => {
                    setNetworkMode('ONLINE');
                    addLog('ROUTING', 'Network switched to 4G/5G Online Gateway');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                    networkMode === 'ONLINE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  4G/5G Online
                </button>
              </div>
            </div>

            {/* Protocol Engine Switcher */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Protocol Engine
                </span>
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedEngine('ENGINE_2');
                    addLog('INFO', 'Selected Engine 2: Hardware Escrow (NPCI Lite)');
                  }}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition ${
                    selectedEngine === 'ENGINE_2'
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs">Engine 2</span>
                    {selectedEngine === 'ENGINE_2' && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                  </div>
                  <span className="text-[11px] text-slate-300 mt-0.5">Hardware Escrow</span>
                  <span className="text-[10px] text-slate-400">Max ₹2,000</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEngine('ENGINE_1');
                    addLog('INFO', 'Selected Engine 1: Direct-Debit Mule');
                  }}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition ${
                    selectedEngine === 'ENGINE_1'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs">Engine 1</span>
                    {selectedEngine === 'ENGINE_1' && <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                  <span className="text-[11px] text-slate-300 mt-0.5">Direct Debit</span>
                  <span className="text-[10px] text-slate-400">Uncapped Balance</span>
                </button>
              </div>

              {/* Clean Balance Indicator Bar */}
              <div className="pt-2 flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    {selectedEngine === 'ENGINE_2' ? 'Escrow Pool Balance:' : 'Checking Account VPA:'}
                  </span>
                  <span className="font-mono font-bold text-slate-100">
                    ₹{selectedEngine === 'ENGINE_2' ? escrowBalance : checkingBalance}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedEngine === 'ENGINE_2' ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}
                    style={{
                      width: `${
                        selectedEngine === 'ENGINE_2'
                          ? (escrowBalance / 2000) * 100
                          : (checkingBalance / 10000) * 100
                      }%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Inputs */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                Payment Terminal
                <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              </span>

              {/* Merchant Input */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={merchantVpa}
                    onChange={(e) => setMerchantVpa(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                    placeholder="merchant@upi"
                  />
                  <Building2 className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[
                    { label: 'Stadium', vpa: 'stadium_snacks@icici' },
                    { label: 'Metro', vpa: 'metro_turnstile@sbi' },
                    { label: 'Trek', vpa: 'remote_guide@hdfc' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setMerchantVpa(item.vpa)}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md transition"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500 transition"
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {['150', '500', '1000', '2000'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmountInput(preset)}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 font-mono text-slate-300 py-1 rounded-md transition text-center"
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={isTransmitting}
                onClick={() => handleInitiatePayment(null)}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg mt-1 ${
                  isTransmitting
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 active:scale-[0.99] cursor-pointer'
                }`}
              >
                {isTransmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                    Routing Packets...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-slate-950" />
                    Initiate Mesh Payment
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: INTERACTIVE DTN MESH CANVAS (5 COLS)            */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          <div className="glass-panel rounded-2xl p-5 flex flex-col h-full justify-between relative overflow-hidden">
            {/* Header / Legend */}
            <div className="flex items-center justify-between mb-4 z-10">
              <div>
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  Visual DTN Mesh Canvas
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  5-Node Hop Sequence & Cryptographic Validation Route
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {currentPacket && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                      currentPacket.status === 'SETTLED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-glow-emerald'
                        : currentPacket.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-glow-rose'
                        : currentPacket.status === 'TENTATIVE_HOLD'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    }`}
                  >
                    {currentPacket.status === 'SETTLED' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {currentPacket.status === 'REJECTED' && <XCircle className="h-3.5 w-3.5" />}
                    {currentPacket.status === 'TENTATIVE_HOLD' && <AlertTriangle className="h-3.5 w-3.5" />}
                    STATUS: {currentPacket.status}
                  </span>
                )}
              </div>
            </div>

            {/* --- VISUAL NODE GRAPH AREA --- */}
            <div className="relative my-4 flex flex-col gap-6 items-center justify-center py-4 sm:py-6 px-2">
              
              {/* 5 NODES VERTICAL / HORIZONTAL GRID */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-5 gap-3 z-10">
                {nodes.map((node) => {
                  const isActive = activeHop === node.id;
                  const isPast = activeHop > node.id;
                  const isCurrentPacketRejectionNode =
                    currentPacket?.status === 'REJECTED' && activeHop === node.id;

                  return (
                    <div
                      key={node.id}
                      className={`relative flex flex-row sm:flex-col items-center sm:items-stretch justify-between p-3 rounded-xl border transition-all duration-300 gap-3 sm:gap-0 ${
                        isCurrentPacketRejectionNode
                          ? 'bg-rose-500/15 border-rose-500/60 text-rose-200 shadow-lg shadow-rose-500/20 scale-[1.02] sm:scale-105'
                          : isActive
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-100 shadow-xl shadow-cyan-500/20 scale-[1.02] sm:scale-105 animate-glow-cyan'
                          : isPast
                          ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {/* Hop Badge & Icon */}
                      <div className="flex items-center sm:flex-col sm:items-center justify-between sm:justify-start sm:mb-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                          Hop {node.id}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping ml-1 sm:ml-0 sm:mt-1"></span>
                        )}
                      </div>

                      {/* Icon & Name */}
                      <div className="flex flex-1 sm:flex-initial items-center sm:flex-col text-left sm:text-center gap-2.5 sm:gap-0 my-0 sm:my-1">
                        <div
                          className={`p-2 sm:p-2.5 rounded-xl transition shrink-0 ${
                            isCurrentPacketRejectionNode
                              ? 'bg-rose-500/30 text-rose-300'
                              : isActive
                              ? 'bg-cyan-500/30 text-cyan-200'
                              : isPast
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {node.id === 0 && <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />}
                          {node.id === 1 && <Radio className="h-4 w-4 sm:h-5 sm:w-5" />}
                          {node.id === 2 && <Radio className="h-4 w-4 sm:h-5 sm:w-5" />}
                          {node.id === 3 && <Server className="h-4 w-4 sm:h-5 sm:w-5" />}
                          {node.id === 4 && <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </div>

                        <div>
                          <span className="text-xs font-bold leading-tight block">{node.name}</span>
                          <span className="text-[9px] text-slate-400 sm:mt-0.5 line-clamp-1 block">
                            {node.device}
                          </span>
                        </div>
                      </div>

                      {/* Node Stats */}
                      <div className="mt-0 sm:mt-2 pt-0 sm:pt-2 border-t-0 sm:border-t border-slate-800/80 text-[10px] space-y-0.5 sm:space-y-1 text-right sm:text-left shrink-0">
                        <div className="flex justify-end sm:justify-between text-slate-400 gap-1">
                          <span className="hidden sm:inline">RSSI:</span>
                          <span className="font-mono text-slate-200">{node.rssi}</span>
                        </div>
                        <div className="flex justify-end sm:justify-between text-slate-400 gap-1">
                          <span className="hidden sm:inline">Battery:</span>
                          <span className="font-mono text-slate-200">{node.battery}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Hop Diagnostics Banner */}
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-cyan-400 animate-spin" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Live Telemetry Header
                    </span>
                    <span className="font-mono font-medium text-slate-200">
                      {currentPacket ? (
                        <>
                          <span className="text-cyan-400">TTL: {currentPacket.ttl}</span> | Hop:{' '}
                          {currentPacket.current_hop}/4 | Nonce: {currentPacket.nonce.substring(0, 10)}...
                        </>
                      ) : (
                        'Awaiting Mesh Packet Transmission...'
                      )}
                    </span>
                  </div>
                </div>

                {currentPacket?.tampered && (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> BIT-FLIP DETECTED
                  </span>
                )}
              </div>

            </div>

            {/* Packet Payload Visualizer Panel */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  Encrypted Payload Structure (AES-256-GCM)
                </span>
                {currentPacket && (
                  <button
                    onClick={() => setShowJsonInspector(!showJsonInspector)}
                    className="text-[10px] text-cyan-400 hover:underline font-mono"
                  >
                    {showJsonInspector ? 'Hide JSON' : 'Inspect JSON Payload'}
                  </button>
                )}
              </div>

              {currentPacket ? (
                <div className="font-mono text-[11px] text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1 overflow-x-auto">
                  <div className="text-slate-400">
                    packet_id: <span className="text-emerald-400">{currentPacket.packet_id}</span>
                  </div>
                  <div className="text-slate-400">
                    engine_type: <span className="text-cyan-300">{currentPacket.engine_type}</span> | amount: <span className="text-amber-300">₹{currentPacket.amount}</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    nonce: <span className="text-slate-200">{currentPacket.nonce}</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    auth_tag: <span className={currentPacket.tampered ? 'text-rose-400 font-bold' : 'text-slate-200'}>{currentPacket.auth_tag}</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    ecdsa_sig: <span className="text-slate-400">{currentPacket.signature.substring(0, 32)}...</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-2 text-center">
                  No active packet in flight. Click "Initiate Mesh Payment" or trigger an attack scenario.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: CRYPTOGRAPHIC TELEMETRY & ATTACK TESTBENCH (4)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Security Attack Testbench */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                Security Attack Testbench
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Trigger Replay Attack */}
              <button
                disabled={isTransmitting}
                onClick={() => handleInitiatePayment('REPLAY_ATTACK')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition flex items-center justify-between group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-rose-400 transition">
                  1. Trigger Replay Attack
                </span>
                <Play className="h-3.5 w-3.5 text-slate-500 group-hover:text-rose-400 transition shrink-0" />
              </button>

              {/* Trigger MITM Payload Tamper */}
              <button
                disabled={isTransmitting}
                onClick={() => handleInitiatePayment('MITM_TAMPER')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition flex items-center justify-between group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-rose-400 transition">
                  2. Trigger Payload Tamper
                </span>
                <Play className="h-3.5 w-3.5 text-slate-500 group-hover:text-rose-400 transition shrink-0" />
              </button>

              {/* Trigger Engine 1 Overdraft */}
              <button
                disabled={isTransmitting}
                onClick={() => {
                  setSelectedEngine('ENGINE_1');
                  setAmountInput('18000');
                  setTimeout(() => handleInitiatePayment('OVERDRAFT'), 100);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition flex items-center justify-between group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-rose-400 transition">
                  3. Trigger Engine 1 Overdraft
                </span>
                <Play className="h-3.5 w-3.5 text-slate-500 group-hover:text-rose-400 transition shrink-0" />
              </button>
            </div>
          </div>

          {/* Real-time Console Log */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col flex-1 min-h-[380px] justify-between">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Real-Time Console Telemetry</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyLogJson}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 flex items-center gap-1 transition"
                >
                  {copiedLog ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedLog ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={clearLogs}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-700 transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 py-2">
              {(['ALL', 'CRYPTO', 'ROUTING', 'ATTACK'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`text-[10px] px-2.5 py-1 rounded-md font-semibold transition ${
                    logFilter === filter
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Monospace Output Panel */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/90 font-mono-code text-[11px] h-72 overflow-y-auto space-y-2 flex-1">
              {filteredLogs.length === 0 ? (
                <div className="text-slate-600 italic py-6 text-center text-xs">
                  Console idle. Run a payment or trigger an attack scenario to view live telemetry logs...
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex flex-col gap-0.5 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 select-none text-[10px]">
                        [{log.timestamp}] (+{log.offsetMs}ms)
                      </span>

                      <span
                        className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                          log.category === 'CRYPTO'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : log.category === 'ROUTING'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : log.category === 'ATTACK' || log.category === 'ERROR'
                            ? 'bg-rose-500/20 text-rose-300'
                            : log.category === 'WARN'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {log.category}
                      </span>

                      <span
                        className={`flex-1 break-words ${
                          log.category === 'ATTACK' || log.category === 'ERROR'
                            ? 'text-rose-300 font-semibold'
                            : log.category === 'WARN'
                            ? 'text-amber-300'
                            : log.category === 'CRYPTO'
                            ? 'text-cyan-200'
                            : 'text-slate-300'
                        }`}
                      >
                        {log.message}
                      </span>
                    </div>

                    {/* Formatted JSON payload snapshot if present */}
                    {log.payload && (
                      <pre className="ml-16 bg-slate-900/90 text-slate-400 p-2 rounded border border-slate-800 text-[10px] overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>

          </div>

        </div>
      </main>
      )}

      {/* --- FOOTER BANNER --- */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-3 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>MeshPay Protocol Specification v2.4 | Hardware Escrow & Direct-Debit Dual Engine</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>AES-256-GCM</span>
          <span>ECDSA secp256k1</span>
          <span>SHA-256 Nonce Deduplication</span>
          <span>NPCI UPI Lite Enclave Compatible</span>
        </div>
      </footer>
    </div>
  );
}
