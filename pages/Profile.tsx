
import React, { useState, useEffect } from 'react';
import { Medal, Award, Layers, Package, Loader2, Upload, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { BlockchainService } from '../services/mockBlockchain';
import { UserProfile, BlindBox, BoxStatus } from '../types';
import { BlindBoxCard } from '../components/BlindBoxCard';

export const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [myPublished, setMyPublished] = useState<BlindBox[]>([]);
  const [myOpened, setMyOpened] = useState<BlindBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'published' | 'opened'>('overview');
  
  // Upload State
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const u = await BlockchainService.getUserProfile();
      const txs = await BlockchainService.getTransactions();
      const allBoxes = await BlockchainService.getAllBoxes();
      
      setUser(u);
      setTransactions(txs);
      
      // Filter boxes locally
      setMyPublished(allBoxes.filter(b => b.publisher === u.address));
      setMyOpened(allBoxes.filter(b => b.opener === u.address));
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = async (e: React.MouseEvent, box: BlindBox) => {
    e.stopPropagation(); // Prevent card click
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;
        
        setUploadingId(box.id);
        try {
            await BlockchainService.submitProof(box.id, file);
            await loadData(); // Reload to see status change
            alert("凭证提交成功，等待 DAO 审核！");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUploadingId(null);
        }
    };
    input.click();
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Chart Data
  const activityData = [
    { name: '已发布', value: user.publishedCount },
    { name: '已拆开', value: user.openedCount },
  ];
  const COLORS = ['#8b5cf6', '#3b82f6'];
  const fulfillData = [
    { name: '周一', rate: 95 },
    { name: '周二', rate: 90 },
    { name: '周三', rate: 100 },
    { name: '周四', rate: user.fulfillmentRate },
    { name: '周五', rate: 98 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-brand-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-100">
          {user.address.substring(2, 4).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.address}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
            {user.medals.map((m, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                <Award className="w-3 h-3 mr-1" /> {m.type}
              </span>
            ))}
            {user.publishedCount > 5 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                <Award className="w-3 h-3 mr-1" /> 活跃发布者
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-8 text-center">
           <div className="bg-slate-50 p-3 rounded-xl min-w-[100px]">
             <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">持有积分</div>
             <div className="text-2xl font-bold text-brand-600">{user.points}</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl min-w-[100px]">
             <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">余额 ETH</div>
             <div className="text-2xl font-bold text-slate-900">{user.ethBalance.toFixed(3)}</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl min-w-[100px]">
             <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">履约信誉</div>
             <div className="text-2xl font-bold text-green-600">{user.fulfillmentRate}%</div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
        <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            数据概览
        </button>
        <button 
            onClick={() => setActiveTab('published')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'published' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            我发布的 ({myPublished.length})
        </button>
        <button 
            onClick={() => setActiveTab('opened')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'opened' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            我拆开的 ({myOpened.length})
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center"><Layers className="w-5 h-5 mr-2 text-slate-500"/> 活跃度占比</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={activityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6">
                    <div className="flex items-center text-sm text-slate-600"><div className="w-3 h-3 bg-brand-500 rounded-full mr-2"></div> 已发布 ({user.publishedCount})</div>
                    <div className="flex items-center text-sm text-slate-600"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div> 已拆开 ({user.openedCount})</div>
                </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center"><Medal className="w-5 h-5 mr-2 text-slate-500"/> 近期履约评分</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fulfillData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>
            
            <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900 flex items-center"><Package className="w-5 h-5 mr-2"/> 最近交易记录</h3>
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                {transactions.length > 0 ? (
                    <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                        <th className="px-6 py-3 font-medium">类型</th>
                        <th className="px-6 py-3 font-medium">关联 ID</th>
                        <th className="px-6 py-3 font-medium">变动</th>
                        <th className="px-6 py-3 font-medium text-right">状态</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium">{tx.type}</td>
                            <td className="px-6 py-4 font-mono text-slate-600 text-xs">{tx.id}</td>
                            <td className={`px-6 py-4 ${tx.amount.includes('-') ? 'text-slate-900' : 'text-green-600 font-bold'}`}>{tx.amount}</td>
                            <td className="px-6 py-4 text-right">
                            <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-full text-xs font-bold">{tx.status}</span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-slate-500">暂无交易记录</div>
                )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'published' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
           {myPublished.length === 0 && <div className="col-span-3 text-center py-12 text-slate-500">你还没有发布过盲盒</div>}
           {myPublished.map(box => (
               <BlindBoxCard 
                  key={box.id} 
                  box={box} 
                  onClick={() => {}} 
                  actionButton={
                      box.status === BoxStatus.OPENED ? (
                        <button 
                           onClick={(e) => handleUploadProof(e, box)}
                           disabled={uploadingId === box.id}
                           className="w-full flex items-center justify-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold transition-colors"
                        >
                           {uploadingId === box.id ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Upload className="w-4 h-4 mr-2"/>}
                           上传履约凭证
                        </button>
                      ) : box.status === BoxStatus.VOTING ? (
                        <div className="w-full py-2 bg-amber-50 text-amber-600 rounded-lg text-sm font-semibold text-center">
                            DAO 审核中...
                        </div>
                      ) : box.status === BoxStatus.COMPLETED ? (
                        <div className="w-full py-2 bg-green-50 text-green-600 rounded-lg text-sm font-semibold text-center flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 mr-1"/> 已履约
                        </div>
                      ) : null
                  }
               />
           ))}
        </div>
      )}

      {activeTab === 'opened' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
           {myOpened.length === 0 && <div className="col-span-3 text-center py-12 text-slate-500">你还没有拆过盲盒</div>}
           {myOpened.map(box => (
               <BlindBoxCard key={box.id} box={box} onClick={() => {}} />
           ))}
        </div>
      )}
    </div>
  );
};
