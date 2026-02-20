import React from 'react';
import { Package, Trash2 } from 'lucide-react';
import { GlassCard } from './ui';

interface InventoryAppProps {
  items: string[];
  onRemoveItem: (index: number) => void;
}

export const InventoryApp: React.FC<InventoryAppProps> = ({ items, onRemoveItem }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2 text-amber-400">
          <Package className="w-5 h-5" />
          <span className="font-bold">持有道具 ({items.length})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto p-2 flex-1 min-h-0">
        {items.map((item, index) => (
          <GlassCard key={index} className="relative group flex flex-col items-center justify-center p-4 aspect-square bg-white/5 border-white/10 hover:border-amber-500/30 transition-all">
            <Package className="w-8 h-8 text-gray-500 mb-2 group-hover:text-amber-400 transition-colors" />
            <div className="text-sm text-center font-medium text-gray-300 group-hover:text-white">{item}</div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(index);
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
              title="丢弃"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </GlassCard>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <Package className="w-12 h-12 mb-2 opacity-20" />
            <div className="text-sm">暂无道具</div>
          </div>
        )}
      </div>
    </div>
  );
};
