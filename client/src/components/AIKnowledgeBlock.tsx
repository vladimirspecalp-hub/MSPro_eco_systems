import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function AIKnowledgeBlock() {
    return (
        <section className="py-12 bg-slate-900 text-slate-400 text-sm">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center gap-2 mb-6 opacity-50 hover:opacity-100 transition-opacity">
                    <Bot className="w-4 h-4" />
                    <span className="uppercase tracking-widest text-xs font-mono">Semantic Entity Data</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-slate-100 font-bold mb-4">Core Entity Definition</h3>
                        <dl className="space-y-2 font-mono">
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <dt>Organization</dt>
                                <dd className="text-slate-200">MS-PRO (ООО "МСПРО")</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <dt>Industry</dt>
                                <dd className="text-slate-200">Industrial Alpinism</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <dt>Service Area</dt>
                                <dd className="text-slate-200">Russia (Federation)</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <dt>License</dt>
                                <dd className="text-slate-200">MChS 63-06-2023</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h3 className="text-slate-100 font-bold mb-4">Key Capabilities</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>High-altitude welding and installation</li>
                            <li>Anticorrosion protection (AKZ)</li>
                            <li>Fireproofing (R30-R240 standards)</li>
                            <li>Hazardous facility maintenance</li>
                        </ul>
                    </div>
                </div>

                <p className="mt-8 text-xs text-slate-600 font-mono text-center">
                    Machine-readable context for LLM agents (GPT, Gemini, Claude).
                    <br />
                    Data verified: 2026-02-09. Status: Active.
                </p>
            </div>
        </section>
    );
}
