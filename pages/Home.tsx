import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Gift, Users } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              相信惊喜的力量 <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">区块链见证每一次承诺</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10">
              首个去中心化盲盒社交平台。质押 ETH 发布盲盒，积累积分拆解惊喜。
              DAO 社区治理确保履约过程公开、透明、不可篡改。
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/market" 
                className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-200 hover:bg-brand-700 transition-all hover:-translate-y-1 flex items-center"
              >
                探索盲盒 <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/publish" 
                className="px-8 py-4 bg-white text-brand-700 border-2 border-brand-100 rounded-xl font-bold text-lg hover:bg-brand-50 transition-all hover:-translate-y-1"
              >
                发布盲盒
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">智能合约保障</h3>
              <p className="text-slate-600">发布者需通过 Polygon 智能合约质押 ETH。只有在社区验证承诺履行后，资金才会释放，杜绝欺诈。</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">赚取积分与兑换</h3>
              <p className="text-slate-600">发布盲盒赚取积分，消耗积分拆开他人的盲盒。建立基于信任与惊喜的循环经济体系。</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">DAO 社区治理</h3>
              <p className="text-slate-600">社区节点投票验证履约凭证。作恶者将被扣除质押金，守信者将获得诚信勋章与声誉奖励。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};