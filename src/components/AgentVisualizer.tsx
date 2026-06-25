"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Database, Shield, Zap, Activity, BrainCircuit } from 'lucide-react';

const AGENTS = [
  { id: 'sales', name: 'Sales Agent', icon: Zap, color: '#ffbd2e', x: -120, y: -80 },
  { id: 'support', name: 'Support Agent', icon: Shield, color: '#27c93f', x: 120, y: -80 },
  { id: 'analytics', name: 'Data Agent', icon: Database, color: '#61afef', x: -120, y: 100 },
  { id: 'devops', name: 'DevOps Agent', icon: Activity, color: '#c678dd', x: 120, y: 100 },
];

const MOCK_LOGS = [
  "[System] Initializing core orchestrator...",
  "[Support] Ticket #8843 resolved autonomously.",
  "[Data] Aggregating multi-source analytics.",
  "[Sales] Lead scored 94/100, initiating sequence.",
  "[DevOps] Latency spike detected. Re-routing...",
  "[System] Node resources scaled by 14%.",
  "[Support] Context gathered from knowledge base.",
  "[Sales] Email drafted for enterprise client.",
  "[Data] Query completed in 14ms.",
];

export default function AgentVisualizer() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    // Simulate live logs and node activity
    const interval = setInterval(() => {
      const randomLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
      setLogs((prev) => [...prev.slice(-4), randomLog]);
      
      const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)].id;
      setActiveNode(randomAgent);
      setPulse((p) => p + 1);

      setTimeout(() => setActiveNode(null), 1500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] bg-[#050505] border border-[#1a1a1a] rounded-xl overflow-hidden flex items-center justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-dot-grid opacity-30"></div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
        {AGENTS.map((agent) => (
          <motion.line
            key={`line-${agent.id}`}
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${agent.x}px)`}
            y2={`calc(50% + ${agent.y}px)`}
            stroke={activeNode === agent.id ? agent.color : '#1a1a1a'}
            strokeWidth={activeNode === agent.id ? "2" : "1"}
            strokeDasharray={activeNode === agent.id ? "0" : "4 4"}
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1, 
              stroke: activeNode === agent.id ? agent.color : '#1a1a1a',
              opacity: activeNode === agent.id ? 1 : 0.3
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
        {/* Animated Data Packets */}
        <AnimatePresence>
          {activeNode && (
            <motion.circle
              cx="50%"
              cy="50%"
              r="4"
              fill={AGENTS.find(a => a.id === activeNode)?.color || "#fff"}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: AGENTS.find(a => a.id === activeNode)?.x || 0,
                y: AGENTS.find(a => a.id === activeNode)?.y || 0,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "circOut" }}
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Core Node */}
      <motion.div 
        className="absolute z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-[#0a0a0a] border border-[#333]"
        animate={{ 
          boxShadow: activeNode ? `0 0 40px rgba(16, 185, 129, 0.2)` : '0 0 10px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.5 }}
      >
        <BrainCircuit size={32} className="text-[#10b981] mb-1" />
        <span className="text-[10px] font-bold tracking-wider text-muted uppercase">Core</span>
      </motion.div>

      {/* Satellite Nodes */}
      {AGENTS.map((agent) => {
        const isActive = activeNode === agent.id;
        const Icon = agent.icon;
        
        return (
          <motion.div
            key={agent.id}
            className={`absolute z-10 flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-[#0a0a0a] border transition-colors duration-300 ${isActive ? 'border-transparent' : 'border-[#1a1a1a]'}`}
            style={{ 
              transform: `translate(${agent.x}px, ${agent.y}px)`,
              borderColor: isActive ? agent.color : '#1a1a1a',
              boxShadow: isActive ? `0 0 20px ${agent.color}40` : 'none'
            }}
            whileHover={{ scale: 1.1 }}
          >
            <Icon size={20} color={isActive ? agent.color : '#666'} className="mb-1" />
          </motion.div>
        );
      })}

      {/* Live Terminal */}
      <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-80 bg-[#000] border border-[#1a1a1a] rounded-lg p-3 z-20 shadow-2xl">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1a1a1a]">
          <Terminal size={14} className="text-muted" />
          <span className="text-xs font-mono text-muted uppercase tracking-widest">Live Activity Log</span>
          <div className="ml-auto w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
        </div>
        <div className="h-[80px] overflow-hidden flex flex-col justify-end">
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div
                key={pulse + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[11px] font-mono mb-1 last:mb-0"
                style={{
                  color: log.includes('System') ? '#10b981' : 
                         log.includes('Support') ? '#27c93f' :
                         log.includes('Data') ? '#61afef' :
                         log.includes('DevOps') ? '#c678dd' : '#ffbd2e'
                }}
              >
                <span className="opacity-50 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
