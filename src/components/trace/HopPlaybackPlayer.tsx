import React, { useState, useEffect } from 'react';
import { HopDetail } from '../../types';
import { Play, Pause, SkipForward, RotateCcw, ArrowRight } from 'lucide-react';

interface HopPlaybackPlayerProps {
  hops: HopDetail[];
  activeHopIndex: number;
  onHopChange: (index: number) => void;
  targetAddress: string;
  vaspDestination: string;
}

export const HopPlaybackPlayer: React.FC<HopPlaybackPlayerProps> = ({
  hops,
  activeHopIndex,
  onHopChange,
  targetAddress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      const intervalMs = 1800 / speed;
      timer = setInterval(() => {
        if (activeHopIndex < hops.length - 1) {
          onHopChange(activeHopIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeHopIndex, hops.length, speed, onHopChange]);

  const handlePlayPause = () => {
    if (activeHopIndex >= hops.length - 1) {
      onHopChange(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    onHopChange(0);
    setIsPlaying(true);
  };

  const handleStepForward = () => {
    if (activeHopIndex < hops.length - 1) {
      onHopChange(activeHopIndex + 1);
    }
  };

  const currentHop = hops[activeHopIndex];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mb-4">
      {/* Player Header & Controls */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
            <Play className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Sequential Hop Trace Playback</h3>
            <p className="text-xs text-slate-500">Forensic step-by-step transaction flow animation</p>
          </div>
        </div>

        {/* Playback Button Group */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReplay}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition text-xs flex items-center space-x-1 border border-slate-200"
            title="Replay from Hop 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handlePlayPause}
            className={`px-3 py-1.5 rounded text-xs font-semibold text-white flex items-center space-x-1.5 shadow-sm transition ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={activeHopIndex >= hops.length - 1}
            className="p-1.5 hover:bg-slate-100 disabled:opacity-40 rounded text-slate-600 transition border border-slate-200"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-200 font-mono"
            title="Playback Speed"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Visual Hop Chain Horizontal Sequence */}
      <div className="overflow-x-auto py-2">
        <div className="flex items-center space-x-2 min-w-max">
          {/* Target Wallet Start Node */}
          <div className="flex flex-col items-center">
            <div className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Suspect Source</span>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}
              </span>
            </div>
          </div>

          {/* Sequential Hops */}
          {hops.map((hop, idx) => {
            const isActive = idx === activeHopIndex;
            const isPassed = idx < activeHopIndex;

            return (
              <React.Fragment key={hop.hopIndex}>
                <div className="flex flex-col items-center px-1">
                  <ArrowRight className={`w-4 h-4 transition ${isActive ? 'text-blue-600 font-bold' : isPassed ? 'text-slate-400' : 'text-slate-200'}`} />
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">{hop.amount} {hop.asset}</span>
                </div>

                <div
                  onClick={() => onHopChange(idx)}
                  className={`cursor-pointer px-3 py-2 rounded-md border text-center transition min-w-[130px] ${
                    isActive
                      ? 'bg-blue-600 border-blue-700 text-white shadow-md scale-105'
                      : isPassed
                      ? 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400'
                      : 'bg-white border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    <span>Hop #{hop.hopIndex}</span>
                    {hop.isVASP && (
                      <span className={`px-1 rounded ${isActive ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700'}`}>
                        VASP
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-semibold truncate max-w-[120px]">
                    {hop.isVASP ? hop.vaspName : `${hop.toAddress.slice(0, 6)}...${hop.toAddress.slice(-4)}`}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Hop Details Info Card */}
      {currentHop && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">
              Hop #{currentHop.hopIndex} Details
            </span>
            <span className="font-mono text-slate-700">
              <strong className="text-slate-900 font-semibold">{currentHop.amount} {currentHop.asset}</strong> (~${currentHop.usdValue.toLocaleString()})
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">{currentHop.timestamp}</span>
          </div>

          <div className="flex items-center space-x-2">
            {currentHop.typology && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-medium">
                Typology: {currentHop.typology}
              </span>
            )}
            {currentHop.isVASP && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-semibold flex items-center space-x-1">
                <span>Destination Matched: {currentHop.vaspName}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
