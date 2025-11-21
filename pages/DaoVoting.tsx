
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink, Inbox, Loader2 } from 'lucide-react';
import { BlockchainService } from '../services/mockBlockchain';
import { DaoVote } from '../types';

export const DaoVoting: React.FC = () => {
  const [votes, setVotes] = useState<DaoVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadVotes();
  }, []);

  const loadVotes = async () => {
    try {
        const data = await BlockchainService.getDaoVotes();
        setVotes(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleVote = async (boxId: string, approve: boolean) => {
    setProcessingId(boxId);
    try {
        await BlockchainService.voteOnFulfillment(boxId, approve);
        // 投票成功后刷新列表（通常会从列表中移除）
        await loadVotes();
    } catch (e) {
        console.error(e);
        alert("投票失败");
    } finally {
        setProcessingId(null);
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">DAO 社区治理</h2>
          <p className="text-slate-500">验证履约凭证，决定是否释放质押资金。</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-sm text-slate-500">当前投票权重</div>
          <div className="font-bold text-brand-600">1 个节点 (Lv.1)</div>
        </div>
      </div>

      {votes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">暂无待审核提案</h3>
            <p className="text-slate-500 mt-1">当前没有正在进行的履约验证投票。</p>
        </div>
      ) : (
        <div className="grid gap-6">
            {votes.map(vote => (
            <div key={vote.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Evidence Column */}
                <div className="md:w-1/3 space-y-3">
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-100 relative group">
                    <img src={vote.proofUrl} alt="Proof" className="w-full h-full object-cover" />
                    <a href={vote.proofUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium cursor-pointer">
                        <ExternalLink className="w-5 h-5 mr-1" /> 查看凭证原图
                    </a>
                </div>
                <div className="text-xs text-slate-400 font-mono">提案 ID: {vote.id}</div>
                </div>

                {/* Context & Action Column */}
                <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900">承诺履约验证</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${vote.status === '进行中' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        {vote.status}
                    </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 italic p-3 bg-slate-50 rounded-lg border border-slate-100">" {vote.promiseContent} "</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center text-xs font-medium text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" /> {vote.votesFor} 票同意
                    </div>
                    <div className="flex items-center text-xs font-medium text-red-600">
                        <XCircle className="w-4 h-4 mr-1" /> {vote.votesAgainst} 票反对
                    </div>
                    <div className="flex items-center text-xs text-slate-400 ml-auto">
                        <Clock className="w-4 h-4 mr-1" /> 剩余 {vote.deadline}
                    </div>
                    </div>
                </div>

                {vote.status === '进行中' && (
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => handleVote(vote.boxId, true)}
                        disabled={processingId !== null}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg font-semibold border border-green-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {processingId === vote.boxId ? <Loader2 className="w-4 h-4 animate-spin"/> : "通过 (验证属实)"}
                    </button>
                    <button 
                        onClick={() => handleVote(vote.boxId, false)}
                        disabled={processingId !== null}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg font-semibold border border-red-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                         {processingId === vote.boxId ? <Loader2 className="w-4 h-4 animate-spin"/> : "拒绝 (存疑/虚假)"}
                    </button>
                    </div>
                )}
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};
