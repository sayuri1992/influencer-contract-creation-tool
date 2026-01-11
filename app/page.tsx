"use client"

import { useState } from "react"
import { type ContractData, defaultContractData } from "@/lib/contract-types"
import { ContractForm } from "@/components/contract-form"
import { PdfGenerator } from "@/components/pdf-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Eye, PenLine } from "lucide-react"

export default function HomePage() {
  const [contractData, setContractData] = useState<ContractData>(defaultContractData)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">業務委託書作成ツール</h1>
              <p className="text-sm text-muted-foreground">フォームに入力してPDFを作成</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="edit" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              入力
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              プレビュー・出力
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="max-w-2xl mx-auto">
            <ContractForm data={contractData} onChange={setContractData} />
          </TabsContent>

          <TabsContent value="preview" className="max-w-3xl mx-auto">
            <PdfGenerator data={contractData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
