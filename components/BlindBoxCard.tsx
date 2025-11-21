
import React from 'react';
import { BlindBox, BoxStatus } from '../types';
import { Package, Zap, BadgeCheck, Lock } from 'lucide-react';

interface Props {
  box: BlindBox;
  onClick: () => void;
  actionButton?: React.ReactNode; // 允许父组件注入额外按钮（如：上传凭证）
}

export const BlindBoxCard: React.FC<Props> = ({ box, onClick, actionButton }) => {
  const statusColors = {
    [BoxStatus.WAITING]: "bg-brand-100 text-brand-800 border-brand-200",
    [BoxStatus.OPENED]: "bg-orange-100 text-orange-800 border-orange-200",
    [BoxStatus.VOTING]: "bg-blue-100 text-blue-800 border-blue-200",
    [BoxStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
    [BoxStatus.FAILED]: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels = {
    [BoxStatus.WAITING]: "待拆开启",
    [BoxStatus.OPENED]: "已拆/待履约",
    [BoxStatus.VOTING]: "DAO投票中",
    [BoxStatus.COMPLETED]: "已完成",
    [BoxStatus.FAILED]: "履约失败",
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Image / Mystery Overlay */}
      <div className="h-48 w-full bg-slate-200 relative overflow-hidden shrink-0">
        <img 
          src={box.imageUrl} 
          alt="Box Preview" 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${box.status === BoxStatus.WAITING ? 'blur-sm' : ''}`}
        />
        {box.status === BoxStatus.WAITING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white backdrop-blur-[2px]">
            <Package className="w-12 h-12 mb-2 animate-bounce" />
            <span className="font-bold tracking-wider">神秘盲盒</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
           <span className={`text-xs font-bold px-2 py-1 rounded-full border ${statusColors[box.status]}`}>
             {statusLabels[box.status]}
           </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[10px] text-white font-mono">{box.id}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{box.description}</h3>
        </div>
        
        <div className="flex items-center text-xs text-slate-500 mb-4 space-x-2">
          <span className="flex items-center bg-slate-100 px-2 py-1 rounded truncate max-w-[150px]">
             发布者: {box.publisher}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center space-x-1 text-amber-500">
            <Zap className="w-4 h-4 fill-current" />
            <span className="font-bold text-sm">{box.pointsCost} 积分</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            {box.status === BoxStatus.WAITING ? (
               <Lock className="w-3 h-3" />
            ) : (
               <BadgeCheck className="w-3 h-3 text-green-500" />
            )}
             <span className="text-xs">惊喜值: {box.surpriseScore}</span>
          </div>
        </div>

        {actionButton && (
            <div className="mt-3 pt-3 border-t border-slate-100">
                {actionButton}
            </div>
        )}
      </div>
    </div>
  );
};
