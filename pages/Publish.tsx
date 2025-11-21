
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { BlockchainService } from '../services/mockBlockchain';

export const Publish: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    promise: '',
    ethAmount: 0.001,
    image: null as File | null,
    imagePreview: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          image: file, 
          imagePreview: reader.result as string 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.description || !formData.promise) {
      alert("请填写完整信息");
      return;
    }
    
    setLoading(true);
    try {
      await BlockchainService.publishBox({
        description: formData.description,
        promiseContent: formData.promise,
        priceEth: formData.ethAmount,
        imageUrl: formData.imagePreview || undefined
      });
      
      // 成功后稍微延迟跳转，增强体验
      setTimeout(() => {
        navigate('/market');
      }, 1000);
      
    } catch (e: any) {
      console.error(e);
      alert("发布失败: " + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">发布新盲盒</h2>
        <p className="text-slate-500 mt-2">分享惊喜，质押 ETH，赚取积分。</p>
      </div>

      {/* 步骤指示器 */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">公开描述 (Teaser)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="例如：一份来自东京的神秘伴手礼"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <p className="text-xs text-slate-400 mt-1">此描述将对所有用户可见。</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">封面图片</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer relative h-48 overflow-hidden">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                {formData.imagePreview ? (
                   <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">点击上传预览图 (JPG/PNG)</span>
                  </>
                )}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">下一步：承诺内容</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start space-x-3">
               <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
               <p className="text-sm text-amber-800">此内容将通过 IPFS <strong>加密存储</strong>，仅对成功解锁该盲盒的用户可见。</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">神秘承诺</label>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                placeholder="详细描述你将交付的物品或服务..."
                value={formData.promise}
                onChange={e => setFormData({...formData, promise: e.target.value})}
              />
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setStep(1)} className="flex-1 text-slate-600 py-3 font-semibold hover:bg-slate-50 rounded-lg transition-colors">上一步</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">下一步：质押</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">质押 ETH</h3>
              <p className="text-slate-500">为你的承诺提供价值担保。</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">质押金额 (ETH)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.001"
                  min="0.001"
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-lg font-mono"
                  value={formData.ethAmount}
                  onChange={e => setFormData({...formData, ethAmount: parseFloat(e.target.value)})}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">ETH</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                <span>最小值: 0.001 ETH</span>
                <span>余额: 充足</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>预计奖励积分:</span>
                <span className="font-bold text-amber-500 flex items-center"><Sparkles className="w-3 h-3 mr-1"/> +20 积分</span>
              </div>
              <div className="flex justify-between">
                <span>网络预估费 (Gas):</span>
                <span>~0.0002 ETH</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setStep(2)} className="flex-1 text-slate-600 py-3 font-semibold hover:bg-slate-50 rounded-lg">上一步</button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-brand-200 transition-all"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> 处理中...</>
                ) : (
                  '确认质押并发布'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
