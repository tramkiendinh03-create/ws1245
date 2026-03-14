/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SidePanel } from './components/SidePanel';

export default function App() {
  return (
    <div className="text-gray-100 font-sans flex flex-col relative selection:bg-pink-500/40">
      <div className="relative z-10 flex flex-col p-1.5 sm:p-2 gap-2 sm:gap-2.5 mx-auto w-full">
        <div className="flex justify-center">
          <SidePanel />
        </div>
      </div>
    </div>
  );
}
