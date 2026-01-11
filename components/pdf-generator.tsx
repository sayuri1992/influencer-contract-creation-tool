"use client"

import type { ContractData } from "@/lib/contract-types"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, X } from "lucide-react"
import { useRef, useState } from "react"
import { ContractPreview } from "./contract-preview"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface PdfGeneratorProps {
  data: ContractData
}

export function PdfGenerator({ data }: PdfGeneratorProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    const previewElement = previewRef.current
    if (!previewElement) {
      alert("プレビューが見つかりません。")
      return
    }

    setIsGenerating(true)

    try {
      // プレビュー要素をキャプチャ
      const canvas = await html2canvas(previewElement, {
        scale: 2, // 高解像度のため
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: previewElement.scrollWidth,
        height: previewElement.scrollHeight,
      })

      // PDFサイズ: 420mm x 297mm (A3横)
      const pdfWidth = 420 // mm
      const pdfHeight = 297 // mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      })

      // キャンバスの画像をPDFに追加
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      // 画像がPDFの高さを超える場合は複数ページに分割
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      // ファイル名を生成（日付と受託者名から）
      const dateStr = data.createdDate
        ? new Date(data.createdDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
      const recipientStr = data.recipientName || "業務委託書"
      const fileName = `業務委託書_${recipientStr}_${dateStr}.pdf`

      // PDFをダウンロード
      pdf.save(fileName)
    } catch (error) {
      console.error("PDF生成エラー:", error)
      alert("PDFの生成に失敗しました。もう一度お試しください。")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center no-print">
        <Button
          onClick={handleDownload}
          size="lg"
          className="h-12 text-base w-[448px]"
          disabled={isGenerating}
        >
          <Download className="mr-2 h-5 w-5" />
          {isGenerating ? "PDF生成中..." : "ダウンロード"}
        </Button>
      </div>

      <div className="flex justify-center no-print">
        <p className="text-sm text-muted-foreground text-center w-[553.586px]">
          ※「ダウンロード」ボタンをクリックすると、PDFファイルがダウンロードフォルダに保存されます。（出力サイズ:
          W420mm × H297mm）
        </p>
      </div>

      <div className="flex justify-center">
        <div
          className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg border bg-white"
          style={{
            width: `calc(420mm * 0.35)`,
            height: `calc(297mm * 0.35)`,
          }}
          onClick={() => setIsExpanded(true)}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center z-10">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
              <ZoomIn className="h-4 w-4" />
              クリックして拡大
            </div>
          </div>
          <div className="origin-top-left" style={{ transform: "scale(0.35)", width: "420mm", height: "297mm" }}>
            <ContractPreview data={data} />
          </div>
        </div>
      </div>

      <p className="text-sm text-center text-muted-foreground">プレビューをクリックすると拡大表示されます</p>

      {/* PDF生成用の非表示プレビュー（フルサイズ） */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <ContractPreview ref={previewRef} data={data} />
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-auto p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="bg-white rounded-lg shadow-2xl overflow-auto max-h-[90vh]">
              <ContractPreview data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
