"use client"

import type { ContractData } from "@/lib/contract-types"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, X } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { ContractPreview } from "./contract-preview"
import { toCanvas } from "html-to-image"
import jsPDF from "jspdf"

interface PdfGeneratorProps {
  data: ContractData
}

export function PdfGenerator({ data }: PdfGeneratorProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const expandedPreviewRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [scale, setScale] = useState(1)

  // 画面サイズに合わせてスケールを計算
  const calculateScale = () => {
    if (typeof window === "undefined") return 1

    // mm単位からpxに変換（96dpi基準）
    const mmToPx = 96 / 25.4 // 1mm = 3.779527559px at 96dpi
    const previewWidth = 420 * mmToPx // 420mm in pixels
    const previewHeight = 297 * mmToPx // 297mm in pixels

    // 実際の要素サイズが取得できる場合はそれを使用
    if (expandedPreviewRef.current) {
      const element = expandedPreviewRef.current
      const actualWidth = element.offsetWidth || element.scrollWidth
      const actualHeight = element.offsetHeight || element.scrollHeight
      
      if (actualWidth > 0 && actualHeight > 0) {
        return calculateScaleFromDimensions(actualWidth, actualHeight)
      }
    }

    // 要素サイズが取得できない場合は計算値を使用
    return calculateScaleFromDimensions(previewWidth, previewHeight)
  }

  // 幅と高さからスケールを計算（2軸スケーリング）
  const calculateScaleFromDimensions = (width: number, height: number) => {
    // 利用可能な画面サイズ（viewport heightの90%を使用）
    const padding = 32 // 左右のパディング
    const topPadding = 80 // 上部のパディング（閉じるボタン用）
    const bottomPadding = 40 // 下部のパディング（署名欄が見切れないように余裕を持たせる）
    
    // 画面の90%を最大高さとして使用
    const maxViewportHeight = window.innerHeight * 0.9
    const availableWidth = window.innerWidth - padding * 2
    const availableHeight = maxViewportHeight - topPadding - bottomPadding

    // 幅と高さの両方に収まるスケールを計算
    const scaleX = availableWidth / width
    const scaleY = availableHeight / height

    // 小さい方のスケールを使用（全体が確実に収まるように）
    // さらに0.98を掛けて、少し余裕を持たせる（署名欄が見切れないように）
    const calculatedScale = Math.min(scaleX, scaleY, 1) * 0.98

    // デバッグ用ログ
    console.log("スケール計算:", {
      previewSize: { width, height },
      availableSize: { width: availableWidth, height: availableHeight },
      scaleX,
      scaleY,
      finalScale: calculatedScale,
    })

    return Math.max(calculatedScale, 0.1) // 最小0.1
  }

  // 画面サイズ変更時にスケールを再計算
  useEffect(() => {
    if (!isExpanded) return

    const updateScale = () => {
      // 少し待ってから計算（レンダリング完了を待つ）
      requestAnimationFrame(() => {
        setTimeout(() => {
          const newScale = calculateScale()
          setScale(newScale)
          console.log("スケール更新:", newScale)
        }, 50)
      })
    }

    // 初回計算（複数回試行して確実に取得）
    updateScale()
    setTimeout(updateScale, 100)
    setTimeout(updateScale, 200)

    // リサイズイベントリスナー
    window.addEventListener("resize", updateScale)
    window.addEventListener("orientationchange", updateScale)

    return () => {
      window.removeEventListener("resize", updateScale)
      window.removeEventListener("orientationchange", updateScale)
    }
  }, [isExpanded])

  // 拡大表示を開く時にスケールを計算
  const handleExpand = () => {
    setIsExpanded(true)
    // DOM更新後にスケールを計算（複数回試行して確実に取得）
    requestAnimationFrame(() => {
      setTimeout(() => {
        setScale(calculateScale())
        // さらに少し待ってから再計算（レンダリングが完全に完了するまで）
        setTimeout(() => {
          setScale(calculateScale())
        }, 100)
      }, 50)
    })
  }

  const handleDownload = async () => {
    try {
      console.log("[STEP 1] PDF生成開始: プレビュー要素の取得")
      const previewElement = previewRef.current
      if (!previewElement) {
        console.error("[ERROR] プレビュー要素が見つかりません")
        alert("プレビューが見つかりません。ページを再読み込みしてください。")
        return
      }
      console.log("[STEP 1] 成功: プレビュー要素を取得")

      setIsGenerating(true)

      // 非表示要素を一時的に表示状態にする
      console.log("[STEP 2] プレビュー要素を一時的に表示状態に変更")
      const originalStyles = {
        position: previewElement.style.position,
        left: previewElement.style.left,
        top: previewElement.style.top,
        opacity: previewElement.style.opacity,
        pointerEvents: previewElement.style.pointerEvents,
        visibility: previewElement.style.visibility,
      }
      
      // 要素を画面外だが表示可能な状態にする
      previewElement.style.position = "absolute"
      previewElement.style.left = "0"
      previewElement.style.top = "0"
      previewElement.style.opacity = "1"
      previewElement.style.pointerEvents = "auto"
      previewElement.style.visibility = "visible"
      previewElement.style.zIndex = "9999"
      
      // 少し待ってレンダリングを完了させる
      await new Promise((resolve) => setTimeout(resolve, 100))
      console.log("[STEP 2] 成功: 要素を表示状態に変更")

      try {
        console.log("[STEP 3] html-to-imageでキャプチャ開始")
        console.log("[STEP 3] 要素サイズ:", {
          width: previewElement.offsetWidth,
          height: previewElement.offsetHeight,
          scrollWidth: previewElement.scrollWidth,
          scrollHeight: previewElement.scrollHeight,
        })

        // プレビュー要素をCanvasに変換（html-to-imageを使用）
        const canvas = await toCanvas(previewElement, {
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          cacheBust: true,
          quality: 1.0,
        })

        console.log("[STEP 3] 成功: キャンバスサイズ:", canvas.width, "x", canvas.height, "px")

        // 元のスタイルを復元
        console.log("[STEP 4] 元のスタイルに復元")
        Object.keys(originalStyles).forEach((key) => {
          ;(previewElement.style as any)[key] = (originalStyles as any)[key] || ""
        })
        console.log("[STEP 4] 成功: スタイルを復元")

        // PDFサイズ: 420mm x 297mm (A3横)
        const pdfWidth = 420 // mm
        const pdfHeight = 297 // mm
        console.log("[STEP 5] PDFサイズ:", pdfWidth, "mm x", pdfHeight, "mm (A3横)")

        // jsPDFのインスタンスを作成
        console.log("[STEP 6] jsPDFインスタンスの作成")
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [pdfWidth, pdfHeight],
          compress: true,
        })
        console.log("[STEP 6] 成功: jsPDFインスタンス作成")

        // キャンバスを画像データに変換
        console.log("[STEP 7] 画像データの変換")
        const imgData = canvas.toDataURL("image/png", 1.0)
        console.log("[STEP 7] 成功: 画像データサイズ:", imgData.length, "文字")

        // 画像のアスペクト比を計算
        const canvasAspectRatio = canvas.width / canvas.height
        const pdfAspectRatio = pdfWidth / pdfHeight

        // PDFサイズに合わせて画像をスケーリング
        let imgWidth = pdfWidth
        let imgHeight = pdfHeight

        if (canvasAspectRatio > pdfAspectRatio) {
          // キャンバスが横長の場合
          imgHeight = pdfWidth / canvasAspectRatio
          if (imgHeight > pdfHeight) {
            imgWidth = pdfHeight * canvasAspectRatio
            imgHeight = pdfHeight
          }
        } else {
          // キャンバスが縦長の場合
          imgWidth = pdfHeight * canvasAspectRatio
          if (imgWidth > pdfWidth) {
            imgWidth = pdfWidth
            imgHeight = pdfWidth / canvasAspectRatio
          }
        }

        // 画像がPDFサイズを超える場合はPDFサイズに収める
        if (imgWidth > pdfWidth) {
          imgWidth = pdfWidth
          imgHeight = pdfWidth / canvasAspectRatio
        }
        if (imgHeight > pdfHeight) {
          imgHeight = pdfHeight
          imgWidth = pdfHeight * canvasAspectRatio
        }

        console.log("[STEP 8] 画像サイズ:", imgWidth.toFixed(2), "mm x", imgHeight.toFixed(2), "mm")

        // 画像を中央に配置して追加
        console.log("[STEP 9] 画像をPDFに追加")
        const xOffset = (pdfWidth - imgWidth) / 2
        const yOffset = (pdfHeight - imgHeight) / 2
        pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight, undefined, "FAST")
        console.log("[STEP 9] 成功: 画像を追加")

        // ファイル名
        const fileName = "業務委託書.pdf"
        console.log("[STEP 10] PDF Blobの生成, ファイル名:", fileName)

        // Blob URLを使用して強制的にダウンロード
        const pdfBlob = pdf.output("blob")
        console.log("[STEP 10] 成功: PDF Blobサイズ:", pdfBlob.size, "bytes")

        // Blob URLを作成
        console.log("[STEP 11] Blob URLの作成")
        const url = URL.createObjectURL(pdfBlob)
        console.log("[STEP 11] 成功: Blob URL作成")

        // ダウンロード用のリンク要素を作成
        console.log("[STEP 12] ダウンロードリンクの作成")
        const link = document.createElement("a")
        link.href = url
        link.download = fileName
        link.style.display = "none"

        // download属性を確実に設定
        link.setAttribute("download", fileName)

        // DOMに追加
        document.body.appendChild(link)
        console.log("[STEP 12] 成功: リンク要素をDOMに追加")

        // クリックイベントを発火
        console.log("[STEP 13] クリックイベント発火")
        link.click()
        console.log("[STEP 13] 成功: クリックイベント発火")

        // クリーンアップ
        setTimeout(() => {
          try {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            console.log("[STEP 14] クリーンアップ完了: ダウンロード成功")
          } catch (cleanupError) {
            console.warn("[WARNING] クリーンアップエラー（無視可能）:", cleanupError)
          }
        }, 300)

      } catch (canvasError) {
        // 元のスタイルを復元（エラー時も確実に）
        console.error("[ERROR] キャンバス生成エラー: スタイルを復元")
        Object.keys(originalStyles).forEach((key) => {
          ;(previewElement.style as any)[key] = (originalStyles as any)[key] || ""
        })
        throw canvasError
      }

    } catch (error) {
      // 詳細なエラーログを出力
      console.error("=== PDF生成エラー（詳細） ===")
      console.error("エラー発生時刻:", new Date().toISOString())
      console.error("エラータイプ:", typeof error)
      console.error("エラーオブジェクト:", error)

      if (error instanceof Error) {
        console.error("エラーメッセージ:", error.message)
        console.error("エラーネーム:", error.name)
        if (error.stack) {
          console.error("エラースタックトレース:")
          console.error(error.stack)
        }
      }

      if (typeof error === "object" && error !== null) {
        try {
          const errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
          console.error("エラーオブジェクト詳細:")
          console.error(errorDetails)
        } catch (stringifyError) {
          console.error("エラーオブジェクトの文字列化に失敗:", stringifyError)
        }
      }

      // ユーザーに分かりやすいメッセージを表示
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      alert(
        `PDFの生成に失敗しました。\n\n` +
          `エラー: ${errorMessage}\n\n` +
          `詳細はブラウザの開発者ツール（F12キー）のコンソールタブを確認してください。\n\n` +
          `ページを再読み込みして、もう一度お試しください。`
      )
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
          onClick={handleExpand}
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
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-hidden"
          onClick={() => setIsExpanded(false)}
          style={{
            padding: "16px",
            maxHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <div
            className="relative flex items-start justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "100vw",
              maxHeight: "90vh",
              overflow: "hidden",
              paddingTop: "60px", // 閉じるボタンのスペース
              paddingBottom: "20px", // 下部の余白
            }}
          >
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div
              ref={expandedPreviewRef}
              className="bg-white rounded-lg shadow-2xl"
              style={{
                width: "420mm",
                height: "297mm",
                minWidth: "420mm",
                minHeight: "297mm",
                transform: `scale(${scale})`,
                transformOrigin: "center top",
                margin: "0 auto",
                overflow: "visible",
              }}
            >
              <ContractPreview data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
