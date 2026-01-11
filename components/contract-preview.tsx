"use client"

import type { ContractData } from "@/lib/contract-types"
import { forwardRef } from "react"

interface ContractPreviewProps {
  data: ContractData
}

export const ContractPreview = forwardRef<HTMLDivElement, ContractPreviewProps>(({ data }, ref) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "____年__月__日"
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <div
      ref={ref}
      className="pdf-preview bg-white text-black mx-auto"
      style={{
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "ヒラギノ角ゴシック", sans-serif',
        width: "420mm",
        minHeight: "297mm",
        padding: "8mm 10mm",
        fontSize: "9pt",
        lineHeight: "1.4",
      }}
    >
      <div className="flex gap-6 h-full">
        {/* 左側カラム */}
        <div style={{ width: "48%" }}>
          <div className="flex justify-between items-center mb-1">
            <div style={{ fontSize: "9px", color: "#808080" }}>（単発的業務・自動更新なし）</div>
            <div style={{ fontSize: "8px", color: "#000000" }}>{formatDate(data.createdDate)}</div>
          </div>

          <h1
            className="font-bold text-center"
            style={{
              fontSize: "14px",
              color: "#000000",
              marginTop: "70px",
              marginBottom: "4mm",
            }}
          >
            業　務　委　託　書
          </h1>

          <div className="mb-3">
            <p className="border-b border-black inline-block" style={{ minWidth: "120px" }}>
              {data.recipientName || "　　　　　　　　　　"}
            </p>
            <span className="ml-2">様</span>
          </div>

          <div className="text-right mb-3 text-xs leading-relaxed">
            <p>大阪府大阪市北区紅梅町1-18ERGOビル3F</p>
            <p>株式会社OFFSTYLE</p>
            <p>代表取締役 菊池 顕</p>
          </div>

          <div className="mb-4 text-xs leading-relaxed">
            <p>
              委託者 株式会社OFFSTYLE（以下「甲」という。）は、受託者{" "}
              <span className="border-b border-black">{data.recipientName || "　　　　　　　　　　　　　　　　"}</span>
              （以下「乙」といい、甲および乙をいずれも「当事者」という。）に対し、標記契約要項1の目的に従い標記契約要項2の業務を、以下の契約要項および各条項に基づいて委託しますので、お受け下さる際は本書に署名の上ご提出下さい。なお、本書の提出をもって本業務の委託契約（以下、「本契約」という。）が締結されたものといたします。
            </p>
          </div>

          {/* 契約要項 */}
          <table className="w-full border-collapse text-xs" style={{ borderSpacing: 0 }}>
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black text-center py-1 font-bold"
                  style={{ borderWidth: "1px", backgroundColor: "#d9d9d9" }}
                >
                  契　約　要　項
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1 w-6 text-center align-top" style={{ borderWidth: "1px" }}>1</td>
                <td className="border border-black p-1 w-20 align-top" style={{ borderWidth: "1px" }}>目的</td>
                <td className="border border-black p-1" style={{ borderWidth: "1px" }}>{data.purpose || "　"}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" style={{ borderWidth: "1px" }}>2</td>
                <td className="border border-black p-1 align-top" style={{ borderWidth: "1px" }}>業務の内容</td>
                <td className="border border-black p-1 whitespace-pre-wrap" style={{ borderWidth: "1px" }}>{data.businessContent || "　"}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" style={{ borderWidth: "1px" }}>3</td>
                <td className="border border-black p-1 align-top" style={{ borderWidth: "1px" }}>契約期間</td>
                <td className="border border-black p-1 whitespace-pre-wrap" style={{ borderWidth: "1px" }}>
                  {data.contractPeriod
                    ? `${data.contractPeriod}までに投稿\n※数日後に投稿内容をスクリーンショットなどで提出\n※投稿後にインサイトを提出`
                    : "　"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" style={{ borderWidth: "1px" }}>4</td>
                <td className="border border-black p-1 align-top" style={{ borderWidth: "1px" }}>場所</td>
                <td className="border border-black p-1" style={{ borderWidth: "1px" }}>　</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" style={{ borderWidth: "1px" }}>5</td>
                <td className="border border-black p-1 align-top" style={{ borderWidth: "1px", whiteSpace: "nowrap" }}>検査完了期日</td>
                <td className="border border-black p-1" style={{ borderWidth: "1px" }}>{data.inspectionDeadline || "　"}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" style={{ borderWidth: "1px" }}>6</td>
                <td className="border border-black p-1 align-top" style={{ borderWidth: "1px" }}>委託料</td>
                <td className="border border-black p-1" style={{ borderWidth: "1px" }}>{data.commissionFee || "　"}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" style={{ borderWidth: "1px" }}>7</td>
                <td className="border border-black p-1 align-top" style={{ borderWidth: "1px" }}>支払条件</td>
                <td className="border border-black p-1 whitespace-pre-wrap" style={{ borderWidth: "1px" }}>{data.paymentCondition || "　"}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" rowSpan={2} style={{ borderWidth: "1px" }}>
                  8
                </td>
                <td className="border border-black p-1 align-top" rowSpan={2} style={{ borderWidth: "1px" }}>
                  <div>支払先</div>
                  <div>および</div>
                  <div>支払方法</div>
                </td>
                <td className="border border-black p-1" style={{ borderWidth: "1px" }}>
                  <div className="space-y-0.5">
                    <p>【金融機関名】{data.bankName || "　"}</p>
                    <p>【口座番号】{data.accountNumber || "　"}</p>
                    <p>【口座名義】{data.accountHolder || "　"}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 whitespace-pre-wrap" style={{ borderWidth: "1px" }}>
                  {data.paymentMethod || "　"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 text-center align-top" style={{ borderWidth: "1px" }}>9</td>
                <td className="border border-black p-1 align-top" style={{ borderWidth: "1px" }}>特約事項</td>
                <td className="border border-black p-1 whitespace-pre-wrap" style={{ borderWidth: "1px" }}>{data.specialTerms || "　"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 右側カラム：契約条項 */}
        <div style={{ width: "52%" }}>
          <div style={{ fontSize: "7pt", lineHeight: "1.35", border: "0.5px solid #000", padding: "6px" }}>
            <h2 className="font-bold mb-2" style={{ fontSize: "9pt" }}>
              業務委託契約
            </h2>

            <div className="space-y-1">
            <div>
              <p className="font-bold">（業務委託）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第1条　甲は、標記契約要項1記載の目的に従い標記契約要項2記載の業務（以下「本業務」という。）を標記契約要項4記載の場所で行うことを乙に委託し、乙はこれを行う。
              </p>
              <p>　　2　甲乙は、相互間で別途協議し合意した本業務に関する基準・仕様等を遵守するものとする。</p>
            </div>

            <div>
              <p className="font-bold">（善管注意義務）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第2条　乙は、本業務を甲の指示に従い、善良な管理者の注意をもって行い、甲の信用を傷つける行為その他不信用な行為を一切行わない。
              </p>
            </div>

            <div>
              <p className="font-bold">（契約期間）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第3条　本契約の契約期間は、標記契約要項3記載の通りとする。但し、本業務は原則として標記契約要項3の但書記載のスケジュールに従って行い、定められた期間までに完了するものとする。尚、各業務において成果物の提出を要するときは、甲が行う検査の合格をもって業務の完了とし、甲が行う検査は標記契約要項5記載の期日までに完了させるものとする。
              </p>
            </div>

            <div>
              <p className="font-bold">（委託料と支払条件）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第4条　本業務に関する委託料は、標記契約要項6記載の通りとし、甲は乙に対し、標記契約要項7記載の支払条件に従って委託料を支払うものとする。
              </p>
              <p>
                　　2　委託料の支払いは、標記契約要項8記載の支払先および支払方法に従い行う。尚、振込み手数料は甲の負担とする。
              </p>
            </div>

            <div>
              <p className="font-bold">（費用）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第5条　本業務の実施に要する費用は全て乙の負担とする。但し、甲が負担することに別途書面で合意した費用については、甲がこれを負担する。
              </p>
            </div>

            <div>
              <p className="font-bold">（報告義務）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第6条　甲は、本業務の遂行に際し必要があるときは、乙に対し本業務の進捗状況などについて報告を求めることができ、乙は甲からの請求があったときは、すみやかにこれを書面にて報告する。
              </p>
            </div>

            <div>
              <p className="font-bold">（業務の実施）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第7条　乙は、万が一本業務の遂行を合意された期間中に完了できないことが判明した場合、期間始期の1週間前には甲にその事由を付して書面またはメールで通知し、甲の指示に従わなければならない。乙は甲の承認なく本業務を中止することはできない。
              </p>
              <p>
                　　2　乙は、前項の事前通知を怠り、業務を遂行しなかった場合、甲が被った損害を賠償するとともに、これとは別に、違約金として契約要項に定めた委託料の金額を甲に支払う。
              </p>
            </div>

            <div>
              <p className="font-bold">（不可抗力免責）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第8条　天災地変等の不可抗力、戦争・暴動・内乱、法令の改廃制定、公権力による命令処分、ストライキその他の労働争議、輸送機関の事故、その他乙の責に帰すことのできない事由（以下「不可抗力事由」という。）による本業務の全部または一部の履行遅滞または履行不能ないし不完全履行を生じた場合には、乙はそれによる損害賠償の責を負担しない。但し、乙は、不可抗力事由が本契約に及ぼす影響を最小限に止めるよう最善の努力をするものとする。
              </p>
            </div>

            <div>
              <p className="font-bold">（業務内容等の変更）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>第9条　甲は、必要があると認めるときは、乙に通知の上、本業務の内容を追加または変更することができる。</p>
              <p>
                　　2　前項の場合において、甲および乙は協議の上、必要と認められる契約期間および委託料を変更することができる。
              </p>
            </div>

            <div>
              <p className="font-bold">（秘密保持）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第10条　乙は、文書、口頭その他方法のいかんを問わず、本業務の内容および業務遂行過程において知り得た営業上の情報（以下「秘密情報」という。）を第三者に漏洩・開示してはならない。
              </p>
            </div>

            <div>
              <p className="font-bold">（成果物の瑕疵）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第11条　甲は、成果物の交付をうけたのちにその成果物に瑕疵を発見した場合は、乙に対して、相当の期間を定めて、その瑕疵の修補を求め、または修補に代えもしくは修補とともに損害の賠償を求めることができる。
              </p>
              <p>
                　　2　前項による瑕疵担保責任は、引き渡しの日から5年間行使することができる。但し、甲がその瑕疵を知らなかった場合、引き渡しの日から10年間行使することができる。
              </p>
            </div>

            <div>
              <p className="font-bold">（知的財産権の帰属）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第12条　甲または乙が従前から有している既存の著作物の著作権で、成果物に利用されているものについては、引き続き従前から権利を有していた者に帰属するものとする。
              </p>
              <p>
                　　2　従前から乙に帰属する著作物で、成果物に利用されているものについては、甲および甲の関係会社はこれを無償で、かつ無期限に任意の方法で非独占的に利用することができるものとし、乙はこれを異議なく許諾する。
              </p>
              <p>3　本業務で甲のために新規に作成された成果物の著作権は、乙に帰属するものとする。</p>
              <p>
                4　前項の場合、甲および甲の関係会社はこれを無償で、かつ無期限に任意の方法で独占的に利用（加工を含む）することができるものとし、乙はこれを異議なく許諾する。
              </p>
            </div>

            <div>
              <p className="font-bold">（第三者の損害防止）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第13条　乙は、本業務の実施にあたり、第三者が有する知的財産権その他一切の権利を侵害しないよう、第三者に対する損害防止に留意し、自己の責任と負担で必要な措置をとらなければならない。
              </p>
            </div>

            <div>
              <p className="font-bold">（乙に生じた損害）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第14条　乙が本業務の遂行にあたって、乙の疾病や負傷、第三者の行為及び天災など、甲の責めに帰さない事由で乙が損害を被った場合、乙は甲に対して損害賠償請求しない。
              </p>
              <p>
                　　2　乙が、SNSの利用にあたって第三者と紛争が生じた場合、乙は乙の責任によって紛争を解決し、甲に対して損害賠償及び責任を請求しない。
              </p>
            </div>

            <div>
              <p className="font-bold">（権利義務の譲渡等の禁止）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第15条　乙は、甲の書面による事前の承諾なしに、本契約に基づく甲に対する一切の権利義務を、第三者に譲渡し、または担保の目的に供してはならない。
              </p>
            </div>

            <div>
              <p className="font-bold">（再委託）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第16条　乙は、甲の書面による事前の承諾なしに、本契約の一部または全部を第三者に再委託してはならない。
              </p>
              <p>
                　　2　前項において、甲の承諾を得て再委託する場合は、乙は当該再委託先に対し、本契約所定の乙の義務と同等の義務を負わせるものとする。
              </p>
            </div>

            <div>
              <p className="font-bold">（反社会的勢力の排除）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>第17条　甲及び乙は、互いに相手方に対し、次の各号の事項を表明し、保証するものとする。</p>
              <p>
                （1）自ら、自らの役員・使用人・従業員等、親会社、子会社、または関連会社が、暴力団、暴力団関係企業、総会屋若しくはこれらに準ずる者またはその構成員のいずれにも該当しないこと。
              </p>
              <p>（2）反社会的勢力に自己の名義を利用させ、本契約を締結するものでないこと。</p>
            </div>

            <div>
              <p className="font-bold">（損害賠償）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第18条　乙は、本契約についての契約違反または自己の責に帰すべき事由により甲に損害を与えたときは、当該損害を賠償するものとする。
              </p>
            </div>

            <div>
              <p className="font-bold">（解除権・中止権）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>第19条　甲は、必要によって、委託業務を中止し、または本契約を解除することができる。</p>
            </div>

            <div>
              <p className="font-bold">（解除に伴う措置）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第20条　事由名目の如何を問わず、本契約が解除された場合には、甲および乙は協議の上、委託料の清算を行う。
              </p>
            </div>

            <div>
              <p className="font-bold">（特約の同意）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>第21条　甲および乙は、標記契約要項9記載の特約事項に同意する。</p>
            </div>

            <div>
              <p className="font-bold">（準拠法及び合意管轄裁判所）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第22条　本契約は日本法に準拠し、日本法に基づき解釈されるものとし、本契約に関し紛争が生じたときは、大阪地方裁判所を第一審の専属的合意管轄裁判所とする。
              </p>
            </div>

            <div>
              <p className="font-bold">（協議事項）</p>
              <p style={{ textIndent: "-3em", paddingLeft: "3em" }}>
                第23条　本契約に定めなき事項については、民法、その他の関係法規に従い、甲乙互いに誠意をもって協議する。
              </p>
            </div>
            </div>

            <p className="text-right mt-2">以上</p>
          </div>

          {/* 署名欄 */}
          <div className="mt-4 pt-3">
            <p className="mb-2" style={{ fontSize: "10px" }}>業務委託契約に同意します。</p>
            <div className="flex justify-end items-end gap-2" style={{ fontSize: "10px" }}>
              <span>受託者名</span>
              <div
                className="border-b border-black"
                style={{
                  width: "180px",
                  height: "20px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: "2px",
                }}
              >
                {data.recipientName}
              </div>
              <span className="ml-4">印</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

ContractPreview.displayName = "ContractPreview"
