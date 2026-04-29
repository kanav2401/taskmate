import { useEffect, useState } from "react";
import { withdrawFunds, getTransactions, API_URL } from "../api/api";
import { Wallet, ArrowUpRight, ArrowDownLeft, Banknote, History, CreditCard, Clock } from "lucide-react";

export default function WalletPage() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        });

        if (!res.ok) {
        setTransactions([]);
        return;
        }

        const user = await res.json();
        setBalance(user.walletBalance || 0);

        const tx = await getTransactions();

        if (Array.isArray(tx)) {
        setTransactions(tx);
        } else {
        setTransactions([]);
        }
    } catch (err) {
        setTransactions([]);
    } finally {
        setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("Are you sure you want to withdraw all available funds to your registered bank account?")) return;
    try {
        const res = await withdrawFunds();
        alert(res.message);
        loadData();
    } catch(err) { console.error(err); alert("Withdrawal failed");}
  };

  const getTxIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'deposit': return <span className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0"><ArrowDownLeft className="w-4 h-4"/></span>;
      case 'withdrawal': return <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0"><ArrowUpRight className="w-4 h-4"/></span>;
      case 'refund': return <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0"><Clock className="w-4 h-4"/></span>;
      default: return <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><Banknote className="w-4 h-4"/></span>;
    }
  };

  const getTxColor = (type) => {
      switch(type.toLowerCase()){
          case 'deposit': return 'text-green-500';
          case 'withdrawal': return 'text-foreground';
          case 'refund': return 'text-blue-500';
          default: return 'text-foreground';
      }
  };

  if (loading) return (
      <div className="min-h-screen pt-32 pb-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Wallet className="w-6 h-6"/></div>
            <div>
                <h1 className="text-3xl font-bold text-foreground border-none">My Wallet</h1>
                <p className="text-muted-foreground">Manage your funds and view transaction history</p>
            </div>
        </div>

        {/* BALANCE CARD */}
        <div className="relative glass-card rounded-[2rem] p-8 md:p-10 border-none overflow-hidden">
            <div className="absolute inset-0 brand-gradient opacity-10 pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h3 className="text-muted-foreground font-medium mb-2 flex items-center gap-2">Available Balance</h3>
                    <div className="text-5xl md:text-7xl font-bold text-foreground tracking-tight border-none shadow-none m-0">
                        <span className="text-3xl text-primary opacity-50 mr-2">₹</span>
                        {balance.toLocaleString('en-IN')}
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
                    <button 
                        onClick={handleWithdraw}
                        disabled={balance <= 0}
                        className="w-full brand-gradient text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        <Banknote className="w-5 h-5"/> Withdraw Funds
                    </button>
                    <p className="text-xs text-center text-muted-foreground bg-secondary/50 rounded-lg p-2 border border-border">
                        <CreditCard className="w-3 h-3 inline mr-1"/> Sent securely to linked bank
                    </p>
                </div>
            </div>
        </div>

        {/* TRANSACTIONS SECTION */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border-none mt-12">
            <div className="flex items-center gap-2 border-b border-border pb-6 mb-6">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground border-none m-0 shadow-none">Transaction History</h3>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4 border border-border">
                        <ArrowUpRight className="w-6 h-6 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-foreground">No recent transactions</p>
                    <p className="text-muted-foreground text-sm">Your activity will show up here once you start using the platform.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map(tx => (
                        <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                {getTxIcon(tx.type)}
                                <div>
                                    <p className="font-semibold text-foreground capitalize text-sm">{tx.type}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px] sm:max-w-md">{tx.task?.title || "Funds transfer"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm ${getTxColor(tx.type)}`}>
                                   {tx.type.toLowerCase() === 'withdrawal' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}