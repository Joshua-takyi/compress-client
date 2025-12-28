import { useEffect, useState } from "react";
import { Button, Slider, HeroUIProvider } from "@heroui/react";
import { Plus, Download, X, Monitor, HardDrive, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Compressor() {
  const [hasMounted, setHasMounted] = useState(false);
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? process.env.API_URL
      : "http://localhost:8080";
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("quality", quality.toString());

    try {
      const resp = await fetch(`${apiUrl}/api/compress`, {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    return (bytes / 1024).toFixed(1) + " KB";
  };

  if (!hasMounted) return <div className="min-h-screen bg-black" />;

  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-black flex flex-col items-center py-20 px-6">
        <div className="w-full max-w-3xl space-y-12">
          {/* Header - Minimal & Serious */}
          <div className="flex justify-between items-end border-b border-[#2e2e2e] pb-6">
            <div>
              <h1 className="text-sm font-medium tracking-widest uppercase text-zinc-500 mb-1">
                Image Engine
              </h1>
              <p className="text-xl font-semibold text-white">Squeeze.sh</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-600 uppercase">
                Version 1.0.4 • Stable
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Left: Configuration */}
            <div className="md:col-span-12 space-y-10">
              {!file ? (
                <div className="relative group border border-dashed border-[#2e2e2e] h-48 flex items-center justify-center hover:border-zinc-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="flex items-center gap-3">
                    <Plus size={16} className="text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-400">
                      Select source image
                    </span>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-[#2e2e2e] p-6 bg-[#0a0a0a] flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-900 border border-[#2e2e2e] flex items-center justify-center overflow-hidden">
                      {preview ? (
                        <img
                          src={preview}
                          alt="original"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <HardDrive size={16} className="text-zinc-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="text-zinc-600 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}

              {/* Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      Quality Output
                    </h3>
                    <span className="text-xs font-mono text-zinc-400">
                      {quality}%
                    </span>
                  </div>
                  <Slider
                    step={1}
                    maxValue={100}
                    minValue={1}
                    value={quality}
                    onChange={setQuality}
                    className="max-w-full"
                    classNames={{
                      track: "bg-[#1a1a1a] h-1 rounded-none",
                      filler: "bg-white",
                      thumb:
                        "bg-white w-3 h-3 rounded-none shadow-none ring-0 after:hidden",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    isDisabled={!file}
                    isLoading={loading}
                    onPress={handleCompress}
                    className="bg-white text-black rounded-none font-bold text-xs uppercase tracking-widest h-12 hover:bg-zinc-200 transition-colors"
                  >
                    Run Optimization
                  </Button>
                  <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
                    All processing is done locally on your machine.
                    <br />
                    Original metadata is preserved.
                  </p>
                </div>
              </div>

              {/* Result Area */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-[#2e2e2e] bg-[#0a0a0a]"
                  >
                    <div className="p-4 border-b border-[#2e2e2e] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-zinc-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Optimization Report
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-0.5 bg-zinc-900 border border-[#2e2e2e]">
                        <span className="text-[9px] font-mono text-zinc-400 uppercase">
                          Success
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-[#2e2e2e] border-b border-[#2e2e2e]">
                      <div className="p-0 border-r border-[#2e2e2e]">
                        <div className="p-4 border-b border-[#2e2e2e]">
                          <p className="text-[9px] uppercase font-bold text-zinc-600 mb-1">
                            Source Preview
                          </p>
                        </div>
                        <div className="h-40 bg-zinc-950 flex items-center justify-center overflow-hidden">
                          <img
                            src={preview}
                            alt="original"
                            className="w-full h-full object-contain grayscale opacity-60"
                          />
                        </div>
                      </div>
                      <div className="p-0">
                        <div className="p-4 border-b border-[#2e2e2e]">
                          <p className="text-[9px] uppercase font-bold text-zinc-600 mb-1">
                            Compressed Output
                          </p>
                        </div>
                        <div className="h-40 bg-zinc-950 flex items-center justify-center overflow-hidden">
                          <img
                            src={result.downloadUrl}
                            alt="compressed"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-[#2e2e2e]">
                      <div className="p-6">
                        <p className="text-[9px] uppercase font-bold text-zinc-600 mb-2">
                          Before
                        </p>
                        <p className="text-lg font-mono text-zinc-300">
                          {formatSize(result.originalSize)}
                        </p>
                      </div>
                      <div className="p-6">
                        <p className="text-[9px] uppercase font-bold text-zinc-600 mb-2">
                          After
                        </p>
                        <p className="text-lg font-mono text-white">
                          {formatSize(result.compressedSize)}
                        </p>
                      </div>
                      <div className="p-6">
                        <p className="text-[9px] uppercase font-bold text-zinc-600 mb-2">
                          Savings
                        </p>
                        <p className="text-lg font-mono text-zinc-400">
                          -{result.savings.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-900/30 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Monitor size={14} />
                        <span className="text-[10px] uppercase font-medium tracking-tight">
                          Optimized for Web Delivery
                        </span>
                      </div>
                      <Button
                        as="a"
                        href={result.downloadUrl}
                        download
                        className="bg-zinc-100 text-black h-8 rounded-none text-[10px] font-bold uppercase tracking-widest px-4 hover:bg-white"
                        startContent={<Download size={12} />}
                      >
                        Download Asset
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <footer className="pt-10 border-t border-[#2e2e2e] flex justify-between items-center opacity-40 grayscale translate-y-10">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
                Squeeze Engine
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest">
                Go-1.22
              </span>
            </div>
            <p className="text-[9px] uppercase font-bold tracking-widest">
              End-to-end Local Processing
            </p>
          </footer>
        </div>
      </div>
    </HeroUIProvider>
  );
}
