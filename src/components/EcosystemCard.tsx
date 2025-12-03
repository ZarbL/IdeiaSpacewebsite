'use client';

import { useTranslations } from 'next-intl';

export default function EcosystemCard() {
  const t = useTranslations('services.ecosystem');

  return (
    <div className="relative w-full max-w-sm">
      <div 
        className="relative overflow-hidden rounded-lg shadow-lg"
        style={{
          width: '340px',
          height: '280px',
          background: 'lightgrey'
        }}
      >
        {/* Browser Header */}
        <div 
          className="flex justify-between items-end px-5 h-10"
          style={{ backgroundColor: '#353535' }}
        >
          <div 
            className="relative flex items-start justify-between gap-1 px-2 pt-1 rounded-t-lg"
            style={{
              width: '120px',
              height: '34px',
              backgroundColor: '#515151'
            }}
          >
            {/* Left rounded corner */}
            <div className="absolute top-0 -left-5 w-5 h-6 overflow-hidden" style={{ backgroundColor: '#515151' }}>
              <div className="w-full h-full rounded-br-lg" style={{ backgroundColor: '#353535' }} />
            </div>
            
            <span className="text-white text-xs mt-0.5">IdeiaSpace</span>
            
            <div 
              className="text-white text-xs px-1 rounded-full cursor-default hover:bg-gray-600 transition-colors"
            >
              ✕
            </div>
            
            {/* Right rounded corner */}
            <div className="absolute top-0 -right-5 w-5 h-6 overflow-hidden" style={{ backgroundColor: '#515151' }}>
              <div className="w-full h-full rounded-bl-lg" style={{ backgroundColor: '#353535' }} />
            </div>
          </div>
          
          <div className="flex mb-2">
            <button className="w-7 h-7 text-white bg-transparent hover:bg-gray-600 transition-colors">-</button>
            <button className="w-7 h-7 text-white bg-transparent hover:bg-gray-600 transition-colors">□</button>
            <button className="w-7 h-7 text-white bg-transparent hover:bg-gray-600 hover:bg-red-500 transition-colors">✕</button>
          </div>
        </div>

        {/* Address Bar */}
        <div 
          className="absolute w-full flex items-center gap-1 px-2 py-2 rounded-t-lg"
          style={{
            top: '30px',
            height: '40px',
            backgroundColor: '#515151'
          }}
        >
          <button className="w-7 h-6 text-white bg-transparent rounded-full hover:bg-gray-600 transition-colors">←</button>
          <button className="w-7 h-6 text-white bg-transparent rounded-full opacity-40" disabled>→</button>
          
          <div className="relative flex-1">
            <input 
              type="text"
              className="w-full h-6 px-4 text-white text-sm rounded-full outline-none border-2 border-transparent focus:border-blue-300 hover:bg-gray-600 transition-colors"
              style={{ backgroundColor: '#3b3b3b' }}
              value={t('title')}
              readOnly
            />
            <button className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-white text-base opacity-70 flex items-center justify-center pb-1">✰</button>
          </div>
          
          <button className="w-7 h-6 text-white bg-transparent rounded-full hover:bg-gray-600 transition-colors">⋮</button>
        </div>

        {/* Content Area */}
        <div 
          className="absolute w-full overflow-y-auto p-4"
          style={{
            top: '70px',
            height: 'calc(100% - 70px)',
            backgroundColor: '#ffffff'
          }}
        >
          <ul className="space-y-3 text-sm text-gray-800">
            {(t.raw('items') as string[]).map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-base mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
