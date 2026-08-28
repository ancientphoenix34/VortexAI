import { useState, useMemo } from 'react'
import { Code2, Copy, Eye, PanelRightClose, PanelRightOpen, Check, RefreshCw, FileCode, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const Artifact = () => {
  const { artifacts } = useSelector((state: any) => state.message)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tab, setTab] = useState<'code' | 'preview'>('code')
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  if (!artifacts || artifacts.length === 0) return;

  const currentArtifact = artifacts[0];
  const files = currentArtifact?.files || [];
  const currentFile = files[selectedFileIndex] || { name: 'code', content: currentArtifact?.content || currentArtifact?.code || '' };

  const getLanguage = (fileName: string) => {
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'typescript';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.py')) return 'python';
    return 'javascript';
  };

  const handleCopy = () => {
    if (currentFile?.content) {
      navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const srcDoc = useMemo(() => {
    if (!currentArtifact) return '';
    const fileList = currentArtifact.files || [];

    const htmlContent = fileList.find((f: any) => f.name?.endsWith('.html'))?.content || currentArtifact.html || currentArtifact.content || '';
    const cssContent = fileList.find((f: any) => f.name?.endsWith('.css'))?.content || currentArtifact.css || '';
    const jsContent = fileList.find((f: any) => f.name?.endsWith('.js'))?.content || currentArtifact.js || '';

    if (htmlContent.includes('<html') || htmlContent.includes('<!DOCTYPE')) {
      let doc = htmlContent;
      if (cssContent && !doc.includes('<style')) {
        doc = doc.replace('</head>', `<style>${cssContent}</style></head>`);
        if (!doc.includes('</head>')) {
          doc = `<style>${cssContent}</style>` + doc;
        }
      }
      if (jsContent && !doc.includes('<script')) {
        doc = doc.replace('</body>', `<script>${jsContent}</script></body>`);
        if (!doc.includes('</body>')) {
          doc = doc + `<script>${jsContent}</script>`;
        }
      }
      return doc;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${cssContent}
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            ${jsContent}
          </script>
        </body>
      </html>
    `;
  }, [currentArtifact]);

  const PanelContent = ({ onClose }: { onClose?: () => void }) => {
    return !collapsed ? (
      <div className='flex flex-col h-full bg-[#0d0f14] overflow-hidden'>
        {/* Header */}
        <div className='h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0 bg-[#0d0f14]'>
          <button
            onClick={onClose || (() => setCollapsed(true))}
            className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0'
            title="Collapse Panel"
          >
            {onClose ? <X size={16} /> : <PanelRightClose size={16} />}
          </button>

          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <div className='flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0'>
              <Code2 className="text-indigo-400" size={12} />
            </div>
            <div className='text-[13px] font-medium text-slate-200 truncate'>{currentArtifact?.title || 'Generated Artifact'}</div>
          </div>

          <div className='flex items-center gap-1 shrink-0'>
            <button
              onClick={handleCopy}
              className='flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer'
              title="Copy Code"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className='flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg shrink-0'>
            <button
              onClick={() => setTab("code")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 border-none cursor-pointer ${tab === "code" ? "bg-indigo-500 text-white" : "bg-transparent text-slate-500 hover:text-slate-200"
                }`}
            >
              <Code2 size={11} /> Code
            </button>
            <button
              onClick={() => setTab("preview")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 border-none cursor-pointer ${tab === "preview" ? "bg-indigo-500 text-white" : "bg-transparent text-slate-500 hover:text-slate-200"
                }`}
            >
              <Eye size={11} /> Preview
            </button>
          </div>
        </div>

        {/* Main Body Content */}
        {tab === 'code' ? (
          <div className='flex-1 flex flex-col min-h-0 bg-[#0d0f14]'>
            {/* File selection tabs if multiple files exist */}
            {files.length > 0 && (
              <div className='flex items-center gap-1 px-4 py-2 border-b border-white/[0.06] overflow-x-auto bg-[#0a0c10] shrink-0'>
                {files.map((file: any, index: number) => {
                  const isSelected = selectedFileIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedFileIndex(index)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border cursor-pointer ${isSelected
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/[0.04]'
                        }`}
                    >
                      <FileCode size={13} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                      <span>{file.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Code viewer */}
            <div className='flex-1 overflow-auto bg-[#0d1117] p-2'>
              <SyntaxHighlighter
                language={getLanguage(currentFile.name)}
                style={oneDark}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  background: 'transparent',
                  fontSize: '12.5px',
                  lineHeight: '1.6',
                }}
              >
                {currentFile.content || '// No code available'}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex flex-col min-h-0 bg-[#0d0f14] relative'>
            {/* Preview Controls Bar */}
            <div className='flex items-center justify-between px-3 py-1.5 bg-[#0a0c10] border-b border-white/[0.06] shrink-0 text-xs text-slate-400'>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                <span className='text-[11px] font-mono text-slate-400'>Live Preview</span>
              </div>
              <button
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className='flex items-center gap-1 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded transition-colors bg-transparent border-none cursor-pointer'
                title="Reload Preview"
              >
                <RefreshCw size={12} /> Reload
              </button>
            </div>

            {/* Preview Iframe */}
            <div className='flex-1 w-full h-full bg-white relative overflow-hidden'>
              <iframe
                key={refreshKey}
                title="Artifact Preview"
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className='flex flex-col h-full bg-[#0d0f14] items-center py-4 gap-3 shrink-0'>
        <button
          className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0'
          onClick={() => setCollapsed(false)}
          title="Expand Panel"
        >
          <PanelRightOpen size={16} />
        </button>
        <div className='flex items-center gap-2 flex-1 min-w-0'>
          <div
            className='text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap'
            style={{
              writingMode: "vertical-lr",
              transform: "rotate(180deg)"
            }}
          >
            {currentArtifact?.title || 'Artifact'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-medium shadow-lg shadow-indigo-500/20 border-none cursor-pointer transition-colors duration-150"
      >
        <Code2 size={13} />
        View Code
      </button>

      <AnimatePresence>
        {mobileOpen && <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[420px] border-l border-white/[0.06] overflow-hidden"
          >
            <PanelContent onClose={() => setMobileOpen(false)} />
          </motion.div>
        </>
        }
      </AnimatePresence>

      <motion.div
        initial={{ width: 460 }}
        animate={{ width: collapsed ? 48 : 460 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0'
      >
        <PanelContent />
      </motion.div>
    </>
  )
}

export default Artifact