
import React, { useState, useEffect } from 'react';
import { BlindBoxCard } from '../components/BlindBoxCard';
import { BlindBox, BoxStatus } from '../types';
import { BlockchainService } from '../services/mockBlockchain';
import { Search, Filter, Zap, Loader2 } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const [boxes, setBoxes] = useState<BlindBox[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<BlindBox | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 初始化加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fetchedBoxes, user] = await Promise.all([
        BlockchainService.getAllBoxes(),
        BlockchainService.getUserProfile()
      ]);
      setBoxes(fetchedBoxes);
      setUserPoints(user.points);
    } catch (e) {
      console.error("加载失败", e);
    } finally {
      setLoading(false);
    }
  };

  const handleBoxClick = (box: BlindBox) => {
    setSelectedBox(box);
    setErrorMsg(null);
  };

  const handleOpenBox = async () => {
    if (!selectedBox) return;
    
    // 前置检查
    if (userPoints < selectedBox.pointsCost) {
      setErrorMsg(`积分不足！你需要 ${selectedBox.pointsCost} 积分，但当前只有 ${userPoints} 积分。发布盲盒可赚取积分。`);
      return;
    }

    setOpeningId(selectedBox.id);
    setErrorMsg(null);
    
    try {
      const updatedBox = await BlockchainService.openBox(selectedBox.id);
      
      // 更新本地状态
      setBoxes(prev => prev.map(b => b.id === selectedBox.id ? updatedBox : b));
      setSelectedBox(updatedBox);
      setUserPoints(prev => prev - selectedBox.pointsCost); // 实时扣除显示
      
    } catch (e: any) {
      console.error("开启失败", e);
      setErrorMsg(e.message || "开启失败，请重试");
    } finally {
      setOpeningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">盲盒市场</h2>
          <p className="text-slate-500">当前积分余额: <span className="font-bold text-brand-600">{userPoints}</span></p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索盲盒..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500" 
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {boxes.map(box => (
          <BlindBoxCard key={box.id} box={box} onClick={() => handleBoxClick(box)} />
        ))}
      </div>

      {/* 详情弹窗 */}
      {selectedBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setSelectedBox(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-56 bg-slate-200">
               <img src={selectedBox.imageUrl} className={`w-full h-full object-cover transition-all duration-700 ${selectedBox.status === BoxStatus.WAITING ? 'blur-md' : 'blur-0'}`} alt="Cover" />
               <button onClick={() => setSelectedBox(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center">
                 &times;
               </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${selectedBox.status === BoxStatus.WAITING ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                     {selectedBox.status === BoxStatus.WAITING ? '待解锁' : '已揭晓'}
                   </span>
                   <h3 className="text-2xl font-bold text-slate-900 mt-2">{selectedBox.description}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">质押金额</div>
                  <div className="font-mono font-bold">{selectedBox.priceEth} ETH</div>
                </div>
              </div>

              {selectedBox.status !== BoxStatus.WAITING ? (
                <div className="bg-brand-50 p-5 rounded-xl border border-brand-100 mb-6 shadow-inner">
                  <h4 className="font-semibold text-brand-800 mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-1" /> 惊喜承诺内容:
                  </h4>
                  <p className="text-brand-900 text-lg font-medium">{selectedBox.promiseContent}</p>
                  <p className="text-xs text-brand-400 mt-2">发布者已锁定 0.01 ETH 直至履约完成</p>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <p className="text-slate-500 flex items-center justify-center h-20">
                    🔒 内容已通过 IPFS 加密隐藏
                  </p>
                </div>
              )}

              {errorMsg && (
                 <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                   {errorMsg}
                 </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                 <div className="flex flex-col">
                    <span className="text-xs text-slate-500">拆盒费用</span>
                    <div className={`flex items-center font-bold text-xl ${userPoints >= selectedBox.pointsCost ? 'text-amber-500' : 'text-red-400'}`}>
                       <Zap className="w-5 h-5 fill-current mr-1" /> {selectedBox.pointsCost} 积分
                    </div>
                 </div>
                 
                 {selectedBox.status === BoxStatus.WAITING ? (
                    <button 
                      onClick={handleOpenBox}
                      disabled={openingId !== null}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-brand-200 transition-all active:scale-95"
                    >
                      {openingId === selectedBox.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2"/> 解锁中...</>
                      ) : (
                        '立即解锁'
                      )}
                    </button>
                 ) : (
                    <div className="text-green-700 font-medium px-6 py-3 bg-green-50 rounded-xl border border-green-100 flex items-center">
                      ✅ 拆盒成功
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
